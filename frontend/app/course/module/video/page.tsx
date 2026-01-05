'use client'

import { useEffect, useRef, useState } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'
import { useParams, useRouter } from 'next/navigation'

export default function VideoPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')

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

  useEffect(() => {
    if (videoUrl && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        sources: [
          {
            src: videoUrl,
            type: 'video/mp4'
          }
        ]
      })
    }

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
    <div>
      <h1>Video Materi</h1>

      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />

      <br />

      <button onClick={handleComplete}>
        Save & Continue
      </button>
    </div>
  )
}
