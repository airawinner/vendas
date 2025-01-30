const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(cors()); // Permitir requisições do frontend
app.use(express.json()); // Para ler o corpo da requisição em JSON

// Usuários fictícios para teste (pode ser substituído por um banco de dados)
const users = [
  { email: 'admin@email.com', password: 'adm', role: 'admin' },
  { email: 'user@email.com', password: '123', role: 'user' },
  { email: 'professor@email.com', password: 'prof123', role: 'teacher' },
  { email: 'airawinnersousa@gmail.com', password: 'aluno123', role: 'student' },
  { email: 'gerente@email.com', password: 'gerente123', role: 'manager' },
  { email: 'dev@email.com', password: 'dev123', role: 'developer' }
];

// Cursos fictícios para teste
let courses = [
  { id: 1, name: 'Curso de React', description: 'Aprenda React do básico ao avançado.', price: 'R$ 99,90', image: 'logo192.png' },
  { id: 2, name: 'Curso de Node.js', description: 'Domine Node.js e crie servidores eficientes.', price: 'R$ 129,90', image: 'java.png' },
  { id: 3, name: 'Curso de JavaScript', description: 'Aprofunde-se em JavaScript com práticas avançadas.', price: 'R$ 89,90', image: 'js.png' },
  { id: 4, name: 'Curso de HTML e CSS', description: 'Aprenda a construir sites modernos com HTML5 e CSS3.', price: 'R$ 49,90', image: 'html.png' }
];


let compras = [
  { id: 1, name: 'Compra01', description: 'Curso de Js', price: 'R$ 99,90', image: 'logo192.png',data: 'xx/xx/xxxx' },
  { id: 2, name: 'Compra02', description: 'Curso de Js', price: 'R$ 129,90', image: 'java.png',data:'xx/xx/xxxx' },
  
];

// Função para gerar o código de redefinição
const generateResetCode = () => {
  return crypto.randomBytes(3).toString('hex'); // Gera um código de 6 caracteres
};

// Função para enviar o e-mail com o código
const sendResetEmail = (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Ou outro serviço de e-mail
    auth: {
      user: 'airawinnersrt@gmail.com',
      pass: '3010199530'
    }
  });

  const mailOptions = {
    from: 'airawinnersrt@gmail',
    to: email,
    subject: 'Redefinição de Senha',
    text: `Seu código de redefinição de senha é: ${code}`
  };

  return transporter.sendMail(mailOptions);
};

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, role: user.role, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Rota para solicitar redefinição de senha
app.post('/esqueceu-senha', async (req, res) => {
  const { email } = req.body;
  console.log('cheguei aqui');
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
  }

  try {
    // Gerar um código de redefinição
    const resetCode = generateResetCode();

    // Enviar o e-mail com o código
    await sendResetEmail(email, resetCode);

    // Em um sistema real, você deveria salvar esse código em um banco de dados com um tempo de expiração
    console.log(`Código de redefinição enviado para ${email}: ${resetCode}`);

    res.status(200).json({ success: true, message: 'Código de redefinição enviado para o e-mail.' });
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar o e-mail.' });
  }
});

// Rota para cadastro de novo usuário
app.post('/cadastro', (req, res) => {
  const { name, email, password } = req.body;

  // Verifica se o usuário já existe
  const userExists = users.some(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'E-mail já cadastrado.' });
  }

  // Adiciona o novo usuário ao array de usuários (no backend real, você armazenaria isso em um banco de dados)
  const newUser = {
    name,
    email,
    password,
    role: 'user'  // O papel padrão pode ser 'user' ou outro, dependendo do seu sistema
  };
  
  users.push(newUser);

  res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso!', user: newUser });
});

// Rota para obter cursos
app.get('/search-course', (req, res) => {
  res.json(courses);
  console.log('Cursos enviados');
});



app.post('/add-course', (req, res) => {
  console.log('Recebendo requisição para adicionar curso:');
  console.log('Dados recebidos:', req.body);

  // Extraindo os dados corretamente
  const { courseData, userData } = req.body;

  // Verifica se os dados existem
  if (!courseData || !userData) {
    return res.status(400).json({ success: false, message: 'Dados do curso e usuário são obrigatórios!' });
  }

  const { name, price, description, image } = courseData;

  if (!name || !price || !description) {
    return res.status(400).json({ success: false, message: 'Nome, preço e descrição são obrigatórios!' });
  }

  // Verifica se o usuário é admin
  if (userData.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Apenas administradores podem adicionar cursos!' });
  }

   // Cria um novo curso
   const newCourse = {
    id: courses.length + 1, // Geração de ID simples, pode ser substituída por banco de dados
    name,
    price,
    description,
    image: image || ''  // Imagem é opcional
  };

  courses.push(newCourse);
  // Simulando sucesso
  console.log('Curso cadastrado com sucesso:', courseData);
  res.status(200).json({ success: true, message: 'Curso adicionado com sucesso!' });
});

// Iniciar servidor na porta 3000
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));



// 🔥 **Remover curso (somente admin)**
app.delete('/remove-course/:id', (req, res) => {
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


// Estrutura para armazenar compras
let purchases = [];

app.post('/purchases', (req, res) => {
  console.log("Recebendo requisição de compra...");
  console.log("Dados recebidos:", req.body); // Exibe os dados que o servidor está recebendo

  const { userId, courseId, quantity, totalPrice } = req.body;

  if (!courseId || !quantity || !totalPrice) {
    console.log("Dados de compra incompletos!");
    return res.status(400).json({ success: false, message: 'Dados de compra incompletos.' });
  }

  const course = courses.find(c => c.id === courseId);
  if (!course) {
    console.log("Curso não encontrado!");
    return res.status(404).json({ success: false, message: 'Curso não encontrado.' });
  }

  const newPurchase = {
    purchaseId: purchases.length + 1,
    userId: userId || "Desconhecido",
    courseId,
    courseName: course.name,
    quantity,
    totalPrice,
    purchaseDate: new Date().toISOString(),
  };

  purchases.push(newPurchase);
 
  console.log("Compra registrada com sucesso:", newPurchase);
  res.status(201).json({ success: true, message: 'Compra registrada com sucesso!', purchase: newPurchase });
});


// 🔥 **Listar cursos**
app.get('/remove-course', (req, res) => {
  res.json(courses);
});

// Função para obter todas as compras
app.get('/view-purchase-details', (req, res) => {
  res.json(compras);
  console.log('Compras enviadas');
});



