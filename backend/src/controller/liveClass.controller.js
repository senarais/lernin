import * as liveClassService from '../services/liveClass.service.js';

export const getCatalog = async (req, res) => {
    try {
        const data = await liveClassService.getAllClasses(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMyClasses = async (req, res) => {
    try {
        const data = await liveClassService.getMyClasses(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getClassDetail = async (req, res) => {
    try {
        const data = await liveClassService.getClassDetail(req.user.id, req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        if (err.message === 'ACCESS_DENIED') {
            return res.status(403).json({ error: "Kamu belum memiliki akses ke kelas ini." });
        }
        res.status(500).json({ error: err.message });
    }
};