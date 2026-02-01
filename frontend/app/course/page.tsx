'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'

type Course = {
  id: string
  slug: string // 'utbk', 'sma-ipa', 'sma-ips'
  title: string
}

export default function CourseSelectionPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Endpoint baru yang kita buat di backend
        const res = await fetch('http://localhost:5000/api/courses/list', {
          credentials: 'include'
        })
        const json = await res.json()
        setCourses(json.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return <div className="p-10 text-center">Memuat Program Belajar...</div>

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mau belajar apa hari ini?</h1>
        <p className="text-slate-500 mb-8">Pilih program belajar yang sesuai dengan jenjangmu.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/course/${course.slug}`}>
              <div className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                  <p className="text-slate-500 text-sm">
                    Akses materi lengkap untuk {course.title}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                  Pilih Mapel <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}