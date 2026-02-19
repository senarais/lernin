import * as tryoutService from '../services/tryout.service.js';

export const listTryouts = async (req, res) => {
    try {
        const data = await tryoutService.getAvailableTryouts();
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const startTryout = async (req, res) => {
    try {
        const { tryoutId } = req.body;
        const session = await tryoutService.startTryout(req.user.id, tryoutId);
        res.json({ success: true, session });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const startSection = async (req, res) => {
    try {
        const { sessionId, sectionId } = req.body;
        const sectionSession = await tryoutService.startSection(sessionId, sectionId);
        // Langsung return soal pas timer mulai
        const questions = await tryoutService.getQuestions(sectionId);
        
        res.json({ 
            success: true, 
            session: sectionSession, 
            questions // Kunci jawaban gak ada disini, jadi aman di inspect element
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const submitSection = async (req, res) => {
    try {
        const { sectionSessionId } = req.params;
        const { answers } = req.body; // format: { "id_soal": "A", "id_soal2": "B" }
        
        const result = await tryoutService.submitSection(sectionSessionId, answers);
        res.json(result);
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
};

export const finishTryout = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await tryoutService.finishTryout(req.user.id, sessionId);
        res.json({ success: true, result });
    } catch (err) { res.status(500).json({ error: err.message }); }
};