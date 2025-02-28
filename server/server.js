
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', emailRoutes); // Agregamos las rutas de email

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
