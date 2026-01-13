'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CourseVideoPlayer({ activeModuleId }: { activeModuleId: string | null }) {
  const router = useRouter()
  
  // Refs untuk Video Player
  const videoTargetRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  // State
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false) // State loading tombol

  // 1. Fetch URL Video setiap kali activeModuleId berubah
  useEffect(() => {
    if (!activeModuleId) return

    const fetchVideoDetail = async () => {
      setIsLoadingVideo(true)
      try {
        const res = await fetch(`http://localhost:5000/api/courses/modules/${activeModuleId}`, { credentials: 'include' })
        const json = await res.json()
        
        if (json.data && json.data.video_url) {
            setVideoUrl(json.data.video_url)
        }
      } catch (e) {
        console.error("Error loading video", e)
      } finally {
        setIsLoadingVideo(false)
      }
    }

    fetchVideoDetail()
  }, [activeModuleId])

  // 2. Logic Video.js (Manual DOM Manipulation agar aman dari Error removeChild)
  useEffect(() => {
    if (!videoTargetRef.current || !videoUrl || isLoadingVideo) return

    // Bersihkan kontainer
    videoTargetRef.current.innerHTML = ''

    // Buat elemen video baru secara manual
    const videoElement = document.createElement('video-js')
    videoElement.classList.add('vjs-big-play-centered', 'vjs-fluid', 'vjs-udemy-theme')
    videoTargetRef.current.appendChild(videoElement)

    // Init Player
    const player = playerRef.current = videojs(videoElement, {
      controls: true,
      fluid: true,
      autoplay: false,
      sources: [{ src: videoUrl, type: 'video/mp4' }],
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'playbackRateMenuButton',
          'fullscreenToggle',
        ],
      },
    })

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [videoUrl, isLoadingVideo])

  // 3. Logic Handle Complete (POST API)
  const handleComplete = async () => {
    if (!activeModuleId) return

    setIsCompleting(true)
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/modules/${activeModuleId}/complete`, 
        { 
            method: 'POST', 
            credentials: 'include' 
        }
      )

      if (res.ok) {
          // Refresh halaman/data agar sidebar centang hijau muncul
          router.refresh() 
      }
    } catch (error) { 
        console.error("Gagal menandai selesai", error) 
    } finally {
        setIsCompleting(false)
    }
  }

  // --- RENDER ---
  
  if (!activeModuleId) {
      return (
        <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
            Pilih Materi untuk Memulai
        </div>
      )
  }

  return (
    <div className="space-y-4">
      {/* Area Video */}
      <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video relative ring-1 ring-slate-900/10">
        {isLoadingVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white z-20">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        ) : (
          <div ref={videoTargetRef} className="w-full h-full" />
        )}
      </div>
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className="font-semibold text-slate-700">Status Pembelajaran</span>
        
        <button 
            onClick={handleComplete}
            disabled={isCompleting || isLoadingVideo}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isCompleting 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg active:scale-95'}
            `}
        >
          {isCompleting ? (
            <>
                <Loader2 size={16} className="animate-spin" /> 
                Menyimpan...
            </>
          ) : (
            <>
                <CheckCircle size={16} /> 
                Tandai Selesai
            </>
          )}
        </button>
      </div>
    </div>
  )
}