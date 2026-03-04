'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Award, ArrowLeft, Loader2, BarChart2, BookOpen } from 'lucide-react' // Tambah BookOpen
import { API_BASE_URL } from '@/lib/api'

export default function TryoutResult() {
  const { sessionId } = useParams()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tryout/result/${sessionId}`, { credentials: 'include' })
        const json = await res.json()
        
        if (json.success) {
            setResult(json.data)
        } else {
            console.error(json.error)
        }
      } catch (e) { 
        console.error(e) 
      } finally { 
        setLoading(false) 
      }
    }
    
    fetchResult()
  }, [sessionId])

  if (loading) return <div className="min-h-screen bg-bg flex justify-center items-center"><Loader2 className="animate-spin text-[#5CD2DD] w-12 h-12" /></div>

  if (!result) return (
      <div className="min-h-screen bg-bg flex flex-col justify-center items-center text-white">
          <p className="mb-4">Hasil tryout tidak ditemukan.</p>
          <Link href="/tryout" className="px-6 py-2 bg-[#5CD2DD] text-slate-900 font-bold rounded-lg">Kembali ke Daftar</Link>
      </div>
  )

  return (
    <div className="min-h-screen bg-bg text-white font-sans p-4">
      <div className="max-w-4xl mx-auto pt-6 flex flex-col items-center">
          <Link href="/" className="mb-10">
              <Image src="/lernin.png" width={120} height={50} alt="Lernin logo" priority />
          </Link>

          <div className="w-full">
            <Link href="/tryout" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors w-max">
                <ArrowLeft size={18} /> Kembali ke Daftar Tryout
            </Link>
          </div>

          <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
              {/* Efek Cahaya di Background */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5CD2DD]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="w-24 h-24 mx-auto bg-[#5CD2DD]/10 rounded-full flex items-center justify-center mb-6 border border-[#5CD2DD]/30 shadow-[0_0_30px_rgba(92,210,221,0.15)]">
                  <Award size={48} className="text-[#5CD2DD]" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Tryout Selesai!</h1>
              <p className="text-gray-400 mb-8">Berikut adalah estimasi skor IRT kamu.</p>

              {/* Kotak Total Skor */}
              <div className="inline-block bg-bg border border-white/5 rounded-3xl p-8 mb-12 shadow-inner min-w-[250px]">
                  <p className="text-gray-400 font-medium mb-3">Total Skor Nasional</p>
                  <p className="text-6xl font-black text-[#5CD2DD] tracking-tight">
                      {/* Pastikan skor dirender rapi (opsional: toFixed(2) kalau formatnya desimal panjang) */}
                      {Number(result.total_score).toFixed(2)}
                  </p>
              </div>

              <div className="text-left">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                      <BarChart2 className="text-[#5CD2DD]" /> Detail Skor Sub-tes
                  </h3>
                  
                  {/* Grid Skor (Dikasih margin bottom mb-10 biar ada napas sebelum tombol) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      {result.section_scores && Object.entries(result.section_scores).map(([title, score]: [string, any]) => (
                          <div key={title} className="bg-bg p-5 rounded-2xl border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                              <span className="text-gray-300 text-sm font-medium pr-4">{title}</span>
                              <span className="font-bold text-[#5CD2DD] text-xl">{score}</span>
                          </div>
                      ))}
                  </div>

                  {/* Tombol Lihat Pembahasan */}
                  <Link href={`/tryout/review/${sessionId}`} className="block w-full">
                      <button className="w-full py-4 rounded-2xl bg-[#1E293B] border border-[#5CD2DD] text-[#5CD2DD] hover:bg-[#5CD2DD] hover:text-slate-900 font-bold transition-all flex justify-center items-center gap-2">
                          Lihat Pembahasan Lengkap
                      </button>
                  </Link>
              </div>
          </div>
      </div>
    </div>
  )
}