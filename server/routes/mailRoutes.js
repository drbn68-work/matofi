import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configura tu transporter (puede ser SMTP, Gmail, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // o true si usas SSL
  // Si tu SMTP requiere autenticación:
  // auth: {
  //   user: process.env.SMTP_USER,
  //   pass: process.env.SMTP_PASS
  // },
  tls: {
    rejectUnauthorized: false, // Permite certificados autofirmados
  },
  debug: true,
  logger: true,
});

// Endpoint POST /api/sendOrder
router.post('/sendOrder', async (req, res) => {
  try {
    const { userInfo, deliveryLocation, comments, items } = req.body;
    if (!userInfo || !items) {
      throw new Error("Faltan datos en la solicitud.");
    }

    // Construir el HTML del correo con una tabla y casillas de verificación
    let html = `
      <h2>Sol·licitud de Material</h2>
      <hr>
      <h3>Informació de la Sol·licitud</h3>
      <table style="border-collapse: collapse; width: 600px; margin-bottom: 1rem;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;"><strong>Sol·licitant:</strong></td>
          <td style="border: 1px solid #ccc; padding: 8px;">${userInfo.fullName}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;"><strong>Departament:</strong></td>
          <td style="border: 1px solid #ccc; padding: 8px;">${userInfo.department}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;"><strong>Centre de cost:</strong></td>
          <td style="border: 1px solid #ccc; padding: 8px;">${userInfo.costCenter}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;"><strong>Correu electrònic:</strong></td>
          <td style="border: 1px solid #ccc; padding: 8px;">${userInfo.email}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;"><strong>Lloc de lliurament:</strong></td>
          <td style="border: 1px solid #ccc; padding: 8px;">${deliveryLocation || ""}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;"><strong>Comentaris:</strong></td>
          <td style="border: 1px solid #ccc; padding: 8px;">${comments || ""}</td>
        </tr>
      </table>

      <h3>Articles Sol·licitats</h3>
      <table style="border-collapse: collapse; width: 600px;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="border: 1px solid #ccc; padding: 8px;">Check</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Descripció</th>
            <th style="border: 1px solid #ccc; padding: 8px;">SAP</th>
            <th style="border: 1px solid #ccc; padding: 8px;">AS400</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Ubicació</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Quantitat</th>
          </tr>
        </thead>
        <tbody>
    `;

    items.forEach((item) => {
      html += `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
            <input type="checkbox" />
          </td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.descripcion || ""}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.codsap || ""}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.codas400 || ""}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.ubicacion || ""}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${item.quantity || ""}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    // Opciones del correo
    const mailOptions = {
      from: '"Fundació Puigvert" <drobson@fundacio-puigvert.es>',
      to: 'drobson@fundacio-puigvert.es', // Cambia esta dirección por la que desees
      subject: `Sol·licitud de Material - ${userInfo.fullName}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado correctament' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, error: 'Error al enviar correo' });
  }
});

export default router;
