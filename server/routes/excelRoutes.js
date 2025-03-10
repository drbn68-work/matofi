import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";
import fs from "fs";
import XLSX from "xlsx";

const router = express.Router();

/**
 * 📂 Obtener __dirname en módulos ESM
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 📌 Ruta correcta del archivo Excel
 */
const excelPath = path.join(__dirname, "../../public/catalogomatofi.xlsx");
console.log("Intentando cargar el Excel desde:", excelPath);

/**
 * 🗂 Configurar `multer` para manejar la subida del archivo Excel
 */
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/"), // 📌 Aseguramos que la carpeta sea relativa
  filename: (req, file, cb) => {
    cb(null, "catalogomatofi.xlsx"); // Sobreescribe el archivo existente
  },
});

const upload = multer({ storage });

/**
 * 🚀 `POST /api/upload-excel`
 * Permite a los usuarios subir un nuevo archivo Excel
 */
router.post("/upload-excel", upload.single("excel"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ningún archivo." });
  }
  console.log("Archivo Excel actualizado:", req.file.path);
  res.json({ message: "Archivo subido correctamente." });
});

/**
 * 🔄 Función para leer el archivo Excel en cada solicitud
 */
function readExcelFile() {
  // Define la ruta absoluta donde se copia el archivo en el contenedor
 // Primero, intenta la ruta absoluta (por ejemplo, en el contenedor Docker)
 let excelPath = "/app/public/catalogomatofi.xlsx";
 if (!fs.existsSync(excelPath)) {
   // Si la ruta absoluta no existe, se usa la ruta relativa para entornos locales
   excelPath = path.join(__dirname, "../../public/catalogomatofi.xlsx");
 }
  console.log("Intentando cargar el Excel desde:", excelPath);

  if (!fs.existsSync(excelPath)) {
    console.error("❌ El archivo Excel no existe:", excelPath);
    return null;
  }

  try {
    console.log("✅ El archivo Excel existe. Leyendo...");
    const workbook = XLSX.readFile(excelPath);
    console.log("Hojas encontradas:", workbook.SheetNames);

    const sheetName = workbook.SheetNames[0];
    console.log("Usando la hoja:", sheetName);

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log("Datos leídos (formato de array bidimensional):", data.slice(0, 10));
    // Mostramos solo las primeras 10 filas para no saturar la consola

    return data;
  } catch (error) {
    console.error("⚠️ Error leyendo el archivo Excel:", error);
    return null;
  }
}




/**
 * 🚀 `GET /api/categories`
 * Devuelve las categorías únicas del Excel
 */
router.get("/categories", (req, res) => {
  try {
    const allData = readExcelFile();
    if (!allData) {
      return res.status(500).json({ error: "No hay datos en el archivo." });
    }

    const categoryColumnName = "categoria";
    const headers = allData[0];
    const categoryIndex = headers.indexOf(categoryColumnName);
    if (categoryIndex === -1) {
      return res.status(400).json({ error: `Columna "${categoryColumnName}" no encontrada.` });
    }

    const categories = allData
      .slice(1)
      .map((row) => row[categoryIndex])
      .filter(Boolean);
    const uniqueCategories = [...new Set(categories)];

    res.json(uniqueCategories);
  } catch (error) {
    console.error("❌ Error obteniendo categorías:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

/**
 * 🚀 `GET /api/products`
 * Devuelve productos con paginación y búsqueda
 */
router.get("/products", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = (req.query.search || "").toLowerCase().trim();
    const category = req.query.category || "";

    const allData = readExcelFile();
    if (!allData) {
      return res.status(500).json({ error: "No hay datos en el archivo." });
    }

    const headers = allData[0];
    const dataWithoutHeaders = allData.slice(1).map((row) => mapRowToObject(row, headers));

    let filtered = dataWithoutHeaders;

    // Filtrar por búsqueda en varios campos: descripción, SAP y AS400
    if (search) {
      filtered = filtered.filter((item) => {
        const descripcion = (item.descripcion || "").toLowerCase();
        const codsap = (item.codsap || "").toString().toLowerCase();
        const codas400 = (item.codas400 || "").toString().toLowerCase();
        return (
          descripcion.includes(search) ||
          codsap.includes(search) ||
          codas400.includes(search)
        );
      });
    }

    // Filtrar por categoría si se especifica
    if (category && category !== "Tots") {
      filtered = filtered.filter((item) => item.categoria === category);
    }

    // Paginación
    const totalRows = filtered.length;
    const totalPages = Math.ceil(totalRows / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filtered.slice(startIndex, endIndex);

    res.json({
      page,
      pageSize,
      totalRows,
      totalPages,
      items: pageData,
    });
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


/**
 * 🔄 Función para mapear filas del Excel a objetos con cabecera
 */
function mapRowToObject(rowArray, headers) {
  const obj = {};
  headers.forEach((headerName, index) => {
    obj[headerName] = rowArray[index];
  });
  return obj;
}

export default router;
