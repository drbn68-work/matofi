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
          }));
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
        descripcion: "ACEPT.DONACIO EMBRIONS Mod 3285",
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

// Mantenemos una versión inicial de las categorías
export const categories = ["FOTOCOPIA", "MP-22", "MP-52", "MP-07", "MP-10"];
