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


module.exports = vendedorRoutes;