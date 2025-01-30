import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import { searchCourses, registerPurchase } from '../API';
import '../style/SearchCourse.css'; // Estilos para SearchCourse
import '../style/Course.css'; // Estilos para Course
import '../style/modal.css';
import '../style/removecourse.css';

const SearchCourse = () => {

  const [query, setQuery] = useState('');
  const [userData, setUserData] = useState(null);
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


  const [selectedCourse, setSelectedCourse] = useState(null); // Curso selecionado
  const navigate = useNavigate(); // Hook para navegação
  const handlePurchase = async (e) => {
    e.preventDefault();
  
    if (!cardNumber || !expiryDate || !cvv) {
      setPurchaseError("Preencha todos os campos do cartão.");
      return;
    }
  
    if (!selectedCourse) {
      setPurchaseError("Nenhum curso selecionado.");
      return;
    }
  
    const purchaseData = {
      userId: "12345", // Simule um ID de usuário até ter autenticação real
      courseId: selectedCourse.id,
      quantity: 1, // Supondo que o usuário compra apenas 1 curso
      totalPrice: selectedCourse.price
    };
  
    console.log("Enviando compra para o servidor:", purchaseData);
  
    try {
      const response = await fetch("http://localhost:3000/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData)
      });
  
      const result = await response.json();
      if (response.ok) {
        setPurchaseSuccess(true);
        setPurchaseError(null);
        console.log("Compra realizada com sucesso!", result);
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setPurchaseError(result.message || "Erro ao processar a compra.");
      }
    } catch (error) {
      console.error("Erro ao enviar compra:", error);
      setPurchaseError("Erro ao conectar ao servidor.");
    }
  };
  
  


  // Função para carregar cursos
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchCourses(''); // Busca cursos sem filtro
        if (results && results.length > 0) {
          setCourses(results);
          setFilteredCourses(results);
        } else {
          setCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error('Erro ao carregar cursos', error);
        setError('Falha ao carregar cursos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Função para filtrar cursos
  const handleSearch = () => {
    if (query) {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(query.toLowerCase())
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

  // Função para navegar até a página de compras
  const handleViewPurchases = () => {
    navigate('/view-purchase-details'); // Redireciona para a página de detalhes de compras
  };

  return (
    <div className="search-container">
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
      <button onClick={handleViewPurchases} className="view-purchases-btn">
        Ver Compras
      </button>

      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="courses-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <img src={course.image} alt={course.name} className="course-image" />
              <div className="course-details">
                <h2>{course.name}</h2>
                <p>{course.description}</p>
                <p className="course-price">{course.price}</p>
                <button className="btn-buy" onClick={() => handleBuyClick(course)}>
                  Comprar
                </button>
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

              {purchaseError && <p className="error-message">{purchaseError}</p>}
              {purchaseSuccess && <p className="success-message">Compra realizada com sucesso!</p>}

              <button type="submit" className="submit-btn">Finalizar Compra</button>
            </form>
            <button className="close-btn" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
      <div className="add-course-container">
      <button onClick={() => navigate('/remove-course')} className="search-course-btn-search">Remover Curso</button>
      <button onClick={() => navigate('/add-course')} className="add-course-btn-search">Adicionar Curso</button>
      <button onClick={() => navigate('/')} className="sair-btn-search">Sair</button>
    </div>

    </div>
    
    
  );
};

export default SearchCourse;
