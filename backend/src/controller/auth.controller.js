import { registerUser, loginUser, getUser, getGoogleUrl, verifyGoogleToken } from "../services/auth.service.js";
import { supabaseAnon } from "../config/supabase.js";

// ... register, login, logout, me (tetap sama) ...

export const register = async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const user = await registerUser({email, password, username})
        res.status(201).json(user)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await loginUser({email, password})
        
        res.cookie('access_token', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })

        res.json({ id: user.id, email: user.email, username: user.username })
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const logout = (req, res) => {
    res.clearCookie('access_token')
    res.json({ message: 'Logged out' })
}

export const me = async (req, res) => {
    const user = await getUser(req.user.id)
    res.json({ user: user })
}

// --- NEW: GOOGLE CONTROLLERS ---

// 1. Frontend minta URL Google
export const loginGoogle = async (req, res) => {
    try {
        const url = await getGoogleUrl();
        res.redirect(url); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. Frontend kirim Token, Backend set Cookie
export const googleAuthSuccess = async (req, res) => {
    try {
        const { accessToken } = req.body;
        
        // Verifikasi token
        const user = await verifyGoogleToken(accessToken);

        // Set Cookie di Backend
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        });

        res.json({ user });
    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(401).json({ error: 'Invalid token or user not found' });
    }
}