import { supabaseSecret } from '../config/supabase.js';

// Middleware ini ASUMSINYA dipakai SETELAH authMiddleware lu jalan
// Jadi req.user (dari authMiddleware) udah ada isinya.
export const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not found in request' });
        }

        // Cek apakah user ini punya role 'admin'
        const { data: userRecord, error } = await supabaseSecret
            .from('users')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !userRecord) {
            return res.status(403).json({ error: 'Forbidden: Cannot verify user role' });
        }

        if (userRecord.role !== 'admin') {
            return res.status(403).json({ error: 'Access Denied: Admin privileges required' });
        }

        // Kalau lolos, lanjut ke controller
        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error during admin verification' });
    }
};