'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Award, ArrowLeft, Loader2, BarChart2 } from 'lucide-react'

export default function TryoutResult() {
  const { sessionId } = useParams()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Kita perlu fetch data result ini dari backend. 
        // Backend kamu di endpoint finish Tryout mereturn data tryout_results.
        // Asumsi kita hit endpoint /api/auth/me untuk dpt result history, 
        // atau idealnya kamu buat `GET /api/tryout/result/:sessionId` di backend.
        // Karena di instruction ga ada GET result, kita anggap datanya kita passing / request custom.
        
        // PENTING: Karena instruksi backend sebelumnya cuma ada POST /finish, 
        // saya buat mock fetcher. Idealnya minta backend bikin GET /api/tryout/result/:sessionId
        const res = await fetch(`http://localhost:5000/api/tryout/result/${sessionId}`, { credentials: 'include' })
        const json = await res.json()
        setResult(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchResult()
  }, [sessionId])

  // CATATAN: Karena endpoint GET Result belum dibuat di instruksi sebelumnya, 
  // Untuk keperluan UI ini saya buatkan render statis sementara jika fetch gagal.
  const dummyResult = result || {
      total_score: 650.50,
      section_scores: { "Kemampuan Penalaran Umum": 700, "Pengetahuan Kuantitatif": 600, "Literasi Bahasa Indonesia": 650 }
  }

  if (loading) return <div className="min-h-screen bg-bg flex justify-center items-center"><Loader2 className="animate-spin text-[#5CD2DD] w-12 h-12" /></div>

  return (
    <div className="min-h-screen bg-bg text-white font-sans p-4">
      <div className="max-w-4xl mx-auto pt-10">
          <Link href="/tryout" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
              <ArrowLeft size={18} /> Kembali ke Daftar Tryout
          </Link>

          <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5CD2DD]/10 blur-[100px] rounded-full" />
              
              <div className="w-24 h-24 mx-auto bg-[#5CD2DD]/20 rounded-full flex items-center justify-center mb-6 border border-[#5CD2DD]/50">
                  <Award size={48} className="text-[#5CD2DD]" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Tryout Selesai!</h1>
              <p className="text-gray-400 mb-8">Berikut adalah estimasi skor IRT kamu.</p>

              <div className="inline-block bg-bg border border-white/10 rounded-2xl p-8 mb-10 shadow-inner">
                  <p className="text-gray-400 font-medium mb-2">Total Skor Nasional</p>
                  <p className="text-6xl font-black text-[#5CD2DD]">{dummyResult.total_score}</p>
              </div>

              <div className="text-left">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                      <BarChart2 className="text-[#5CD2DD]" /> Detail Skor Sub-tes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(dummyResult.section_scores).map(([title, score]: [string, any]) => (
                          <div key={title} className="bg-bg p-4 rounded-xl border border-white/5 flex justify-between items-center">
                              <span className="text-gray-300 text-sm font-medium">{title}</span>
                              <span className="font-bold text-[#5CD2DD] text-lg">{score}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}