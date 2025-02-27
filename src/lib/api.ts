
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
  { id: "1", codsap: "600560", codas400: "3288", descripcion: "ACEPT.DONACIO DE GAMETO  Mod 3288", ubicacion: "FOTOCOPIA" },
  { id: "2", codsap: "600557", codas400: "3285", descripcion: "ACEPT.DONACIO PREEMBRIONES  Mod 3285", ubicacion: "FOTOCOPIA" },
  { id: "3", codsap: "600508", codas400: "3215", descripcion: "ADQUISICIO FORA DE GUIA  Mod 3215", ubicacion: "FOTOCOPIA" },
  { id: "4", codsap: "600339", codas400: "3022", descripcion: "ADQUISICION FUERA DE GUIA  Mod 3022", ubicacion: "FOTOCOPIA" },
  { id: "5", codsap: "600646", codas400: "3382", descripcion: "AGONISTAS PCO  Mod 3382", ubicacion: "FOTOCOPIA" },
  { id: "6", codsap: "600386", codas400: "3078", descripcion: "ALTA SIN EMISION PROVIS.FAC  Mod 3078", ubicacion: "FOTOCOPIA" },
  { id: "7", codsap: "600257", codas400: "2056", descripcion: "ANALGESIA POSTOPERATORIA  Mod 2056", ubicacion: "FOTOCOPIA" },
  { id: "8", codsap: "600368", codas400: "3055", descripcion: "ANALISIS PREVIOS  Mod 3055", ubicacion: "FOTOCOPIA" },
  { id: "9", codsap: "600575", codas400: "3304", descripcion: "ANDROLOGIA GRISS C  Mod 3304", ubicacion: "FOTOCOPIA" },
  { id: "10", codsap: "600576", codas400: "3305", descripcion: "ANDROLOGIA GRISS FEMENINO  Mod 3305", ubicacion: "FOTOCOPIA" },
  { id: "11", codsap: "600574", codas400: "3303", descripcion: "ANDROLOGIA GRISS GRA  Mod 3303", ubicacion: "FOTOCOPIA" },
  { id: "12", codsap: "600583", codas400: "3312", descripcion: "ANDROLOGIA GRISS HOMBRE  Mod 3312", ubicacion: "FOTOCOPIA" },
  { id: "13", codsap: "600485", codas400: "3190", descripcion: "ANDROLOGIA II S  Mod 3190", ubicacion: "FOTOCOPIA" },
  { id: "14", codsap: "600492", codas400: "3197", descripcion: "ANDROLOGIA IIS COR  Mod 3197", ubicacion: "FOTOCOPIA" },
  { id: "15", codsap: "600480", codas400: "3183", descripcion: "ANDROLOGIA IIS GRA  Mod 3183", ubicacion: "FOTOCOPIA" },
  { id: "16", codsap: "600509", codas400: "3216", descripcion: "ANDROLOGIA SAI  Mod 3216", ubicacion: "FOTOCOPIA" },
  { id: "17", codsap: "600589", codas400: "3321", descripcion: "ANDROLOGIA SAI-COR  Mod 3321", ubicacion: "FOTOCOPIA" },
  { id: "18", codsap: "600568", codas400: "3297", descripcion: "ANDROLOGIA SAI-GRA  Mod 3297", ubicacion: "FOTOCOPIA" },
  { id: "19", codsap: "600645", codas400: "3381", descripcion: "ANTAGONISTAS PCO  Mod 3381", ubicacion: "FOTOCOPIA" },
  { id: "20", codsap: "600566", codas400: "3295", descripcion: "APERTURA PROCESO P.R.A  Mod 3295", ubicacion: "FOTOCOPIA" },
  { id: "21", codsap: "600160", codas400: "501", descripcion: "ARCHIVADOR D-4 NEGRO C/CAJA", ubicacion: "MO-42" },
  { id: "22", codsap: "600162", codas400: "503", descripcion: "ARCHIVADOR DEFINITIVO FOLIO", ubicacion: "MP-12" },
  { id: "23", codsap: "601975", codas400: "4110", descripcion: "AUTORITZACIÓ MOSTRES RAÇA ESPECIF. 4110", ubicacion: "FOTOCOPIA" },
  { id: "24", codsap: "600242", codas400: "204", descripcion: "AUTORIZACION AUSENCIA CENTRO  Mod 2040", ubicacion: "FOTOCOPIA" },
  { id: "25", codsap: "600432", codas400: "3127", descripcion: "AUTORIZACION AUSENTARSE  Mod 3127", ubicacion: "FOTOCOPIA" },
  { id: "26", codsap: "600591", codas400: "3324", descripcion: "AUTORIZACION RECOLLIDA ORINA  Mod 3324", ubicacion: "FOTOCOPIA" },
  { id: "27", codsap: "600650", codas400: "3386", descripcion: "BAIXA RESPOSTA GONAL/LUVERIS  Mod 3386", ubicacion: "FOTOCOPIA" },
  { id: "28", codsap: "600649", codas400: "3385", descripcion: "BAIXA RESPOSTA MENOPUR  Mod 3385", ubicacion: "FOTOCOPIA" },
  { id: "29", codsap: "600210", codas400: "", descripcion: "BANDEJA DE PLASTICO NEGRA", ubicacion: "MP-22" },
  { id: "30", codsap: "601668", codas400: "3829", descripcion: "BLOC A-5 PRIVAT MOD.3829", ubicacion: "MP-52" },
  { id: "31", codsap: "600114", codas400: "235", descripcion: "BOLIGRAFO  AZUL", ubicacion: "MP-07" },
  { id: "32", codsap: "600087", codas400: "203", descripcion: "BOLIGRAFO  NEGRO", ubicacion: "MP-07" },
  { id: "33", codsap: "600113", codas400: "234", descripcion: "BOLIGRAFO  ROJO", ubicacion: "MP-07" },
  { id: "34", codsap: "600097", codas400: "214", descripcion: "BORRADOR  VELLEDA REF.15MAGN", ubicacion: "MP-10" },
  { id: "35", codsap: "600497", codas400: "3202", descripcion: "CAMBIO TURNO AUX.DOTAC.1ªCL  Mod 3202", ubicacion: "FOTOCOPIA" },
  { id: "36", codsap: "600420", codas400: "3115", descripcion: "CAMBIO TURNO AUX.DOTAC.2ªH  Mod 3115", ubicacion: "FOTOCOPIA" },
  { id: "37", codsap: "600418", codas400: "3113", descripcion: "CAMBIO TURNO AUX.DOTAC.3ªCL  Mod 3113", ubicacion: "FOTOCOPIA" },
  { id: "38", codsap: "600510", codas400: "3218", descripcion: "CAMBIO TURNO AUX.DOTAC.3ªH  Mod 3218", ubicacion: "FOTOCOPIA" },
  { id: "39", codsap: "600496", codas400: "3201", descripcion: "CAMBIO TURNO AUX.DOTAC.4ªCL  Mod 3201", ubicacion: "FOTOCOPIA" },
  { id: "40", codsap: "600166", codas400: "507", descripcion: "CARPETA MARRON D-4", ubicacion: "MP-26" },
  { id: "41", codsap: "600161", codas400: "502", descripcion: "CARPETAS 2 ANILLAS LOMO ANCHO", ubicacion: "MP-29" },
  { id: "42", codsap: "600781", codas400: "4003", descripcion: "CARPETAS CARTON D-4 BLANCA MOD.4003", ubicacion: "MP-51" },
  { id: "43", codsap: "600164", codas400: "505", descripcion: "CARPETAS CON GOMA Y BOLSA", ubicacion: "MP-28" },
  { id: "44", codsap: "600195", codas400: "617", descripcion: "CARPETAS ESCAPARATE 40 FUNDAS", ubicacion: "MP-27" },
  { id: "45", codsap: "600165", codas400: "506", descripcion: "CARPETAS NEGRA PARA CURSOS", ubicacion: "MP-28" },
  { id: "46", codsap: "600167", codas400: "509", descripcion: "CARPETAS PLASTICO TRANSP D-4", ubicacion: "MP-25" },
  { id: "47", codsap: "600721", codas400: "3480", descripcion: "CARTA CONVOCATORIA FIV  Mod 3480", ubicacion: "FOTOCOPIA" },
  { id: "48", codsap: "600816", codas400: "4055", descripcion: "CARTA GERENCIA MOD.4055", ubicacion: "MP-43" },
  { id: "49", codsap: "601666", codas400: "4052", descripcion: "CARTA PRIVAT MOD.4052", ubicacion: "MP-53" }
];

const mockCategories = [...new Set(mockProducts.map(p => p.ubicacion))];

export const loginWithLDAP = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Si es autenticación local (solo para admin/desarrollo)
    if (credentials.authType === 'local') {
      if (credentials.username === 'testuser' && credentials.password === 'testuser') {
        return {
          success: true,
          user: {
            username: credentials.username,
            fullName: `Usuario de Prueba (${credentials.username})`,
            costCenter: credentials.costCenter,
            department: 'Departamento de Prueba'
          }
        };
      } else {
        return {
          success: false,
          error: 'Credenciales locales inválidas. Por favor, use "testuser" como usuario y contraseña para el modo local.'
        };
      }
    }
    
    // Si es autenticación LDAP (predeterminada)
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Extraemos información más detallada del error
      console.error('Error detallado de autenticación LDAP:', error);
      
      let errorMessage = 'Error de conexión con el servidor LDAP';
      
      if (error.response) {
        // El servidor respondió con un código de error
        const statusCode = error.response.status;
        const serverError = error.response.data?.error || '';
        
        if (statusCode === 401) {
          errorMessage = 'Usuario o contraseña incorrectos. Verifique sus credenciales LDAP.';
        } else if (statusCode === 404) {
          errorMessage = 'Usuario no encontrado en el directorio LDAP.';
        } else if (statusCode === 403) {
          errorMessage = 'Este usuario no tiene permisos para acceder. Contacte con el administrador.';
        } else if (statusCode === 400) {
          errorMessage = 'Datos incompletos o inválidos. Verifique el centro de coste.';
        } else if (serverError) {
          errorMessage = `Error del servidor: ${serverError}`;
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        errorMessage = 'No se obtuvo respuesta del servidor LDAP. Verifique la conexión de red o contacte con soporte técnico.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  } catch (error: any) {
    console.error('Error general en autenticación:', error);
    return {
      success: false,
      error: 'Error inesperado en la autenticación. Por favor, contacte con soporte técnico.'
    };
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error loading data:', error);
    // Si hay un error, retornamos los datos mock
    return mockProducts;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Si hay un error, retornamos las categorías mock
    return mockCategories;
  }
};
