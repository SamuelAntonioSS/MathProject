import Empleado from "../models/Empleado.js";

const empleadoController = {};

// Obtener todos los empleados
empleadoController.getEmpleados = async (req, res) => {
    const empleados = await Empleado.find();
    res.json(empleados);
};

// Crear empleado
empleadoController.insertEmpleado = async (req, res) => {
    const { nombre, sueldoBase, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;
    const iss = sueldoBase * 0.03;
    const afp = sueldoBase * 0.0725;
    const totalRetenciones = iss + afp;
    const subTotalDevengado = sueldoBase + (horasExtrasDiurnas * (sueldoBase/240) * 1.25) + (horasExtrasNocturnas * (sueldoBase/240) * 1.75);
    const liquidoAPagar = subTotalDevengado - totalRetenciones;

    const nuevoEmpleado = new Empleado({
        nombre, sueldoBase, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas,
        iss, afp, totalRetenciones, liquidoAPagar
    });

    await nuevoEmpleado.save();
    res.json({ message: "Empleado agregado", empleado: nuevoEmpleado });
};

// Actualizar empleado
empleadoController.updateEmpleado = async (req, res) => {
    const { nombre, sueldoBase, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;
    const iss = sueldoBase * 0.03;
    const afp = sueldoBase * 0.0725;
    const totalRetenciones = iss + afp;
    const subTotalDevengado = sueldoBase + (horasExtrasDiurnas * (sueldoBase/240) * 1.25) + (horasExtrasNocturnas * (sueldoBase/240) * 1.75);
    const liquidoAPagar = subTotalDevengado - totalRetenciones;

    const empleado = await Empleado.findByIdAndUpdate(req.params.id, {
        nombre, sueldoBase, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas,
        iss, afp, totalRetenciones, liquidoAPagar
    }, { new: true });

    res.json({ message: "Empleado actualizado", empleado });
};

// Eliminar empleado
empleadoController.deleteEmpleado = async (req, res) => {
    await Empleado.findByIdAndDelete(req.params.id);
    res.json({ message: "Empleado eliminado" });
};

export default empleadoController;
