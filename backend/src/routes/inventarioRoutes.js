// routes/inventarioRoutes.js
import express from "express";
import inventarioController from "../controllers/inventarioController.js";

const router = express.Router();

// Rutas para movimientos de inventario
router.route("/movimientos")
    .get(inventarioController.getMovimientos)
    .post(inventarioController.insertMovimiento);

// Rutas generales de inventario - CORREGIR AQUÍ ✅
router.route("/")
    .get(inventarioController.getMovimientos)    // ✅ Cambiar a getMovimientos
    .post(inventarioController.insertMovimiento); // ✅ Cambiar a insertMovimiento

router.get("/totales", inventarioController.getTotales);

// Rutas con parámetros
router.route("/:id")
    .put(inventarioController.updateMovimiento)
    .delete(inventarioController.deleteMovimiento);

export default router;