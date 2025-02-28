
import { Product } from "./types";
import Papa from 'papaparse';

const parseCsvProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/catalogomatofi.csv');
    const csvData = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          const products = results.data.map((row: any) => ({
            id: row.codsap, // Usamos codsap como ID
            codsap: row.codsap,
            codas400: row.codas400,
            descripcion: row.descripcion,
            ubicacion: row.ubicacion
          })).filter((product: any) => product.codsap && product.descripcion); // Filtramos productos inválidos
          
          console.log(`CSV cargado: ${products.length} productos encontrados`);
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
    // Retornamos datos de ejemplo en caso de error
    return [
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
  }
};

// Extraemos las categorías únicas del CSV
export const getCategories = (products: Product[]): string[] => {
  const uniqueCategories = new Set(products.map(product => product.ubicacion));
  return Array.from(uniqueCategories);
};

// Exportamos los productos como una promesa
export const getProducts = async (): Promise<Product[]> => {
  return await parseCsvProducts();
};

// Lista de categorías conocidas (como respaldo)
export const categories = [
  "FOTOCOPIA", "MO-42", "MP-12", "MP-22", "MP-52", 
  "MP-07", "MP-10", "MP-26", "MP-29", "MP-51", 
  "MP-28", "MP-27", "MP-25", "MP-43", "MP-53"
];
