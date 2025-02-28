
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// Configuración para cargar el archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

// Configuración de orígenes permitidos para CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  // Añadir cualquier otro origen que necesites
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origen no permitido: ${origin}`);
      callback(null, true); // Permitimos de todos modos para desarrollo, cambiar a false en producción
    }
  },
  credentials: true // Importante: habilitar el envío de cookies
}));

// Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', emailRoutes); 

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error en middleware global:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
  console.log(`- Orígenes CORS permitidos: ${allowedOrigins.join(', ')}`);
});
