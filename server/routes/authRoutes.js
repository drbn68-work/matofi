
import express from 'express';
import { authenticateUser } from '../services/ldapService.js';

const router = express.Router();

// Configuración para las cookies
const COOKIE_OPTIONS = {
  httpOnly: true,          // Previene acceso desde JavaScript (XSS protection)
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'lax',         // Protección contra CSRF
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  path: '/'                // Disponible en toda la aplicación
};

// Ruta de login LDAP
router.post('/login', async (req, res) => {
  const { username, password, costCenter } = req.body;
  
  if (!username || !password || !costCenter) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos necesarios para la autenticación'
    });
  }
  
  try {
    const result = await authenticateUser(username, password, costCenter);
    
    if (result.success) {
      // Almacenar datos del usuario en una cookie HTTP-only
      res.cookie('auth_session', JSON.stringify(result.user), COOKIE_OPTIONS);
      
      return res.status(200).json({
        success: true,
        user: result.user
      });
    } else {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({
      success: false,
      error: `Error en el servidor: ${error.message}`
    });
  }
});

// Ruta de login local (para desarrollo)
router.post('/login-local', (req, res) => {
  const { username, costCenter } = req.body;
  
  if (!username || !costCenter) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos necesarios para la autenticación local'
    });
  }
  
  // Crear usuario de prueba
  const user = {
    username,
    fullName: `Usuario de Prueba (${username})`,
    costCenter,
    department: 'Departamento de Prueba',
    email: `${username}@example.com`
  };
  
  // Almacenar datos del usuario en una cookie HTTP-only
  res.cookie('auth_session', JSON.stringify(user), COOKIE_OPTIONS);
  
  return res.status(200).json({
    success: true,
    user
  });
});

// Ruta para verificar si el usuario está autenticado
router.get('/check', (req, res) => {
  const authCookie = req.cookies.auth_session;
  
  if (!authCookie) {
    return res.status(200).json({
      authenticated: false
    });
  }
  
  try {
    const user = JSON.parse(authCookie);
    return res.status(200).json({
      authenticated: true,
      user
    });
  } catch (error) {
    console.error('Error al procesar cookie de autenticación:', error);
    res.clearCookie('auth_session');
    return res.status(200).json({
      authenticated: false
    });
  }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
  res.clearCookie('auth_session');
  return res.status(200).json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
});

export default router;
