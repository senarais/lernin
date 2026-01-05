'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type ModuleDetail = {
  id: string
  title: string
}

export default function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const [module, setModule] = useState<ModuleDetail | null>(null)

  useEffect(() => {
    const fetchModule = async () => {
      const res = await fetch(
        `http://localhost:5000/api/courses/modules/${moduleId}`,
        { credentials: 'include' }
      )
      const json = await res.json()
      setModule(json.data)
    }

    fetchModule()
  }, [moduleId])

  if (!module) return <p>Loading...</p>

  return (
    <div>
      <h1>{module.title}</h1>

      <Link href={`/course/module/${moduleId}/video`}>
        <button>Nonton Video</button>
      </Link>

      <br /><br />

      <Link href={`/course/module/${moduleId}/quiz`}>
        <button>Kerjain Quiz</button>
      </Link>
    </div>
  )
}
