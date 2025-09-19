// models/Planilla.js
import { Schema, model } from "mongoose";

const planillaSchema = new Schema({
    empleado: { type: Schema.Types.ObjectId, ref: "Empleado", required: true },
    diasTrabajados: { type: Number, default: 0 },
    horasExtrasDiurnas: { type: Number, default: 0 },
    horasExtrasNocturnas: { type: Number, default: 0 },
    subTotalDevengado: { type: Number, default: 0 },
    iss: { type: Number, default: 0 },
    afp: { type: Number, default: 0 },
    isr: { type: Number, default: 0 }, // <-- ✅ Agregar este campo
    totalRetenciones: { type: Number, default: 0 },
    liquidoAPagar: { type: Number, default: 0 },
    firma: { type: String, default: "" }
}, {
    timestamps: true,
    strict: false
});

export default model("Planilla", planillaSchema);
