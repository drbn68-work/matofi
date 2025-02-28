
import { Product } from "./types";
import Papa from 'papaparse';

// Agregamos una variable para cachear los productos y no tener que cargarlos repetidamente
let cachedProducts: Product[] | null = null;

const parseCsvProducts = async (): Promise<Product[]> => {
  // Si ya tenemos los productos en caché, los devolvemos inmediatamente
  if (cachedProducts !== null && cachedProducts.length > 0) {
    console.log(`Usando ${cachedProducts.length} productos en caché`);
    return cachedProducts;
  }

  try {
    console.log('Iniciando carga del archivo CSV...');
    const response = await fetch('/catalogomatofi.csv');
    
    if (!response.ok) {
      throw new Error(`Error cargando CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvData = await response.text();
    console.log(`CSV cargado, tamaño: ${csvData.length} bytes`);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products = results.data
            .filter((row: any) => row.codsap && row.descripcion) // Filtramos productos inválidos
            .map((row: any) => ({
              id: row.codsap, // Usamos codsap como ID
              codsap: row.codsap,
              codas400: row.codas400 || '',
              descripcion: row.descripcion,
              ubicacion: row.ubicacion || 'SIN UBICACIÓN'
            }));
          
          console.log(`CSV procesado: ${products.length} productos encontrados (de ${results.data.length} filas)`);
          
          // Guardamos en caché para futuros usos
          cachedProducts = products as Product[];
          
          resolve(products as Product[]);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    
    // Datos de ejemplo en caso de error
    const fallbackProducts = [
      {
        id: "600560",
        codsap: "600560",
        codas400: "3288",
        descripcion: "ACEPT.DONACIO DE GAMETO Mod 3288",
        ubicacion: "FOTOCOPIA"
      },
      {
        id: "600557",
        codsap: "600557",
        codas400: "3285",
        descripcion: "ACEPT.DONACIO PREEMBRIONES Mod 3285",
        ubicacion: "FOTOCOPIA"
      },
      {
        id: "600508",
        codsap: "600508",
        codas400: "3215",
        descripcion: "ADQUISICIO FORA DE GUIA Mod 3215",
        ubicacion: "FOTOCOPIA"
      },
      {
        id: "600339",
        codsap: "600339",
        codas400: "3022",
        descripcion: "ADQUISICION FUERA DE GUIA Mod 3022",
        ubicacion: "FOTOCOPIA"
      },
      {
        id: "600646",
        codsap: "600646",
        codas400: "3382",
        descripcion: "AGONISTAS PCO Mod 3382",
        ubicacion: "FOTOCOPIA"
      }
    ];
    
    // También guardamos estos en caché para no repetir el error
    cachedProducts = fallbackProducts;
    
    return fallbackProducts;
  }
};

// Extraemos las categorías únicas del CSV
export const getCategories = (products: Product[]): string[] => {
  const uniqueCategories = new Set(products.map(product => product.ubicacion));
  return Array.from(uniqueCategories).sort();
};

// Exportamos los productos como una promesa
export const getProducts = async (): Promise<Product[]> => {
  console.log('Solicitando productos...');
  return await parseCsvProducts();
};

// Lista de categorías conocidas (como respaldo)
export const categories = [
  "FOTOCOPIA", "MO-42", "MP-12", "MP-22", "MP-52", 
  "MP-07", "MP-10", "MP-26", "MP-29", "MP-51", 
  "MP-28", "MP-27", "MP-25", "MP-43", "MP-53"
];
