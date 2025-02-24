import { Product } from "./types";

const parseCsvProducts = () => {
  // En desarrollo, usar datos de ejemplo hasta que tengamos el CSV
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
    },
    // Añade más productos según necesites para pruebas
  ];
};

export const products: Product[] = parseCsvProducts();

export const categories = ["FOTOCOPIA", "MP-22", "MP-52", "MP-07", "MP-10"];
