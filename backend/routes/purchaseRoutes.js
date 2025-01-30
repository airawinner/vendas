// routes/purchaseRoutes.js
import express from 'express';
import purchases from '../models/purchases.js'; // Importe os dados de compras do arquivo models/purchases.js

const router = express.Router();

// Rota para obter todas as compras
router.get('/', (req, res) => {
  res.json(purchases);
});

// Rota para registrar uma nova compra
router.post('/', (req, res) => {
  const { userId, courseId, quantity, totalPrice } = req.body;
  if (!courseId || !quantity || !totalPrice) {
    return res.status(400).json({ success: false, message: 'Dados de compra incompletos.' });
  }
  const newPurchase = {
    purchaseId: purchases.length + 1,
    userId: userId || 'Desconhecido',
    courseId,
    quantity,
    totalPrice,
    purchaseDate: new Date().toISOString()
  };
  purchases.push(newPurchase);
  res.status(201).json({ success: true, message: 'Compra registrada com sucesso!', purchase: newPurchase });
});

export default router;
