const express = require('express');
const { connectToDatabase, query } = require('../db/db.js');

const authRoutes = express.Router();

// Rota para login
authRoutes.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const connection = connectToDatabase();

    // Verificar se o email pertence a um vendedor
    let sql = 'SELECT * FROM vendedor WHERE email = ?';
    let result = await query(connection, sql, [email]);

    if (result.length > 0) {
      const vendedor = result[0];
      connection.end();
      return res.json({ role: 'admin', ...vendedor });
    }

    // Verificar se o email pertence a um aluno
    sql = 'SELECT * FROM aluno WHERE email = ?';
    result = await query(connection, sql, [email]);

    if (result.length > 0) {
      const aluno = result[0];
      connection.end();
      return res.json({ role: 'user', ...aluno });
    }

    connection.end();
    res.status(401).send('Email não encontrado');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).send('Erro ao fazer login');
  }
});

module.exports = authRoutes;