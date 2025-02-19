import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import { getAvailableCourses, registerPurchase, updateUserEmailAluno,  updateUserEmailVendedor, deleteUserAluno, deleteUserVendedor} from '../API';
import '../style/SearchCourse.css'; // Estilos para SearchCourse
import '../style/Course.css'; // Estilos para Course
import '../style/modal.css';
import '../style/removecourse.css';

const SearchCourse = ({ userData }) => {

  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [purchaseError, setPurchaseError] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [installments, setInstallments] = useState('1'); 
  const [newEmail, setNewEmail] = useState(''); 
  const [showEmailModal, setShowEmailModal] = useState(false); 



  const [selectedCourse, setSelectedCourse] = useState(null); // Curso selecionado
  const navigate = useNavigate(); // Hook para navegação

  const handlePurchase = async (e) => {
    e.preventDefault();
    const purchaseData = {
      data_compra: new Date().toISOString().slice(0, 19).replace('T', ' '), 
      forma_pagamento: 'cartao_credito',
      aluno_id: userData.id,
      curso_id: selectedCourse.id,
      status: 'pago',
      data_pagamento: new Date().toISOString().slice(0, 19).replace('T', ' '),
      valor_pago: selectedCourse.preco,
      quantidade_parcelas: installments,
      valor_parcela: selectedCourse.preco / installments
    };

    console.log('Dados da compra:', purchaseData);

    try {
      await registerPurchase(purchaseData);
      setPurchaseSuccess(true);
      setPurchaseError('');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao registrar compra', error);
      setPurchaseError('Erro ao registrar compra. Tente novamente.');
      setPurchaseSuccess(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      let updatedUser;
      if (userData.role === 'user') {
        updatedUser = await updateUserEmailAluno(userData.id, newEmail);
      } else if (userData.role === 'admin') {
        updatedUser = await updateUserEmailVendedor(userData.id, newEmail);
      }

      setShowEmailModal(false); // Fecha o modal
      alert('Email atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar email', error);
      alert('Erro ao atualizar email. Tente novamente.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (userData.role === 'user') {
        await deleteUserAluno(userData.id);
      } else if (userData.role === 'admin') {
        await deleteUserVendedor(userData.id);
      }


      alert('Usuário deletado com sucesso!');
      navigate('/'); // Redireciona para a página inicial após deletar o usuário
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
      alert('Erro ao deletar usuário. Tente novamente.');
    }
  };

  // Função para carregar cursos
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAvailableCourses();
        console.log('Cursos disponíveis:', data);
        setCourses(data);
        setFilteredCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar cursos disponíveis', error);
      }
    };

    console.log('Dados do usuário:', userData);
    fetchCourses();
  }, []);

  // Função para filtrar cursos
  const handleSearch = () => {
    if (query) {
      const filtered = courses.filter(course =>
        course.titulo.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  };

  // Função para abrir o modal e selecionar o curso
  const handleBuyClick = (course) => {
    setSelectedCourse(course); // Define o curso selecionado
    setShowModal(true); // Abre o modal
  };

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null); // Reseta o curso selecionado
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  // Função para navegar até a página de compras somente se for um aluno
  const handleViewPurchases = () => {
    navigate('/view-purchase-details'); // Redireciona para a página de detalhes de compras
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="search-container">
      {/* Botão para deletar usuário */}
            <button onClick={handleDeleteUser} className="delete-user-btn">
        Deletar Usuário
      </button>
      {/* Botão para alterar email */}
      <button onClick={openEmailModal} className="change-email-btn">
        Alterar seu email
      </button>
      <h1>Pesquisar Cursos</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Digite o nome do curso"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            handleSearch();
          }}
        />
        <button onClick={handleSearch} className="search-btn">
          <i className="fa fa-search"></i>
        </button>
      </div>

      {/* Botão para ver compras */}
      {userData.role === 'user' && (
            <button onClick={handleViewPurchases} className="view-purchases-btn">
              Ver Compras
            </button>
      )}

      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="courses-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-details">
                <h2>{course.titulo}</h2>
                <p>{course.descricao}</p>
                <p className="course-price">{formatPrice(course.preco)}</p>
                {userData.role === 'user' && (
                  <button className="btn-buy" onClick={() => handleBuyClick(course)}>
                    Comprar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum curso encontrado.</p>
        )}
      </div>

      {/* Modal para inserção de dados do cartão */}
      {showModal && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Informações de pagamento - {selectedCourse.name}</h2>
            <form className="payment-form" onSubmit={handlePurchase}>
              <div className="input-group">
                <label htmlFor="card-number">Número do Cartão</label>
                <input
                  type="text"
                  id="card-number"
                  placeholder="**** **** **** ****"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="expiry-date">Data de Validade</label>
                <input
                  type="text"
                  id="expiry-date"
                  placeholder="MM/AA"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="***"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="installments">Quantidade de Parcelas</label>
                <select
                  id="installments"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                >
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">4x</option>
                  <option value="5">5x</option>
                  <option value="6">6x</option>
                </select>
              </div>

              {purchaseError && <p className="error-message">{purchaseError}</p>}
              {purchaseSuccess && <p className="success-message">Compra realizada com sucesso!</p>}

              <button type="submit" className="submit-btn">Finalizar Compra</button>
            </form>
            <button className="close-btn" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal para alteração de email */}
            {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Alterar Email</h2>
            <form className="email-form" onSubmit={handleEmailChange}>
              <div className="input-group">
                <label htmlFor="new-email">Novo Email</label>
                <input
                  type="email"
                  id="new-email"
                  placeholder="Digite o novo email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Atualizar Email</button>
            </form>
            <button className="close-btn" onClick={closeEmailModal}>Fechar</button>
          </div>
        </div>
      )}


      <div className="add-course-container">
      <button onClick={() => navigate('/remove-course')} className="search-course-btn-search">Mudar status curso</button>
      <button onClick={() => navigate('/add-course')} className="add-course-btn-search">Adicionar Curso</button>
      <button onClick={() => navigate('/')} className="sair-btn-search">Sair</button>
    </div>

    </div>
    
    
  );
};

export default SearchCourse;
