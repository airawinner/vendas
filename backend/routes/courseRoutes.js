// routes/courseRoutes.js
import express from 'express';
const router = express.Router();
import courses from '../models/courses.js'; // Ajuste de importação para módulos ES6

// Rota para obter todos os cursos
router.get('/', (req, res) => {
  res.json(courses);
});

// Rota para adicionar um novo curso (somente admin)
router.post('/', (req, res) => {
  const { name, description, price, image } = req.body;
  if (!name || !description || !price) {
    return res.status(400).json({ success: false, message: 'Nome, descrição e preço são obrigatórios!' });
  }
  const newCourse = {
    id: courses.length + 1,
    name,
    description,
    price,
    image: image || ''
  };
  courses.push(newCourse);
  res.status(201).json({ success: true, message: 'Curso adicionado com sucesso!', course: newCourse });
});

// Rota para remover um curso (somente admin)
router.delete('/:id', (req, res) => {
  const { userData } = req.body;
  const courseId = parseInt(req.params.id);
  if (userData.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Apenas administradores podem remover cursos!' });
  }
  const courseIndex = courses.findIndex(course => course.id === courseId);
  if (courseIndex === -1) {
    return res.status(404).json({ success: false, message: 'Curso não encontrado!' });
  }
  courses.splice(courseIndex, 1);
  res.json({ success: true, message: 'Curso removido com sucesso!' });
});

export default router; // Exportação do router com ES6 syntax
