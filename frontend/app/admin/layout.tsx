'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, FileText, Video, LogOut, Globe } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Menu Dashboard dihapus, sisa 3 fitur utama
  const menuItems = [
    { name: 'E-Learning', path: '/admin/e-learning', icon: BookOpen },
    { name: 'Tryout SNBT', path: '/admin/tryout', icon: FileText },
    { name: 'Live Class', path: '/admin/live-class', icon: Video },
  ]

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] border-r border-white/5 flex flex-col hidden md:flex fixed h-full">
        <div className="p-6 border-b border-white/5">
            <h1 className="text-2xl font-bold text-white italic">Lern<span className="text-[#5CD2DD]">in</span></h1>
            <p className="text-xs text-[#5CD2DD] font-mono mt-1">Admin Workspace</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
                // Biar active state-nya tetep nyala kalau lagi di sub-folder
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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all font-medium text-sm">
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