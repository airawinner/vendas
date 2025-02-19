-- Gatilho para impedir exclusão de curso com vendas registradas
DELIMITER //
CREATE TRIGGER before_delete_curso
BEFORE DELETE ON Curso
FOR EACH ROW
BEGIN
IF (SELECT COUNT(*) FROM Compra_Curso WHERE curso_id = OLD.id) > 0 THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Não é possível excluir cursos com vendas registradas';
END IF;
END
// DELIMITER ;

-- Gatilho para permitir acesso ao curso apenas após pagamento confirmado
DELIMITER //
CREATE TRIGGER after_pagamento_confirmado
AFTER UPDATE ON Pagamento
FOR EACH ROW
BEGIN
IF NEW.status = 'pago' THEN
UPDATE Curso SET status = 'ativo' WHERE id IN (
SELECT curso_id FROM Compra_Curso WHERE compra_id = NEW.compra_id
);
END IF;
END
// DELIMITER ;

-- Gatilho para impedir a compra de cursos com desconto
DELIMITER //
CREATE TRIGGER before_insert_compra
BEFORE INSERT ON Compra
FOR EACH ROW
BEGIN
IF (SELECT COUNT(*) FROM Curso WHERE id IN (
SELECT curso_id FROM Compra_Curso WHERE compra_id = NEW.id
) AND preco < (SELECT AVG(preco) FROM Curso)) > 0 THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Não é permitido vender cursos com desconto';
END IF;
END
// DELIMITER ;

-- Gatilho para impedir que um aluno faça mais de uma compra ao mesmo tempo
DELIMITER //
CREATE TRIGGER before_insert_compra_restricao
BEFORE INSERT ON Compra
FOR EACH ROW
BEGIN
IF (
SELECT COUNT(*) AS count FROM Compra c
join aluno a on c.aluno_id = a.id
join pagamento p on p.compra_id = c.id
 WHERE aluno_id = NEW.aluno_id AND p.status != "pago"
) > 0 THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'O aluno só pode realizar uma compra por vez';
END IF;
END
// DELIMITER ;


-- Gatilho para impedir que um curso seja anunciado por mais de um vendedor
DELIMITER //
CREATE TRIGGER before_insert_curso
BEFORE INSERT ON Curso
FOR EACH ROW
BEGIN
IF (SELECT COUNT(*) FROM Curso WHERE titulo = NEW.titulo AND vendedor_id <>
NEW.vendedor_id) > 0 THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Cada curso deve ser anunciado por apenas um vendedor';
END IF;
END
// DELIMITER ;