// components/ModuleItem.tsx
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
  isActive: boolean
  onPlayVideo: (id: string) => void
}

export default function ModuleItem({ module, isActive, onPlayVideo }: ModuleItemProps) {
  const answerElRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [answerH, setAnswerH] = useState('0px')

  const handleOpenAnswer = () => {
    const answerElH = answerElRef.current?.childNodes[0] as HTMLElement
    if (answerElH) setAnswerH(`${answerElH.offsetHeight + 20}px`)
    setOpen(!open)
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden transition-all shadow-xl duration-300">
      {/* --- Header Accordion --- */}
      <div
        className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 ${
          isActive ? 'bg-slate-50 border-l-4 border-slate-900' : ''
        }`}
        onClick={handleOpenAnswer}
      >
        <div className="flex items-center gap-3">
            {/* Indikator Status */}
          {module.is_completed ? (
            <CheckCircle className="text-green-500 w-5 h-5" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
          )}
          
          <h4 className={`font-medium text-slate-900 ${isActive ? 'font-bold' : ''}`}>
            {module.title}
          </h4>
        </div>

        <ChevronDown 
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* --- Body Accordion (Dropdown) --- */}
      <div
        ref={answerElRef}
        className="duration-300 ease-in-out transition-all overflow-hidden bg-slate-50"
        style={{ height: open ? answerH : '0px' }}
      >
        <div className="p-4 space-y-2 border-t border-slate-100">
          
          {/* Tombol Nonton Video (State Change) */}
          <button 
            onClick={() => onPlayVideo(module.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-md text-sm transition-colors text-left
                ${isActive ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-200 text-slate-600'}
            `}
          >
            <PlayCircle size={18} />
            <span className="flex-1">Materi Video</span>
            {isActive && <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">Playing</span>}
          </button>

          {/* Tombol Quiz (Link Pindah Halaman) */}
          <Link href={`/course/module/${module.id}/quiz`} className="block">
            <button className="w-full flex items-center gap-3 p-3 rounded-md text-sm text-slate-600 hover:bg-slate-200 text-left transition-colors">
                <HelpCircle size={18} />
                <span>Kuis Latihan</span>
            </button>
          </Link>

        </div>
      </div>
    </div>
  )
}