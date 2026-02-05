import * as paymentService from '../services/payment.service.js';

export const createSnapToken = async (req, res) => {
    try {
        // req.user dapet dari authMiddleware
        const token = await paymentService.createTransaction(req.user);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const midtransWebhook = async (req, res) => {
    try {
        // Webhook ini dipanggil sama server Midtrans, bukan user browser
        await paymentService.handleMidtransNotification(req.body);
        res.status(200).send('OK'); // Wajib bales 200 OK biar Midtrans gak ngirim ulang
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing notification');
    }
};