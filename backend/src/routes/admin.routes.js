import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import * as adminController from '../controller/admin.controller.js';

const router = express.Router();

// Terapkan perlindungan ganda: Harus Login & Harus Admin
router.use(authMiddleware);
router.use(adminMiddleware);

// --- LIVE CLASS ROUTES ---
router.post('/live-class', adminController.addLiveClass);
router.put('/live-class/:id', adminController.editLiveClass);
router.delete('/live-class/:id', adminController.removeLiveClass);

// --- TRYOUT ROUTES ---
// 1. Master Tryout
router.get('/tryout', adminController.fetchTryoutsAdmin); // BARU
router.get('/tryout/:tryoutId', adminController.fetchTryoutDetailAdmin); // BARU
router.post('/tryout', adminController.addTryout);
router.put('/tryout/:id', adminController.editTryout);
router.delete('/tryout/:id', adminController.removeTryout);

// 2. Mapel Tryout (Section)
router.post('/tryout/:tryoutId/section', adminController.addTryoutSection);
router.put('/tryout-section/:id', adminController.editTryoutSection); // BARU
router.delete('/tryout-section/:id', adminController.removeTryoutSection); // BARU

// 3. Soal Tryout (Question)
router.post('/tryout/section/:sectionId/question', adminController.addTryoutQuestion);
router.put('/tryout-question/:id', adminController.editTryoutQuestion); // BARU
router.delete('/tryout-question/:id', adminController.removeTryoutQuestion); // BARU

// ==========================================
// E-LEARNING ROUTES
// ==========================================

// --- 1. COURSE ---
router.get('/course', adminController.fetchCourses); // <-- TAMBAHAN BARU
router.post('/course', adminController.addCourse);
router.put('/course/:id', adminController.editCourse);
router.delete('/course/:id', adminController.removeCourse);

// --- 2. SUBJECT (Nempel ke Course) ---
router.get('/course/:courseId/subject', adminController.fetchSubjects); // <-- TAMBAHAN BARU
router.post('/course/:courseId/subject', adminController.addSubject);
router.put('/subject/:id', adminController.editSubject);
router.delete('/subject/:id', adminController.removeSubject);
router.get('/subject/:subjectId/modules', adminController.fetchSubjectDetail);

// --- 3. MODULE (Nempel ke Subject) ---
router.post('/subject/:subjectId/module', adminController.addModule);
router.put('/module/:id', adminController.editModule);
router.delete('/module/:id', adminController.removeModule);

// --- 4. QUIZ (Nempel ke Module) ---
router.post('/module/:moduleId/quiz', adminController.addQuiz);
router.put('/quiz/:id', adminController.editQuiz);
router.delete('/quiz/:id', adminController.removeQuiz);

// --- 5. QUIZ QUESTION (Nempel ke Quiz) ---
router.post('/quiz/:quizId/question', adminController.addQuizQuestion);
router.put('/quiz-question/:id', adminController.editQuizQuestion);
router.delete('/quiz-question/:id', adminController.removeQuizQuestion);

export default router;