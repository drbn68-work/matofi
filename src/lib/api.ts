import axios from "axios";
import { LoginCredentials, LoginResponse, Product } from "@/lib/types";

const API_BASE_URL = "http://localhost:3000/api"; // Ajusta esto a la URL de tu backend

// Configuración base de axios
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
    console.log("Intentando autenticación LDAP con:", credentials);

    const response = await api.post('/auth/login', credentials);
    console.log("Respuesta del servidor LDAP:", response.data);

    // Verificar que la respuesta tenga la estructura esperada
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
// OBTENER PRODUCTOS DEL EXCEL (con paginación)
// --------------------------------------------------------------------------

/**
 * Llama a GET /api/products?page=PAGE&pageSize=PAGE_SIZE,
 * que tu backend debe implementar para leer catalogomatofi.xlsx,
 * parsearlo y devolver una página de datos.
 *
 * Retorna un objeto con:
 *   { page, pageSize, total, totalPages, items: Product[] }
 */
export interface PaginatedProducts {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: Product[];
}

/**
 * Petición para obtener una página de productos
 * @param page número de página (por defecto 1)
 * @param pageSize cuántos items por página (por defecto 8 o 10)
 */
export const getProducts = async (
  page = 1,
  pageSize = 8
): Promise<PaginatedProducts> => {
  try {
    // Ejemplo: /products?page=1&pageSize=8
    const response = await api.get(`/products`, {
      params: { page, pageSize },
    });
    return response.data; // { page, pageSize, total, totalPages, items }
  } catch (error) {
    console.error("Error loading data:", error);
    // Aquí podrías retornar mock data si falla, o relanzar el error
    throw error;
  }
};

// --------------------------------------------------------------------------
// OBTENER CATEGORÍAS (ejemplo, si tu backend las expone en /api/categories)
// --------------------------------------------------------------------------

/**
 * Llama a GET /api/categories (que tu backend puede implementar
 * leyendo la hoja Excel completa y extrayendo la columna 'ubicación').
 */
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/categories");
    // Suponiendo que tu backend retorna ["FOTOCOPIA","MP-07","MP-42",...]
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // También podrías usar mock data si falla
    throw error;
  }
};
