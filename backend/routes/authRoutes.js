import express from 'express';
import users from '../models/users.js';

const router = express.Router();

// Rota de login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Corpo da requisição:', req.body);
  console.log(`Tentando fazer login com: email: ${email}, senha: ${password}`);
  
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, role: user.role, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Rota para cadastro de novo usuário
router.post('/cadastro', (req, res) => {
  const { name, email, password } = req.body;
  const userExists = users.some(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'E-mail já cadastrado.' });
  }
  const newUser = { name, email, password, role: 'user' };
  users.push(newUser);
  res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso!', user: newUser });
});

// Rota para solicitar redefinição de senha
router.post('/esqueceu-senha', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
  }
  // Lógica para enviar código de redefinição de senha
  res.status(200).json({ success: true, message: 'Código de redefinição enviado para o e-mail.' });
});

export default router;
