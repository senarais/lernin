'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, Loader2 } from 'lucide-react'

type Subject = {
  id: string
  title: string
  description: string
  completed_modules: number
  total_modules: number
  progress_percentage: number
}

export default function SubjectListPage() {
  const { slug } = useParams<{ slug: string }>()
  
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grade, setGrade] = useState<number>(10) 
  const [loading, setLoading] = useState(true)

  const isSchoolMode = slug !== 'utbk'

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      try {
        let url = `http://localhost:5000/api/courses/${slug}/subjects`
        if (isSchoolMode) {
          url += `?grade=${grade}`
        }
        const res = await fetch(url, { credentials: 'include' })
        const json = await res.json()
        setSubjects(json.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [slug, grade, isSchoolMode])

  return (
    <div className="min-h-screen bg-bg text-white py-8 px-4 flex justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <Link href="/course" className="inline-flex items-center gap-2 text-gray-400 hover:text-third mb-8 transition-colors">
          <ArrowLeft size={20} /> Ganti Program
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold capitalize mb-2">
              Materi <span className="text-secondary">{slug?.replace('-', ' ')}</span>
            </h1>
            <p className="text-gray-300 font-extralight">Pilih mata pelajaran untuk mulai belajar.</p>
          </div>

          {/* Tab Kelas Dark Mode */}
          {isSchoolMode && (
            <div className="flex bg-[#5B5B5B]/30 p-1.5 rounded-xl border border-white/5">
              {[10, 11, 12].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    grade === g 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Kelas {g}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List Subjects */}
        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="animate-spin w-8 h-8 text-third" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 bg-[#5B5B5B]/10 rounded-3xl border border-dashed border-white/10 text-gray-400">
            Belum ada materi untuk kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/course/study/${subject.id}`}>
                <div className="bg-[#5B5B5B]/20 p-6 rounded-3xl border border-white/5 hover:border-third/50 hover:bg-[#5B5B5B]/30 transition-all cursor-pointer group backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-xl text-white group-hover:text-third transition-colors">
                      {subject.title}
                    </h3>
                    <span className="text-xs font-medium bg-white/10 text-secondary px-3 py-1 rounded-full border border-white/5">
                      {subject.total_modules} Modul
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 font-extralight line-clamp-2">
                    {subject.description || "Pelajari konsep dasar hingga mahir."}
                  </p>

                  {/* Progress Bar Dark */}
                  <div className="w-full bg-black/40 rounded-full h-2 mb-3">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]" 
                      style={{ width: `${subject.progress_percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{subject.progress_percentage}% Selesai</span>
                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                      Mulai Belajar <PlayCircle size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}