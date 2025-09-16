import express from "express";
import contabilidadController from "../controllers/contabilidadController.js";

const router = express.Router();

router.route("/")
    .get(contabilidadController.getContabilidad)
    .post(contabilidadController.insertContabilidad);

router.route("/:id")
    .put(contabilidadController.updateContabilidad)
    .delete(contabilidadController.deleteContabilidad);

export default router;
    