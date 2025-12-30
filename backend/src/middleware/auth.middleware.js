import { supabaseAnon, supabaseSecret } from '../config/supabase.js'

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabaseAnon.auth.getUser(token)
    if (error) return res.status(401).json({ error: 'Invalid token' })
    
    req.user = data.user;
    next()
}