CREATE schema vendas;
use vendas;

-- Tabela Vendedor
CREATE TABLE Vendedor (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
especialidade VARCHAR(100) NOT NULL,
email VARCHAR(100)
);

-- Tabela Curso
CREATE TABLE Curso (
id INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(255) NOT NULL,
descricao TEXT,
preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
data_anuncio DATE NOT NULL,
status ENUM('ativo', 'inativo') NOT NULL,
acesso_curso VARCHAR(255) NOT NULL,
vendedor_id INT NOT NULL,
FOREIGN KEY (vendedor_id) REFERENCES Vendedor(id)
);
-- Tabela Aluno
CREATE TABLE Aluno (
id INT AUTO_INCREMENT PRIMARY KEY,
cpf VARCHAR(14) UNIQUE NOT NULL,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
telefone VARCHAR(15)
);
-- Tabela Compra
CREATE TABLE Compra (
id INT AUTO_INCREMENT PRIMARY KEY,
data_compra DATE NOT NULL,
forma_pagamento ENUM('cartao_credito') NOT NULL,
aluno_id INT NOT NULL,
FOREIGN KEY (aluno_id) REFERENCES Aluno(id)
);
-- Tabela Pagamento
CREATE TABLE Pagamento (
id INT AUTO_INCREMENT PRIMARY KEY,
status ENUM('pago', 'pendente', 'cancelado') NOT NULL,
data_pagamento DATE,
valor_pago DECIMAL(10,2) CHECK (valor_pago >= 0),
quantidade_parcelas INT CHECK (quantidade_parcelas > 0),
valor_parcela DECIMAL(10,2) GENERATED ALWAYS AS (valor_pago / quantidade_parcelas) STORED,
compra_id INT UNIQUE NOT NULL,
FOREIGN KEY (compra_id) REFERENCES Compra(id)
);
-- Tabela Compra_Curso (Associação entre Compra e Curso)
CREATE TABLE Compra_Curso (
compra_id INT NOT NULL,
curso_id INT NOT NULL,
PRIMARY KEY (compra_id, curso_id),
FOREIGN KEY (compra_id) REFERENCES Compra(id),
FOREIGN KEY (curso_id) REFERENCES Curso(id)
);