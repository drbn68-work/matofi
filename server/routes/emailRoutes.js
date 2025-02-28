
import express from 'express';
import { sendOrderEmail } from '../services/emailService.js';

const router = express.Router();

// Ruta para enviar email con la orden
router.post('/send-order-email', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validar que la solicitud tenga los datos necesarios
    if (!orderData.items || !orderData.userInfo) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos necesarios para procesar la solicitud'
      });
    }
    
    // Enviar el email
    const result = await sendOrderEmail(orderData);
    
    res.status(200).json({
      success: true,
      message: 'Email enviado correctamente',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error en la ruta /send-order-email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al enviar el email'
    });
  }
});

export default router;
