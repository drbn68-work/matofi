import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import excelRoutes from './routes/excelRoutes.js'; // <-- importar

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de auth
app.use('/api/auth', authRoutes);

// Rutas para productos / categories del Excel
app.use('/api', excelRoutes);

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
