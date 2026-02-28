'use client'

import Link from 'next/link'
import { BookOpen, FileText, Video, ArrowRight, LayoutDashboard } from 'lucide-react'

export default function AdminDashboard() {
  const modules = [
    {
      title: 'E-Learning',
      description: 'Kelola Program, Mata Pelajaran, Video Materi, dan Kuis interaktif untuk siswa.',
      icon: BookOpen,
      path: '/admin/e-learning',
      color: 'from-blue-500/20 to-[#5CD2DD]/20',
      border: 'hover:border-blue-400/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(92,210,221,0.2)]'
    },
    {
      title: 'Tryout SNBT',
      description: 'Atur master simulasi CBT, manajemen Sub-tes, Bank Soal, dan kunci pembahasan.',
      icon: FileText,
      path: '/admin/tryout',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'hover:border-purple-400/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
    },
    {
      title: 'Live Class',
      description: 'Buat jadwal kelas, tetapkan harga tiket, instruktur, dan tautan Zoom/WhatsApp.',
      icon: Video,
      path: '/admin/live-class',
      color: 'from-orange-500/20 to-yellow-500/20',
      border: 'hover:border-orange-400/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]'
    }
  ]

  return (
    <div className="p-8 md:p-12 h-full flex flex-col font-sans text-white min-h-screen relative overflow-hidden">
      
      {/* Background Ornament */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5CD2DD]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-4">
          <LayoutDashboard size={14} className="text-[#5CD2DD]" />
          Admin Workspace
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Selamat Datang, <span className="text-[#5CD2DD]">Admin!</span> 👋
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          Pusat kendali utama aplikasi Lernin. Pilih modul di bawah ini untuk mulai mengelola konten, jadwal, dan operasional platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {modules.map((mod, idx) => {
          const Icon = mod.icon
          return (
            <Link key={idx} href={mod.path} className="block h-full">
              <div className={`group bg-[#1E293B] border border-white/5 rounded-3xl p-8 h-full flex flex-col transition-all duration-300 cursor-pointer overflow-hidden relative ${mod.border} ${mod.glow}`}>
                
                {/* Gradient Background Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon size={28} className="text-white group-hover:text-[#5CD2DD] transition-colors" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">{mod.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-auto relative z-10">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500 group-hover:text-[#5CD2DD] transition-colors">
                    Kelola Sekarang <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats / Info Footer (Opsional, buat menuhin ruang biar proporsional) */}
      <div className="mt-auto pt-16 relative z-10">
        <div className="bg-[#1E293B]/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Sistem berjalan normal. Pastikan semua data disimpan sebelum keluar.
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Lernin System v1.0.0
          </div>
        </div>
      </div>

    </div>
  )
}