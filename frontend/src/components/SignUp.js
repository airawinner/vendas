import React, { useState } from 'react';
import { registerUserAluno, registerUserVendedor } from '../API'; // Importando as funções de cadastro
import '../style/SignUp.css';

const SignUp = ({ setUserRole, setUserData }) => {
  const [userType, setUserType] = useState(''); // Estado para armazenar o tipo de usuário
  const [formDataAluno, setFormDataAluno] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
  });

  const [formDataVendedor, setFormDataVendedor] = useState({
    nome: '',
    email: '',
    cpf_cnpj: '',
    especialidade: '',
  });

  const handleChangeAluno = (e) => {
    setFormDataAluno({
      ...formDataAluno,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeVendedor = (e) => {
    setFormDataVendedor({
      ...formDataVendedor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (userType === 'aluno') {
        // Chama a função registerUserAluno para enviar os dados do aluno para o backend
        data = await registerUserAluno(formDataAluno);
      } else if (userType === 'vendedor') {
        // Chama a função registerUserVendedor para enviar os dados do vendedor para o backend
        data = await registerUserVendedor(formDataVendedor);
      }

      // Supondo que o backend retorne um objeto com os dados do usuário, você pode atualizar o estado
      setUserRole(userType);
      setUserData(data);

      alert('Cadastro realizado com sucesso!');
      //atualizar a página
      window.location.reload();
    } catch (error) {
      console.error('Erro no cadastro', error);
      alert('Falha ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Cadastro</h1>
        {!userType ? (
          <div className="user-type-selection">
            <button onClick={() => setUserType('aluno')}>Cadastrar como Aluno</button>
            <button onClick={() => setUserType('vendedor')}>Cadastrar como Vendedor</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {userType === 'aluno' && (
              <>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formDataAluno.nome}
                  onChange={handleChangeAluno}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formDataAluno.email}
                  onChange={handleChangeAluno}
                  required
                />
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formDataAluno.cpf}
                  onChange={handleChangeAluno}
                  required
                />
                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={formDataAluno.telefone}
                  onChange={handleChangeAluno}
                  required
                />
              </>
            )}
            {userType === 'vendedor' && (
              <>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formDataVendedor.nome}
                  onChange={handleChangeVendedor}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formDataVendedor.email}
                  onChange={handleChangeVendedor}
                  required
                />
                <input
                  type="text"
                  name="cpf_cnpj"
                  placeholder="CPF/CNPJ"
                  value={formDataVendedor.cpf_cnpj}
                  onChange={handleChangeVendedor}
                  required
                />
                <input
                  type="text"
                  name="especialidade"
                  placeholder="Especialidade"
                  value={formDataVendedor.especialidade}
                  onChange={handleChangeVendedor}
                  required
                />
              </>
            )}
            <button type="submit">Cadastrar</button>
          </form>
        )}
        <div className="signup-links">
          <a href="/">Já tem uma conta? Faça login</a>
          <a href="/esqueceu-senha">Esqueceu a senha?</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;