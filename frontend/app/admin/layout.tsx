'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, FileText, Video, LogOut, Globe, Loader2, ShieldAlert } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // State untuk Authorization
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  // Menu Dashboard dihapus, sisa 3 fitur utama
  const menuItems = [
    { name: 'E-Learning', path: '/admin/e-learning', icon: BookOpen },
    { name: 'Tryout SNBT', path: '/admin/tryout', icon: FileText },
    { name: 'Live Class', path: '/admin/live-class', icon: Video },
  ]

  // Cek apakah user adalah Admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
        const json = await res.json()
        
        if (json.user && json.user.role === 'admin') {
          setIsAuthorized(true) // Lolos
        } else {
          setIsAuthorized(false) // Ditolak
        }
      } catch (e) {
        console.error("Gagal verifikasi admin:", e)
        setIsAuthorized(false)
      }
    }
    
    checkAdminAccess()
  }, [])

  // Fungsi untuk handle logout
  const handleLogout = async () => {
      try {
          await fetch('http://localhost:5000/api/auth/logout', { 
              method: 'POST', 
              credentials: 'include' 
          })
          
          router.push('/login')
          router.refresh()
      } catch (e) { 
          console.error("Gagal logout:", e) 
      }
  }

  // 1. Tampilan saat masih mengecek status (Loading)
  if (isAuthorized === null) {
      return (
          <div className="min-h-screen bg-[#0F172A] flex justify-center items-center flex-col gap-4">
              <Loader2 className="animate-spin text-[#5CD2DD] w-12 h-12" />
              <p className="text-[#5CD2DD] font-mono text-sm">Memverifikasi otorisasi admin...</p>
          </div>
      )
  }

  // 2. Tampilan jika BUKAN Admin (Unauthorized)
  if (isAuthorized === false) {
      return (
          <div className="min-h-screen bg-[#0F172A] flex justify-center items-center flex-col text-white px-4 text-center">
              <ShieldAlert size={80} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              <h1 className="text-4xl font-bold mb-3">401 Unauthorized</h1>
              <p className="text-gray-400 mb-8 max-w-md">
                  Akses ditolak. Anda tidak memiliki izin untuk masuk ke area Admin Workspace.
              </p>
              <Link href="/">
                  <button className="px-8 py-3 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] transition-colors shadow-lg shadow-[#5CD2DD]/20">
                      Kembali ke Beranda
                  </button>
              </Link>
          </div>
      )
  }

  // 3. Tampilan jika lolos otorisasi Admin (Render Layout Normal)
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] border-r border-white/5 flex flex-col hidden md:flex fixed h-full">
        <div className="p-6 border-b border-white/5">
            <Link href="/" className="block">
                <Image src="/lernin.png" width={100} height={40} alt="Lernin logo" priority />
            </Link>
            <p className="text-[10px] text-[#5CD2DD] font-mono mt-1 uppercase tracking-wider">Admin Workspace</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)
                const Icon = item.icon
                return (
                    <Link key={item.path} href={item.path}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                            ${isActive ? 'bg-[#5CD2DD]/10 text-[#5CD2DD] border border-[#5CD2DD]/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                        `}>
                            <Icon size={18} />
                            {item.name}
                        </div>
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
            <Link href="/">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium text-sm">
                    <Globe size={18} /> Lihat Website
                </div>
            </Link>
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all font-medium text-sm cursor-pointer"
            >
                <LogOut size={18} /> Logout Admin
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-0 md:ml-64 bg-[#0F172A] min-h-screen">
          {children}
      </main>
    </div>
  )
}