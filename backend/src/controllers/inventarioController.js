// controllers/inventarioController.js
import Inventario from "../models/Inventario.js";

const inventarioController = {};

// 🔧 DEBUG: Agregar logs para verificar que el controlador se carga
console.log("✅ Controlador de inventario cargado correctamente");

// Obtener todos los movimientos de inventario (ruta principal)
inventarioController.getInventario = async (req, res) => {
    console.log("📍 getInventario llamado");
    try {
        const data = await Inventario.find().sort({ createdAt: -1 });
        console.log(`✅ Encontrados ${data.length} movimientos`);
        res.json(data);
    } catch (error) {
        console.error("❌ Error al obtener inventario:", error);
        res.status(500).json({ 
            message: "Error al obtener inventario", 
            error: error.message 
        });
    }
};

// Insertar nuevo movimiento (ruta principal)
inventarioController.insertInventario = async (req, res) => {
    console.log("📍 insertInventario llamado con:", req.body);
    try {
        const { nombreProducto, tipoMovimiento, unidades, precioUnitario } = req.body;
        
        // Validar datos requeridos
        if (!nombreProducto || !tipoMovimiento || !unidades || precioUnitario === undefined) {
            console.log("❌ Faltan campos requeridos");
            return res.status(400).json({ 
                message: "Faltan campos requeridos" 
            });
        }

        // Calcular total automáticamente
        const total = unidades * precioUnitario;

        const nuevoMovimiento = new Inventario({
            nombreProducto,
            tipoMovimiento,
            unidades,
            precioUnitario,
            total
        });

        const resultado = await nuevoMovimiento.save();
        console.log("✅ Movimiento guardado:", resultado._id);
        res.status(201).json({ 
            message: "Movimiento de inventario registrado", 
            movimiento: resultado 
        });
    } catch (error) {
        console.error("❌ Error al insertar movimiento:", error);
        res.status(500).json({ 
            message: "Error al insertar movimiento", 
            error: error.message 
        });
    }
};

// Actualizar movimiento existente
inventarioController.updateInventario = async (req, res) => {
    console.log(`📍 updateInventario llamado para ID: ${req.params.id}`);
    try {
        const { nombreProducto, tipoMovimiento, unidades, precioUnitario } = req.body;
        
        // Validar que el ID sea válido
        if (!req.params.id) {
            return res.status(400).json({ message: "ID requerido" });
        }

        // Calcular total automáticamente
        const total = unidades * precioUnitario;

        const movimiento = await Inventario.findByIdAndUpdate(
            req.params.id, 
            {
                nombreProducto,
                tipoMovimiento,
                unidades,
                precioUnitario,
                total
            }, 
            { new: true, runValidators: true }
        );

        if (!movimiento) {
            return res.status(404).json({ message: "Movimiento no encontrado" });
        }

        console.log("✅ Movimiento actualizado:", movimiento._id);
        res.json({ 
            message: "Movimiento actualizado", 
            movimiento 
        });
    } catch (error) {
        console.error("❌ Error al actualizar movimiento:", error);
        res.status(500).json({ 
            message: "Error al actualizar movimiento", 
            error: error.message 
        });
    }
};

// Eliminar un movimiento
inventarioController.deleteInventario = async (req, res) => {
    console.log(`📍 deleteInventario llamado para ID: ${req.params.id}`);
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "ID requerido" });
        }

        const movimiento = await Inventario.findByIdAndDelete(req.params.id);
        
        if (!movimiento) {
            return res.status(404).json({ message: "Movimiento no encontrado" });
        }

        console.log("✅ Movimiento eliminado:", req.params.id);
        res.json({ 
            message: "Movimiento eliminado correctamente" 
        });
    } catch (error) {
        console.error("❌ Error al eliminar movimiento:", error);
        res.status(500).json({ 
            message: "Error al eliminar movimiento", 
            error: error.message 
        });
    }
};

// 🎯 FUNCIÓN PRINCIPAL: Obtener todos los movimientos (ruta específica para movimientos)
inventarioController.getMovimientos = async (req, res) => {
    console.log("📍 getMovimientos llamado - Esta es la función que usa tu frontend");
    try {
        const movimientos = await Inventario.find().sort({ createdAt: -1 });
        console.log(`✅ getMovimientos: Encontrados ${movimientos.length} movimientos`);
        res.json(movimientos);
    } catch (error) {
        console.error("❌ Error al obtener movimientos:", error);
        res.status(500).json({ 
            message: "Error al obtener movimientos", 
            error: error.message 
        });
    }
};

// 🎯 FUNCIÓN PRINCIPAL: Insertar nuevo movimiento (ruta específica para movimientos)
inventarioController.insertMovimiento = async (req, res) => {
    console.log("📍 insertMovimiento llamado - Esta es la función que usa tu frontend");
    console.log("📨 Datos recibidos:", req.body);
    try {
        const { nombreProducto, tipoMovimiento, unidades, precioUnitario } = req.body;
        
        // Validar datos requeridos
        if (!nombreProducto || !tipoMovimiento || !unidades || precioUnitario === undefined) {
            console.log("❌ Faltan campos requeridos");
            return res.status(400).json({ 
                message: "Faltan campos requeridos: nombreProducto, tipoMovimiento, unidades, precioUnitario" 
            });
        }

        // Validar que unidades y precio sean números positivos
        if (unidades <= 0 || precioUnitario < 0) {
            console.log("❌ Valores inválidos:", { unidades, precioUnitario });
            return res.status(400).json({ 
                message: "Unidades debe ser mayor a 0 y precio unitario no puede ser negativo" 
            });
        }

        // Calcular el total automáticamente
        const total = unidades * precioUnitario;

        const nuevoMovimiento = new Inventario({
            nombreProducto: nombreProducto.trim(),
            tipoMovimiento,
            unidades,
            precioUnitario,
            total
        });

        const resultado = await nuevoMovimiento.save();
        console.log("✅ insertMovimiento: Movimiento guardado exitosamente:", resultado._id);
        res.status(201).json({ 
            message: "Movimiento de inventario registrado correctamente", 
            movimiento: resultado 
        });
    } catch (error) {
        console.error("❌ Error al insertar movimiento:", error);
        res.status(500).json({ 
            message: "Error al insertar movimiento", 
            error: error.message 
        });
    }
};

export default inventarioController;