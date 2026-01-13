import express from 'express'
import * as courseController from '../controller/course.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

/**
 * Semua route course WAJIB login
 */
router.use(authMiddleware)

/**
 * ============================
 * SUBJECT
 * ============================
 */

// GET /api/courses/subjects
router.get('/subjects', courseController.getSubjects)

// GET /api/courses/subjects/:subjectId/modules
router.get(
  '/subjects/:subjectId/modules',
  courseController.getModulesBySubject
)

/**
 * ============================
 * MODULE
 * ============================
 */

// GET /api/courses/modules/:moduleId
router.get('/modules/:moduleId', courseController.getModuleDetail)

// POST /api/courses/modules/:moduleId/complete
router.post(
  '/modules/:moduleId/complete',
  courseController.completeVideo
)

// GET /api/courses/modules/:moduleId/quiz
router.get(
  '/modules/:moduleId/quiz',
  courseController.getQuizByModule
)

/**
 * ============================
 * QUIZ
 * ============================
 */

// POST /api/courses/quizzes/:quizId/submit
router.post(
  '/quizzes/:quizId/submit',
  courseController.submitQuiz
)

// GET /api/courses/quizzes/:quizId/attempts
router.get(
  '/quizzes/:quizId/attempts',
  courseController.getQuizAttempts
)

export default router
