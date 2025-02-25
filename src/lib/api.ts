
import axios from 'axios';
import { LoginCredentials, LoginResponse, Product } from '@/lib/types';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta esto a la URL de tu backend

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data para desarrollo
const mockProducts: Product[] = [
  { id: "1", codsap: "SAP001", codas400: "AS001", descripcion: "Bolígrafo Azul BIC", ubicacion: "Material de Escritura" },
  { id: "2", codsap: "SAP002", codas400: "AS002", descripcion: "Papel A4 500 hojas", ubicacion: "Papel" },
  { id: "3", codsap: "SAP003", codas400: "AS003", descripcion: "Grapadora Metálica", ubicacion: "Material de Oficina" },
  { id: "4", codsap: "SAP004", codas400: "AS004", descripcion: "Post-it Amarillo", ubicacion: "Material de Oficina" },
  { id: "5", codsap: "SAP005", codas400: "AS005", descripcion: "Archivador A4", ubicacion: "Archivo" },
  { id: "6", codsap: "SAP006", codas400: "AS006", descripcion: "Lápiz HB2", ubicacion: "Material de Escritura" },
  { id: "7", codsap: "SAP007", codas400: "AS007", descripcion: "Tijeras Oficina", ubicacion: "Material de Oficina" },
  { id: "8", codsap: "SAP008", codas400: "AS008", descripcion: "Corrector Líquido", ubicacion: "Material de Escritura" },
  { id: "9", codsap: "SAP009", codas400: "AS009", descripcion: "Clips Metálicos", ubicacion: "Material de Oficina" },
  { id: "10", codsap: "SAP010", codas400: "AS010", descripcion: "Gomas de Borrar", ubicacion: "Material de Escritura" },
  { id: "11", codsap: "SAP011", codas400: "AS011", descripcion: "Carpeta Clasificadora", ubicacion: "Archivo" },
  { id: "12", codsap: "SAP012", codas400: "AS012", descripcion: "Rotulador Negro", ubicacion: "Material de Escritura" },
  { id: "13", codsap: "SAP013", codas400: "AS013", descripcion: "Cuaderno Espiral A5", ubicacion: "Papel" },
  { id: "14", codsap: "SAP014", codas400: "AS014", descripcion: "Calculadora Básica", ubicacion: "Electrónica" },
  { id: "15", codsap: "SAP015", codas400: "AS015", descripcion: "Sobre Blanco A4", ubicacion: "Papel" },
  { id: "16", codsap: "SAP016", codas400: "AS016", descripcion: "Marcadores Fluorescentes", ubicacion: "Material de Escritura" },
  { id: "17", codsap: "SAP017", codas400: "AS017", descripcion: "Pizarra Blanca", ubicacion: "Presentación" },
  { id: "18", codsap: "SAP018", codas400: "AS018", descripcion: "Cinta Adhesiva", ubicacion: "Material de Oficina" },
  { id: "19", codsap: "SAP019", codas400: "AS019", descripcion: "Pegamento en Barra", ubicacion: "Material de Oficina" },
  { id: "20", codsap: "SAP020", codas400: "AS020", descripcion: "Calendario de Pared", ubicacion: "Planificación" },
  { id: "21", codsap: "SAP021", codas400: "AS021", descripcion: "Portaminas 0.5mm", ubicacion: "Material de Escritura" },
  { id: "22", codsap: "SAP022", codas400: "AS022", descripcion: "Etiquetas Adhesivas", ubicacion: "Material de Oficina" },
  { id: "23", codsap: "SAP023", codas400: "AS023", descripcion: "Bandeja Documentos", ubicacion: "Organización" },
  { id: "24", codsap: "SAP024", codas400: "AS024", descripcion: "Papel Reciclado A4", ubicacion: "Papel" },
  { id: "25", codsap: "SAP025", codas400: "AS025", descripcion: "Bolígrafo Rojo", ubicacion: "Material de Escritura" },
  { id: "26", codsap: "SAP026", codas400: "AS026", descripcion: "Carpetas Colgantes", ubicacion: "Archivo" },
  { id: "27", codsap: "SAP027", codas400: "AS027", descripcion: "Notas Adhesivas Grandes", ubicacion: "Material de Oficina" },
  { id: "28", codsap: "SAP028", codas400: "AS028", descripcion: "Grapas 24/6", ubicacion: "Material de Oficina" },
  { id: "29", codsap: "SAP029", codas400: "AS029", descripcion: "Rotuladores Colores", ubicacion: "Material de Escritura" },
  { id: "30", codsap: "SAP030", codas400: "AS030", descripcion: "Agenda Anual", ubicacion: "Planificación" },
  { id: "31", codsap: "SAP031", codas400: "AS031", descripcion: "Chinchetas", ubicacion: "Material de Oficina" },
  { id: "32", codsap: "SAP032", codas400: "AS032", descripcion: "Cuaderno A4", ubicacion: "Papel" },
  { id: "33", codsap: "SAP033", codas400: "AS033", descripcion: "Portafolios", ubicacion: "Organización" },
  { id: "34", codsap: "SAP034", codas400: "AS034", descripcion: "Rotulador Pizarra", ubicacion: "Presentación" },
  { id: "35", codsap: "SAP035", codas400: "AS035", descripcion: "Alfombrilla Ratón", ubicacion: "Electrónica" },
  { id: "36", codsap: "SAP036", codas400: "AS036", descripcion: "Folder A4", ubicacion: "Archivo" },
  { id: "37", codsap: "SAP037", codas400: "AS037", descripcion: "Papel Fotográfico", ubicacion: "Papel" },
  { id: "38", codsap: "SAP038", codas400: "AS038", descripcion: "Sacapuntas Eléctrico", ubicacion: "Material de Escritura" },
  { id: "39", codsap: "SAP039", codas400: "AS039", descripcion: "Borrador Pizarra", ubicacion: "Presentación" },
  { id: "40", codsap: "SAP040", codas400: "AS040", descripcion: "Regla 30cm", ubicacion: "Material de Oficina" },
  { id: "41", codsap: "SAP041", codas400: "AS041", descripcion: "Separadores A4", ubicacion: "Organización" },
  { id: "42", codsap: "SAP042", codas400: "AS042", descripcion: "Bolígrafo Negro Gel", ubicacion: "Material de Escritura" },
  { id: "43", codsap: "SAP043", codas400: "AS043", descripcion: "Caja Archivo Definitivo", ubicacion: "Archivo" },
  { id: "44", codsap: "SAP044", codas400: "AS044", descripcion: "Pistola Silicona", ubicacion: "Material de Oficina" },
  { id: "45", codsap: "SAP045", codas400: "AS045", descripcion: "Puntero Láser", ubicacion: "Presentación" },
  { id: "46", codsap: "SAP046", codas400: "AS046", descripcion: "Block Notas A5", ubicacion: "Papel" },
  { id: "47", codsap: "SAP047", codas400: "AS047", descripcion: "Portaclips Magnético", ubicacion: "Material de Oficina" },
  { id: "48", codsap: "SAP048", codas400: "AS048", descripcion: "Teclado Inalámbrico", ubicacion: "Electrónica" },
  { id: "49", codsap: "SAP049", codas400: "AS049", descripcion: "Papel Continuo", ubicacion: "Papel" },
  { id: "50", codsap: "SAP050", codas400: "AS050", descripcion: "Soporte Monitor", ubicacion: "Electrónica" }
];

const mockCategories = [...new Set(mockProducts.map(p => p.ubicacion))];

export const loginWithLDAP = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Mock login para desarrollo
  return Promise.resolve({
    success: true,
    user: {
      username: credentials.username,
      fullName: `Usuario de Prueba (${credentials.username})`,
      costCenter: credentials.costCenter,
      department: 'Departamento de Prueba'
    }
  });
};

export const getProducts = async (): Promise<Product[]> => {
  // En desarrollo, retornar datos mock
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve(mockProducts);
  }

  // En producción, usar el backend real
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  // En desarrollo, retornar categorías mock
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve(mockCategories);
  }

  // En producción, usar el backend real
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
