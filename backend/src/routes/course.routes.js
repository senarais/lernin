import express from 'express'
import * as courseController from '../controller/course.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

// Middleware Auth
router.use(authMiddleware)

/**
 * ============================
 * COURSES & SUBJECTS
 * ============================
 */

// 1. List Courses (Menu: UTBK, IPA, IPS)
// GET /api/courses/list
router.get('/list', courseController.getCourses)

// 2. List Subjects by Course Slug (bisa ?grade=10)
// GET /api/courses/utbk/subjects
// GET /api/courses/sma-ipa/subjects?grade=10
router.get('/:courseSlug/subjects', courseController.getSubjects)

/**
 * ============================
 * MODULE & QUIZ (FLAT ROUTES)
 * ============================
 */
// Karena kita fetch based on ID, kita gak perlu naro ini di dalem /:courseSlug/

// List Modules in a Subject
// GET /api/courses/subjects/:subjectId/modules
router.get('/subjects/:subjectId/modules', courseController.getModulesBySubject)

// Module Detail
// GET /api/courses/modules/:moduleId
router.get('/modules/:moduleId', courseController.getModuleDetail)

// Complete Video
// POST /api/courses/modules/:moduleId/complete
router.post('/modules/:moduleId/complete', courseController.completeVideo)

// Get Quiz Info
// GET /api/courses/modules/:moduleId/quiz
router.get('/modules/:moduleId/quiz', courseController.getQuizByModule)

// Submit Quiz
// POST /api/courses/quizzes/:quizId/submit
router.post('/quizzes/:quizId/submit', courseController.submitQuiz)

// Quiz History
// GET /api/courses/quizzes/:quizId/attempts
router.get('/quizzes/:quizId/attempts', courseController.getQuizAttempts)

export default router