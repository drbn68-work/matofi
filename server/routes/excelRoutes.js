import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import XLSX from 'xlsx';

const router = express.Router();

/**
 * En ESM (con "type": "module"), __dirname no está disponible por defecto.
 * Usamos fileURLToPath y path.dirname para obtenerlo.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Construye la ruta absoluta hacia el archivo Excel:
 * - Subimos dos niveles (../../) desde server/routes hasta la carpeta raíz (matofi),
 * - Entramos en /public
 * - Nombre del archivo: catalogomatofi.xlsx
 */
const excelPath = path.join(__dirname, '../../public/catalogomatofi.xlsx');
console.log("Intentando cargar el Excel desde:", excelPath);

// 1) Cargar el archivo Excel y procesar los datos
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// 2) Convertir la hoja a un array de arrays (o array de objetos con cabecera)
const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// 3) Definir el nombre de la columna de categorías en el Excel
const categoryColumnName = "categoria"; 

// 4) Endpoint para obtener categorías únicas
router.get('/categories', (req, res) => {
    try {
        if (!allData.length) {
            return res.status(500).json({ error: "No hay datos en el archivo." });
        }

        // Encontrar la columna de categorías en la cabecera (fila 0)
        const headers = allData[0];
        const categoryIndex = headers.indexOf(categoryColumnName);

        if (categoryIndex === -1) {
            return res.status(400).json({ error: `Columna "${categoryColumnName}" no encontrada.` });
        }

        // Extraer categorías desde la segunda fila (slice(1))
        const categories = allData.slice(1)
            .map(row => row[categoryIndex])
            .filter(Boolean); // Eliminar valores vacíos

        // Quitar duplicados
        const uniqueCategories = [...new Set(categories)];

        res.json(uniqueCategories);
    } catch (error) {
        console.error("Error obteniendo categorías:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// 5) Endpoint para obtener productos con paginación
router.get('/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Índices para extraer la porción de datos
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Extraer las filas de productos para esta página
    const pageData = allData.slice(startIndex, endIndex);

    // Cabeceras del Excel
    const headers = allData[0] || [];
    let items = [];

    if (page === 1) {
        // Evita volver a incluir la fila de cabeceras
        items = pageData.slice(1).map(row => mapRowToObject(row, headers));
    } else {
        items = pageData.map(row => mapRowToObject(row, headers));
    }

    // Total de páginas (restamos 1 por la fila de cabeceras)
    const totalRows = allData.length - 1;
    const totalPages = Math.ceil(totalRows / pageSize);

    res.json({
        page,
        pageSize,
        totalRows,
        totalPages,
        items
    });
});

// 6) Función para mapear una fila de celdas a un objeto con claves de cabecera
function mapRowToObject(rowArray, headers) {
    const obj = {};
    headers.forEach((headerName, index) => {
        obj[headerName] = rowArray[index];
    });
    return obj;
}

export default router;
