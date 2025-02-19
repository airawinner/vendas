-- Povoador de tabelas
INSERT INTO Vendedor (nome, cpf_cnpj, especialidade, email) VALUES
('Carlos Silva', '12345678901', 'Programação', 'carlos.silva@example.com'),
('Mariana Souza', '98765432100', 'Design', 'mariana.souza@example.com'),
('Rafael Lima', '55566677788', 'Marketing', 'rafael.lima@example.com'),
('Juliana Mendes', '33322211199', 'Fotografia', 'juliana.mendes@example.com'),
('Fernando Rocha', '11223344556', 'Finanças', 'fernando.rocha@example.com');

INSERT INTO Curso (titulo, descricao, preco, data_anuncio, status, acesso_curso, vendedor_id) VALUES
('Python para Iniciantes', 'Curso básico de Python', 150.00, '2024-01-10', 'ativo', 'link-curso-1', 1),
('Design Gráfico', 'Fundamentos do design', 200.00, '2024-02-15', 'ativo', 'link-curso-2', 2),
('Marketing Digital', 'Técnicas e estratégias', 180.00, '2024-03-05', 'ativo', 'link-curso-3', 3),
('Fotografia Profissional', 'Aulas práticas e teóricas', 250.00, '2024-04-20', 'ativo', 'link-curso-4', 4),
('Investimentos Inteligentes', 'Educação financeira avançada', 300.00, '2024-05-10', 'ativo', 'link-curso-5', 5);

INSERT INTO Aluno (cpf, nome, email, telefone) VALUES
('11122233344', 'Lucas Pereira', 'lucas@email.com', '31999998888'),
('55566677788', 'Ana Clara', 'ana@email.com', '31988887777'),
('99988877766', 'Bruno Costa', 'bruno@email.com', '31977776666'),
('33344455566', 'Mariana Ribeiro', 'mariana@email.com', '31966665555'),
('77788899900', 'Gustavo Mendes', 'gustavo@email.com', '31955554444');


INSERT INTO Compra (data_compra, forma_pagamento, aluno_id) VALUES
('2024-06-01', 'cartao_credito', 1),
('2024-06-05', 'cartao_credito', 2),
('2024-06-10', 'cartao_credito', 3),
('2024-06-15', 'cartao_credito', 4),
('2024-06-20', 'cartao_credito', 5);


INSERT INTO Pagamento (status, data_pagamento, valor_pago, quantidade_parcelas, compra_id) VALUES
('pago', '2024-06-02', 150.00, 1, 1),
('pago', '2024-06-06', 200.00, 2, 2),
('pendente', NULL, 180.00, 3, 3),
('pago', '2024-06-16', 250.00, 4, 4),
('cancelado', NULL, 300.00, 5, 5);


INSERT INTO Compra_Curso (compra_id, curso_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);