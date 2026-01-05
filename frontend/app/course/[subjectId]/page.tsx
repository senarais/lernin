'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Module = {
  id: string
  title: string
  is_completed: boolean
}

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    const fetchModules = async () => {
      const res = await fetch(
        `http://localhost:5000/api/courses/subjects/${subjectId}/modules`,
        { credentials: 'include' }
      )
      const json = await res.json()
      setModules(json.data)
    }

    fetchModules()
  }, [subjectId])

  return (
    <div>
      <h1>Daftar Materi</h1>

      {modules.map(module => (
        <div key={module.id} style={{ marginBottom: 16 }}>
          <h3>{module.title}</h3>
          <p>Status: {module.is_completed ? 'Selesai' : 'Belum'}</p>

          <Link href={`/course/module/${module.id}`}>
            <button>Masuk Materi</button>
          </Link>
        </div>
      ))}
    </div>
  )
}
