// routes/inventarioRoutes.js
import express from "express";
import inventarioController from "../controllers/inventarioController.js";

const router = express.Router();

// Rutas para movimientos de inventario (IMPORTANTE: estas van ANTES de las rutas con parámetros)
router.route("/movimientos")
    .get(inventarioController.getMovimientos)
    .post(inventarioController.insertMovimiento);

// Rutas generales de inventario
router.route("/")
    .get(inventarioController.getInventario)
    .post(inventarioController.insertInventario);

// Rutas con parámetros (van al final para evitar conflictos)
router.route("/:id")
    .put(inventarioController.updateInventario)
    .delete(inventarioController.deleteInventario);

export default router;