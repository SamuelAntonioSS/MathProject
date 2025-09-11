import express from "express";
import planillaController from "../controllers/planillaController.js";

const router = express.Router();

router.route("/")
    .get(planillaController.getPlanillas)
    .post(planillaController.insertPlanilla);

router.route("/:id")
    .put(planillaController.updatePlanilla)
    .delete(planillaController.deletePlanilla);

export default router;
