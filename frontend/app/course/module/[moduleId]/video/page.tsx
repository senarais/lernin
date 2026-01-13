'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// HAPUS IMPORT INI: import 'videojs-youtube' 
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'

export default function VideoPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<any>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)

  // 1. Fetch Video dari API (Link Supabase)
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`http://localhost:5000/api/courses/modules/${moduleId}`, { credentials: 'include' })
        const json = await res.json()
        
        // Asumsi: json.data.video_url adalah link file .mp4 dari Supabase
        // Contoh: https://xyz.supabase.co/storage/v1/object/public/videos/materi1.mp4
        setVideoUrl(json.data.video_url)
      } catch (error) {
        console.error("Failed", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVideo()
  }, [moduleId])

  // 2. Init Video Player (NATIVE HTML5)
  useEffect(() => {
    // Pastikan URL valid sebelum init
    if (!videoUrl || !videoRef.current || playerRef.current) return

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto', // Preload video agar buffer lebih cepat
      // techOrder dihapus (biar default ke HTML5)
      
      sources: [
        {
          src: videoUrl, 
          type: 'video/mp4' // Ubah jadi MP4 (format standar Supabase)
        }
      ],
      
      // === FITUR UDEMY STYLE (Tetap Dipertahankan) ===
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'playbackRateMenuButton', // Speed
          'fullscreenToggle',
        ],
      },
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [videoUrl])

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await fetch(`http://localhost:5000/api/courses/modules/${moduleId}/complete`, { method: 'POST', credentials: 'include' })
      router.back()
    } catch (error) { setIsCompleting(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black">
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Video Container */}
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl relative ring-1 ring-slate-900/10">
          {isLoading ? (
            <div className="aspect-video w-full bg-slate-900 flex items-center justify-center text-slate-400">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div data-vjs-player>
              {/* Tambahkan playsInline agar di mobile tidak otomatis fullscreen native */}
              <video 
                ref={videoRef} 
                className="video-js vjs-udemy-theme" 
                playsInline 
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="font-semibold text-slate-700">Materi Pembelajaran</div>
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-md font-medium transition-all text-sm"
          >
            {isCompleting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Selesai & Lanjut
          </button>
        </div>
      </div>
    </div>
  )
}