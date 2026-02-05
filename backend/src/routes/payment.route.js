import express from 'express';
import { createSnapToken, midtransWebhook } from '../controller/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// User request token (Harus Login)
router.post('/purchase', authMiddleware, createSnapToken);

// Webhook dari Midtrans (GAK BOLEH pake authMiddleware karena Midtrans yang manggil)
router.post('/notification', midtransWebhook);

export default router;