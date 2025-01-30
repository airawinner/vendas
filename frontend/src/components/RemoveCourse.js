import React, { useState, useEffect } from 'react';
import { searchCourses, removeCourse } from '../API'; // Importando a função de remoção
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
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchCourses('');
        setCourses(results);
        setFilteredCourses(results);
      } catch (error) {
        console.error('Erro ao carregar cursos', error);
        setError('Falha ao carregar cursos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

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

  // Função para remover um curso
  const handleRemoveCourse = async (courseId) => {
    try {
      await removeCourse(courseId, userData);
      alert('Curso removido com sucesso!');

      // Atualizar a lista de cursos após a remoção
      setCourses(courses.filter(course => course.id !== courseId));
      setFilteredCourses(filteredCourses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Erro ao remover curso', error);
      alert('Erro ao remover curso. Tente novamente.');
    }
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
              <img src={course.image} alt={course.name} className="course-image" />
              <div className="course-details">
                <h2>{course.name}</h2>
                <p>{course.description}</p>
                <p className="course-price">{course.price}</p>
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
