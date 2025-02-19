import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/viewpurchasedetails.css'; // Novo arquivo de estilo
import { viewPurchaseDetails } from '../API'; // Importando a função de remoção

const ViewPurchaseDetails = ({userData}) => {
  const [purchases, setPurchases] = useState([]); // Estado para armazenar as compras
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para capturar erros

  const fetchPurchases = async () => {
    try {
      const response = await viewPurchaseDetails(userData.id); // Chama a função de API para buscar as compras
      setPurchases(response); // Atualiza o estado com as compras
    } catch (err) {
      setError('Erro ao carregar as compras');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    fetchPurchases(); // Carrega as compras ao montar o componente
  }, []); // Executa apenas uma vez quando o componente é montado

  const handlePurchase = async (purchaseData) => {
    try {
      // Aqui você faz a chamada para registrar a compra
      const response = await fetch('http://localhost:3000/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Atualiza as compras após realizar a compra
        setPurchases(result.purchases);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Erro ao realizar a compra');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };


  return (
    <div className="purchase-container">
      <h1>Detalhes das Compras</h1>
      {purchases.length === 0 ? (
        <p>Nenhuma compra encontrada.</p>
      ) : (
        <div className="purchases-list">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="purchase-card">
              <div className="purchase-details">
                <h2>{purchase.titulo}</h2>
                <p>{purchase.descricao}</p>
                <div className="price-row">
                  <span>Preço:</span>
                  <span className="purchase-price">{formatPrice(purchase.preco)}</span>
                </div>
                <p className="purchase-date">Data da Compra: {formatDate(purchase.data_compra)}</p>
                <p className="purchase-acesso">Link de acesso: {purchase.acesso_curso}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="back-btn" onClick={() => window.history.back()}>
        Voltar
      </button>
    </div>
  );
};

export default ViewPurchaseDetails;
