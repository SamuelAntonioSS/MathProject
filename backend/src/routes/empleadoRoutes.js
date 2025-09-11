import express from "express";
import empleadoController from "../controllers/empleadoController.js";

const router = express.Router();

router.route("/")
    .get(empleadoController.getEmpleados)
    .post(empleadoController.insertEmpleado);

router.route("/:id")
    .put(empleadoController.updateEmpleado)
    .delete(empleadoController.deleteEmpleado);

export default router;
