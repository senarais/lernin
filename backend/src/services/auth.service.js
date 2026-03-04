import { supabaseAnon, supabaseSecret } from "../config/supabase.js";

// --- EXISTING EMAIL/PASSWORD FUNCTIONS ---
export const registerUser = async ({email, password, username}) => {
    const { data, error } = await supabaseAnon.auth.signUp({ email, password })
    if (error) throw error
    // Trigger SQL sudah handle insert ke public.users, jadi kita skip manual insert
    return {id: data.user.id, email, username}
}

export const loginUser = async ({ identifier, password }) => {
    let loginEmail = identifier;

    // 1. Cek apakah input adalah username (tidak mengandung '@')
    if (!identifier.includes('@')) {
        // Cari email berdasarkan username di tabel users
        const { data: userData, error: userError } = await supabaseSecret
            .from('users')
            .select('email')
            .eq('username', identifier)
            .single();
        
        // Kalau username gak ketemu di database
        if (userError || !userData) {
            throw new Error("Username tidak ditemukan.");
        }
        
        // Timpa loginEmail dengan email asli si user
        loginEmail = userData.email;
    }

    // 2. Lanjut login ke Supabase Auth menggunakan Email & Password
    const { data, error } = await supabaseAnon.auth.signInWithPassword({ 
        email: loginEmail, 
        password 
    });
    
    if (error) {
        throw new Error("Email/Username atau password salah.");
    }

    // 3. Ambil data user dari public.users
    const { data: user, error: dbError } = await supabaseSecret
        .from('users')
        .select('id, email, username')
        .eq('id', data.user.id)
        .single();
    
    if (dbError) throw dbError;

    return { ...user, accessToken: data.session.access_token };
}

export const getUser = async (userId) => {
    // 1. Ambil data user
    const {data: user, error} = await supabaseSecret
        .from('users')
        .select('id, email, username, role, subscription_plan, subscription_expires_at')
        .eq('id', userId)
        .single();

    if(error) throw error;

    // 2. LAZY CHECK: Cek apakah plan PRO sudah kadaluarsa?
    if (user.subscription_plan === 'pro' && user.subscription_expires_at) {
        const now = new Date();
        const expiry = new Date(user.subscription_expires_at);

        if (now > expiry) {
            console.log(`User ${user.username} expired. Downgrading to FREE.`);
            
            // Update DB balik ke free
            await supabaseSecret
                .from('users')
                .update({ 
                    subscription_plan: 'free',
                    subscription_expires_at: null 
                })
                .eq('id', userId);
            
            // Update object user yang mau dikirim balik biar frontend langsung tau
            user.subscription_plan = 'free';
            user.subscription_expires_at = null;
        }
    }

    return user;
}

// --- NEW: GOOGLE AUTH FUNCTIONS ---

export const getGoogleUrl = async () => {
    const { data, error } = await supabaseAnon.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // PENTING: Arahkan ke FRONTEND (Next.js), bukan Backend
            redirectTo: 'http://localhost:3000/auth/callback', 
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) throw error;
    return data.url;
}

export const verifyGoogleToken = async (accessToken) => {
    // 1. Cek validitas token ke Supabase Auth
    const { data: { user }, error } = await supabaseAnon.auth.getUser(accessToken);
    if (error) throw error;

    // 2. Ambil data user dari tabel public.users kita
    const { data: dbUser, error: dbError } = await supabaseSecret
        .from('users')
        .select('id, email, username')
        .eq('id', user.id)
        .single();
    
    if (dbError) throw dbError;

    return dbUser;
}

export const updateProfile = async (userId, data) => {
    // data berisi: { username, full_name, phone_number, school }
    const { data: result, error } = await supabaseSecret
        .from('users')
        .update({
            username: data.username,
            full_name: data.full_name,
            phone_number: data.phone_number,
            school: data.school
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        // Handle jika username sudah dipakai orang lain
        if (error.code === '23505') throw new Error("Username sudah digunakan.");
        throw error;
    }
    return result;
};