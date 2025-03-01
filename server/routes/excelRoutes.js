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
        const headers = allData[0];
        const categoryIndex = headers.indexOf(categoryColumnName);
        if (categoryIndex === -1) {
            return res.status(400).json({ error: `Columna "${categoryColumnName}" no encontrada.` });
        }
        const categories = allData.slice(1)
            .map(row => row[categoryIndex])
            .filter(Boolean);
        const uniqueCategories = [...new Set(categories)];
        res.json(uniqueCategories);
    } catch (error) {
        console.error("Error obteniendo categorías:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// 5) Endpoint para obtener productos con paginación y búsqueda
router.get('/products', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const search = (req.query.search || "").toLowerCase().trim();
        const category = req.query.category || "";

        // Obtener cabeceras y mapear las filas sin la cabecera
        const headers = allData[0];
        const dataWithoutHeaders = allData.slice(1).map(row => mapRowToObject(row, headers));

        // Filtrado por búsqueda en la columna "descripcion"
        let filtered = dataWithoutHeaders;
        if (search) {
            filtered = filtered.filter(item => {
                const desc = (item.descripcion || "").toLowerCase();
                return desc.includes(search);
            });
        }

        // Filtrado por categoría si se especifica y no es "Tots" (o vacío)
        if (category && category !== "Tots") {
            filtered = filtered.filter(item => item.categoria === category);
        }

        // Paginación sobre el conjunto filtrado
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
            items: pageData
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
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
