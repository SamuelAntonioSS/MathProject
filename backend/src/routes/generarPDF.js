import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import Empleado from "../models/Empleado.js";
import Planilla from "../models/Planilla.js";

const router = express.Router();

// Generar PDF de boleta de pago
router.post("/", async (req, res) => {
    try {
        const { planillaId } = req.body;

        const planilla = await Planilla.findById(planillaId).populate("empleado");
        if (!planilla) return res.status(404).json({ message: "Planilla no encontrada" });

        const doc = new PDFDocument();
        const filePath = `uploads/boleta_${planilla._id}.pdf`;

        doc.pipe(fs.createWriteStream(filePath));

        // Encabezado
        doc.fontSize(20).text("Boleta de Pago", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Empleado: ${planilla.empleado.nombre}`);
        doc.text(`Sueldo Base: $${planilla.empleado.sueldoBase.toFixed(2)}`);
        doc.text(`Días Trabajados: ${planilla.diasTrabajados}`);
        doc.text(`Horas Extras Diurnas: ${planilla.horasExtrasDiurnas}`);
        doc.text(`Horas Extras Nocturnas: ${planilla.horasExtrasNocturnas}`);
        doc.moveDown();
        doc.text(`Subtotal Devengado: $${planilla.subTotalDevengado.toFixed(2)}`);
        doc.text(`ISSS: $${planilla.iss.toFixed(2)}`);
        doc.text(`AFP: $${planilla.afp.toFixed(2)}`);
        doc.text(`Total Retenciones: $${planilla.totalRetenciones.toFixed(2)}`);
        doc.moveDown();
        doc.fontSize(14).text(`Líquido a Pagar: $${planilla.liquidoAPagar.toFixed(2)}`, { underline: true });

        doc.end();

        res.json({ message: "Boleta PDF generada", url: `/${filePath}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
