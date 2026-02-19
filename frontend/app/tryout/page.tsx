'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, FileText, Loader2, Clock } from 'lucide-react'
import Navbar from '@/app/components/Navbar'

export default function TryoutCatalog() {
  const [tryouts, setTryouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tryout/list', { credentials: 'include' })
        const json = await res.json()
        if (json.success) setTryouts(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchTryouts()
  }, [])

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-10">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-[#5CD2DD] font-medium">Tryout SNBT</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-8">
            <div className="p-4 bg-[#5CD2DD]/10 rounded-2xl text-[#5CD2DD]">
                <FileText size={40} />
            </div>
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Tryout <span className="text-[#5CD2DD]">UTBK SNBT</span></h1>
                <p className="text-gray-400 mt-2 font-light">Uji kemampuanmu dengan sistem CBT yang dirancang persis seperti aslinya.</p>
            </div>
        </div>

        {/* List Tryout */}
        {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-[#5CD2DD]" /></div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tryouts.map((to) => {
                    // Hitung total durasi dari semua section
                    const totalDuration = to.tryout_sections.reduce((acc: number, curr: any) => acc + curr.duration_minutes, 0)
                    
                    return (
                        <div key={to.id} className="bg-[#1E293B] rounded-3xl p-6 shadow-lg border border-white/5 hover:border-[#5CD2DD]/50 transition-all flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2">{to.title}</h3>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-3">{to.description}</p>
                            
                            <div className="flex flex-col gap-2 mb-8">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <FileText size={16} className="text-[#5CD2DD]" /> {to.tryout_sections.length} Sub-tes
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Clock size={16} className="text-[#5CD2DD]" /> {totalDuration} Menit
                                </div>
                            </div>
                            
                            <div className="flex-1" />
                            <Link href={`/tryout/${to.id}`}>
                                <button className="w-full py-3 rounded-xl bg-[#1E293B] border border-[#5CD2DD] text-[#5CD2DD] hover:bg-[#5CD2DD] hover:text-slate-900 font-bold text-sm transition-all">
                                    Mulai Simulasi
                                </button>
                            </Link>
                        </div>
                    )
                })}
             </div>
        )}
      </main>
    </div>
  )
}