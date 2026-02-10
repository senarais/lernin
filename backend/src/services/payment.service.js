import { snap } from "../config/midtrans.js";
import { supabaseSecret } from "../config/supabase.js";

/**
 * 1. Create Snap Transaction Token (Dynamic)
 * params:
 * - user: object user
 * - item: { type: 'plan' | 'class', id: string, name: string, price: number }
 */
export const createTransaction = async (user, item) => {
    // Format Order ID: TYPE-TIMESTAMP-RANDOM
    // Contoh: PLAN-1708... atau CLASS-1708...
    const prefix = item.type === 'plan' ? 'PRO' : 'CLS';
    const orderId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: item.price
        },
        customer_details: {
            first_name: user.username,
            email: user.email,
        },
        // --- CUSTOM FIELDS (PENTING BANGET) ---
        custom_field1: user.id,      // Siapa yang beli
        custom_field2: item.type,    // Apa tipenya ('plan' atau 'class')
        custom_field3: item.id,      // ID itemnya (uuid class atau 'pro-plan')

        item_details: [{
            id: item.id,
            price: item.price,
            quantity: 1,
            name: item.name.substring(0, 50) // Midtrans ada limit panjang nama item
        }]
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
};

/**
 * 2. Handle Webhook dari Midtrans (Smart Handler)
 */
export const handleMidtransNotification = async (notificationBody) => {
    const statusResponse = await snap.transaction.notification(notificationBody);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // Ambil metadata yang kita titipin tadi
    const userId = statusResponse.custom_field1;
    const itemType = statusResponse.custom_field2; // 'plan' atau 'class'
    const itemId = statusResponse.custom_field3;   // id barangnya

    console.log(`Notif masuk: ${orderId} | User: ${userId} | Tipe: ${itemType}`);

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        if (fraudStatus == 'challenge') {
            return { status: 'challenge' };
        } else if (fraudStatus == 'accept' || !fraudStatus) {
            
            if (!userId) throw new Error("User ID missing");

            // === SKENARIO 1: BELI PAKET PRO ===
            if (itemType === 'plan') {
                const expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Logic 10 menit lu

                const { error } = await supabaseSecret
                    .from('users')
                    .update({
                        subscription_plan: 'pro',
                        subscription_expires_at: expiresAt.toISOString()
                    })
                    .eq('id', userId);
                
                if (error) throw error;
            } 
            
            // === SKENARIO 2: BELI LIVE CLASS SATUAN ===
            else if (itemType === 'class') {
                // Insert ke tabel kepemilikan
                // Kita pake upsert/ignore biar kalo notif midtrans masuk 2x gak error
                const { error } = await supabaseSecret
                    .from('user_live_classes')
                    .upsert({
                        user_id: userId,
                        live_class_id: itemId,
                        purchased_at: new Date().toISOString()
                    }, { onConflict: 'user_id, live_class_id' }); // Abaikan kalo udah ada

                if (error) throw error;
            }

            return { status: 'success', userId, itemType };
        }
    }
    
    return { status: 'processed' };
};