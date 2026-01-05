'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Subject = {
  id: string
  title: string
  total_modules: number
  completed_modules: number
}

export default function CoursePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch(
        'http://localhost:5000/api/courses/subjects',
        { credentials: 'include' }
      )
      const json = await res.json()
      setSubjects(json.data)
    }

    fetchSubjects()
  }, [])

  return (
    <div>
      <h1>UTBK Subjects</h1>

      {subjects.map(subject => (
        <div key={subject.id} style={{ marginBottom: 16 }}>
          <h3>{subject.title}</h3>
          <p>
            Progress: {subject.completed_modules} / {subject.total_modules}
          </p>

          <Link href={`/course/${subject.id}`}>
            <button>Masuk</button>
          </Link>
        </div>
      ))}
    </div>
  )
}
