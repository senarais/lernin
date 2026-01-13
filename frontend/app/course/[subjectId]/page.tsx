// app/course/subject/[subjectId]/page.tsx (Sesuaikan path kamu)
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ModuleItem from '@/app/components/ModuleItem' // Import komponen diatas
import CourseVideoPlayer from '@/app/components/CourseVideoPlayer' // Import komponen diatas

type Module = {
  id: string
  title: string
  is_completed: boolean
}

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [modules, setModules] = useState<Module[]>([])
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/subjects/${subjectId}/modules`,
          { credentials: 'include' }
        )
        const json = await res.json()
        const fetchedModules = json.data

        setModules(fetchedModules)

        // LOGIC DEFAULT VIDEO:
        // Ambil yang pertama (order_index logic diasumsikan sudah sort dari API)
        // Atau kamu bisa tambahkan logic localStorage disini untuk 'last watched'
        if (fetchedModules.length > 0) {
            setActiveModuleId(fetchedModules[0].id)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [subjectId])

  const handleModuleChange = (id: string) => {
    setActiveModuleId(id)
    // Optional: Scroll ke atas agar video terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <div className="p-10 text-center">Loading Course...</div>

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali */}
        <Link href="/course" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black mb-6">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        {/* 1. VIDEO PLAYER SECTION (Selalu sticky di atas atau flow biasa) */}
        <CourseVideoPlayer activeModuleId={activeModuleId} />

        {/* Separator / Judul */}
        <div className="mb-6 mt-10 border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-900">Daftar Materi Pembelajaran</h1>
            <p className="text-slate-500">Silakan pilih modul di bawah untuk memutar video.</p>
        </div>

        {/* 2. MODULE LIST (Accordion Style) */}
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleItem 
                key={module.id} 
                module={module}
                isActive={activeModuleId === module.id}
                onPlayVideo={handleModuleChange}
            />
          ))}
        </div>

      </div>
    </div>
  )
}