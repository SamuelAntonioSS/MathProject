// controllers/planillaController.js
import Planilla from "../models/Planilla.js";
import Empleado from "../models/Empleado.js";

const planillaController = {};

// Crear planilla para un empleado
planillaController.insertPlanilla = async (req, res) => {
    try {
        const { empleadoId, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;

        const empleado = await Empleado.findById(empleadoId);
        if (!empleado) return res.status(404).json({ message: "Empleado no encontrado" });

        // Cálculos
        const valorHora = empleado.sueldoBase / 240; // suponiendo 240 horas al mes
        const subTotalDevengado =
            empleado.sueldoBase +
            (horasExtrasDiurnas * valorHora * 1.25) +
            (horasExtrasNocturnas * valorHora * 1.75);

        const iss = empleado.sueldoBase * 0.03;
        const afp = empleado.sueldoBase * 0.0725;
        const totalRetenciones = iss + afp;
        const liquidoAPagar = subTotalDevengado - totalRetenciones;

        // Guardar planilla
        const nuevaPlanilla = new Planilla({
            empleado: empleadoId,
            diasTrabajados,
            horasExtrasDiurnas,
            horasExtrasNocturnas,
            subTotalDevengado,
            iss,
            afp,
            totalRetenciones,
            liquidoAPagar
        });

        await nuevaPlanilla.save();
        res.json({ message: "Planilla generada", planilla: nuevaPlanilla });
    } catch (error) {
        console.error("Error al crear planilla:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Obtener todas las planillas
planillaController.getPlanillas = async (req, res) => {
    try {
        const planillas = await Planilla.find().populate("empleado");
        res.json(planillas);
    } catch (error) {
        console.error("Error al obtener planillas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Actualizar planilla
planillaController.updatePlanilla = async (req, res) => {
    try {
        const { diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;
        const planilla = await Planilla.findById(req.params.id).populate("empleado");
        if (!planilla) return res.status(404).json({ message: "Planilla no encontrada" });

        const empleado = planilla.empleado;

        // Recalcular valores
        const valorHora = empleado.sueldoBase / 240;
        const subTotalDevengado =
            empleado.sueldoBase +
            (horasExtrasDiurnas * valorHora * 1.25) +
            (horasExtrasNocturnas * valorHora * 1.75);

        const iss = empleado.sueldoBase * 0.03;
        const afp = empleado.sueldoBase * 0.0725;
        const totalRetenciones = iss + afp;
        const liquidoAPagar = subTotalDevengado - totalRetenciones;

        // Actualizar campos
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
    } catch (error) {
        console.error("Error al actualizar planilla:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Eliminar planilla
planillaController.deletePlanilla = async (req, res) => {
    try {
        await Planilla.findByIdAndDelete(req.params.id);
        res.json({ message: "Planilla eliminada" });
    } catch (error) {
        console.error("Error al eliminar planilla:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export default planillaController;
