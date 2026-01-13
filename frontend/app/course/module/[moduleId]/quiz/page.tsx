'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Question = {
  id: string
  question: string
  options: string[]
}

type Quiz = {
  id: string
  title: string
  quiz_questions: Question[]
}

type QuizResult = {
  success?: boolean
  message?: string
  score?: number
  correct?: number
  wrong?: number
}

export default function QuizPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(
        `http://localhost:5000/api/courses/modules/${moduleId}/quiz`,
        { credentials: 'include' }
      )
      const json = await res.json()
      setQuiz(json.data)
    }

    fetchQuiz()
  }, [moduleId])

  const submitQuiz = async () => {
    if (!quiz) return

    const res = await fetch(
      `http://localhost:5000/api/courses/quizzes/${quiz.id}/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ answers })
      }
    )

    const json = await res.json()
    setResult(json.data)
  }

  if (!quiz) return <p>Loading...</p>

  return (
    <div>
      <h1>{quiz.title}</h1>

      {quiz.quiz_questions.map(q => (
        <div key={q.id} style={{ marginBottom: 16 }}>
          <p>{q.question}</p>

          {q.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() =>
                  setAnswers(prev => ({
                    ...prev,
                    [q.id]: opt
                  }))
                }
              />
              {opt}
              <br />
            </label>
          ))}
        </div>
      ))}

      <button onClick={submitQuiz}>Submit Quiz</button>

      {result && (
        <div style={{ marginTop: 16 }}>
          {result.success === false ? (
            <p style={{ color: 'red' }}>{result.message}</p>
          ) : (
            <>
              <h3>Hasil</h3>
              <p>Score: {result.score}</p>
              <p>Benar: {result.correct}</p>
              <p>Salah: {result.wrong}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
