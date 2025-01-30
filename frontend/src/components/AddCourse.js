import React, { useState } from 'react';
import { addCourse } from '../API';
import { useNavigate } from 'react-router-dom';
import '../style/addcourse.css';

const AddCourse = ({ userData }) => {
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseImage, setCourseImage] = useState('');

  const handleAddCourse = async () => {
    if (!courseName || !coursePrice || !courseDescription) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    try {
      const courseData = {
        name: courseName,
        price: coursePrice,
        description: courseDescription,
        image: courseImage || ''
      };
      await addCourse(courseData, userData);
      alert('Curso adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar curso', error);
      alert('Erro ao adicionar curso, tente novamente.');
    }
  };

  return (
    <div className="add-course-container">
      <h1>Adicionar Curso</h1>
      <div className="input-group">
        <label htmlFor="course-name">Nome do Curso</label>
        <input 
          type="text" 
          id="course-name" 
          placeholder="Nome do curso" 
          value={courseName} 
          onChange={e => setCourseName(e.target.value)} 
        />
      </div>
      <div className="input-group">
        <label htmlFor="course-price">Preço</label>
        <input 
          type="text" 
          id="course-price" 
          placeholder="Preço do curso" 
          value={coursePrice} 
          onChange={e => setCoursePrice(e.target.value)} 
        />
      </div>
      <div className="input-group">
        <label htmlFor="course-description">Descrição</label>
        <textarea 
          id="course-description" 
          placeholder="Descrição do curso" 
          value={courseDescription} 
          onChange={e => setCourseDescription(e.target.value)} 
        />
      </div>
      <div className="input-group">
        <label htmlFor="course-image">Link da Imagem (opcional)</label>
        <input 
          type="text" 
          id="course-image" 
          placeholder="URL da imagem do curso (opcional)" 
          value={courseImage} 
          onChange={e => setCourseImage(e.target.value)} 
        />
      </div>
      <button onClick={handleAddCourse} className="add-course-btn">Adicionar Curso</button>
      <button onClick={() => navigate('/remove-course')} className="remove-course-btn">Remover Curso</button>
      <button onClick={() => navigate('/search-course')} className="search-course-btn">Pesquisar Curso</button>
      <button onClick={() => navigate('/')} className="exit-btn">Sair</button>
    </div>
  );
};

export default AddCourse;
