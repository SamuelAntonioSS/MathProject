import { Schema, model } from "mongoose";

const contabilidadSchema = new Schema({
    proveedores: { type: Number, default: 0 },
    impuestosPorPagar: { type: Number, default: 0 },
    ivaPorPagar: { type: Number, default: 0 },
    obligacionesEmpleados: { type: Number, default: 0 },
    retencionesPorPagar: { type: Number, default: 0 },
    totalGeneral: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

export default model("Contabilidad", contabilidadSchema);
