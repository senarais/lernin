'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, PlayCircle, CheckCircle, Loader2 } from 'lucide-react'
import Navbar from '@/app/components/Navbar'

export default function TryoutLobby() {
  const { tryoutId } = useParams()
  const router = useRouter()
  
  const [tryout, setTryout] = useState<any>(null)
  const [session, setSession] = useState<any>(null) 
  const [completedSections, setCompletedSections] = useState<string[]>([]) 
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const fetchTryout = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tryout/list', { credentials: 'include' })
        const json = await res.json()
        const found = json.data.find((t: any) => t.id === tryoutId)
        if(found) found.tryout_sections.sort((a:any, b:any) => a.order_index - b.order_index)
        setTryout(found)

        const localSession = localStorage.getItem(`to_session_${tryoutId}`)
        if (localSession) {
            const parsed = JSON.parse(localSession)
            setSession(parsed.session)
            setCompletedSections(parsed.completedSections || [])
        }
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchTryout()
  }, [tryoutId])

  const handleStartMaster = async () => {
    setStarting(true)
    try {
        const res = await fetch('http://localhost:5000/api/tryout/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tryoutId }),
            credentials: 'include'
        })
        const json = await res.json()
        if (json.success) {
            setSession(json.session)
            localStorage.setItem(`to_session_${tryoutId}`, JSON.stringify({
                session: json.session,
                completedSections: []
            }))
        }
    } catch (e) { console.error(e) } finally { setStarting(false) }
  }

  const handleStartSection = async (sectionId: string) => {
    try {
        const res = await fetch('http://localhost:5000/api/tryout/section/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: session.id, sectionId }),
            credentials: 'include'
        })
        const json = await res.json()
        if (json.success) {
            // FIX BUG DISINI: Tambahin sectionId eksplisit ke local storage
            localStorage.setItem(`cbt_engine_${json.session.id}`, JSON.stringify({
                tryoutId: tryoutId,
                sectionId: sectionId, // <--- INI PENYELAMATNYA
                sectionSessionId: json.session.id,
                expiresAt: json.session.expires_at,
                questions: json.questions,
                answers: {} 
            }))
            router.push(`/tryout/engine/${json.session.id}`)
        }
    } catch (e) { console.error(e) }
  }

  const handleFinishTryout = async () => {
      if(!confirm("Yakin ingin mengakhiri seluruh tryout?")) return;
      try {
          const res = await fetch(`http://localhost:5000/api/tryout/${session.id}/finish`, {
              method: 'POST', credentials: 'include'
          })
          const json = await res.json()
          if(json.success) {
              localStorage.removeItem(`to_session_${tryoutId}`) 
              router.push(`/tryout/result/${session.id}`)
          }
      } catch (e) { console.error(e) }
  }

  if (loading) return <div className="min-h-screen bg-bg flex justify-center items-center"><Loader2 className="animate-spin text-[#5CD2DD] w-12 h-12" /></div>
  if (!tryout) return <div className="min-h-screen bg-bg text-white text-center pt-20">Tryout tidak ditemukan.</div>

  const currentSectionIndex = tryout.tryout_sections.findIndex((sec: any) => !completedSections.includes(sec.id))
  const isAllCompleted = completedSections.length === tryout.tryout_sections.length

  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{tryout.title}</h1>
        <p className="text-gray-400 mb-10">{tryout.description}</p>

        {!session ? (
            <div className="bg-[#1E293B] p-8 rounded-3xl text-center border border-white/5">
                <h2 className="text-xl font-bold mb-4">Siap untuk memulai?</h2>
                <p className="text-gray-400 mb-8">Pastikan koneksi internet stabil. Waktu akan terus berjalan setelah kamu memulai setiap sub-tes.</p>
                <button onClick={handleStartMaster} disabled={starting} className="px-8 py-3 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] transition-all">
                    {starting ? 'Memulai...' : 'Mulai Tryout Sekarang'}
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Daftar Sub-tes</h3>
                {tryout.tryout_sections.map((sec: any, idx: number) => {
                    const isCompleted = completedSections.includes(sec.id)
                    const isLocked = idx > currentSectionIndex
                    const isCurrent = idx === currentSectionIndex

                    return (
                        <div key={sec.id} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                            isCurrent ? 'bg-[#1E293B] border-[#5CD2DD] shadow-[0_0_15px_rgba(92,210,221,0.1)]' : 
                            isCompleted ? 'bg-[#1E293B]/50 border-white/5' : 'bg-transparent border-white/5 opacity-50'
                        }`}>
                            <div>
                                <h4 className={`font-bold text-lg ${isCompleted ? 'text-gray-400' : 'text-white'}`}>{sec.title}</h4>
                                <p className="text-sm text-gray-500">{sec.duration_minutes} Menit</p>
                            </div>

                            {isCompleted && <div className="text-green-400 flex items-center gap-2"><CheckCircle size={20}/> Selesai</div>}
                            {isLocked && !isCompleted && <div className="text-gray-500 text-sm">Terkunci</div>}
                            {isCurrent && (
                                <button onClick={() => handleStartSection(sec.id)} className="px-6 py-2 bg-[#5CD2DD] text-slate-900 font-bold rounded-lg flex items-center gap-2 hover:bg-[#4bc0cb]">
                                    Kerjakan <PlayCircle size={16} />
                                </button>
                            )}
                        </div>
                    )
                })}

                {isAllCompleted && (
                    <div className="mt-10 p-6 bg-[#1E293B] border border-[#5CD2DD] rounded-2xl text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Selamat, kamu telah menyelesaikan semua sub-tes!</h3>
                        <button onClick={handleFinishTryout} className="px-8 py-3 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl">Lihat Hasil & Skor</button>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  )
}