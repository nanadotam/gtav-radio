"use client"

import { useState, useEffect } from "react"

export default function DebugInfo({ playerRef, selectedStation, isPlaying, currentTrack }) {
  const [playerState, setPlayerState] = useState("Not Initialized")
  const [videoId, setVideoId] = useState("")
  const [playerTime, setPlayerTime] = useState(0)
  const [showDebug, setShowDebug] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        try {
          const state = playerRef.current.getPlayerState()
          const stateMap = {
            '-1': 'Unstarted',
            '0': 'Ended',
            '1': 'Playing',
            '2': 'Paused',
            '3': 'Buffering',
            '5': 'Video Cued'
          }
          setPlayerState(stateMap[state] || `Unknown (${state})`)
          setVideoId(playerRef.current.getVideoData()?.video_id || "Unknown")
          setPlayerTime(Math.floor(playerRef.current.getCurrentTime() || 0))
        } catch (e) {
          setPlayerState(`Error: ${e.message}`)
        }
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [playerRef])
  
  // Toggle debug visibility with Ctrl+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setShowDebug(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  if (!showDebug) return null
  
  return (
    <div className="fixed bottom-2 right-2 bg-black/80 text-white p-2 rounded-md text-xs font-mono z-50 max-w-xs">
      <div className="grid grid-cols-2 gap-1">
        <span>Player State:</span>
        <span className={playerState === "Playing" ? "text-green-400" : "text-yellow-400"}>
          {playerState}
        </span>
        
        <span>Video ID:</span>
        <span>{videoId}</span>
        
        <span>Station:</span>
        <span>{selectedStation?.name || "None"}</span>
        
        <span>Is Playing:</span>
        <span>{isPlaying ? "Yes" : "No"}</span>
        
        <span>Current Time:</span>
        <span>{playerTime}s</span>
        
        <span>Track:</span>
        <span>{currentTrack?.title || "None"}</span>
      </div>
      <div className="mt-1 text-gray-400 text-[10px]">Press Ctrl+D to hide</div>
    </div>
  )
} 