const express = require("express");
//importando modulo de conexão com o banco de dados
const { connectToDatabase, query } = require('../db/db.js');

const vendedorRoutes = express.Router();

// Rota para obter todos os vendedores
vendedorRoutes.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM vendedor';
    // Conectar ao banco de dados
    const connection = connectToDatabase();
    // Executar query para obter todos os vendedores  
    const vendedores = await query(connection, sql);
    connection.end();

    res.json(vendedores);
  } catch (error) {
    console.log('Erro ao consultar vendedores:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

//rota para adicionar um vendedor com os campos id, nome, cpf_cnpj, especialidade, email
vendedorRoutes.post('/', async (req, res) => {
  try {
    const { nome, cpf_cnpj, especialidade, email } = req.body;
    const sql = 'INSERT INTO vendedor ( nome, cpf_cnpj, especialidade, email) VALUES ( ?, ?, ?, ?)';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [ nome, cpf_cnpj, especialidade, email]);
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao adicionar vendedor:', error);
    res.status(500).send("Erro ao adicionar vendedor");
  }
});

//rota para atualizar email do vendedor por id
vendedorRoutes.put('/email/:id', async (req, res) => {
  try {
    const { email } = req.body;
    const sql = 'UPDATE vendedor SET email = ? WHERE id = ?';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [email, req.params.id]);
    console.log('result', result);  
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao atualizar email do vendedor:', error);
    res.status(500).send("Erro ao atualizar email do vendedor");
  }
});

//rota para deletar vendedor por id
vendedorRoutes.delete('/:id', async (req, res) => {
  try {
    const sql = 'DELETE FROM vendedor WHERE id = ?';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [req.params.id]);
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao deletar vendedor:', error);
    res.status(500).send("Erro ao deletar vendedor");
  }
});


module.exports = vendedorRoutes;