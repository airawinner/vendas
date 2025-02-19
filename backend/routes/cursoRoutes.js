const express = require("express");
//importando modulo de conexão com o banco de dados
const { connectToDatabase, query } = require('../db/db.js');

const cursosRoutes = express.Router();

// Rota para obter todos os cursos
cursosRoutes.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM curso';
    // Conectar ao banco de dados
    const connection = connectToDatabase();
    // Executar query para obter todos os cursos  
    const cursos = await query(connection, sql);
    connection.end();

    res.json(cursos);
  } catch (error) {
    console.log('Erro ao consultar cursos:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

//rota para adicionar um curso 
cursosRoutes.post('/', async (req, res) => {
  try {
    const { titulo, descricao, preco, data_anuncio, status, acesso_curso, vendedor_id } = req.body;
    const sql = 'INSERT INTO curso (titulo, descricao, preco, data_anuncio, status, acesso_curso, vendedor_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [titulo, descricao, preco, data_anuncio, status, acesso_curso, vendedor_id]);
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao adicionar curso:', error);
    res.status(500).send("Erro ao adicionar curso");
  }
});

//rota que retorna todos os cursos disponiveis
cursosRoutes.get('/disponiveis', async (req, res) => {
  try {
    const sql = 'SELECT * FROM curso WHERE status = "ativo"';
    const connection = connectToDatabase();
    const cursos = await query(connection, sql);
    connection.end();
    res.json(cursos);
  } catch (error) {
    console.log('Erro ao consultar cursos:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

//rota para trazer curso por id do vendendor
cursosRoutes.get('/vendedor/:id', async (req, res) => {
  try {
    const sql = 'SELECT * FROM curso WHERE vendedor_id = ?';
    const connection = connectToDatabase();
    const cursos = await query(connection, sql, [req.params.id]);
    connection.end();
    res.json(cursos);
  } catch (error) {
    console.log('Erro ao consultar cursos:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

//rota para deletar um curso pelo id
cursosRoutes.delete('/:id', async (req, res) => {
  try {
    const sql = 'DELETE FROM curso WHERE id = ?';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [req.params.id]);
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao deletar curso:', error);
    res.status(500).send("Erro ao deletar curso");
  }
});

//rota para obter as compras pagas de um aluno
cursosRoutes.get('/compras/:id', async (req, res) => {
  try {
    const sql = `
      SELECT c.*, co.data_compra
      FROM curso c
      JOIN compra_curso cc ON c.id = cc.curso_id
      JOIN compra co ON cc.compra_id = co.id
      JOIN pagamento p ON co.id = p.compra_id
      WHERE p.status = 'pago'
      AND co.aluno_id = ?;
    `;
    const connection = connectToDatabase();
    const compras = await query(connection, sql, [req.params.id]);
    connection.end();
    res.json(compras);
  } catch (error) {
    console.log('Erro ao consultar compras:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});



module.exports = cursosRoutes;


