import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importar rutas de nuestro backend
import empleadoRoutes from "./routes/empleadoRoutes.js";
import planillaRoutes from "./routes/planillaRoutes.js";
import contabilidadRoutes from "./routes/contabilidadRoutes.js";
import generarPDFRoutes from "./routes/generarPDF.js"; // Ruta para generar boletas PDF

const app = express();

// Configuración de CORS
const allowedOrigins = ["http://localhost:5173"]; // Ajusta según tu frontend

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `La política CORS no permite acceso desde el origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Manejar solicitudes preflight OPTIONS
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos (si guardas PDFs generados)
app.use('/uploads', express.static('uploads'));

// Rutas
app.use("/api/empleados", empleadoRoutes);
app.use("/api/planillas", planillaRoutes);
app.use("/api/contabilidad", contabilidadRoutes);
app.use("/api/boletas", generarPDFRoutes); // Endpoint para generar PDF/Excel

export default app;
