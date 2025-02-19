import React, { useState, useEffect, use } from 'react';
import { getCoursesByVendorId, deleteCourse } from '../API'; // Importando a função de remoção
import '../style/SearchCourse.css';
import '../style/Course.css';
import { useNavigate } from 'react-router-dom';
import '../style/removecourse.css';

const SearchCourse = ({ userData }) => {
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

  // Função para remover um curso
  const handleRemoveCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      alert('Curso deletado com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao deletar curso', error);
      alert('Erro ao deletar curso, tente novamente.');
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
                <p className="course-price">{formatPrice(course.preco)}</p>
                <button className="btn-remove" onClick={() => handleRemoveCourse(course.id)}>
                  Remover
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

export default SearchCourse;
