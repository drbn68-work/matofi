import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configura tu transporter (puede ser SMTP, Gmail, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // o true si usas SSL
  // auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
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

    // Bloque de estilos para la tabla aún más compacta
    const styleBlock = `
      <style>
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 0;
        }
        table.compact-table {
          border-collapse: collapse;
          width: 600px;
          margin-bottom: 1rem;
          font-size: 12px;      /* Tamaño de fuente reducido */
          line-height: 1;       /* Línea muy compacta */
        }
        table.compact-table th,
        table.compact-table td {
          border: 1px solid #ccc;
          padding: 2px 4px;     /* Menos padding en las celdas */
        }
        table.compact-table thead tr {
          background-color: #f0f0f0;
        }
        .checkbox-cell {
          text-align: center;
          vertical-align: middle;
        }
      </style>
    `;

    // Construir el HTML del correo
    let html = `
      ${styleBlock}
      <h2>Sol·licitud de Material</h2>
      <hr>
      <h3>Informació de la Sol·licitud</h3>
      <table class="compact-table">
        <tbody>
          <tr>
            <th>Sol·licitant</th>
            <td>${userInfo.fullName}</td>
          </tr>
          <tr>
            <th>Departament</th>
            <td>${userInfo.department}</td>
          </tr>
          <tr>
            <th>Correu electrònic</th>
            <td>${userInfo.email}</td>
          </tr>
          <tr>
            <th>Centre de cost (CAI Petició)</th>
            <td>${userInfo.costCenter}</td>
          </tr>          
          <tr>
            <th>Lloc de lliurament</th>
            <td>${deliveryLocation || ""}</td>
          </tr>
          <tr>
            <th>Comentaris</th>
            <td>${comments || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3>Articles Sol·licitats</h3>
      <table class="compact-table">
        <thead>
          <tr>
            <th>Check</th>
            <th>Descripció</th>
            <th>SAP</th>
            <th>AS400</th>
            <th>Ubicació</th>
            <th>Quantitat</th>
          </tr>
        </thead>
        <tbody>
    `;

    items.forEach((item) => {
      html += `
        <tr>
          <td class="checkbox-cell"><input type="checkbox" /></td>
          <td>${item.descripcion || ""}</td>
          <td>${item.codsap || ""}</td>
          <td>${item.codas400 || ""}</td>
          <td>${item.ubicacion || ""}</td>
          <td style="text-align: right;">${item.quantity || ""}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    const mailOptions = {
      from: '"Fundació Puigvert" <drobson@fundacio-puigvert.es>',
      to: 'drobson@fundacio-puigvert.es', // Cambia por la dirección deseada
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
