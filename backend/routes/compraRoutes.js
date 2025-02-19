const express = require("express");
//importando modulo de conexão com o banco de dados
const { connectToDatabase, query } = require('../db/db.js');

const comprasRoutes = express.Router();

// Rota para obter todas as compras
comprasRoutes.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM compra';
    // Conectar ao banco de dados
    const connection = connectToDatabase();
    // Executar query para obter todas as compras  
    const compras = await query(connection, sql);
    connection.end();

    res.json(compras);
  } catch (error) {
    console.log('Erro ao consultar compras:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

//rota registrar uma compra, ela precisa asicionar dados nas tabelas:
//  compra: id, data_compra, forma_pagamento, aluno_id
// compra_curso: compra_id, curso_id
// pagamento: id, status, data_pagamento, valor_pago, quantidade_parcelas, valor_parcela, compra_id
comprasRoutes.post('/', async (req, res) => {
  try {
    const { data_compra, forma_pagamento, aluno_id, curso_id, status, data_pagamento, valor_pago, quantidade_parcelas } = req.body;
    const connection = connectToDatabase();

    // Verificar se o aluno já possui uma compra pendente
    const checkSql = `
    SELECT COUNT(*) AS count FROM Compra c
    join aluno a on c.aluno_id = a.id
    join pagamento p on p.compra_id = c.id
    WHERE aluno_id = ? AND p.status != "pago"
    `;    
    const [existingPurchases] = await query(connection, checkSql, [aluno_id]);

    if (existingPurchases.count > 0) {
      connection.end();
      return res.status(400).send("O aluno só pode realizar uma compra por vez");
    }

    // Inserir nova compra
    const sql = 'INSERT INTO compra (data_compra, forma_pagamento, aluno_id) VALUES (?, ?, ?)';
    const result = await query(connection, sql, [data_compra, forma_pagamento, aluno_id]);
    const compra_id = result.insertId;

    // Inserir curso na compra
    const sql2 = 'INSERT INTO compra_curso (compra_id, curso_id) VALUES (?, ?)';
    await query(connection, sql2, [compra_id, curso_id]);

    // Inserir pagamento
    const sql3 = 'INSERT INTO pagamento (status, data_pagamento, valor_pago, quantidade_parcelas, compra_id) VALUES (?, ?, ?, ?, ?)';
    await query(connection, sql3, [status, data_pagamento, valor_pago, quantidade_parcelas, compra_id]);

    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao adicionar compra:', error);
    res.status(500).send("Erro ao adicionar compra");
  }
});

//rota que retorna todas as compras de um aluno por id
comprasRoutes.get('/aluno/:id', async (req, res) => {
  try {
    const sql = 'SELECT * FROM compra WHERE aluno_id = ?';
    const connection = connectToDatabase();
    const compras = await query(connection, sql, [req.params.id]);
    connection.end();
    res.json(compras);
  } catch (error) {
    console.log('Erro ao consultar compras:', error);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});


module.exports = comprasRoutes;

