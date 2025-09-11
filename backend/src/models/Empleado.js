import { Schema, model } from "mongoose";

const empleadoSchema = new Schema({
    nombre: { type: String, required: true },
    sueldoBase: { type: Number, required: true },
    diasTrabajados: { type: Number, default: 0 },
    horasExtrasDiurnas: { type: Number, default: 0 },
    horasExtrasNocturnas: { type: Number, default: 0 },
    iss: { type: Number, default: 0 },
    afp: { type: Number, default: 0 },
    totalRetenciones: { type: Number, default: 0 },
    liquidoAPagar: { type: Number, default: 0 },
}, {
    timestamps: true,
    strict: false
});

export default model("Empleado", empleadoSchema);
