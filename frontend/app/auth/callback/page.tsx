'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // 1. Ambil hash dari URL (Google balikin token di belakang #)
    // Contoh: #access_token=eyJ...&refresh_token=...
    const hashStr = window.location.hash.substring(1) 
    const params = new URLSearchParams(hashStr)
    const accessToken = params.get('access_token')

    if (accessToken) {
      // 2. Kirim token ke Backend Express
      fetch('http://localhost:5000/api/auth/google/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
        credentials: 'include' // PENTING: Biar cookie dari backend ketrigger
      })
      .then(res => {
        if (res.ok) {
            router.push('/') // Login Sukses, masuk Home/Dashboard
        } else {
            console.error('Backend rejected token')
            router.push('/login?error=auth_failed')
        }
      })
      .catch(err => {
        console.error('Network error', err)
        router.push('/login?error=network_error')
      })
    } else {
        // Kalo user iseng buka halaman ini tanpa login
        router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
      <p>Logging you in...</p>
    </div>
  )
}