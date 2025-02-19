// src/API.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Função para fazer o login do usuário
export const loginUser = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
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

export const getAvailableCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/cursos/disponiveis`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCoursesByVendorId = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/cursos/vendedor/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(`${API_URL}/cursos/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerPurchase = async (purchaseData) => {
  try {
    const response = await axios.post(`${API_URL}/compras`, purchaseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const viewPurchaseDetails = async (alunoId) => {
  try {
    const response = await axios.get(`${API_URL}/cursos/compras/${alunoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUserAluno = async (formData) => {
  try {
    console.log('formData', formData);
    const response = await axios.post(`${API_URL}/alunos`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUserVendedor = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/vendedores`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserEmailAluno = async (id, email) => {
  try {
    const response = await axios.put(`${API_URL}/alunos/email/${id}`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserEmailVendedor = async (id, email) => {
  try {
    const response = await axios.put(`${API_URL}/vendedores/email/${id}`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteUserAluno = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/alunos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserVendedor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/vendedores/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const inactivateCourse = async (courseId) => {
  try {
    const response = await axios.put(`${API_URL}/cursos/inativar/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const activateCourse = async (courseId) => {
  try {
    const response = await axios.put(`${API_URL}/cursos/ativar/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para enviar pedido de redefinição de senha
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/esqueceu-senha`, { email });
    return response.data;
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    throw error;
  }
};

// Função para pesquisar cursos
export const searchCourses = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search-course`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Erro ao pesquisar cursos:", error);
    throw error;
  }
};


// Função para adicionar curso (somente admin)
export const addCourse = async (courseData, userData) => {
  try {
    const response = await axios.post(`${API_URL}/cursos`, courseData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCourse = async (courseId, userData) => {
  try {
    const response = await axios.delete(`${API_URL}/remove-course/${courseId}`, {
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






