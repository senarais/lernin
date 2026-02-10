'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, Loader2, Info } from 'lucide-react'
import Navbar from '@/app/components/Navbar'
import LiveClassCard from '@/app/components/LiveClassCard'

export default function MyLiveClassPage() {
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hit API my-classes yang udah kita buat di backend
        // Backend akan otomatis cek apakah user PRO atau punya record di user_live_classes
        const res = await fetch('http://localhost:5000/api/live-class/my-classes', { 
          credentials: 'include' 
        })
        const json = await res.json()
        
        if (json.success) {
            // Kita map is_accessible jadi true karena ini halaman 'My Class'
            const mapped = json.data.map((c: any) => ({ ...c, is_accessible: true }))
            setMyClasses(mapped)
        }
      } catch (e) { 
        console.error("Error fetching my classes:", e) 
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* --- Breadcrumb Fungsional --- */}
        <div className="flex items-center gap-2 text-sm mb-10">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} className="text-gray-600" />
            <Link href="/live-class" className="text-gray-400 hover:text-white transition-colors">Live Class</Link>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-[#F2C94C] font-medium">My Class</span>
        </div>

        {/* --- Section Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-[#5CD2DD]/10 rounded-2xl text-[#5CD2DD] shadow-[0_0_20px_rgba(92,210,221,0.1)]">
                    <BookOpen size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Kelas <span className="text-[#5CD2DD]">Saya</span></h1>
                    <p className="text-gray-400 mt-2 font-light">Kelola dan akses semua bimbingan live yang kamu miliki.</p>
                </div>
            </div>

            {/* Info Badge buat user PRO */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-gray-400">
                <Info size={14} />
                <span>Materi diperbarui secara berkala</span>
            </div>
        </div>

        {/* --- Content Grid --- */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin w-12 h-12 text-[#5CD2DD] mb-4" />
                <p className="text-gray-500 animate-pulse">Menyiapkan kelas kamu...</p>
             </div>
        ) : myClasses.length === 0 ? (
            /* --- Empty State --- */
            <div className="flex flex-col items-center justify-center py-24 bg-[#1E293B]/30 rounded-[2.5rem] border border-dashed border-white/10">
                <div className="w-48 h-48 bg-[#1E293B] rounded-full flex items-center justify-center mb-8">
                    <img src="/landing/ipa.svg" alt="Empty" className="w-24 opacity-20 grayscale" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300">Belum ada kelas yang diikuti</h3>
                <p className="text-gray-500 mb-10 text-center max-w-sm">
                    Kamu belum membeli kelas satuan atau belum berlangganan paket PRO.
                </p>
                <Link href="/live-class">
                    <button className="px-8 py-4 bg-[#5CD2DD] text-slate-900 font-extrabold rounded-2xl hover:bg-[#4bc0cb] hover:scale-105 transition-all shadow-lg shadow-[#5CD2DD]/20">
                        Eksplor Live Class
                    </button>
                </Link>
            </div>
        ) : (
             /* --- List Grid (Sesuai styling Live Class sebelumnya) --- */
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {myClasses.map((cls) => (
                    <LiveClassCard key={cls.id} data={cls} isMyClassPage={true} />
                ))}
             </div>
        )}

      </main>
    </div>
  )
}