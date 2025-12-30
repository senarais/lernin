import { supabaseAnon, supabaseSecret } from '../config/supabase.js'

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabaseAnon.auth.getUser(token)
    if (error) return res.status(401).json({ error: 'Invalid token' })
    
    const {data: userData, error: userError} = await supabaseSecret
        .from('users')
        .select('id, email, username')
        .eq('id', data.user.id)
        .single()

    req.user = userData;
    next()
}