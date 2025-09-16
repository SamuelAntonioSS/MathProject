import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// 🔧 AGREGAR: Importar configuración de variables de entorno
import { config } from "./config.js";

// Importar rutas de nuestro backend
import empleadoRoutes from "./routes/empleadoRoutes.js";
import planillaRoutes from "./routes/planillaRoutes.js";
import contabilidadRoutes from "./routes/contabilidadRoutes.js";
import generarPDFRoutes from "./routes/generarPDF.js"; // Ruta para generar boletas PDF

const app = express();

// 🐛 DEBUG: Verificar variables de entorno
console.log("🔍 Verificando variables de entorno:");
console.log("DB_URI:", process.env.DB_URI ? "✅ Cargada" : "❌ No encontrada");
console.log("PORT:", process.env.PORT);
console.log("DB_URI completa:", config.db.URI);

// 🔧 AGREGAR: Conexión a MongoDB
mongoose.connect(config.db.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    console.log("📦 Base de datos:", mongoose.connection.name);
})
.catch((error) => {
    console.log("❌ Error conectando a MongoDB:");
    console.log("Error completo:", error.message);
});

// 🔧 AGREGAR: Eventos de conexión de MongoDB
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Error de conexión:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose desconectado');
});

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

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos (si guardas PDFs generados)
app.use('/uploads', express.static('uploads'));

// 🔧 AGREGAR: Ruta de prueba simple
app.get('/api/test', (req, res) => {
    res.json({ 
        message: "✅ API funcionando correctamente",
        database: mongoose.connection.readyState === 1 ? "✅ Conectada" : "❌ Desconectada"
    });
});

// Rutas
app.use("/api/empleados", empleadoRoutes);
app.use("/api/planillas", planillaRoutes);
app.use("/api/contabilidad", contabilidadRoutes);
app.use("/api/boletas", generarPDFRoutes); // Endpoint para generar PDF/Excel

export default app;