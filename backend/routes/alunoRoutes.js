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

//rota para adicionar um aluno com os campos id, cpf, nome, email, telefone
alunoRoutes.post('/', async (req, res) => {
  try {
    const { cpf, nome, email, telefone } = req.body;
    const sql = 'INSERT INTO aluno ( cpf, nome, email, telefone) VALUES (?, ?, ?, ?)';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [ cpf, nome, email, telefone]);
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao adicionar aluno:', error);
    res.status(500).send("Erro ao adicionar aluno");
  }
});

//rota para atualizar email do aluno por id
alunoRoutes.put('/email/:id', async (req, res) => {
  try {
    const { email } = req.body;
    const sql = 'UPDATE aluno SET email = ? WHERE id = ?';
    const connection = connectToDatabase();
    const result = await query(connection, sql, [email, req.params.id]);
    connection.end();
    res.json(result);
  } catch (error) {
    console.log('Erro ao atualizar email do aluno:', error);
    res.status(500).send("Erro ao atualizar email do aluno");
  }
});

// Rota para deletar aluno por id
alunoRoutes.delete('/:id', async (req, res) => {
  const connection = connectToDatabase();
  try {
    await connection.beginTransaction();

    const alunoId = req.params.id;

    // Deletar associações na tabela Compra_Curso
    let sql = 'DELETE FROM Compra_Curso WHERE compra_id IN (SELECT id FROM Compra WHERE aluno_id = ?)';
    await query(connection, sql, [alunoId]);

    // Deletar pagamentos
    sql = 'DELETE FROM Pagamento WHERE compra_id IN (SELECT id FROM Compra WHERE aluno_id = ?)';
    await query(connection, sql, [alunoId]);

    // Deletar compras
    sql = 'DELETE FROM Compra WHERE aluno_id = ?';
    await query(connection, sql, [alunoId]);

    // Deletar aluno
    sql = 'DELETE FROM Aluno WHERE id = ?';
    const result = await query(connection, sql, [alunoId]);

    await connection.commit();
    connection.end();
    res.json(result);
  } catch (error) {
    await connection.rollback();
    connection.end();
    console.log('Erro ao deletar aluno:', error);
    res.status(500).send("Erro ao deletar aluno");
  }
});

module.exports = alunoRoutes;