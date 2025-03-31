"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Script from "next/script"

type YouTubePlayerProps = {
  videoId: string
  isChangingStation: boolean
  isPlaying: boolean
  isMuted: boolean
  volume: number
  playerRef: React.MutableRefObject<any>
}

export default function YouTubePlayer({
  videoId,
  isChangingStation,
  isPlaying,
  isMuted,
  volume,
  playerRef,
}: YouTubePlayerProps) {
  const [isApiReady, setIsApiReady] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [playerId] = useState(`youtube-player-${Math.random().toString(36).substring(2, 9)}`)

  // Initialize YouTube API
  useEffect(() => {
    if (!isApiReady) return

    // Create YouTube player when API is ready
    if (!window.YT) return

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player(playerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true)
            event.target.setVolume(volume)
            if (isMuted) event.target.mute()

            // Start at random position (between 30s and 90% of video duration)
            const duration = event.target.getDuration()
            if (duration) {
              const minTime = 30
              const maxTime = duration * 0.9
              const randomTime = Math.floor(Math.random() * (maxTime - minTime)) + minTime
              event.target.seekTo(randomTime, true)
            }

            if (isPlaying && !isChangingStation) {
              event.target.playVideo()
            }
          },
          onStateChange: (event: any) => {
            // Auto-loop when video ends
            if (event.data === window.YT.PlayerState.ENDED) {
              const duration = event.target.getDuration()
              const randomTime = Math.floor(Math.random() * (duration * 0.7)) + 30
              event.target.seekTo(randomTime, true)
              event.target.playVideo()
            }
          },
          onError: (event: any) => {
            console.error("YouTube player error:", event.data)
            // Try to recover by loading the video again
            if (playerRef.current) {
              setTimeout(() => {
                playerRef.current.loadVideoById({
                  videoId: videoId,
                  startSeconds: Math.floor(Math.random() * 180) + 30,
                })
              }, 2000)
            }
          },
        },
      })
    }
  }, [isApiReady, videoId, playerId, playerRef, isPlaying, isMuted, volume, isChangingStation])

  // Handle video ID change
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return

    // When changing station, load new video
    if (!isChangingStation) {
      playerRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: Math.floor(Math.random() * 180) + 30,
      })

      if (isPlaying) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    }
  }, [videoId, isChangingStation, isPlayerReady, isPlaying, playerRef])

  // Handle play/pause
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current || isChangingStation) return

    if (isPlaying) {
      playerRef.current.playVideo()
    } else {
      playerRef.current.pauseVideo()
    }
  }, [isPlaying, isPlayerReady, isChangingStation, playerRef])

  // Handle mute/unmute
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return

    if (isMuted) {
      playerRef.current.mute()
    } else {
      playerRef.current.unMute()
    }
  }, [isMuted, isPlayerReady, playerRef])

  // Handle volume change
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return

    playerRef.current.setVolume(volume)
  }, [volume, isPlayerReady, playerRef])

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" onLoad={() => setIsApiReady(true)} />
      <div id={playerId} className="w-full h-full"></div>
    </>
  )
}

