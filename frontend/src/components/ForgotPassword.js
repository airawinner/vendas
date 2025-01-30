import React, { useState } from 'react';
import { forgotPassword } from '../API';
import '../style/ForgotPassword.css'; // Importando o CSS corretamente

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      await forgotPassword(email);
      setMessage('Instruções para redefinir a senha foram enviadas!');
    } catch (error) {
      setMessage('Erro ao enviar solicitação de redefinição de senha. Tente novamente.');
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1>Esqueceu a senha?</h1>
        <input 
          type="email" 
          placeholder="Digite seu e-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <button onClick={handleForgotPassword}>Enviar solicitação</button>
        {message && <p>{message}</p>}
        <div className="forgot-links">
          <a href="/">Voltar ao Login</a>
          <a href="/signup">Criar conta</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
