"use client"
import { API_BASE_URL } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, LayoutGrid, CheckCircle, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react'

type Question = {
  id: string
  question: string
  options: string[]
}

type Quiz = {
  id: string
  title: string
  quiz_questions: Question[]
}

type QuizResult = {
  success?: boolean
  message?: string
  score?: number
  correct?: number
  wrong?: number
}

export default function QuizPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const router = useRouter()
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempts, setAttempts] = useState<any[]>([])
  
  // View mode: 'loading' | 'history' | 'playing' | 'result'
  const [view, setView] = useState<'loading' | 'history' | 'playing' | 'result'>('loading')
  
  // CBT Engine State
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // 1. Fetch Quiz Data
        const resQuiz = await fetch(`${API_BASE_URL}/api/courses/modules/${moduleId}/quiz`, { credentials: 'include' })
        const jsonQuiz = await resQuiz.json()
        
        if (jsonQuiz.success && jsonQuiz.data) {
          setQuiz(jsonQuiz.data)
          
          // 2. Fetch Attempts History using Quiz ID
          const resAtt = await fetch(`${API_BASE_URL}/api/courses/quizzes/${jsonQuiz.data.id}/attempts`, { credentials: 'include' })
          const jsonAtt = await resAtt.json()
          
          if (jsonAtt.success && jsonAtt.data.length > 0) {
              setAttempts(jsonAtt.data)
              setView('history') // Tampilkan history kalau udah pernah ngerjain
          } else {
              setView('playing') // Langsung kerjain kalau belum pernah
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchQuizData()
  }, [moduleId])

  const handleAnswer = (qId: string, opt: string) => {
      setAnswers(prev => ({ ...prev, [qId]: opt }))
  }

  const submitQuiz = async () => {
    if (!quiz) return
    if (!confirm("Yakin ingin mengumpulkan kuis ini?")) return;

    setIsSubmitting(true)
    try {
        const res = await fetch(`${API_BASE_URL}/api/courses/quizzes/${quiz.id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ answers })
        })

        const json = await res.json()
        if (json.success) {
            setResult(json.data)
            setView('result')
            // Refresh data untuk halaman sebelumnya supaya checkbox kuis ter-update
            router.refresh()
        } else {
            alert(json.message || "Gagal mengumpulkan kuis. Pastikan kamu sudah menonton videonya terlebih dahulu.")
        }
    } catch (e) {
        alert("Terjadi kesalahan jaringan.")
    } finally {
        setIsSubmitting(false)
    }
  }

  if (view === 'loading' || !quiz) {
      return (
          <div className="min-h-screen bg-bg flex justify-center items-center">
              <Loader2 className="animate-spin text-[#5CD2DD] w-12 h-12" />
          </div>
      )
  }

  // ==========================================
  // VIEW 1: HISTORY (RIWAYAT KUIS)
  // ==========================================
  if (view === 'history') {
      return (
          <div className="min-h-screen bg-bg text-white p-6 md:p-12 flex flex-col items-center font-sans">
              <div className="w-full max-w-3xl">
                  <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
                      <ArrowLeft size={18} /> Kembali ke Materi
                  </button>
                  
                  <div className="bg-[#1E293B] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
                      <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                      <p className="text-gray-400 mb-8">Riwayat pengerjaan evaluasi kuis kamu.</p>
                      
                      <div className="space-y-4 mb-10 max-h-[50vh] overflow-y-auto pr-2">
                          {attempts.map((att, i) => (
                              <div key={att.id} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-[#5CD2DD]/30 transition-colors">
                                  <div>
                                      <p className="font-bold text-[#5CD2DD] text-lg">Percobaan {attempts.length - i}</p>
                                      <p className="text-sm text-gray-400 mt-1">{new Date(att.created_at).toLocaleString('id-ID')}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-3xl font-black text-white">{att.score}</p>
                                      <p className="text-xs text-gray-400 font-medium">Benar: {att.correct_count} | Salah: {att.wrong_count}</p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <button 
                          onClick={() => { setAnswers({}); setCurrentIndex(0); setView('playing'); }} 
                          className="w-full py-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] flex justify-center items-center gap-2 text-lg transition-all"
                      >
                          <RotateCcw size={20} /> Coba Kerjakan Lagi
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // ==========================================
  // VIEW 2: RESULT (HASIL KUIS BARU)
  // ==========================================
  if (view === 'result' && result) {
      return (
          <div className="min-h-screen bg-bg text-white p-6 flex flex-col items-center justify-center font-sans">
              <div className="bg-[#1E293B] p-10 rounded-3xl border border-white/5 shadow-2xl text-center w-full max-w-md">
                  <CheckCircle size={80} className="text-[#25D366] mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-2">Kuis Selesai!</h2>
                  <p className="text-gray-400 mb-8">Hasil evaluasi belajar kamu.</p>
                  
                  <div className="bg-bg border border-white/10 rounded-2xl p-6 mb-8">
                      <p className="text-sm text-gray-400 font-medium mb-1">Skor Akhir</p>
                      <p className="text-6xl font-black text-[#5CD2DD] mb-6">{result.score}</p>
                      
                      <div className="flex justify-between text-sm font-medium">
                          <span className="text-[#25D366]">Benar: {result.correct}</span>
                          <span className="text-red-400">Salah: {result.wrong}</span>
                      </div>
                  </div>

                  <button onClick={() => router.back()} className="w-full py-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] transition-colors">
                      Kembali ke Materi
                  </button>
              </div>
          </div>
      )
  }

  // ==========================================
  // VIEW 3: PLAYING (CBT ENGINE STYLE)
  // ==========================================
  const question = quiz.quiz_questions[currentIndex]

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col font-sans">
      <header className="bg-[#1E293B] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
              <Image src="/lernin.png" width={80} height={34} alt="Lernin logo" priority />
              <div className="w-px h-4 bg-white/20 mx-2" />
              <span className="text-[#5CD2DD] font-medium text-xs tracking-widest uppercase">Quiz Engine</span>
          </div>
          <div>
              <button onClick={submitQuiz} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">
                  {isSubmitting ? 'Mengumpulkan...' : 'Selesai Kuis'}
              </button>
          </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 h-full mt-4">
          
          <div className="flex-1 bg-[#1E293B] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Soal No. {currentIndex + 1}</h2>
              </div>
              
              <p className="text-lg text-gray-200 leading-relaxed mb-8">{question.question}</p>
              
              <div className="space-y-4">
                  {/* Mapping Opsi Array dan mengubah index jadi A, B, C, D */}
                  {question.options.map((opt, idx) => {
                      const isSelected = answers[question.id] === opt
                      const labelChar = String.fromCharCode(65 + idx) // 0 -> A, 1 -> B, dll.
                      
                      return (
                          <label 
                              key={opt} 
                              onClick={() => handleAnswer(question.id, opt)}
                              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-[#5CD2DD] bg-[#5CD2DD]/10' : 'border-white/10 hover:bg-white/5'}`}
                          >
                              <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#5CD2DD] bg-[#5CD2DD]' : 'border-gray-500'}`}>
                                  {isSelected && <div className="w-2 h-2 bg-[#1E293B] rounded-full" />}
                              </div>
                              <span className="text-gray-200 leading-relaxed font-medium">
                                  <span className="font-bold mr-2 uppercase">{labelChar}.</span> {opt}
                              </span>
                          </label>
                      )
                  })}
              </div>

              <div className="flex-1" />

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                  <button 
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                      <ChevronLeft size={18} /> Sebelumnya
                  </button>
                  <button 
                      onClick={() => setCurrentIndex(prev => Math.min(quiz.quiz_questions.length - 1, prev + 1))}
                      disabled={currentIndex === quiz.quiz_questions.length - 1}
                      className="px-6 py-3 rounded-xl bg-[#5CD2DD] text-slate-900 font-bold hover:bg-[#4bc0cb] flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                      Selanjutnya <ChevronRight size={18} />
                  </button>
              </div>
          </div>

          <div className="w-full md:w-80 bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl h-fit">
              <div className="flex items-center gap-2 mb-6 text-gray-300 font-bold">
                  <LayoutGrid size={20} className="text-[#5CD2DD]" /> Navigasi Soal
              </div>
              <div className="grid grid-cols-5 gap-3">
                  {quiz.quiz_questions.map((q, idx) => {
                      const isAnswered = !!answers[q.id]
                      const isActive = currentIndex === idx
                      
                      return (
                          <button
                              key={q.id}
                              onClick={() => setCurrentIndex(idx)}
                              className={`h-12 w-full rounded-lg font-bold text-sm transition-all flex items-center justify-center
                                  ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1E293B]' : ''}
                                  ${isAnswered ? 'bg-[#5CD2DD] text-slate-900' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}
                              `}
                          >
                              {idx + 1}
                          </button>
                      )
                  })}
              </div>
              <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#5CD2DD] rounded-sm"></div> Dijawab</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 border border-gray-500 rounded-sm"></div> Kosong</div>
              </div>
          </div>
      </main>
    </div>
  )
}