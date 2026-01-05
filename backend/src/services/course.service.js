import { supabaseSecret } from "../config/supabase.js"

/**
 * ============================
 * SUBJECT
 * ============================
 */

/**
 * Get all subjects with progress user
 */
export const getSubjectsWithProgress = async (userId) => {
  const { data, error } = await supabaseSecret
    .from('subjects')
    .select(`
      id,
      title,
      description,
      order_index,
      modules (
        id,
        user_module_progress (
          is_completed
        )
      )
    `)
    .order('order_index')

  if (error) throw error

  return data.map(subject => {
    const totalModules = subject.modules.length
    const completedModules = subject.modules.filter(
      m => m.user_module_progress?.[0]?.is_completed
    ).length

    return {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      total_modules: totalModules,
      completed_modules: completedModules
    }
  })
}

/**
 * ============================
 * MODULE
 * ============================
 */

/**
 * Get modules by subject with user progress
 */
export const getModulesBySubject = async (userId, subjectId) => {
  const { data, error } = await supabaseSecret
    .from('modules')
    .select(`
      id,
      title,
      video_url,
      order_index,
      user_module_progress (
        is_completed
      )
    `)
    .eq('subject_id', subjectId)
    .eq('user_module_progress.user_id', userId)
    .order('order_index')

  if (error) throw error

  return data.map(module => ({
    id: module.id,
    title: module.title,
    video_url: module.video_url,
    order_index: module.order_index,
    is_completed: module.user_module_progress?.[0]?.is_completed ?? false
  }))
}

/**
 * Get single module detail + quiz
 */
export const getModuleDetail = async (userId, moduleId) => {
  const { data, error } = await supabaseSecret
    .from('modules')
    .select(`
      id,
      title,
      video_url,
      quizzes (
        id,
        title
      )
    `)
    .eq('id', moduleId)
    .single()

  if (error) throw error
  return data
}

/**
 * Save module progress (Save & Continue)
 */
export const completeModule = async (userId, moduleId) => {
  const { error } = await supabaseSecret
    .from('user_module_progress')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      is_completed: true,
      completed_at: new Date()
    })

  if (error) throw error

  return { success: true }
}

/**
 * ============================
 * QUIZ
 * ============================
 */

/**
 * Get quiz by module (without correct answer)
 */
export const getQuizByModule = async (moduleId) => {
  const { data, error } = await supabaseSecret
    .from('quizzes')
    .select(`
      id,
      title,
      quiz_questions (
        id,
        question,
        options
      )
    `)
    .eq('module_id', moduleId)
    .single()

  if (error) throw error
  return data
}

/**
 * Submit quiz answers
 */
export const submitQuiz = async (userId, quizId, answers) => {
  // Get correct answers
  const { data: questions, error } = await supabaseSecret
    .from('quiz_questions')
    .select('id, correct_answer')
    .eq('quiz_id', quizId)

  if (error) throw error

  let correct = 0
  let wrong = 0

  questions.forEach(q => {
    if (answers[q.id] === q.correct_answer) {
      correct++
    } else {
      wrong++
    }
  })

  const score = correct * 20

  const { error: insertError } = await supabaseSecret
    .from('user_quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      correct_count: correct,
      wrong_count: wrong,
      answers
    })

  if (insertError) throw insertError

  return {
    score,
    correct,
    wrong,
    total: questions.length
  }
}

/**
 * Get quiz attempt history
 */
export const getQuizAttempts = async (userId, quizId) => {
  const { data, error } = await supabaseSecret
    .from('user_quiz_attempts')
    .select(`
      id,
      score,
      correct_count,
      wrong_count,
      created_at
    `)
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
