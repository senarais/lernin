'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CourseVideoPlayer({ activeModuleId }: { activeModuleId: string | null }) {
  const router = useRouter()
  const videoTargetRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  // ... (Bagian Logic Fetch & Video.js SAMA PERSIS, tidak berubah) ...
  // Biar hemat tempat saya skip logicnya, copas aja logic useEffect dari sebelumnya.
  // Yang berubah hanya bagian RENDER di bawah ini:

  useEffect(() => {
    if (!activeModuleId) return
    const fetchVideoDetail = async () => {
      setIsLoadingVideo(true)
      try {
        const res = await fetch(`http://localhost:5000/api/courses/modules/${activeModuleId}`, { credentials: 'include' })
        const json = await res.json()
        if (json.data && json.data.video_url) setVideoUrl(json.data.video_url)
      } catch (e) { console.error(e) } finally { setIsLoadingVideo(false) }
    }
    fetchVideoDetail()
  }, [activeModuleId])

  useEffect(() => {
    if (!videoTargetRef.current || !videoUrl || isLoadingVideo) return
    videoTargetRef.current.innerHTML = ''
    const videoElement = document.createElement('video-js')
    videoElement.classList.add('vjs-big-play-centered', 'vjs-fluid', 'vjs-udemy-theme') 
    videoTargetRef.current.appendChild(videoElement)
    const player = playerRef.current = videojs(videoElement, {
      controls: true, fluid: true, autoplay: false,
      sources: [{ src: videoUrl, type: 'video/mp4' }]
    })
    return () => { if (player && !player.isDisposed()) { player.dispose(); playerRef.current = null } }
  }, [videoUrl, isLoadingVideo])

  const handleComplete = async () => {
    if (!activeModuleId) return
    setIsCompleting(true)
    try {
      const res = await fetch(`http://localhost:5000/api/courses/modules/${activeModuleId}/complete`, { method: 'POST', credentials: 'include' })
      if (res.ok) router.refresh()
    } catch (error) { console.error(error) } finally { setIsCompleting(false) }
  }

  // --- RENDER UPDATED ---
  
  if (!activeModuleId) {
      return (
        <div className="aspect-video bg-[#5B5B5B]/10 rounded-3xl flex items-center justify-center text-gray-500 border border-white/10">
            Pilih Materi untuk Memulai
        </div>
      )
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative border border-white/10">
        {isLoadingVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg text-white z-20">
            <Loader2 className="animate-spin w-10 h-10 text-third" />
          </div>
        ) : (
          <div ref={videoTargetRef} className="w-full h-full" />
        )}
      </div>
      
      {/* Action Bar Dark Mode */}
      <div className="flex justify-between items-center bg-[#5B5B5B]/20 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
        <span className="font-medium text-gray-200">Status Pembelajaran</span>
        
        <button 
            onClick={handleComplete}
            disabled={isCompleting || isLoadingVideo}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
                ${isCompleting 
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/20 active:scale-95'}
            `}
        >
          {isCompleting ? (
            <> <Loader2 size={18} className="animate-spin" /> Menyimpan... </>
          ) : (
            <> <CheckCircle size={18} /> Tandai Selesai </>
          )}
        </button>
      </div>
    </div>
  )
}