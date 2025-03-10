import axios from "axios";
import { LoginCredentials, LoginResponse, Product } from "@/lib/types";

// Verifica el valor de VITE_API_URL en tiempo de build
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL 


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --------------------------------------------------------------------------
// LOGIN (sin cambios, solo para referencia)
// --------------------------------------------------------------------------

export const loginWithLDAP = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log("Intentando autenticación LDAP");
    const response = await api.post('/auth/login', credentials);
    console.log("Respuesta del servidor LDAP:", response.data);
    if (!response.data || typeof response.data.success !== "boolean") {
      throw new Error("Respuesta inválida del servidor");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error de autenticación LDAP:", error);
    return {
      success: false,
      error: error.message || "Error desconocido en la autenticación",
    };
  }
};

// --------------------------------------------------------------------------
// OBTENER PRODUCTOS DEL EXCEL (con paginación y búsqueda en el servidor)
// --------------------------------------------------------------------------

export interface PaginatedProducts {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: Product[];
}

/**
 * Petición para obtener una página de productos.
 * Ahora se envían además los parámetros 'search' y 'category' para filtrar en el servidor.
 * @param page Número de página (por defecto 1)
 * @param pageSize Cantidad de items por página (por defecto 8)
 * @param search Término de búsqueda (por defecto cadena vacía)
 * @param category Filtro de categoría (por defecto cadena vacía, es decir, sin filtro)
 */
export const getProducts = async (
  page = 1,
  pageSize = 8,
  search: string = "",
  category: string = ""
): Promise<PaginatedProducts> => {
  try {
    const response = await api.get(`/products`, {
      params: { page, pageSize, search, category },
    });
    return response.data; // { page, pageSize, total, totalPages, items }
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

// --------------------------------------------------------------------------
// OBTENER CATEGORÍAS (si el backend las expone en /api/categories)
// --------------------------------------------------------------------------

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
