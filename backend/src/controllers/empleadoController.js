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

    // Cálculos de ISS y AFP
    const iss = sueldoBase * 0.03;
    const afp = sueldoBase * 0.0725;
    const totalRetenciones = iss + afp;
    
    // Calcular el sueldo gravado
    const sueldoGravado = sueldoBase - totalRetenciones;

    // Calcular el exceso para ISR
    let isr = 0;
    if (sueldoGravado > 550) {
        const exceso = sueldoGravado - 550;
        isr = (exceso * 0.10) + 17.67; // Aplicar fórmula del ISR
    }

    // Total devengado con horas extras
    const subTotalDevengado = sueldoBase + 
        (horasExtrasDiurnas * (sueldoBase / 240) * 1.25) + 
        (horasExtrasNocturnas * (sueldoBase / 240) * 1.75);

    // Salario líquido final
    const liquidoAPagar = subTotalDevengado - totalRetenciones - isr;

    // Crear el nuevo empleado con todos los datos
    const nuevoEmpleado = new Empleado({
        nombre,
        sueldoBase,
        diasTrabajados,
        horasExtrasDiurnas,
        horasExtrasNocturnas,
        iss,
        afp,
        totalRetenciones,
        isr,
        liquidoAPagar
    });

    await nuevoEmpleado.save();
    res.json({ message: "Empleado agregado", empleado: nuevoEmpleado });
};

// Actualizar empleado
empleadoController.updateEmpleado = async (req, res) => {
    const { nombre, sueldoBase, diasTrabajados, horasExtrasDiurnas, horasExtrasNocturnas } = req.body;

    // Cálculos de ISS y AFP
    const iss = sueldoBase * 0.03;
    const afp = sueldoBase * 0.0725;
    const totalRetenciones = iss + afp;
    
    // Calcular el sueldo gravado
    const sueldoGravado = sueldoBase - totalRetenciones;

    // Calcular el exceso para ISR
    let isr = 0;
    if (sueldoGravado > 550) {
        const exceso = sueldoGravado - 550;
        isr = (exceso * 0.10) + 17.67; // Aplicar fórmula del ISR
    }

    // Total devengado con horas extras
    const subTotalDevengado = sueldoBase + 
        (horasExtrasDiurnas * (sueldoBase / 240) * 1.25) + 
        (horasExtrasNocturnas * (sueldoBase / 240) * 1.75);

    // Salario líquido final
    const liquidoAPagar = subTotalDevengado - totalRetenciones - isr;

    // Actualizar el empleado con los nuevos datos
    const empleado = await Empleado.findByIdAndUpdate(req.params.id, {
        nombre,
        sueldoBase,
        diasTrabajados,
        horasExtrasDiurnas,
        horasExtrasNocturnas,
        iss,
        afp,
        totalRetenciones,
        isr,
        liquidoAPagar
    }, { new: true });

    res.json({ message: "Empleado actualizado", empleado });
};

// Eliminar empleado
empleadoController.deleteEmpleado = async (req, res) => {
    await Empleado.findByIdAndDelete(req.params.id);
    res.json({ message: "Empleado eliminado" });
};

export default empleadoController;
