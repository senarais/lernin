'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import ModuleItem from '@/app/components/ModuleItem' 
import CourseVideoPlayer from '@/app/components/CourseVideoPlayer' 
import Navbar from '@/app/components/Navbar'

// Tipe Data Frontend
type Module = {
  id: string
  title: string
  is_completed: boolean
}

type SubjectInfo = {
  id: string
  title: string
  grade_level: number | null
  course_slug: string
  course_title: string
}

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const router = useRouter()
  
  // State Data Utama
  const [currentSubject, setCurrentSubject] = useState<SubjectInfo | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  
  // State Navigasi (Pills & Grade)
  const [siblingSubjects, setSiblingSubjects] = useState<SubjectInfo[]>([])
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  
  // State UI
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Buat dropdown kelas

  // 1. FETCH MAIN DATA (Subject + Modules)
  useEffect(() => {
    const fetchMainData = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/subjects/${subjectId}/modules`,
          { credentials: 'include' }
        )
        const json = await res.json()
        
        if (json.success) {
            setCurrentSubject(json.data.subject)
            setModules(json.data.modules)

            // Set default active video (first module)
            if (json.data.modules.length > 0) {
                setActiveModuleId(json.data.modules[0].id)
            }
        }
      } catch (e) {
        console.error("Error fetch main data", e)
      } finally {
        setLoading(false)
      }
    }

    fetchMainData()
  }, [subjectId])

  // 2. FETCH SIBLING SUBJECTS (Buat Pills Navigasi)
  // Jalan cuma kalo currentSubject udah ke-load
  useEffect(() => {
    if (!currentSubject) return

    const fetchSiblings = async () => {
      try {
        // Ambil semua subject dalam course ini (misal semua subject 'sma-ipa')
        // Kita pake endpoint existing: /api/courses/:slug/subjects
        // Kita tambah query ?grade=... kalo dia punya grade
        let url = `http://localhost:5000/api/courses/${currentSubject.course_slug}/subjects`
        
        if (currentSubject.grade_level) {
             url += `?grade=${currentSubject.grade_level}`
        }

        const res = await fetch(url, { credentials: 'include' })
        const json = await res.json()
        
        if (json.success) {
            // Map data biar sesuai format SubjectInfo
            const siblings = json.data.map((s: any) => ({
                id: s.id,
                title: s.title,
                grade_level: s.grade_level,
                course_slug: currentSubject.course_slug,
                course_title: currentSubject.course_title
            }))
            setSiblingSubjects(siblings)
        }
      } catch (e) {
        console.error("Error fetch siblings", e)
      }
    }

    fetchSiblings()
  }, [currentSubject]) // Trigger kalo currentSubject berubah

  // 3. HANDLE GANTI KELAS (Dropdown Logic)
  const handleGradeChange = async (newGrade: number) => {
    if (!currentSubject) return
    setIsDropdownOpen(false)

    // Jangan refresh kalo kelas sama
    if (newGrade === currentSubject.grade_level) return

    // Logic Pindah Kelas:
    // Kita cari subject pertama di kelas tujuan untuk course yang sama
    // Contoh: Lagi di Biologi Kls 10 -> Pindah Kls 11 -> Cari subject apa aja di Kls 11 (misal Fisika Kls 11)
    try {
        const res = await fetch(
            `http://localhost:5000/api/courses/${currentSubject.course_slug}/subjects?grade=${newGrade}`,
            { credentials: 'include' }
        )
        const json = await res.json()
        
        if (json.success && json.data.length > 0) {
            // Redirect ke subject pertama di kelas baru
            router.push(`/course/study/${json.data[0].id}`)
        } else {
            alert("Materi untuk kelas ini belum tersedia.")
        }
    } catch (e) {
        console.error(e)
    }
  }

  // Helper Player
  const handleModuleChange = (id: string) => {
    setActiveModuleId(id)
  }

  if (loading || !currentSubject) return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-10 h-10 text-[#2D9CDB]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        {/* === 1. BREADCRUMB FUNCTIONAL === */}
        <div className="flex items-center gap-2 text-sm mb-8 font-light">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
          <ChevronRight size={14} className="text-gray-600" />
          
          {/* Dynamic Link ke Course Parent (misal ke /course/sma-ipa) */}
          <Link href={`/course/${currentSubject.course_slug}`} className="text-gray-400 hover:text-white transition-colors uppercase">
            {currentSubject.course_title}
          </Link>
          
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-[#F2C94C] font-medium truncate max-w-[200px]">
            {currentSubject.title}
          </span>
        </div>

        {/* === 2. SUBJECT PILLS (FETCHED FROM DB) === */}
        <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {siblingSubjects.map((subject) => {
            const isActive = subject.id === currentSubject.id; 
            return (
              <Link 
                key={subject.id} 
                href={`/course/study/${subject.id}`} // Link beneran pindah page
              >
                <button
                  className={`
                    px-3 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-third text-black shadow-[0_4px_14px_rgba(45,156,219,0.4)]' 
                      : 'bg-[#1E3A5F] text-white hover:bg-[#253248] hover:text-white'}
                  `}
                >
                  {subject.title}
                </button>
              </Link>
            )
          })}
        </div>

        {/* === 3. VIDEO PLAYER === */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
             <CourseVideoPlayer activeModuleId={activeModuleId} />
        </div>

        {/* === 4. CURRICULUM HEADER & GRADE SELECTOR === */}
        <div className="flex items-center justify-between mb-6 relative">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Class Curriculum</h2>
          
          {/* Dropdown Kelas (Hanya muncul jika bukan UTBK / Grade tidak null) */}
          {currentSubject.grade_level && (
            <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-[#2D9CDB] font-medium cursor-pointer hover:text-cyan-300 transition-colors bg-[#1E293B] px-4 py-2 rounded-lg border border-white/5"
                >
                    <span>Kelas {currentSubject.grade_level}</span>
                    <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#1E293B] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                        {[10, 11, 12].map(g => (
                            <div 
                                key={g}
                                onClick={() => handleGradeChange(g)}
                                className={`px-4 py-3 text-sm hover:bg-[#2D9CDB]/10 cursor-pointer transition-colors
                                    ${g === currentSubject.grade_level ? 'text-[#2D9CDB] font-bold' : 'text-gray-400'}
                                `}
                            >
                                Kelas {g}
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}
        </div>

        {/* === 5. MODULE LIST === */}
        <div className="space-y-4">
          {modules.map((module, index) => (
            <ModuleItem 
                key={module.id} 
                index={index}
                module={module}
                isActive={activeModuleId === module.id}
                onPlayVideo={handleModuleChange}
            />
          ))}
          
          {modules.length === 0 && (
             <div className="p-8 text-center text-gray-500 bg-[#1E293B] rounded-xl border border-dashed border-white/10">
                Materi sedang disiapkan.
             </div>
          )}
        </div>

      </main>
    </div>
  )
}