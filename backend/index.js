const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Permitir requisições do frontend
app.use(express.json()); // Para ler o corpo da requisição em JSON

const alunoRoutes = require('./routes/alunoRoutes.js');
const vendedorRoutes = require('./routes/vendedorRoutes.js');
const cursoRoutes = require('./routes/cursoRoutes.js');
const compraRoutes = require('./routes/compraRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

//usar roteadores na aplicação
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);
app.use('/compras', compraRoutes);
app.use('/vendedores', vendedorRoutes);
app.use('/', authRoutes);

//rota para verificar id do processo
app.get('/', (req, res) => {
  res.send('API em execução');
});

// Iniciar servidor na porta 3000
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
