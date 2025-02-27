import express from 'express';
import ldapService from '../services/ldapService.js'; // Ajusta la ruta si es necesario

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log("📨 Solicitud de login recibida:", req.body);

  try {
    // Eliminamos costCenter por completo
    const { username, password } = req.body;

    if (!username || !password) {
      console.error("❌ Error: Falta username o password en la solicitud");
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    console.log("🔍 Intentando autenticación con:", { username });

    // Llamamos a ldapService con solo username y password
    const result = await ldapService.authenticate(username, password);

    console.log("✅ Autenticación exitosa:", result.user);
    res.json(result);

  } catch (error) {
    console.error("❌ Error en autenticación:", error.message);
    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
});

export default router; // Exportación compatible con ES Modules
