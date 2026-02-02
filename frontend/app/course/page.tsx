'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react'

type Course = {
  id: string
  slug: string
  title: string
}

export default function CourseSelectionPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
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

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-white">
      <Loader2 className="animate-spin w-10 h-10 text-third" />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg text-white py-12 px-4 flex flex-col items-center">
      {/* Background Blobs (Optional - biar mirip Home) */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-third/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl w-full z-10">
        <h1 className="text-4xl font-semibold mb-4 text-center">
          Mau belajar <span className="text-secondary">apa hari ini?</span>
        </h1>
        <p className="text-xl font-extralight text-gray-300 mb-12 text-center">
          Pilih program belajar yang sesuai dengan jenjangmu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/course/${course.slug}`}>
              <div className="group bg-[#5B5B5B]/20 border border-white/10 rounded-3xl p-8 hover:bg-[#5B5B5B]/40 transition-all cursor-pointer h-full flex flex-col justify-between backdrop-blur-sm">
                <div>
                  <div className="w-14 h-14 bg-white/10 text-third rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 font-extralight text-sm">
                    Akses materi lengkap dan latihan soal untuk {course.title}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center text-secondary font-medium text-sm group-hover:translate-x-2 transition-transform">
                  Pilih Mapel <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}