import express from 'express';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

// Estas dos líneas son para poder usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 1. Leer el archivo de Excel al iniciar la app o la ruta
// (Hazlo fuera de la ruta, para que se cargue solo una vez)
const workbook = XLSX.readFile(path.join(__dirname, '..', '..', 'public', 'catalogomatofi.xlsx'));

// 2. Escoger la hoja que quieras (por defecto, la primera)
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// 3. Convertir la hoja a un array de arrays (o array de objetos con cabecera)
const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
/*
  Esto te devuelve algo como:
  [
    ["CodSAP", "Descripcion", "Ubicacion", ... ],
    ["600560", "ACEPT...", "FOTOCOPIA", ... ],
    ...
  ]
  Cada sub-array es una fila.
*/

// Creamos un endpoint GET /api/products que soporte ?page=1&pageSize=10
router.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // Calculamos los índices para hacer slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Extraemos la porción de filas para esa página
  const pageData = allData.slice(startIndex, endIndex);

  // Si la primera fila del Excel son cabeceras, 
  //   puedes ignorar esa fila en el slice, o quitarla antes de almacenar 'allData'.
  //   Para este ejemplo, supongamos que la primera fila es cabecera y la devuelves también, o la quitas si quieres.

  // Convertir cada fila (array) en un objeto con campos “codsap”, “descripcion”, etc.
  //   asumiendo que la fila 0 tiene cabeceras
  //   si no tienes cabeceras, lo harías de otra forma.
  const headers = allData[0] || []; // la cabecera supuestamente
  let items = [];
  // Evitar que el slice devuelva la primera fila otra vez. 
  //   Puedes manejarlo de varias maneras. Ejemplo rápido:
  if (page === 1) {
    // pageData[0] sería la cabecera, la saltamos
    items = pageData.slice(1).map(row => mapRowToObject(row, headers));
  } else {
    // de la segunda página en adelante, mapear todo
    items = pageData.map(row => mapRowToObject(row, headers));
  }

  // En caso de no tener cabeceras en la primera fila
  // items = pageData.map((rowArray) => ({
  //   codsap: rowArray[0],
  //   descripcion: rowArray[1],
  //   ubicacion: rowArray[2],
  //   // ...
  // }));

  // Estructura de la respuesta
  const totalRows = allData.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  res.json({
    page,
    pageSize,
    totalRows,
    totalPages,
    items
  });
});

// Función auxiliar para mapear un array de celdas en un objeto con nombres de columna
function mapRowToObject(rowArray, headers) {
  const obj = {};
  headers.forEach((headerName, index) => {
    obj[headerName] = rowArray[index];
  });
  return obj;
}

export default router;
