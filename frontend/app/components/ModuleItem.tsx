'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { PlayCircle, HelpCircle, ChevronDown, CheckCircle, Lock } from 'lucide-react'

type Module = {
  id: string
  title: string
  is_completed: boolean
}

interface ModuleItemProps {
  module: Module
  index: number // Tambah index buat nomor urut
  isActive: boolean
  onPlayVideo: (id: string) => void
}

export default function ModuleItem({ module, index, isActive, onPlayVideo }: ModuleItemProps) {
  const answerElRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [answerH, setAnswerH] = useState('0px')

  const handleOpenAnswer = () => {
    const answerElH = answerElRef.current?.childNodes[0] as HTMLElement
    if (answerElH) setAnswerH(`${answerElH.offsetHeight + 20}px`)
    setOpen(!open)
  }

  // Warna aksen cyan sesuai gambar
  const accentColor = "bg-[#2D9CDB]" 

  return (
    // Card Container - Style mirip gambar (Dark Blue Card)
    <div className={`rounded-xl overflow-hidden transition-all duration-300 border border-white/5 ${
        isActive 
            ? 'bg-[#1E293B] ring-1 ring-[#2D9CDB]' // Active state
            : 'bg-[#1E293B] hover:bg-[#253248]' // Inactive state
    }`}>
      
      {/* --- Header Accordion (Tampilan Utama seperti di Gambar) --- */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer group"
        onClick={handleOpenAnswer}
      >
        <div className="flex items-center gap-5">
          {/* 1. Kotak Nomor (Sesuai Gambar) */}
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-lg
            ${module.is_completed ? 'bg-green-500' : accentColor}
          `}>
             {module.is_completed ? <CheckCircle size={24} /> : index + 1}
          </div>

          {/* 2. Judul & Meta Data */}
          <div className="flex flex-col">
            <h4 className={`text-lg font-bold text-white group-hover:text-[#2D9CDB] transition-colors`}>
              {module.title}
            </h4>
            {/* Dummy metadata biar persis gambar */}
            <p className="text-gray-400 text-sm font-light mt-0.5">
              Video Pembelajaran • 10 Menit
            </p>
          </div>
        </div>

        {/* 3. Chevron Icon */}
        <ChevronDown 
            className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-[#2D9CDB]' : ''}`} 
        />
      </div>

      {/* --- Body Accordion (Isi Dropdown) --- */}
      <div
        ref={answerElRef}
        className="duration-300 ease-in-out transition-all overflow-hidden bg-black/20"
        style={{ height: open ? answerH : '0px' }}
      >
        <div className="p-4 pl-[5.5rem] space-y-2 border-t border-white/5">
          
          {/* Tombol Nonton */}
          <button 
            onClick={() => onPlayVideo(module.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors text-left
                ${isActive 
                    ? 'bg-[#2D9CDB]/10 text-[#2D9CDB]' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'}
            `}
          >
            <PlayCircle size={18} />
            <span className="flex-1 font-medium">Tonton Materi</span>
            {isActive && <span className="text-[10px] font-bold bg-[#2D9CDB] text-white px-2 py-0.5 rounded">PLAYING</span>}
          </button>

          {/* Tombol Quiz */}
          <Link href={`/course/module/${module.id}/quiz`} className="block">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left transition-colors">
                <HelpCircle size={18} />
                <span className="font-medium">Kerjakan Kuis</span>
            </button>
          </Link>

        </div>
      </div>
    </div>
  )
}