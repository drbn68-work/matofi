
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

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Orígenes permitidos
  credentials: true // Habilitar el envío de cookies
}));
app.use(express.json());
app.use(cookieParser()); // Middleware para cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', emailRoutes); 

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
