const mysql = require('mysql');
const dbConfig = require('./dbConfig');

// função para conectar com o banco de dados
const connectToDatabase = () => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.log('Erro ao conectar com o banco de dados:', err);
            return;
        }
        console.log('Conexão com o banco de dados realizada com sucesso!');
    });

    return connection;
};

// função para executar queries no banco de dados
const query = (connection, sql, args) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

module.exports = { connectToDatabase, query };