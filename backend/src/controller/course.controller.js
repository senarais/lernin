import * as courseService from '../services/course.service.js'

/**
 * ============================
 * SUBJECT
 * ============================
 */

// GET /api/courses/subjects
export const getSubjects = async (req, res, next) => {
  try {
    const userId = req.user.id

    const subjects = await courseService.getSubjectsWithProgress(userId)

    return res.status(200).json({
      success: true,
      data: subjects
    })
  } catch (err) {
    next(err)
  }
}

/**
 * ============================
 * MODULE
 * ============================
 */

// GET /api/courses/subjects/:subjectId/modules
export const getModulesBySubject = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { subjectId } = req.params

    const modules = await courseService.getModulesBySubject(
      userId,
      subjectId
    )

    return res.status(200).json({
      success: true,
      data: modules
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/courses/modules/:moduleId
export const getModuleDetail = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { moduleId } = req.params

    const module = await courseService.getModuleDetail(
      userId,
      moduleId
    )

    return res.status(200).json({
      success: true,
      data: module
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/courses/modules/:moduleId/complete
export const completeVideo = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { moduleId } = req.params

    await courseService.completeVideo(userId, moduleId)

    return res.status(200).json({
      success: true,
      message: 'Module completed'
    })
  } catch (err) {
    next(err)
  }
}

/**
 * ============================
 * QUIZ
 * ============================
 */

// GET /api/courses/modules/:moduleId/quiz
export const getQuizByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params

    const quiz = await courseService.getQuizByModule(moduleId)

    return res.status(200).json({
      success: true,
      data: quiz
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/courses/quizzes/:quizId/submit
export const submitQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { quizId } = req.params
    const { answers } = req.body

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Answers is required'
      })
    }

    const result = await courseService.submitQuiz(
      userId,
      quizId,
      answers
    )

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/courses/quizzes/:quizId/attempts
export const getQuizAttempts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { quizId } = req.params

    const attempts = await courseService.getQuizAttempts(
      userId,
      quizId
    )

    return res.status(200).json({
      success: true,
      data: attempts
    })
  } catch (err) {
    next(err)
  }
}
