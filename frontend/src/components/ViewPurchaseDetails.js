import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/viewpurchasedetails.css'; // Novo arquivo de estilo
import { viewPurchaseDetails } from '../API'; // Importando a função de remoção



const ViewPurchaseDetails = () => {
  const [purchases, setPurchases] = useState([]); // Estado para armazenar as compras
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para capturar erros

  // Usando useEffect para buscar os dados das compras ao carregar o componente
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await viewPurchaseDetails(); // Chama a função sem passar userId
        alert('Comprasssssss');
        setPurchases(data); // Atualiza o estado com as compras
      } catch (err) {
        setError('Erro ao carregar as compras');
        alert('Comprasssssss');
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchPurchases(); // Realiza a busca das compras
  }, []); // Dependência vazia para rodar apenas uma vez ao montar o componente

  if (loading) {
    return <p>Carregando...</p>; // Exibindo uma mensagem de carregamento
  }

  if (error) {
    return <p>{error}</p>; // Exibindo um erro caso ocorra
  }

  return (
    <div className="purchase-container">
      <h1>Detalhes das Compras</h1>
      {purchases.length === 0 ? (
        <p>Nenhuma compra encontrada.</p>
      ) : (
        <div className="purchases-list">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="purchase-card">
              <img src={purchase.image} alt={purchase.name} className="purchase-image" />
              <div className="purchase-details">
                <h2>{purchase.name}</h2>
                <p>{purchase.description}</p>
                <p className="purchase-price">{purchase.price}</p>
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
