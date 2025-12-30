import { registerUser, loginUser } from "../services/auth.service.js";
import { supabaseAnon } from "../config/supabase.js";

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
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })

        res.json({
            id: user.id, 
            email: user.email,
            username: user.username
        })
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const logout = (req, res) => {
    res.clearCookie('access_token')
    res.json({ message: 'Logged out' })
}