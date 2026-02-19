import { supabaseSecret } from "../config/supabase.js";

// GRACE PERIOD (Toleransi delay internet 15 detik)
const GRACE_PERIOD_MS = 15000; 

export const getAvailableTryouts = async () => {
    const { data, error } = await supabaseSecret
        .from('tryouts')
        .select(`id, title, description, tryout_sections(id, title, duration_minutes)`)
        .eq('is_published', true);
    if (error) throw error;
    return data;
};

// 1. INIT MASTER SESSION (Pas user klik "Mulai Tryout")
export const startTryout = async (userId, tryoutId) => {
    // Cek apakah udah pernah ngerjain
    const { data: existing } = await supabaseSecret.from('tryout_sessions').select('*').eq('user_id', userId).eq('tryout_id', tryoutId).eq('is_completed', false).single();
    if (existing) return existing;

    const { data, error } = await supabaseSecret
        .from('tryout_sessions')
        .insert({ user_id: userId, tryout_id: tryoutId })
        .select()
        .single();
    if (error) throw error;
    return data;
};

// 2. MULAI SUB-TES (Pas user klik mulai "Penalaran Umum")
export const startSection = async (sessionId, sectionId) => {
    // Cari tahu durasi pelajaran ini
    const { data: section } = await supabaseSecret.from('tryout_sections').select('duration_minutes').eq('id', sectionId).single();
    if (!section) throw new Error("Pelajaran tidak ditemukan");

    // Kalkulasi Waktu Habis (Sekarang + durasi)
    const startTime = new Date();
    const expiresAt = new Date(startTime.getTime() + section.duration_minutes * 60000);

    const { data, error } = await supabaseSecret
        .from('tryout_section_sessions')
        .insert({
            session_id: sessionId,
            section_id: sectionId,
            start_time: startTime.toISOString(),
            expires_at: expiresAt.toISOString()
        })
        .select()
        .single();
    if (error) throw error;
    return data;
};

// 3. GET SOAL PELAJARAN (TANPA KUNCI JAWABAN BIAR GAK DI-INSPECT ELEMENT)
export const getQuestions = async (sectionId) => {
    const { data, error } = await supabaseSecret
        .from('tryout_questions')
        .select('id, question_text, option_a, option_b, option_c, option_d, option_e') // CORRECT_OPTION JANGAN DISELECT!
        .eq('section_id', sectionId);
    if (error) throw error;
    return data;
};

// 4. SUBMIT JAWABAN & ANTI-CHEAT LOGIC
export const submitSection = async (sectionSessionId, answers) => {
    // 1. Get Session Data & Validate Time
    const { data: session } = await supabaseSecret.from('tryout_section_sessions').select('*').eq('id', sectionSessionId).single();
    if (!session || session.is_completed) throw new Error("Sesi tidak valid atau sudah disubmit");

    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    const maxAllowedTime = new Date(expiresAt.getTime() + GRACE_PERIOD_MS);

    // ANTI-CHEAT CHECK
    if (now > maxAllowedTime) {
        // Otomatis lock tabel, user di-kick dari pengerjaan ini
        await supabaseSecret.from('tryout_section_sessions').update({ is_completed: true, end_time: expiresAt.toISOString() }).eq('id', sectionSessionId);
        throw new Error("Waktu habis! Keterlambatan melebihi batas toleransi server.");
    }

    // 2. Ambil Kunci Jawaban
    const { data: questions } = await supabaseSecret.from('tryout_questions').select('id, correct_option').eq('section_id', session.section_id);
    
    let correctCount = 0;
    let wrongCount = 0;
    const answerInserts = [];

    // 3. Cocokkan Jawaban
    questions.forEach(q => {
        const userAnswer = answers[q.id];
        if (userAnswer) {
            const isCorrect = userAnswer === q.correct_option;
            if (isCorrect) correctCount++; else wrongCount++;
            
            answerInserts.push({
                section_session_id: sectionSessionId,
                question_id: q.id,
                selected_option: userAnswer,
                is_correct: isCorrect
            });
        }
    });

    // 4. Save to DB
    if (answerInserts.length > 0) {
        await supabaseSecret.from('tryout_answers').insert(answerInserts);
    }

    // Mark Section as Completed
    await supabaseSecret.from('tryout_section_sessions').update({
        is_completed: true,
        end_time: now.toISOString(),
        correct_count: correctCount,
        wrong_count: wrongCount
    }).eq('id', sectionSessionId);

    return { success: true, correctCount, wrongCount };
};

// 5. FINISH TRYOUT & CALCULATE SCORE
export const finishTryout = async (userId, sessionId) => {
    // Ambil semua hasil section
    const { data: sections } = await supabaseSecret.from('tryout_section_sessions')
        .select(`correct_count, tryout_sections(title)`)
        .eq('session_id', sessionId);

    let totalScore = 0;
    let sectionScores = {};

    // Logic Hitung UTBK (Sementara kita pake Weighted sederhana, misal 1 soal = 20 poin IRT dasar)
    // Aslinya UTBK pakai IRT kompleks, tapi buat MVP ini cukup.
    sections.forEach(sec => {
        const title = sec.tryout_sections.title;
        // Rumus dummy: 1 Benar dapet IRT Score rata-rata 25
        const score = sec.correct_count * 25; 
        sectionScores[title] = score;
        totalScore += score;
    });

    const finalAvgScore = sections.length > 0 ? (totalScore / sections.length) : 0;

    // Save Result
    const { data: tryoutObj } = await supabaseSecret.from('tryout_sessions').select('tryout_id').eq('id', sessionId).single();

    const { data: result } = await supabaseSecret.from('tryout_results').insert({
        session_id: sessionId,
        user_id: userId,
        tryout_id: tryoutObj.tryout_id,
        total_score: finalAvgScore,
        section_scores: sectionScores
    }).select().single();

    // Tutup Master Session
    await supabaseSecret.from('tryout_sessions').update({ is_completed: true }).eq('id', sessionId);

    return result;
};