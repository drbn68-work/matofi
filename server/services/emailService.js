
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para cargar el archivo .env desde la carpeta server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Obtener configuración SMTP desde variables de entorno
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '25', 10);

// Configuración del transportador de email usando el servidor SMTP proporcionado
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true para 465, false para otros puertos
  tls: {
    // No rechazar conexiones no autorizadas
    rejectUnauthorized: false
  }
});

// Verificar la configuración al iniciar la aplicación
console.log(`Configuración SMTP: Host=${SMTP_HOST}, Port=${SMTP_PORT}`);

/**
 * Función para enviar un correo electrónico con los detalles de un pedido
 * @param {Object} orderData - Datos del pedido
 * @returns {Promise<Object>} - Resultado del envío
 */
export const sendOrderEmail = async (orderData) => {
  try {
    const { items, userInfo, deliveryLocation, comments } = orderData;
    
    // Crear tabla HTML con los items del pedido
    let itemsTable = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="text-align: left;">Descripció</th>
            <th style="text-align: left;">Codi SAP</th>
            <th style="text-align: left;">Codi AS400</th>
            <th style="text-align: left;">Ubicació</th>
            <th style="text-align: center;">Quantitat</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    items.forEach(item => {
      itemsTable += `
        <tr>
          <td>${item.product.descripcion}</td>
          <td>${item.product.codsap}</td>
          <td>${item.product.codas400}</td>
          <td>${item.product.ubicacion}</td>
          <td style="text-align: center;">${item.quantity}</td>
        </tr>
      `;
    });
    
    itemsTable += `
        </tbody>
      </table>
    `;
    
    // Construir el contenido del correo
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #003366;">Sol·licitud de Material d'Oficina</h2>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0;">Informació del Sol·licitant</h3>
          <p><strong>Nom:</strong> ${userInfo.fullName}</p>
          <p><strong>Departament:</strong> ${userInfo.department}</p>
          <p><strong>Centre de Cost:</strong> ${userInfo.costCenter}</p>
          <p><strong>Correu:</strong> ${userInfo.email}</p>
          <p><strong>Lloc de lliurament:</strong> ${deliveryLocation}</p>
          ${comments ? `<p><strong>Comentaris:</strong> ${comments}</p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>Articles Sol·licitats</h3>
          ${itemsTable}
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          Aquest correu s'ha generat automàticament. Si us plau, no respongui a aquest missatge.
        </p>
      </div>
    `;
    
    // Configurar opciones del email
    const mailOptions = {
      from: `"Sistema de Sol·licituds" <solicitudes@fp.local>`,
      to: 'compras@fp.local', // Email del departamento de compras
      cc: userInfo.email, // Copia al solicitante
      subject: `Sol·licitud de Material - ${userInfo.fullName} (${userInfo.department})`,
      html: emailContent
    };
    
    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: %s', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error(`Error al enviar email: ${error.message}`);
  }
};
