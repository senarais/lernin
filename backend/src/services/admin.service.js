import { supabaseSecret } from "../config/supabase.js";

// ==========================================
// 1. MODULE: LIVE CLASS MANAGEMENT
// ==========================================
export const createLiveClass = async (data) => {
    const { data: result, error } = await supabaseSecret.from('live_classes').insert(data).select().single();
    if (error) throw error;
    return result;
};

export const updateLiveClass = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('live_classes').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteLiveClass = async (id) => {
    const { error } = await supabaseSecret.from('live_classes').delete().eq('id', id);
    if (error) throw error;
    return { message: "Live Class deleted successfully" };
};


// ==========================================
// 2. MODULE: TRYOUT MANAGEMENT (BERLAPIS)
// ==========================================

// A. Master Tryout
export const createTryout = async (data) => {
    // data: { title, description, is_published }
    const { data: result, error } = await supabaseSecret.from('tryouts').insert(data).select().single();
    if (error) throw error;
    return result;
};

export const updateTryout = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('tryouts').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteTryout = async (id) => {
    const { error } = await supabaseSecret.from('tryouts').delete().eq('id', id);
    if (error) throw error;
    return { message: "Tryout deleted successfully" };
};

// B. Tryout Sections (Mapel/Sub-tes)
export const createTryoutSection = async (tryoutId, data) => {
    // data: { title, duration_minutes, order_index }
    const payload = { ...data, tryout_id: tryoutId };
    const { data: result, error } = await supabaseSecret.from('tryout_sections').insert(payload).select().single();
    if (error) throw error;
    return result;
};

// C. Tryout Questions (Soal & Pembahasan)
export const createTryoutQuestion = async (sectionId, data) => {
    // data: { question_text, option_a...e, correct_option, explanation }
    const payload = { ...data, section_id: sectionId };
    const { data: result, error } = await supabaseSecret.from('tryout_questions').insert(payload).select().single();
    if (error) throw error;
    return result;
};

// --- GET FULL TRYOUT (KHUSUS ADMIN) ---
export const getAllTryoutsAdmin = async () => {
    const { data, error } = await supabaseSecret
        .from('tryouts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getTryoutDetailAdmin = async (tryoutId) => {
    // Ambil Tryout + Sections + Questions
    const { data, error } = await supabaseSecret
        .from('tryouts')
        .select(`
            id, title, description, is_published,
            tryout_sections (
                id, title, duration_minutes, order_index,
                tryout_questions ( id, question_text, option_a, option_b, option_c, option_d, option_e, correct_option, explanation )
            )
        `)
        .eq('id', tryoutId)
        .order('order_index', { referencedTable: 'tryout_sections', ascending: true })
        .single();
    if (error) throw error;
    return data;
};

// --- MELENGKAPI UPDATE & DELETE UNTUK SECTION DAN QUESTION ---
export const updateTryoutSection = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('tryout_sections').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteTryoutSection = async (id) => {
    const { error } = await supabaseSecret.from('tryout_sections').delete().eq('id', id);
    if (error) throw error;
    return { message: "Section deleted" };
};

export const updateTryoutQuestion = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('tryout_questions').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteTryoutQuestion = async (id) => {
    const { error } = await supabaseSecret.from('tryout_questions').delete().eq('id', id);
    if (error) throw error;
    return { message: "Question deleted" };
};


// ==========================================
// 3. MODULE: E-LEARNING (Course -> Subject -> Module)
// ==========================================
// (Contoh pattern untuk E-Learning)
// --- A. COURSES ---
export const createCourse = async (data) => {
    // data: { title, slug }
    const { data: result, error } = await supabaseSecret.from('courses').insert(data).select().single();
    if (error) throw error;
    return result;
};

export const updateCourse = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('courses').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteCourse = async (id) => {
    const { error } = await supabaseSecret.from('courses').delete().eq('id', id);
    if (error) throw error;
    return { message: "Course deleted successfully" };
};

// --- B. SUBJECTS (Mata Pelajaran) ---
export const createSubject = async (courseId, data) => {
    // data: { title, description, order_index, grade_level }
    const payload = { ...data, course_id: courseId };
    const { data: result, error } = await supabaseSecret.from('subjects').insert(payload).select().single();
    if (error) throw error;
    return result;
};

export const updateSubject = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('subjects').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteSubject = async (id) => {
    const { error } = await supabaseSecret.from('subjects').delete().eq('id', id);
    if (error) throw error;
    return { message: "Subject deleted successfully" };
};

// --- C. MODULES (Video Materi) ---
export const createModule = async (subjectId, data) => {
    // data: { title, video_url, order_index }
    const payload = { ...data, subject_id: subjectId };
    const { data: result, error } = await supabaseSecret.from('modules').insert(payload).select().single();
    if (error) throw error;
    return result;
};

export const updateModule = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('modules').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteModule = async (id) => {
    const { error } = await supabaseSecret.from('modules').delete().eq('id', id);
    if (error) throw error;
    return { message: "Module deleted successfully" };
};

// --- D. QUIZZES ---
export const createQuiz = async (moduleId, data) => {
    // data: { title }
    const payload = { ...data, module_id: moduleId };
    const { data: result, error } = await supabaseSecret.from('quizzes').insert(payload).select().single();
    if (error) throw error;
    return result;
};

export const updateQuiz = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('quizzes').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteQuiz = async (id) => {
    const { error } = await supabaseSecret.from('quizzes').delete().eq('id', id);
    if (error) throw error;
    return { message: "Quiz deleted successfully" };
};

// --- E. QUIZ QUESTIONS ---
export const createQuizQuestion = async (quizId, data) => {
    // data: { question, options (jsonb), correct_answer }
    const payload = { ...data, quiz_id: quizId };
    const { data: result, error } = await supabaseSecret.from('quiz_questions').insert(payload).select().single();
    if (error) throw error;
    return result;
};

export const updateQuizQuestion = async (id, data) => {
    const { data: result, error } = await supabaseSecret.from('quiz_questions').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
};

export const deleteQuizQuestion = async (id) => {
    const { error } = await supabaseSecret.from('quiz_questions').delete().eq('id', id);
    if (error) throw error;
    return { message: "Question deleted successfully" };
};

export const getAllCourses = async () => {
    const { data, error } = await supabaseSecret
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
};

// --- GET DATA KHUSUS ADMIN ---
export const getSubjectsByCourse = async (courseId) => {
    const { data, error } = await supabaseSecret
        .from('subjects')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
    if (error) throw error;
    return data;
};

export const getSubjectDetailAdmin = async (subjectId) => {
    // Ambil info subject & parent course-nya
    const { data: subject, error: subErr } = await supabaseSecret
        .from('subjects')
        .select('id, title, courses(title)')
        .eq('id', subjectId).single();
    if (subErr) throw subErr;

    // Ambil modules beserta nested quizzes & questions
    const { data: modules, error: modErr } = await supabaseSecret
        .from('modules')
        .select(`
            id, title, video_url, order_index,
            quizzes (
                id, title,
                quiz_questions ( id, question, options, correct_answer )
            )
        `)
        .eq('subject_id', subjectId)
        .order('order_index', { ascending: true });
    if (modErr) throw modErr;

    return { subject, modules };
};