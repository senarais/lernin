import { supabaseSecret } from "../config/supabase.js"

/**
 * ============================
 * COURSE (MENU UTAMA)
 * ============================
 */

/**
 * Get all available courses (UTBK, SMA IPA, SMA IPS)
 */
export const getCourses = async () => {
  const { data, error } = await supabaseSecret
    .from('courses')
    .select('id, slug, title')
    .order('title')

  if (error) throw error
  return data
}

/**
 * ============================
 * SUBJECT
 * ============================
 */

/**
 * Get subjects filtered by Course Slug & Grade Level with progress
 * Params: 
 * - userId: uuid
 * - courseSlug: string ('utbk', 'sma-ipa', etc)
 * - gradeLevel: number (optional, e.g. 10, 11, 12)
 */
export const getSubjectsByCourse = async (userId, courseSlug, gradeLevel = null) => {
  // 1. Base Query: Join ke tabel courses pake !inner biar bisa filter by slug
  let query = supabaseSecret
    .from('subjects')
    .select(`
      id,
      title,
      description,
      order_index,
      grade_level,
      courses!inner (
        slug
      ),
      modules (
        id,
        user_module_progress (
          is_completed
        )
      )
    `)
    .eq('courses.slug', courseSlug)
    .order('order_index')

  // 2. Filter Grade Level kalo ada (Khusus IPA/IPS)
  if (gradeLevel) {
    query = query.eq('grade_level', gradeLevel)
  }

  const { data, error } = await query

  if (error) throw error

  // 3. Mapping data biar rapi (ngitung progress)
  return data.map(subject => {
    const totalModules = subject.modules.length
    const completedModules = subject.modules.filter(
      m => m.user_module_progress?.[0]?.is_completed
    ).length

    return {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      grade_level: subject.grade_level,
      total_modules: totalModules,
      completed_modules: completedModules,
      progress_percentage: totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100)
    }
  })
}

/**
 * ============================
 * MODULE (Gak banyak berubah logicnya)
 * ============================
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
 * QUIZ (Logic tetep sama karena based on ID)
 * ============================
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

export const submitQuiz = async (userId, quizId, answers) => {
  // 1. Cek Module ID
  const { data: quiz, error: quizError } = await supabaseSecret
    .from('quizzes')
    .select('module_id')
    .eq('id', quizId)
    .single()

  if (quizError) throw quizError

  // 2. Update Progress (Hanya update, harusnya udah insert pas nonton video)
  const { data: progressData, error: progressError } = await supabaseSecret
    .from('user_module_progress')
    .update({ quiz_completed: true })
    .eq('user_id', userId)
    .eq('module_id', quiz.module_id)
    .select()

  if (progressError || !progressData || progressData.length === 0) {
    return { success: false, message: 'Tonton materi terlebih dahulu.' }
  }

  // 3. Hitung Score
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

  // Asumsi skor max 100, dibagi rata jumlah soal
  const scorePerQuestion = questions.length > 0 ? 100 / questions.length : 0
  const score = Math.round(correct * scorePerQuestion)

  // 4. Save Attempt
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

  return { success: true, score, correct, wrong, total: questions.length }
}

export const getQuizAttempts = async (userId, quizId) => {
  const { data, error } = await supabaseSecret
    .from('user_quiz_attempts')
    .select('id, score, correct_count, wrong_count, created_at')
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}