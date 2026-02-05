import midtransClient from 'midtrans-client';

// Pastikan simpan SERVER KEY di .env ya!
export const snap = new midtransClient.Snap({
    isProduction: false, // Kita pake Sandbox dulu
    serverKey: process.env.MIDTRANS_SERVER_KEY, 
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Core API buat verifikasi transaksi nanti (opsional tapi bagus ada)
export const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});