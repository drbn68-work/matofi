
import axios from 'axios';
import { LoginCredentials, LoginResponse, Product } from '@/lib/types';
import { getProducts as fetchProductsFromCsv } from '@/lib/data';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta esto a la URL de tu backend

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar y recibir cookies
});

// Función para probar la conexión al backend
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/test');
    console.log('Conexión al API exitosa:', response.data);
    return true;
  } catch (error) {
    console.error('Error al conectar con el API:', error);
    return false;
  }
};

export const loginWithLDAP = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Iniciando proceso de autenticación con:', { 
      username: credentials.username, 
      costCenter: credentials.costCenter,
      authType: credentials.authType 
    });

    // Si es autenticación local (solo para admin/desarrollo)
    if (credentials.authType === 'local') {
      if (credentials.username === 'testuser' && credentials.password === 'testuser') {
        try {
          console.log("Intentando autenticación local con credenciales de prueba");
          
          // Intentamos primero probar la conexión
          const isConnected = await testApiConnection();
          if (!isConnected) {
            console.error("No se pudo conectar con el servidor");
            
            // Si no hay conexión, creamos una sesión local
            const mockUser = {
              username: credentials.username,
              fullName: `Usuario de Prueba (${credentials.username})`,
              costCenter: credentials.costCenter,
              department: 'Departamento de Prueba',
              email: `${credentials.username}@example.com`
            };
            
            // Guardamos en sessionStorage
            sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
            sessionStorage.setItem('is_authenticated', 'true');
            
            console.log("Autenticación local simulada exitosa");
            
            return {
              success: true,
              user: mockUser
            };
          }
          
          // Enviamos la autenticación al servidor para establecer la cookie
          console.log("Enviando solicitud de autenticación local a", `${API_BASE_URL}/auth/login-local`);
          const response = await api.post('/auth/login-local', {
            username: credentials.username,
            costCenter: credentials.costCenter
          });
          
          console.log("Respuesta de autenticación local:", response.data);
          
          if (response.data.success) {
            // También guardamos en sessionStorage como respaldo
            sessionStorage.setItem('auth_user', JSON.stringify(response.data.user));
            sessionStorage.setItem('is_authenticated', 'true');
            
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
          
          // Si hay un error de conexión, permitimos la autenticación local de respaldo
          const mockUser = {
            username: credentials.username,
            fullName: `Usuario de Prueba (${credentials.username})`,
            costCenter: credentials.costCenter,
            department: 'Departamento de Prueba'
          };
          
          sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
          sessionStorage.setItem('is_authenticated', 'true');
          
          console.log("Autenticación local de respaldo activada");
          
          return {
            success: true,
            user: mockUser
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
    try {
      console.log(`Enviando solicitud a ${API_BASE_URL}/auth/login`);
      const response = await api.post('/auth/login', credentials);
      console.log('Respuesta del servidor LDAP:', response.data);
      
      if (response.data.success) {
        // Guardamos en sessionStorage como respaldo
        sessionStorage.setItem('auth_user', JSON.stringify(response.data.user));
        sessionStorage.setItem('is_authenticated', 'true');
      }
      
      return response.data;
    } catch (error: any) {
      // Extraemos información detallada del error para debugging
      console.error('Error completo de autenticación LDAP:', error);
      
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
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('is_authenticated');
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    // Intentamos limpiar el sessionStorage de todas formas
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('is_authenticated');
    return false;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    // Primero intentamos obtener los productos del CSV local
    const csvProducts = await fetchProductsFromCsv();
    if (csvProducts && csvProducts.length > 0) {
      console.log(`Cargados ${csvProducts.length} productos desde CSV`);
      return csvProducts;
    }
    
    // Si no hay productos en el CSV o falla, intentamos obtenerlos del API
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    // Si hay un error en ambos métodos, intentamos una última vez con el CSV
    try {
      return await fetchProductsFromCsv();
    } catch (e) {
      console.error('Error final obteniendo productos:', e);
      // Retornamos un conjunto mínimo de productos como último recurso
      return [
        { id: "600560", codsap: "600560", codas400: "3288", descripcion: "ACEPT.DONACIO DE GAMETO Mod 3288", ubicacion: "FOTOCOPIA" },
        { id: "600557", codsap: "600557", codas400: "3285", descripcion: "ACEPT.DONACIO PREEMBRIONES Mod 3285", ubicacion: "FOTOCOPIA" },
        { id: "600508", codsap: "600508", codas400: "3215", descripcion: "ADQUISICIO FORA DE GUIA Mod 3215", ubicacion: "FOTOCOPIA" },
        { id: "600339", codsap: "600339", codas400: "3022", descripcion: "ADQUISICION FUERA DE GUIA Mod 3022", ubicacion: "FOTOCOPIA" },
        { id: "600646", codsap: "600646", codas400: "3382", descripcion: "AGONISTAS PCO Mod 3382", ubicacion: "FOTOCOPIA" }
      ];
    }
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Si hay un error, intentamos obtener las categorías de los productos del CSV
    try {
      const products = await fetchProductsFromCsv();
      const uniqueCategories = [...new Set(products.map(p => p.ubicacion))];
      return uniqueCategories;
    } catch (e) {
      console.error('Error obteniendo categorías desde CSV:', e);
      // Retornamos categorías de respaldo
      return ["FOTOCOPIA", "MO-42", "MP-12", "MP-22", "MP-52", "MP-07", "MP-10", "MP-26", "MP-29", "MP-51", "MP-28", "MP-27", "MP-25", "MP-43", "MP-53"];
    }
  }
};
