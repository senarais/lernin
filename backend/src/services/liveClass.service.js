// services/liveClass.service.js
import { supabaseSecret } from "../config/supabase.js";

// 1. Get All Classes (Catalog)
// Kita kasih flag 'is_owned' dan 'is_accessible' buat UI
export const getAllClasses = async (userId) => {
    // Cek User Plan
    const { data: user } = await supabaseSecret.from('users').select('subscription_plan, subscription_expires_at').eq('id', userId).single();
    const isPro = user.subscription_plan === 'pro' && new Date(user.subscription_expires_at) > new Date();

    // Ambil data kelas (TAMBAH wa_link di select)
    const { data: classes } = await supabaseSecret
        .from('live_classes')
        .select('id, title, description, price, schedule, image_url, instructor_name, wa_link'); // <--- Tambah wa_link

    // Ambil kepemilikan
    const { data: owned } = await supabaseSecret.from('user_live_classes').select('live_class_id').eq('user_id', userId);
    const ownedIds = owned.map(o => o.live_class_id);

    // Map data
    return classes.map(c => {
        const isOwned = ownedIds.includes(c.id);
        const isAccessible = isPro || isOwned;

        return {
            id: c.id,
            title: c.title,
            description: c.description,
            price: c.price,
            schedule: c.schedule,
            image_url: c.image_url,
            instructor_name: c.instructor_name,
            is_owned: isOwned,
            is_accessible: isAccessible,
            // LOGIC PENTING: Cuma kasih wa_link kalau punya akses
            wa_link: isAccessible ? c.wa_link : null 
        };
    });
};

// 2. Get My Classes - UPDATE DISINI
export const getMyClasses = async (userId) => {
    const { data: user } = await supabaseSecret.from('users').select('subscription_plan, subscription_expires_at').eq('id', userId).single();
    const isPro = user.subscription_plan === 'pro' && new Date(user.subscription_expires_at) > new Date();

    if (isPro) {
        // Kalau PRO, return semua data (termasuk wa_link karena select *)
        const { data } = await supabaseSecret.from('live_classes').select('*');
        return data;
    } else {
        // Kalau FREE, return yang dibeli
        const { data } = await supabaseSecret
            .from('user_live_classes')
            .select(`
                purchased_at,
                live_classes (*) 
            `)
            .eq('user_id', userId);
        
        // Flatten data
        return data.map(d => d.live_classes);
    }
};

// 3. Get Class Detail (Sensitive Data: WA Link)
export const getClassDetail = async (userId, classId) => {
    // 1. Cek User
    const { data: user } = await supabaseSecret.from('users').select('subscription_plan, subscription_expires_at').eq('id', userId).single();
    const isPro = user.subscription_plan === 'pro' && new Date(user.subscription_expires_at) > new Date();

    // 2. Cek Ownership
    const { data: owned } = await supabaseSecret.from('user_live_classes').select('id').eq('user_id', userId).eq('live_class_id', classId).single();

    // 3. Validasi Akses
    if (!isPro && !owned) {
        throw new Error("ACCESS_DENIED"); 
    }

    // 4. Return Data Lengkap (Termasuk WA Link)
    const { data } = await supabaseSecret.from('live_classes').select('*').eq('id', classId).single();
    return data;
};