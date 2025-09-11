import Planilla from "../models/Planilla.js";
import Empleado from "../models/Empleado.js";

const planillaController = {};

// Crear planilla para un empleado
planillaController.insertPlanilla = async (req, res) => {
    const { empleadoId, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;
    const empleado = await Empleado.findById(empleadoId);
    if(!empleado) return res.status(404).json({ message: "Empleado no encontrado" });

    const subTotalDevengado = empleado.sueldoBase + (horasExtrasDiurnas * (empleado.sueldoBase/240) * 1.25) + (horasExtrasNocturnas * (empleado.sueldoBase/240) * 1.75);
    const iss = empleado.sueldoBase * 0.03;
    const afp = empleado.sueldoBase * 0.0725;
    const totalRetenciones = iss + afp;
    const liquidoAPagar = subTotalDevengado - totalRetenciones;

    const nuevaPlanilla = new Planilla({
        empleado: empleadoId, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas,
        subTotalDevengado, iss, afp, totalRetenciones, liquidoAPagar
    });

    await nuevaPlanilla.save();
    res.json({ message: "Planilla generada", planilla: nuevaPlanilla });
};

// Obtener todas las planillas
planillaController.getPlanillas = async (req, res) => {
    const planillas = await Planilla.find().populate("empleado");
    res.json(planillas);
};

// Actualizar planilla
planillaController.updatePlanilla = async (req, res) => {
    const { diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;
    const planilla = await Planilla.findById(req.params.id).populate("empleado");
    if(!planilla) return res.status(404).json({ message: "Planilla no encontrada" });

    const empleado = planilla.empleado;

    const subTotalDevengado = empleado.sueldoBase + (horasExtrasDiurnas * (empleado.sueldoBase/240) * 1.25) + (horasExtrasNocturnas * (empleado.sueldoBase/240) * 1.75);
    const iss = empleado.sueldoBase * 0.03;
    const afp = empleado.sueldoBase * 0.0725;
    const totalRetenciones = iss + afp;
    const liquidoAPagar = subTotalDevengado - totalRetenciones;

    planilla.diasTrabajados = diasTrabajados;
    planilla.horasExtrasDiurnas = horasExtrasDiurnas;
    planilla.horasExtrasNocturnas = horasExtrasNocturnas;
    planilla.subTotalDevengado = subTotalDevengado;
    planilla.iss = iss;
    planilla.afp = afp;
    planilla.totalRetenciones = totalRetenciones;
    planilla.liquidoAPagar = liquidoAPagar;

    await planilla.save();
    res.json({ message: "Planilla actualizada", planilla });
};

// Eliminar planilla
planillaController.deletePlanilla = async (req, res) => {
    await Planilla.findByIdAndDelete(req.params.id);
    res.json({ message: "Planilla eliminada" });
};

export default planillaController;
