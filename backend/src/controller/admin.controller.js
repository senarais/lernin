import * as adminService from '../services/admin.service.js';

// --- LIVE CLASS ---
export const addLiveClass = async (req, res) => {
    try {
        const result = await adminService.createLiveClass(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editLiveClass = async (req, res) => {
    try {
        const result = await adminService.updateLiveClass(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeLiveClass = async (req, res) => {
    try {
        await adminService.deleteLiveClass(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// --- TRYOUT ---
export const addTryout = async (req, res) => {
    try {
        const result = await adminService.createTryout(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editTryout = async (req, res) => {
    try {
        const result = await adminService.updateTryout(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeTryout = async (req, res) => {
    try {
        await adminService.deleteTryout(req.params.id);
        res.json({ success: true, message: "Tryout deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const addTryoutSection = async (req, res) => {
    try {
        const { tryoutId } = req.params;
        const result = await adminService.createTryoutSection(tryoutId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const addTryoutQuestion = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const result = await adminService.createTryoutQuestion(sectionId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// ==========================================
// E-LEARNING CONTROLLERS
// ==========================================

// --- COURSE ---
export const addCourse = async (req, res) => {
    try {
        const result = await adminService.createCourse(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editCourse = async (req, res) => {
    try {
        const result = await adminService.updateCourse(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeCourse = async (req, res) => {
    try {
        await adminService.deleteCourse(req.params.id);
        res.json({ success: true, message: "Course deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// --- SUBJECT ---
export const addSubject = async (req, res) => {
    try {
        const result = await adminService.createSubject(req.params.courseId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editSubject = async (req, res) => {
    try {
        const result = await adminService.updateSubject(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeSubject = async (req, res) => {
    try {
        await adminService.deleteSubject(req.params.id);
        res.json({ success: true, message: "Subject deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// --- MODULE ---
export const addModule = async (req, res) => {
    try {
        const result = await adminService.createModule(req.params.subjectId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editModule = async (req, res) => {
    try {
        const result = await adminService.updateModule(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeModule = async (req, res) => {
    try {
        await adminService.deleteModule(req.params.id);
        res.json({ success: true, message: "Module deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// --- QUIZ & QUESTIONS ---
export const addQuiz = async (req, res) => {
    try {
        const result = await adminService.createQuiz(req.params.moduleId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editQuiz = async (req, res) => {
    try {
        const result = await adminService.updateQuiz(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeQuiz = async (req, res) => {
    try {
        await adminService.deleteQuiz(req.params.id);
        res.json({ success: true, message: "Quiz deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const addQuizQuestion = async (req, res) => {
    try {
        const result = await adminService.createQuizQuestion(req.params.quizId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const editQuizQuestion = async (req, res) => {
    try {
        const result = await adminService.updateQuizQuestion(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const removeQuizQuestion = async (req, res) => {
    try {
        await adminService.deleteQuizQuestion(req.params.id);
        res.json({ success: true, message: "Question deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};