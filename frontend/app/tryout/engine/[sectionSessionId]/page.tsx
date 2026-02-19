'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock, ChevronLeft, ChevronRight, LayoutGrid, Check } from 'lucide-react'

export default function CBTEngine() {
  const { sectionSessionId } = useParams()
  const router = useRouter()
  
  const [data, setData] = useState<any>(null) 
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<string>("--:--")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const localData = localStorage.getItem(`cbt_engine_${sectionSessionId}`)
    if (!localData) {
        alert("Sesi tidak valid / sudah disubmit.")
        router.push('/tryout')
        return
    }
    const parsed = JSON.parse(localData)
    setData(parsed)
    setAnswers(parsed.answers || {})
  }, [sectionSessionId, router])

  useEffect(() => {
    if (!data?.expiresAt) return

    const timer = setInterval(() => {
        const now = new Date().getTime()
        const expires = new Date(data.expiresAt).getTime()
        const distance = expires - now

        if (distance <= 0) {
            clearInterval(timer)
            setTimeLeft("00:00")
            handleAutoSubmit() 
        } else {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        }
    }, 1000)

    return () => clearInterval(timer)
  }, [data])

  const handleAnswer = (qId: string, opt: string) => {
      const newAnswers = { ...answers, [qId]: opt.toUpperCase() }
      setAnswers(newAnswers)
      const updatedData = { ...data, answers: newAnswers }
      localStorage.setItem(`cbt_engine_${sectionSessionId}`, JSON.stringify(updatedData))
  }

  const handleSubmit = async (isAuto = false) => {
      if(!isAuto && !confirm("Yakin ingin mengumpulkan sub-tes ini? Anda tidak bisa kembali!")) return;
      
      setIsSubmitting(true)
      try {
          const res = await fetch(`http://localhost:5000/api/tryout/section/${sectionSessionId}/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ answers }),
              credentials: 'include'
          })
          const json = await res.json()
          
          if (json.success || json.error) { 
              const masterStateStr = localStorage.getItem(`to_session_${data.tryoutId}`)
              if (masterStateStr) {
                  const masterState = JSON.parse(masterStateStr)
                  
                  // FIX BUG DISINI: Kita ambil secId dari data lokal, bukan dari questions
                  const secId = data.sectionId
                  
                  // Pastikan gak duplikat
                  if (secId && !masterState.completedSections.includes(secId)) {
                      masterState.completedSections.push(secId)
                  }
                  
                  localStorage.setItem(`to_session_${data.tryoutId}`, JSON.stringify(masterState))
              }
              localStorage.removeItem(`cbt_engine_${sectionSessionId}`)
              router.push(`/tryout/${data.tryoutId}`)
          }
      } catch (e) {
          console.error(e)
          alert("Gagal submit, pastikan internet stabil.")
          setIsSubmitting(false)
      }
  }

  const handleAutoSubmit = () => {
      alert("WAKTU HABIS! Jawaban Anda otomatis dikumpulkan.")
      handleSubmit(true)
  }

  if (!data) return <div className="min-h-screen bg-bg text-white" />

  const question = data.questions[currentIndex]
  const options = ['a', 'b', 'c', 'd', 'e']

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col font-sans">
      <header className="bg-[#1E293B] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="font-bold text-xl italic text-white">Lern<span className="text-[#5CD2DD]">in</span> <span className="text-gray-500 font-normal text-sm ml-2">| CBT Engine</span></div>
          <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg border ${timeLeft.startsWith("00:") || timeLeft.startsWith("01:") || timeLeft.startsWith("02:") ? 'border-red-500 text-red-500 bg-red-500/10 animate-pulse' : 'border-[#5CD2DD] text-[#5CD2DD] bg-[#5CD2DD]/10'}`}>
                  <Clock size={20} /> {timeLeft}
              </div>
              <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">
                  {isSubmitting ? 'Submitting...' : 'Akhiri Sub-tes'}
              </button>
          </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 h-full">
          
          <div className="flex-1 bg-[#1E293B] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Soal No. {currentIndex + 1}</h2>
              </div>
              
              <p className="text-lg text-gray-200 leading-relaxed mb-8">{question.question_text}</p>
              
              <div className="space-y-4">
                  {options.map((opt) => {
                      const optText = question[`option_${opt}`]
                      if (!optText) return null 

                      const isSelected = answers[question.id] === opt.toUpperCase()
                      
                      return (
                          <label 
                              key={opt} 
                              onClick={() => handleAnswer(question.id, opt)} // FIX BUG DISINI: Tambah onClick
                              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-[#5CD2DD] bg-[#5CD2DD]/10' : 'border-white/10 hover:bg-white/5'}`}
                          >
                              <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#5CD2DD] bg-[#5CD2DD]' : 'border-gray-500'}`}>
                                  {isSelected && <div className="w-2 h-2 bg-[#1E293B] rounded-full" />}
                              </div>
                              <span className="text-gray-200 leading-relaxed font-medium">
                                  <span className="font-bold mr-2 uppercase">{opt}.</span> {optText}
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
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                      <ChevronLeft size={18} /> Sebelumnya
                  </button>
                  <button 
                      onClick={() => setCurrentIndex(prev => Math.min(data.questions.length - 1, prev + 1))}
                      disabled={currentIndex === data.questions.length - 1}
                      className="px-6 py-3 rounded-xl bg-[#5CD2DD] text-slate-900 font-bold hover:bg-[#4bc0cb] flex items-center gap-2 disabled:opacity-50"
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
                  {data.questions.map((q: any, idx: number) => {
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