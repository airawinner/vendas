// server.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Usando as rotas
app.use('/', authRoutes);
app.use('/courses', courseRoutes);
app.use('/purchases', purchaseRoutes);

// Iniciando o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
