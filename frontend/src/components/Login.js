import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../API';
import '../style/Login.css';

const Login = ({ setUserRole, setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser(email);
      setUserRole(data.role);
      setUserData(data);

      console.log(data);

      if (data.role === 'admin') {
        navigate('/add-course');
      } else {
        navigate('/search-course');
      }
    } catch (error) {
      console.error('Falha no login', error);
      alert('Login falhou! Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
        <div className="login-links">
          <a href="/cadastro">Cadastre-se</a>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
