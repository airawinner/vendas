import React, { useState, useEffect } from 'react';
import { getCoursesByVendorId, inactivateCourse, activateCourse } from '../API'; // Importando as funções de ativação e inativação
import '../style/SearchCourse.css';
import '../style/Course.css';
import { useNavigate } from 'react-router-dom';
import '../style/removecourse.css';

const RemoveCourse = ({ userData }) => {
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesByVendorId(userData.id);
        setCourses(data);
        setFilteredCourses(data);
        console.log('Cursos do vendedor no estado:', data); 
      } catch (error) {
        console.error('Erro ao buscar cursos do vendedor', error);
      }
    };

    fetchCourses();
  }, [userData.id]);

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

  // Função para mudar o status de um curso
  const handleMudaStatusCourse = async (courseId, currentStatus) => {
    try {
      if (currentStatus === 'ativo') {
        await inactivateCourse(courseId);
        alert('Curso inativado com sucesso!');
      } else {
        await activateCourse(courseId);
        alert('Curso ativado com sucesso!');
      }
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: currentStatus === 'ativo' ? 'inativo' : 'ativo' } : course
      ));

      //recarrega a página
      window.location.reload();
    } catch (error) {
      console.error('Erro ao mudar status do curso', error);
      alert('Erro ao mudar status do curso, tente novamente.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="search-container">
      <h1>Gerenciar Cursos</h1>
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

      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="courses-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-details">
                <h2>{course.titulo}</h2>
                <p>{course.descricao}</p>
                <p>{course.status}</p>
                <p className="course-price">{formatPrice(course.preco)}</p>
                <button className="btn-remove" onClick={() => handleMudaStatusCourse(course.id, course.status)}>
                  Mudar status do curso
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum curso encontrado.</p>
        )}
      </div>
      <button onClick={() => navigate('/add-course')} className="add-course-btn-div">Adicionar Curso</button>
      <button onClick={() => navigate('/search-course')} className="search-course-btn-div">Pesquisar Curso</button>
      <button onClick={() => navigate('/')} className="sair-btn-div">Sair</button>
    </div>
  );
};

export default RemoveCourse;