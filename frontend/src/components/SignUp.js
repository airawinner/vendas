import React, { useState } from 'react';
import { registerUser } from '../API'; // Importando a função de cadastro
import '../style/SignUp.css';

const SignUp = ({ setUserRole, setUserData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama a função registerUser para enviar os dados para o backend
      const data = await registerUser(formData.name, formData.email, formData.password);
      
      // Supondo que o backend retorne um objeto com os dados do usuário, você pode atualizar o estado
      setUserRole('user');
      setUserData(data);

      alert('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Erro no cadastro', error);
      alert('Falha ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
        <div className="signup-links">
          <a href="/">Já tem uma conta? Faça login</a>
          <a href="/esqueceu-senha">Esqueceu a senha?</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
