import * as courseService from '../services/course.service.js'

/**
 * ============================
 * COURSE (MENU UTAMA)
 * ============================
 */

// GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getCourses()
    return res.status(200).json({
      success: true,
      data: courses
    })
  } catch (err) {
    next(err)
  }
}

/**
 * ============================
 * SUBJECT
 * ============================
 */

// GET /api/courses/:courseSlug/subjects?grade=10
export const getSubjects = async (req, res, next) => {
  try {
    const userId = req.user.id
    // Ambil slug dari URL params (misal: 'utbk', 'sma-ipa')
    const { courseSlug } = req.params
    // Ambil grade dari query params (optional)
    const { grade } = req.query 
    
    // Pastikan logic kalau grade dikirim, dia valid
    const gradeLevel = grade ? parseInt(grade) : null

    const subjects = await courseService.getSubjectsByCourse(userId, courseSlug, gradeLevel)

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

    // Panggil service yang baru kita update
    const result = await courseService.getSubjectDetailWithModules(userId, subjectId)

    return res.status(200).json({
      success: true,
      data: result // Structure: { subject: {...}, modules: [...] }
    })
  } catch (err) {
    next(err)
  }
}

export const getModuleDetail = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { moduleId } = req.params

    const module = await courseService.getModuleDetail(userId, moduleId)

    return res.status(200).json({
      success: true,
      data: module
    })
  } catch (err) {
    next(err)
  }
}

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

    const result = await courseService.submitQuiz(userId, quizId, answers)
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (err) {
    next(err)
  }
}

export const getQuizAttempts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { quizId } = req.params
    const attempts = await courseService.getQuizAttempts(userId, quizId)
    return res.status(200).json({
      success: true,
      data: attempts
    })
  } catch (err) {
    next(err)
  }
}

