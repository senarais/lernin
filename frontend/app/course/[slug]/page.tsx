'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle } from 'lucide-react'

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
  // Default kelas 10 kalau bukan UTBK
  const [grade, setGrade] = useState<number>(10) 
  const [loading, setLoading] = useState(true)

  // Cek apakah ini mode sekolah (IPA/IPS) atau UTBK
  const isSchoolMode = slug !== 'utbk'

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      try {
        // Logic URL: Kalo sekolah tambah query ?grade=X
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
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/course" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ArrowLeft size={16} /> Ganti Program
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              Materi {slug?.replace('-', ' ')}
            </h1>
            <p className="text-slate-500">Pilih mata pelajaran untuk mulai belajar.</p>
          </div>

          {/* Tab Kelas (Hanya muncul jika bukan UTBK) */}
          {isSchoolMode && (
            <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              {[10, 11, 12].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    grade === g 
                      ? 'bg-slate-900 text-white shadow' 
                      : 'text-slate-500 hover:bg-slate-50'
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
          <div className="text-center py-10">Mengambil data mapel...</div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
            Belum ada materi untuk kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              // PERHATIKAN LINK INI: Mengarah ke /study/
              <Link key={subject.id} href={`/course/study/${subject.id}`}>
                <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {subject.title}
                    </h3>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {subject.total_modules} Modul
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {subject.description || "Tidak ada deskripsi."}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${subject.progress_percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{subject.progress_percentage}% Selesai</span>
                    <span className="flex items-center gap-1 group-hover:text-blue-600">
                      Mulai Belajar <PlayCircle size={12} />
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