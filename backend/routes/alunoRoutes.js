const express = require("express");
const { connectToDatabase, query } = require('../db/db.js');

const alunoRoutes = express.Router();

// Rota para obter todos os alunos
alunoRoutes.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM aluno';
    const connection = connectToDatabase();
    const alunos = await query(connection, sql);
    connection.end();

    res.json(alunos);
  } catch (error) {
    console.log('Erro ao consultar alunos:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

module.exports = alunoRoutes;