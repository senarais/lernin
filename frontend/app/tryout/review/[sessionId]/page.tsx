'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, LayoutGrid, ArrowLeft, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

export default function TryoutReview() {
  const { sessionId } = useParams()
  const router = useRouter()
  
  const [data, setData] = useState<any>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tryout/review/${sessionId}`, { credentials: 'include' })
        const json = await res.json()
        if (json.success) setData(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchReview()
  }, [sessionId])

  if (loading) return <div className="min-h-screen bg-bg text-white flex justify-center items-center"><div className="animate-spin w-10 h-10 border-4 border-[#5CD2DD] border-t-transparent rounded-full"></div></div>
  if (!data || !data.sections || data.sections.length === 0) return <div className="min-h-screen bg-bg text-white flex items-center justify-center">Data pembahasan tidak ditemukan.</div>

  const currentSection = data.sections[currentSectionIndex]
  const question = currentSection.questions[currentQuestionIndex]
  const options = ['a', 'b', 'c', 'd', 'e']

  // Handle ganti pelajaran, reset nomor soal ke 1
  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentSectionIndex(Number(e.target.value))
      setCurrentQuestionIndex(0)
  }

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col font-sans">
      {/* HEADER REVIEW */}
      <header className="bg-[#1E293B] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
              <Link href="/">
                <Image src="/lernin.png" width={80} height={34} alt="Lernin logo" priority />
              </Link>
              <div className="w-px h-4 bg-white/20 mx-2" />
              <span className="text-gray-400 font-medium text-xs tracking-widest uppercase">Pembahasan</span>
          </div>
          <button onClick={() => router.push(`/tryout/result/${sessionId}`)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
              <ArrowLeft size={18} /> Kembali ke Hasil
          </button>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 h-full">
          
          {/* AREA SOAL & PEMBAHASAN (KIRI) */}
          <div className="flex-1 bg-[#1E293B] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Soal No. {currentQuestionIndex + 1}</h2>
                  <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-sm text-[#5CD2DD]">
                      {currentSection.title}
                  </div>
              </div>
              
              <p className="text-lg text-gray-200 leading-relaxed mb-8">{question.question_text}</p>
              
              <div className="space-y-4">
                  {options.map((opt) => {
                      const optText = question[`option_${opt}`]
                      if (!optText) return null 

                      const isUserAnswer = question.user_answer === opt.toUpperCase()
                      const isCorrectAnswer = question.correct_option === opt.toUpperCase()
                      
                      // LOGIC WARNA PEMBAHASAN
                      let styling = "border-white/10 bg-white/5 opacity-50" // Default (bukan jawaban)
                      let icon = null

                      if (isCorrectAnswer) {
                          styling = "border-[#25D366] bg-[#25D366]/10 shadow-[0_0_15px_rgba(37,211,102,0.15)] ring-1 ring-[#25D366]" // Hijau Terang
                          icon = <CheckCircle size={20} className="text-[#25D366] shrink-0" />
                      } else if (isUserAnswer && !isCorrectAnswer) {
                          styling = "border-red-500 bg-red-500/10" // Merah (Jawaban user salah)
                          icon = <XCircle size={20} className="text-red-500 shrink-0" />
                      }

                      return (
                          <div key={opt} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${styling}`}>
                              <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                  ${isCorrectAnswer ? 'bg-[#25D366] text-slate-900' : isUserAnswer ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                  {opt.toUpperCase()}
                              </div>
                              <span className={`leading-relaxed font-medium flex-1 ${isCorrectAnswer ? 'text-white' : 'text-gray-300'}`}>
                                  {optText}
                              </span>
                              {icon}
                          </div>
                      )
                  })}
              </div>

              {/* KOTAK PEMBAHASAN */}
              <div className="mt-8 p-6 bg-[#5CD2DD]/10 border border-[#5CD2DD]/30 rounded-2xl relative">
                  <div className="flex items-center gap-2 text-[#5CD2DD] font-bold mb-3">
                      <BookOpen size={20} /> Pembahasan:
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                      {question.explanation || "Pembahasan belum tersedia untuk soal ini."}
                  </p>
              </div>

              <div className="flex-1" />

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                  <button 
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                      <ChevronLeft size={18} /> Sebelumnya
                  </button>
                  <button 
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(currentSection.questions.length - 1, prev + 1))}
                      disabled={currentQuestionIndex === currentSection.questions.length - 1}
                      className="px-6 py-3 rounded-xl bg-[#1E293B] border border-[#5CD2DD] text-[#5CD2DD] hover:bg-[#5CD2DD] hover:text-slate-900 font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
                  >
                      Selanjutnya <ChevronRight size={18} />
                  </button>
              </div>
          </div>

          {/* AREA NAVIGASI KANAN (DENGAN DROPDOWN MAPEL) */}
          <div className="w-full md:w-80 bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl h-fit">
              <div className="flex items-center gap-2 mb-4 text-gray-300 font-bold">
                  <LayoutGrid size={20} className="text-[#5CD2DD]" /> Pindah Pelajaran
              </div>
              
              <select 
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-[#5CD2DD] mb-8"
                  value={currentSectionIndex}
                  onChange={handleSectionChange}
              >
                  {data.sections.map((sec: any, idx: number) => (
                      <option key={sec.section_id} value={idx}>{sec.title}</option>
                  ))}
              </select>

              <div className="grid grid-cols-5 gap-3">
                  {currentSection.questions.map((q: any, idx: number) => {
                      const isActive = currentQuestionIndex === idx
                      
                      // LOGIC WARNA NAVIGASI KANAN
                      let btnStyling = "bg-white/5 border border-white/10 text-gray-400" // Kosong
                      if (q.user_answer) {
                          btnStyling = q.is_correct 
                              ? "bg-[#25D366] text-slate-900 border-[#25D366]" // Bener (Hijau)
                              : "bg-red-500 text-white border-red-500" // Salah (Merah)
                      }
                      
                      return (
                          <button
                              key={q.id}
                              onClick={() => setCurrentQuestionIndex(idx)}
                              className={`h-12 w-full rounded-lg font-bold text-sm transition-all flex items-center justify-center
                                  ${btnStyling}
                                  ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1E293B]' : 'hover:opacity-80'}
                              `}
                          >
                              {idx + 1}
                          </button>
                      )
                  })}
              </div>
              
              <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#25D366] rounded-sm"></div> Benar</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Salah</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 border border-gray-500 rounded-sm"></div> Kosong</div>
              </div>
          </div>
      </main>
    </div>
  )
}