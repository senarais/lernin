import { supabaseAnon, supabaseSecret } from "../config/supabase.js";

// --- EXISTING EMAIL/PASSWORD FUNCTIONS ---
export const registerUser = async ({email, password, username}) => {
    const { data, error } = await supabaseAnon.auth.signUp({ email, password })
    if (error) throw error
    // Trigger SQL sudah handle insert ke public.users, jadi kita skip manual insert
    return {id: data.user.id, email, username}
}

export const loginUser = async ({email, password}) => {
    const {data, error} = await supabaseAnon.auth.signInWithPassword({ email, password })
    if (error) throw error

    const {data: user, error: userError} = await supabaseSecret
        .from('users')
        .select('id, email, username')
        .eq('id', data.user.id)
        .single()
    
    if (userError) throw userError

    return { ...user, accessToken: data.session.access_token }
}

export const getUser = async (userId) => {
    // 1. Ambil data user
    const {data: user, error} = await supabaseSecret
        .from('users')
        .select('id, email, username, subscription_plan, subscription_expires_at')
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