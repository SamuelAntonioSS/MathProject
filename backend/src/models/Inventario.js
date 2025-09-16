// models/Inventario.js
import { Schema, model } from "mongoose";

const inventarioSchema = new Schema({
    nombreProducto: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    tipoMovimiento: {
        type: String,
        required: [true, 'El tipo de movimiento es requerido'],
        enum: {
            values: ['entrada', 'salida'],
            message: 'El tipo de movimiento debe ser entrada o salida'
        }
    },
    unidades: {
        type: Number,
        required: [true, 'Las unidades son requeridas'],
        min: [1, 'Las unidades deben ser mayor a 0']
    },
    precioUnitario: {
        type: Number,
        required: [true, 'El precio unitario es requerido'],
        min: [0, 'El precio unitario no puede ser negativo']
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: false  // Como en tu ejemplo de planilla
});

// Middleware para calcular el total antes de guardar
inventarioSchema.pre('save', function(next) {
    this.total = this.unidades * this.precioUnitario;
    next();
});

// Middleware para recalcular el total antes de actualizar
inventarioSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.unidades !== undefined && update.precioUnitario !== undefined) {
        update.total = update.unidades * update.precioUnitario;
    }
    next();
});

// Virtual para formatear la fecha
inventarioSchema.virtual('fechaFormateada').get(function() {
    return this.createdAt.toLocaleDateString('es-ES');
});

// Virtual para formatear el total como moneda
inventarioSchema.virtual('totalFormateado').get(function() {
    return `$${this.total.toFixed(2)}`;
});

export default model("Inventario", inventarioSchema);