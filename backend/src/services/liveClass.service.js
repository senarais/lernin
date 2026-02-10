// services/liveClass.service.js
import { supabaseSecret } from "../config/supabase.js";

// 1. Get All Classes (Catalog)
// Kita kasih flag 'is_owned' dan 'is_accessible' buat UI
export const getAllClasses = async (userId) => {
    // Ambil data user buat cek plan
    const { data: user } = await supabaseSecret.from('users').select('subscription_plan, subscription_expires_at').eq('id', userId).single();
    
    // Cek status PRO (Lazy Check Logic Sederhana)
    const isPro = user.subscription_plan === 'pro' && new Date(user.subscription_expires_at) > new Date();

    // Ambil semua kelas
    const { data: classes } = await supabaseSecret.from('live_classes').select('id, title, description, price, schedule, image_url, instructor_name');

    // Ambil kelas yang udah dibeli user
    const { data: owned } = await supabaseSecret.from('user_live_classes').select('live_class_id').eq('user_id', userId);
    const ownedIds = owned.map(o => o.live_class_id);

    // Map data
    return classes.map(c => ({
        ...c,
        is_owned: ownedIds.includes(c.id),
        is_accessible: isPro || ownedIds.includes(c.id) // Bisa akses kalau PRO atau Udah Beli
    }));
};

// 2. Get My Classes (Hanya yang bisa diakses)
export const getMyClasses = async (userId) => {
    // Sama logicnya, cek PRO dulu
    const { data: user } = await supabaseSecret.from('users').select('subscription_plan, subscription_expires_at').eq('id', userId).single();
    const isPro = user.subscription_plan === 'pro' && new Date(user.subscription_expires_at) > new Date();

    if (isPro) {
        // Kalau PRO, return SEMUA kelas yang ada di database
        // Karena PRO = Punya Semua
        const { data } = await supabaseSecret.from('live_classes').select('*');
        return data;
    } else {
        // Kalau FREE, return cuma yang ada di tabel user_live_classes
        const { data } = await supabaseSecret
            .from('user_live_classes')
            .select(`
                purchased_at,
                live_classes (*) 
            `) // Join ke tabel live_classes
            .eq('user_id', userId);
        
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