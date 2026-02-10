'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import Navbar from '@/app/components/Navbar' // Import Navbar kamu
import LiveClassCard from '@/app/components/LiveClassCard'
import Script from 'next/script' // Buat Midtrans

// Type for global window snap
declare global { interface Window { snap: any; } }

export default function LiveClassCatalog() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch Data Catalog
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/live-class/catalog', { credentials: 'include' })
        const json = await res.json()
        if (json.success) setClasses(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-bg text-white overflow-x-hidden font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          
          {/* --- HEADER SECTION (Breadcrumb & Filter) --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            
            {/* Breadcrumb Fungsional */}
            <div className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
                <ChevronRight size={14} className="text-gray-600" />
                <span className="text-[#F2C94C] font-medium">Live Class</span>
            </div>

            {/* Filter Dropdown (Sesuai Gambar) */}
            <div className="relative group">
                <button className="flex items-center gap-2 bg-[#1E293B] px-4 py-2 rounded-lg text-sm font-medium border border-white/10 hover:border-[#5CD2DD]/50 transition-colors">
                    <span>Terbaru</span>
                    <ChevronDown size={16} />
                </button>
                {/* Dummy Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-32 bg-[#1E293B] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="px-4 py-2 text-sm hover:text-[#5CD2DD] cursor-pointer">Terbaru</div>
                    <div className="px-4 py-2 text-sm hover:text-[#5CD2DD] cursor-pointer">Termurah</div>
                    <div className="px-4 py-2 text-sm hover:text-[#5CD2DD] cursor-pointer">Terpopuler</div>
                </div>
            </div>
          </div>

          {/* --- GRID CONTENT --- */}
          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-10 h-10 text-[#5CD2DD]" />
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((cls) => (
                    <LiveClassCard key={cls.id} data={cls} />
                ))}
             </div>
          )}

          {/* --- PAGINATION SECTION (Sesuai Gambar) --- */}
          {!loading && classes.length > 0 && (
              <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-8">
                  <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-lg bg-[#1E293B] flex items-center justify-center text-gray-400 hover:text-white border border-white/5 hover:border-[#5CD2DD] transition-all">
                          <ChevronRight className="rotate-180" size={16} />
                      </button>
                      
                      {/* Active Page (Cyan) */}
                      <button className="w-10 h-10 rounded-lg bg-[#5CD2DD] text-slate-900 font-bold flex items-center justify-center">
                          1
                      </button>
                      
                      <button className="w-10 h-10 rounded-lg bg-[#1E293B] text-gray-400 font-medium flex items-center justify-center border border-white/5 hover:border-[#5CD2DD] transition-all">
                          2
                      </button>
                      <button className="w-10 h-10 rounded-lg bg-[#1E293B] text-gray-400 font-medium flex items-center justify-center border border-white/5 hover:border-[#5CD2DD] transition-all">
                          3
                      </button>
                      <div className="w-10 h-10 flex items-center justify-center text-gray-600">...</div>
                      <button className="w-10 h-10 rounded-lg bg-[#1E293B] text-gray-400 font-medium flex items-center justify-center border border-white/5 hover:border-[#5CD2DD] transition-all">
                          10
                      </button>

                      <button className="w-10 h-10 rounded-lg bg-[#1E293B] flex items-center justify-center text-gray-400 hover:text-white border border-white/5 hover:border-[#5CD2DD] transition-all">
                          <ChevronRight size={16} />
                      </button>
                  </div>

                  <p className="text-sm text-gray-500">Showing 1-6 of {classes.length} projects</p>
              </div>
          )}

        </main>
      </div>
    </>
  )
}