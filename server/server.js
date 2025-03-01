import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import excelRoutes from './routes/excelRoutes.js';
import mailRoutes from './routes/mailRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir el envío de cookies
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas para Excel (productos y categorías)
app.use('/api', excelRoutes);

// Rutas para enviar correos (por ejemplo, /api/sendOrder)
app.use('/api', mailRoutes);

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
