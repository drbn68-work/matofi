
import axios from 'axios';
import { LoginCredentials, LoginResponse, Product } from '@/lib/types';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta esto a la URL de tu backend

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar y recibir cookies
});

// Mock data para desarrollo
const mockProducts: Product[] = [
  { id: "1", codsap: "600560", codas400: "3288", descripcion: "ACEPT.DONACIO DE GAMETO  Mod 3288", ubicacion: "FOTOCOPIA" },
  { id: "2", codsap: "600557", codas400: "3285", descripcion: "ACEPT.DONACIO PREEMBRIONES  Mod 3285", ubicacion: "FOTOCOPIA" },
  { id: "3", codsap: "600508", codas400: "3215", descripcion: "ADQUISICIO FORA DE GUIA  Mod 3215", ubicacion: "FOTOCOPIA" },
  { id: "4", codsap: "600339", codas400: "3022", descripcion: "ADQUISICION FUERA DE GUIA  Mod 3022", ubicacion: "FOTOCOPIA" },
  { id: "5", codsap: "600646", codas400: "3382", descripcion: "AGONISTAS PCO  Mod 3382", ubicacion: "FOTOCOPIA" },
  // ... resto de productos
];

const mockCategories = [...new Set(mockProducts.map(p => p.ubicacion))];

export const loginWithLDAP = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Si es autenticación local (solo para admin/desarrollo)
    if (credentials.authType === 'local') {
      if (credentials.username === 'testuser' && credentials.password === 'testuser') {
        try {
          console.log("Intentando autenticación local con credenciales de prueba");
          
          // Enviamos la autenticación al servidor para establecer la cookie
          const response = await api.post('/auth/login-local', {
            username: credentials.username,
            costCenter: credentials.costCenter
          });
          
          console.log("Respuesta de autenticación local:", response.data);
          
          if (response.data.success) {
            return {
              success: true,
              user: response.data.user || {
                username: credentials.username,
                fullName: `Usuario de Prueba (${credentials.username})`,
                costCenter: credentials.costCenter,
                department: 'Departamento de Prueba'
              }
            };
          } else {
            return {
              success: false,
              error: response.data.error || 'Error en autenticación local'
            };
          }
        } catch (error: any) {
          console.error("Error detallado al establecer cookie local:", error);
          
          let errorMessage = 'Error al establecer la sesión. Por favor, inténtelo de nuevo.';
          
          if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
            errorMessage = error.response.data?.error || errorMessage;
          }
          
          return {
            success: false,
            error: errorMessage
          };
        }
      } else {
        return {
          success: false,
          error: 'Credenciales locales inválidas. Por favor, use "testuser" como usuario y contraseña para el modo local.'
        };
      }
    }
    
    // Si es autenticación LDAP (predeterminada)
    console.log('Intentando autenticación LDAP con:', { 
      username: credentials.username, 
      costCenter: credentials.costCenter,
      // No mostramos la contraseña por seguridad
      authType: credentials.authType 
    });

    try {
      console.log(`Enviando solicitud a ${API_BASE_URL}/auth/login`);
      const response = await api.post('/auth/login', credentials);
      console.log('Respuesta del servidor LDAP:', response.data);
      return response.data;
    } catch (error: any) {
      // Extraemos información detallada del error para debugging
      console.error('Error completo de autenticación LDAP:', error);
      
      // Crear un objeto con todos los detalles del error para depuración
      const errorDetails = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          timeout: error.config?.timeout,
          baseURL: error.config?.baseURL
        }
      };
      
      console.error('Detalles completos del error:', JSON.stringify(errorDetails, null, 2));
      
      let errorMessage = 'Error de conexión con el servidor LDAP';
      let errorDetail = '';
      
      if (error.response) {
        // El servidor respondió con un código de error
        const statusCode = error.response.status;
        const serverError = error.response.data?.error || '';
        
        if (statusCode === 401) {
          errorMessage = 'Usuario o contraseña incorrectos';
          errorDetail = 'Verifique sus credenciales LDAP y asegúrese de que tiene permiso para acceder.';
        } else if (statusCode === 404) {
          errorMessage = 'Usuario no encontrado en el directorio LDAP';
          errorDetail = `El usuario "${credentials.username}" no existe en el directorio LDAP o no está asociado al centro de coste especificado.`;
        } else if (statusCode === 403) {
          errorMessage = 'Acceso denegado';
          errorDetail = 'Este usuario no tiene permisos para acceder a la aplicación. Contacte con el administrador.';
        } else if (statusCode === 400) {
          errorMessage = 'Datos incompletos o inválidos';
          errorDetail = `Verifique que todos los campos sean correctos. Error del servidor: ${serverError}`;
        } else {
          errorMessage = `Error del servidor (${statusCode})`;
          errorDetail = serverError || 'El servidor devolvió un error no especificado';
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        errorMessage = 'No se obtuvo respuesta del servidor LDAP';
        errorDetail = `La petición fue enviada pero no se recibió respuesta. Detalles: ${error.message}. Verifique:
        1. Que el servidor esté en funcionamiento
        2. Que la URL ${API_BASE_URL} sea accesible
        3. Que no haya problemas de red o cortafuegos bloqueando la conexión
        4. Que el servidor LDAP esté configurado correctamente`;
      } else {
        // Error al configurar la solicitud
        errorMessage = 'Error al preparar la solicitud';
        errorDetail = `No se pudo configurar la petición: ${error.message}`;
      }
      
      // Creamos un mensaje de error completo para mostrar al usuario
      const fullErrorMessage = `${errorMessage}\n\n${errorDetail}\n\nDetalles técnicos: ${error.message}`;
      
      return {
        success: false,
        error: fullErrorMessage
      };
    }
  } catch (error: any) {
    console.error('Error general en autenticación:', error);
    const detailedError = `
      Error inesperado en la autenticación: ${error.message}
      
      Stack trace: ${error.stack || 'No disponible'}
      
      Este es probablemente un error de programación o configuración.
      Por favor, contacte con soporte técnico y proporcione estos detalles.
    `;
    
    return {
      success: false,
      error: detailedError
    };
  }
};

// Función para cerrar sesión
export const logout = async (): Promise<boolean> => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
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
