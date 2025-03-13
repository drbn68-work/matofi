import express from 'express';
import jwt from 'jsonwebtoken';
import ldapService from '../services/ldapService.js';

const router = express.Router();

router.post('/login', async (req, res) => {

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.error("❌ Error: Falta username o password en la solicitud");
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    console.log("🔍 Intentando autenticación con:", { username });

    // Llamada a ldapService para autenticar con LDAP
    const result = await ldapService.authenticate(username, password);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed'
      });
    }

    console.log("✅ Autenticación exitosa:", result.user);

    // Generar token JWT con los datos esenciales del usuario,
    // sin usar 'id' ya que el LDAP no lo proporciona, y dejando costCenter vacío.
    // Añadimos isAdmin para que el frontend sepa si es admin.
    const tokenPayload = {
      username: result.user.username,
      fullName: result.user.fullName,
      department: result.user.department,
      email: result.user.email,
      costCenter: result.user.costCenter, // Se espera que sea "" (vacío)
      isAdmin: result.user.isAdmin        
    };

    const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1h' });

    // Establecer la cookie httpOnly con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hora en milisegundos
    });

    // Se responde con éxito y se envía el usuario (sin el token, ya que está en la cookie)
    res.json({ success: true, user: result.user });
    
  } catch (error) {
    console.error("❌ Error en autenticación:", error.message);
    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
});

export default router;
