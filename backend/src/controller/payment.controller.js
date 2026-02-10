import * as paymentService from '../services/payment.service.js';
import { supabaseSecret } from "../config/supabase.js";

// POST /api/payment/purchase
export const createSnapToken = async (req, res) => {
    try {
        const user = req.user; // Dari middleware auth
        const { type, itemId } = req.body; // Frontend kirim ini

        let itemData = {};

        // Validasi apa yang mau dibeli
        if (type === 'plan') {
            itemData = {
                type: 'plan',
                id: 'plan-pro-10min',
                name: 'Paket PRO (10 Menit)',
                price: 19000
            };
        } else if (type === 'class') {
            // Kalau beli kelas, ambil detail harga dari DB dulu biar gak dicurangin frontend
            const { data: classData, error } = await supabaseSecret
                .from('live_classes')
                .select('title, price')
                .eq('id', itemId)
                .single();
            
            if (error || !classData) throw new Error("Kelas tidak ditemukan");

            itemData = {
                type: 'class',
                id: itemId,
                name: classData.title,
                price: classData.price
            };
        } else {
            return res.status(400).json({ error: "Tipe pembelian tidak valid" });
        }

        const token = await paymentService.createTransaction(user, itemData);
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Webhook (tetap sama route-nya)
export const midtransWebhook = async (req, res) => {
    try {
        await paymentService.handleMidtransNotification(req.body);
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};