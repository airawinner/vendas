// src/API.js
import axios from 'axios';

const apiUrl = 'http://localhost:3000';  // Atualize com o endpoint correto

// Função para fazer o login do usuário
export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer login');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};



// Função para cadastrar um novo usuário
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/cadastro`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw error;
  }
};

// Função para enviar pedido de redefinição de senha
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${apiUrl}/esqueceu-senha`, { email });
    return response.data;
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    throw error;
  }
};

// Função para pesquisar cursos
export const searchCourses = async (query) => {
  try {
    const response = await axios.get(`${apiUrl}/search-course`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Erro ao pesquisar cursos:", error);
    throw error;
  }
};


// Função para adicionar curso (somente admin)
export const addCourse = async (courseData, userData) => {
  try {
    const response = await axios.post(`${apiUrl}/add-course`, { courseData, userData });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar curso:", error);
    throw error;
  }
};

export const removeCourse = async (courseId, userData) => {
  try {
    const response = await axios.delete(`${apiUrl}/remove-course/${courseId}`, {
      data: { userData }, // Enviando userData para verificação de permissões
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}` // Supondo que o admin tenha um token de autenticação
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao remover curso:", error.response ? error.response.data : error.message);
    throw error;
  }
};



// Função para pesquisar cursos
export const viewPurchaseDetails = async (query) => {
  try {
    const response = await axios.get(`${apiUrl}/view-purchase-details`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Erro ao pesquisar cursos:", error);
    throw error;
  }
};



// Função para registrar uma compra
export const registerPurchase = async (course) => {
  try {
    const purchaseData = {
      id: course.id,
      name: course.name,
      description: course.description,
      price: course.price,
      image: course.image,
      date: new Date().toLocaleDateString('pt-BR') // Formato xx/xx/xxxx
    };

    alert('Dados sendo passados');
    
    const response = await axios.post(`${apiUrl}/purchases`, purchaseData);
  
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar compra:', error);
    throw error;
  }
};



