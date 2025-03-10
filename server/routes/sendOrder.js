import express from "express";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

const router = express.Router();

console.log("Definint POST /sendOrder en sendOrderRouter");

// Configuració del transportador de correu (sense canviar res de la configuració original)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // o true si utilitzes SSL
  // auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: {
    rejectUnauthorized: false, // Permet certificats autofirmats
  },
  debug: true,
  logger: true,
});

router.post("/sendOrder", async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    const { userInfo, deliveryLocation, comments, items } = req.body;
    // Generar un ID únic per a la comanda
    const orderId = uuidv4();

    // Bloc d'estils per a la taula compacta
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
      font-size: 12px; /* Mida de font més petita */
      line-height: 1;  /* Espaiat molt compacte entre línies */
    }
    table.compact-table th,
    table.compact-table td {
      border: 1px solid #ccc;
      padding: 2px 4px; /* Menys farcit a les cel·les */
      text-align: left; 
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

    // Construir l'HTML del correu
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

    // Inserir la capçalera de la comanda a la taula "orders"
    await pool.query(
      `INSERT INTO orders (
         id,
         cost_center,
         full_name,
         department,
         email,
         delivery_location,
         comments,
         created_at
       )
       VALUES (
         $1,
         $2,
         $3,
         $4,
         $5,
         $6,
         $7,
         NOW()
       )`,
      [
        orderId,
        userInfo.costCenter,
        userInfo.fullName,
        userInfo.department,
        userInfo.email,
        deliveryLocation,
        comments,
      ]
    );

    // Inserir cada article a la taula "order_items"
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (
           order_id,
           codsap,
           descripcion,
           codas400,
           ubicacion,
           quantity
         )
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.codsap,
          item.descripcion,
          item.codas400,
          item.ubicacion,
          item.quantity,
        ]
      );
    }

    // Ara que la comanda està inserida a la BD, enviar el correu al departament
    const mailOptionsDept = {
      from: "matofi@fundacio-puigvert.es",
      to: process.env.EMAIL_DESTINATARI,
      cc: "drobson@fundacio-puigvert.es",
      subject: `Comanda pel CAI ${userInfo.costCenter}`,
      html,
    };

    try {
      const mailResultDept = await transporter.sendMail(mailOptionsDept);
      console.log("Correu enviat al departament:", mailResultDept);
      return res.status(201).json({
        success: true,
        message: "Comanda guardada i correu enviat correctament",
        orderId,
      });
    } catch (mailError) {
      console.error("Error enviant el correu:", mailError);
      return res.status(201).json({
        success: true,
        message:
          "Comanda guardada correctament però no s'ha enviat el correu. Si us plau, imprimeix la comanda i envia-la manualment.",
        orderId,
      });
    }
  } catch (error) {
    console.error("Error en sendOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Error en guardar la comanda",
    });
  }
});

export default router;
