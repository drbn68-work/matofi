import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";
import sendOrderRouter from "./routes/sendOrder.js"; // Router para enviar pedidos
import ordersRouter from "./routes/orders.js";       // Router para listar pedidos
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Configurar __dirname correctamente en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use EXCEL_PUBLIC_FOLDER if defined, otherwise default to "../public"
const excelPublicFolder = process.env.EXCEL_PUBLIC_FOLDER || path.join(__dirname, "../public");
// 📌 Ruta correcta para el archivo Excel
const excelPath = path.join(excelPublicFolder, "catalogomatofi.xlsx");
console.log("Intentando cargar el Excel desde:", excelPath);

// Configurar CORS para permitir el envío de cookies
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Middleware para verificar si el archivo Excel existe antes de procesarlo
app.use((req, res, next) => {
  import("fs").then(fs => {
    if (!fs.existsSync(excelPath)) {
      console.error("El archivo Excel no existe:", excelPath);
    }
    next();
  });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas para Excel (productos y categorías)
app.use("/api", excelRoutes);

// Rutas para enviar pedidos
app.use("/api", sendOrderRouter);
console.log("Configurando rutas de sendOrder");

// Rutas para listar pedidos
app.use("/api", ordersRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
