'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-youtube'
import { useParams, useRouter } from 'next/navigation'

export default function VideoPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<any>(null)

  const [videoUrl, setVideoUrl] = useState<string>('')

  // Fetch video URL dari backend
  useEffect(() => {
    const fetchVideo = async () => {
      const res = await fetch(
        `http://localhost:5000/api/courses/modules/${moduleId}`,
        { credentials: 'include' }
      )

      const json = await res.json()
      setVideoUrl(json.data.video_url)
    }

    fetchVideo()
  }, [moduleId])

  // Init video.js + YouTube
  useEffect(() => {
    if (!videoUrl || !videoRef.current || playerRef.current) return

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      techOrder: ['youtube'],
      sources: [
        {
          src: videoUrl, // link youtube
          type: 'video/youtube'
        }
      ],
      youtube: {
        iv_load_policy: 3, // hide annotations
        modestbranding: 1
      }
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [videoUrl])

  const handleComplete = async () => {
    await fetch(
      `http://localhost:5000/api/courses/modules/${moduleId}/complete`,
      {
        method: 'POST',
        credentials: 'include'
      }
    )

    router.back()
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>Video Materi</h1>

      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
        />
      </div>

      <br />

      <button onClick={handleComplete}>
        Save & Continue
      </button>
    </div>
  )
}
