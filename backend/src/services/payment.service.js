import { snap } from "../config/midtrans.js";
import { supabaseSecret } from "../config/supabase.js";

/**
 * 1. Create Snap Transaction Token
 */
export const createTransaction = async (user) => {
    // KITA UBAH FORMAT ORDER ID BIAR LEBIH PENDEK (< 50 Karakter)
    // Format: PRO-{timestamp}-{random 3 digit}
    // Contoh: PRO-1707123456789-123 (Total sekitar 20an karakter, aman)
    const orderId = `PRO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: 19000 // Harga Paket Pro
        },
        customer_details: {
            first_name: user.username,
            email: user.email,
        },
        // KITA PINDAHIN USER ID KE SINI
        // Midtrans punya fitur custom_field1, custom_field2, dst buat nyimpen data tambahan
        custom_field1: user.id, 
        
        item_details: [{
            id: 'plan-pro-10min',
            price: 19000,
            quantity: 1,
            name: "Paket PRO (10 Menit)"
        }]
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
};

/**
 * 2. Handle Webhook dari Midtrans
 */
export const handleMidtransNotification = async (notificationBody) => {
    const statusResponse = await snap.transaction.notification(notificationBody);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // AMBIL USER ID DARI CUSTOM FIELD (Bukan dari split string order_id lagi)
    const userId = statusResponse.custom_field1;

    console.log(`Transaction notification received. Order ID: ${orderId}. User: ${userId}. Status: ${transactionStatus}`);

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        if (fraudStatus == 'challenge') {
            return { status: 'challenge' };
        } else if (fraudStatus == 'accept' || !fraudStatus) {
            
            if (!userId) {
                console.error("User ID not found in custom_field1");
                throw new Error("User ID missing from transaction");
            }

            // Hitung waktu expire (Sekarang + 10 Menit)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);

            // Update Database via Supabase Secret
            const { error } = await supabaseSecret
                .from('users')
                .update({
                    subscription_plan: 'pro',
                    subscription_expires_at: expiresAt.toISOString()
                })
                .eq('id', userId);

            if (error) {
                console.error("Gagal update user pro:", error);
                throw error;
            }

            return { status: 'success', userId };
        }
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
        return { status: 'failed' };
    } else if (transactionStatus == 'pending') {
        return { status: 'pending' };
    }
};