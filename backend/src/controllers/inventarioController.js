// controllers/inventarioController.js
import Inventario from "../models/Inventario.js";

const inventarioController = {};

// ✅ Controlador cargado
console.log("✅ Controlador de inventario cargado correctamente");

// Obtener todos los movimientos
inventarioController.getMovimientos = async (req, res) => {
    console.log("📍 getMovimientos llamado");
    try {
        const movimientos = await Inventario.find().sort({ createdAt: -1 });
        console.log(`✅ Encontrados ${movimientos.length} movimientos`);
        res.json(movimientos);
    } catch (error) {
        console.error("❌ Error al obtener movimientos:", error);
        res.status(500).json({ 
            message: "Error al obtener movimientos", 
            error: error.message 
        });
    }
};

// Insertar nuevo movimiento con validación de stock
inventarioController.insertMovimiento = async (req, res) => {
    console.log("📍 insertMovimiento llamado");
    console.log("📨 Datos recibidos:", req.body);

    try {
        const { nombreProducto, tipoMovimiento, unidades, precioUnitario } = req.body;

        // Validar datos requeridos
        if (!nombreProducto || !tipoMovimiento || !unidades || precioUnitario === undefined) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos: nombreProducto, tipoMovimiento, unidades, precioUnitario" 
            });
        }

        if (unidades <= 0 || precioUnitario < 0) {
            return res.status(400).json({ 
                message: "Unidades debe ser mayor a 0 y precio unitario no puede ser negativo" 
            });
        }

        // ------------------------
        // VALIDACIÓN DE STOCK PARA SALIDAS
        // ------------------------
        if (tipoMovimiento === "salida") {
            // Calcular stock actual del producto
            const entradas = await Inventario.aggregate([
                { $match: { nombreProducto, tipoMovimiento: "entrada" } },
                { $group: { _id: "$nombreProducto", totalUnidades: { $sum: "$unidades" } } }
            ]);
            const salidas = await Inventario.aggregate([
                { $match: { nombreProducto, tipoMovimiento: "salida" } },
                { $group: { _id: "$nombreProducto", totalUnidades: { $sum: "$unidades" } } }
            ]);

            const stockActual = (entradas[0]?.totalUnidades || 0) - (salidas[0]?.totalUnidades || 0);

            if (unidades > stockActual) {
                return res.status(400).json({ 
                    message: `No hay suficiente stock. Stock disponible: ${stockActual}` 
                });
            }
        }

        // Calcular total
        const total = unidades * precioUnitario;

        const nuevoMovimiento = new Inventario({
            nombreProducto: nombreProducto.trim(),
            tipoMovimiento,
            unidades,
            precioUnitario,
            total
        });

        const resultado = await nuevoMovimiento.save();
        console.log("✅ Movimiento guardado:", resultado._id);
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

// Actualizar movimiento
inventarioController.updateMovimiento = async (req, res) => {
    console.log(`📍 updateMovimiento llamado para ID: ${req.params.id}`);
    try {
        const { nombreProducto, tipoMovimiento, unidades, precioUnitario } = req.body;

        if (!req.params.id) return res.status(400).json({ message: "ID requerido" });

        // Validar unidades y precio
        if (unidades <= 0 || precioUnitario < 0) {
            return res.status(400).json({ message: "Unidades debe ser mayor a 0 y precio unitario no puede ser negativo" });
        }

        // ------------------------
        // VALIDACIÓN DE STOCK PARA SALIDAS
        // ------------------------
        if (tipoMovimiento === "salida") {
            const entradas = await Inventario.aggregate([
                { $match: { nombreProducto, tipoMovimiento: "entrada" } },
                { $group: { _id: "$nombreProducto", totalUnidades: { $sum: "$unidades" } } }
            ]);
            const salidas = await Inventario.aggregate([
                { $match: { nombreProducto, tipoMovimiento: "salida", _id: { $ne: req.params.id } } },
                { $group: { _id: "$nombreProducto", totalUnidades: { $sum: "$unidades" } } }
            ]);

            const stockActual = (entradas[0]?.totalUnidades || 0) - (salidas[0]?.totalUnidades || 0);

            if (unidades > stockActual) {
                return res.status(400).json({ 
                    message: `No hay suficiente stock. Stock disponible: ${stockActual}` 
                });
            }
        }

        const total = unidades * precioUnitario;

        const movimiento = await Inventario.findByIdAndUpdate(
            req.params.id,
            { nombreProducto, tipoMovimiento, unidades, precioUnitario, total },
            { new: true, runValidators: true }
        );

        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado" });

        console.log("✅ Movimiento actualizado:", movimiento._id);
        res.json({ message: "Movimiento actualizado", movimiento });

    } catch (error) {
        console.error("❌ Error al actualizar movimiento:", error);
        res.status(500).json({ message: "Error al actualizar movimiento", error: error.message });
    }
};

// Eliminar movimiento
inventarioController.deleteMovimiento = async (req, res) => {
    console.log(`📍 deleteMovimiento llamado para ID: ${req.params.id}`);
    try {
        if (!req.params.id) return res.status(400).json({ message: "ID requerido" });

        const movimiento = await Inventario.findByIdAndDelete(req.params.id);
        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado" });

        console.log("✅ Movimiento eliminado:", req.params.id);
        res.json({ message: "Movimiento eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar movimiento:", error);
        res.status(500).json({ message: "Error al eliminar movimiento", error: error.message });
    }
};

export default inventarioController;
