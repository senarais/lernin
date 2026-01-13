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
/**
 * Save video progress (Video Completed)
 */
export const completeVideo = async (userId, moduleId) => {
  const { error } = await supabaseSecret
    .from('user_module_progress')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      video_completed: true
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
/**
 * Submit quiz answers
 */
export const submitQuiz = async (userId, quizId, answers) => {
  // Get module_id from quiz
  const { data: quiz, error: quizError } = await supabaseSecret
    .from('quizzes')
    .select('module_id')
    .eq('id', quizId)
    .single()

  if (quizError) throw quizError

  // Update quiz_completed (ONLY update, NO insert)
  const { data: progressData, error: progressError } = await supabaseSecret
    .from('user_module_progress')
    .update({
      quiz_completed: true
    })
    .eq('user_id', userId)
    .eq('module_id', quiz.module_id)
    .select()

  // ❌ user belum nonton video / progress belum ada
  if (progressError || !progressData || progressData.length === 0) {
    return {
      success: false,
      message: 'Tonton materi terlebih dahulu.'
    }
  }

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

  // Save quiz attempt
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
    success: true,
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
