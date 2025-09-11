import Contabilidad from "../models/Contabilidad.js";

const contabilidadController = {};

// Obtener contabilidad
contabilidadController.getContabilidad = async (req, res) => {
    const data = await Contabilidad.find();
    res.json(data);
};

// Crear registro contable
contabilidadController.insertContabilidad = async (req, res) => {
    const { proveedores, impuestosPorPagar, ivaPorPagar, obligacionesEmpleados, retencionesPorPagar } = req.body;
    const totalGeneral = proveedores + impuestosPorPagar + ivaPorPagar + obligacionesEmpleados + retencionesPorPagar;

    const nuevoRegistro = new Contabilidad({
        proveedores, impuestosPorPagar, ivaPorPagar, obligacionesEmpleados, retencionesPorPagar, totalGeneral
    });

    await nuevoRegistro.save();
    res.json({ message: "Registro contable creado", registro: nuevoRegistro });
};

// Actualizar registro
contabilidadController.updateContabilidad = async (req, res) => {
    const { proveedores, impuestosPorPagar, ivaPorPagar, obligacionesEmpleados, retencionesPorPagar } = req.body;
    const totalGeneral = proveedores + impuestosPorPagar + ivaPorPagar + obligacionesEmpleados + retencionesPorPagar;

    const registro = await Contabilidad.findByIdAndUpdate(req.params.id, {
        proveedores, impuestosPorPagar, ivaPorPagar, obligacionesEmpleados, retencionesPorPagar, totalGeneral
    }, { new: true });

    res.json({ message: "Registro contable actualizado", registro });
};

// Eliminar registro
contabilidadController.deleteContabilidad = async (req, res) => {
    await Contabilidad.findByIdAndDelete(req.params.id);
    res.json({ message: "Registro contable eliminado" });
};

export default contabilidadController;
