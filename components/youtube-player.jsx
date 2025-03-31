"use client"

import { useEffect, useState, useRef } from "react"
import YouTube from "react-youtube"
import { getTrackStartTimeInSeconds } from "@/lib/data/stations"

export default function YouTubePlayer({
  videoId,
  station,
  isPlaying,
  isMuted,
  volume,
  playerRef,
  onTimeUpdate,
  onTrackChange,
  selectedTrack,
  isChangingStation
}) {
  const youtubeRef = useRef(null)
  const timeUpdateIntervalRef = useRef(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  
  // Initialize YouTube player with API
  const onPlayerReady = (event) => {
    console.log("YouTube player onReady event triggered")
    youtubeRef.current = event.target
    
    if (playerRef) {
      // Define safe versions of all methods
      const safeCall = (fn, fallback = null) => {
        return (...args) => {
          try {
            if (youtubeRef.current) {
              return fn(...args)
            }
            return fallback
          } catch (e) {
            console.error("YouTube API error:", e)
            return fallback
          }
        }
      }
      
      // Set player reference with safe methods
      playerRef.current = {
        play: safeCall(() => youtubeRef.current.playVideo()),
        pause: safeCall(() => youtubeRef.current.pauseVideo()),
        setVolume: safeCall((vol) => youtubeRef.current.setVolume(vol)),
        mute: safeCall((state) => state ? youtubeRef.current.mute() : youtubeRef.current.unMute()),
        seekTo: safeCall((seconds) => youtubeRef.current.seekTo(seconds, true)),
        getCurrentTime: safeCall(() => youtubeRef.current.getCurrentTime(), 0),
        getDuration: safeCall(() => youtubeRef.current.getDuration(), 0),
        getPlayerState: safeCall(() => youtubeRef.current.getPlayerState(), -1),
        getVideoData: safeCall(() => youtubeRef.current.getVideoData(), {})
      }
    }
    
    // Handle initial settings only after the player is ready
    setTimeout(() => {
      try {
        // Set volume
        if (youtubeRef.current) {
          youtubeRef.current.setVolume(volume)
          
          // Set mute state
          if (isMuted) {
            youtubeRef.current.mute()
          } else {
            youtubeRef.current.unMute()
          }
        }
        
        // Mark player as ready
        setIsPlayerReady(true)
        console.log("YouTube player is now ready:", videoId)
      } catch (e) {
        console.error("Error during player initialization:", e)
      }
    }, 1000) // Give a second for the player to stabilize
  }

  // Track seek state to prevent loops
  const seekStateRef = useRef({
    lastSeekTime: 0,
    lastSeekPosition: 0,
    seekAttempts: 0,
    isStabilizing: false,
    maxSeekAttempts: 2,        // Reduced from 3 to be more aggressive
    stabilizationDelay: 3000,  // Increased from 2000 to 3000
    seekThreshold: 5,          // Increased from 2 to 5 seconds
    minSeekInterval: 5000,     // Increased from 3000 to 5000
    totalSeeksThisSession: 0,
    maxSeeksPerSession: 10
  })

  // Handle player state changes
  const onPlayerStateChange = (event) => {
    try {
      const playerState = event.data
      console.log("YouTube player state changed:", playerState)
      
      if (playerState === 1) { // Playing
        if (seekStateRef.current.isStabilizing) {
          console.log("Playback stabilized")
          seekStateRef.current.seekAttempts = 0
          seekStateRef.current.isStabilizing = false
        }
      }
      
      // Handle buffering state with improved stabilization
      if (playerState === 3) { // Buffering
        seekStateRef.current.seekAttempts++
        console.log(`Buffering detected, attempt ${seekStateRef.current.seekAttempts}`)
        
        // Force stabilization if too many seeks or attempts
        if ((seekStateRef.current.seekAttempts >= seekStateRef.current.maxSeekAttempts || 
             seekStateRef.current.totalSeeksThisSession >= seekStateRef.current.maxSeeksPerSession) && 
            !seekStateRef.current.isStabilizing) {
          
          console.log("Forcing playback stabilization...")
          seekStateRef.current.isStabilizing = true
          
          // Continue playback without seeking
          setTimeout(() => {
            if (youtubeRef.current) {
              try {
                youtubeRef.current.playVideo()
                seekStateRef.current.seekAttempts = 0
                seekStateRef.current.isStabilizing = false
              } catch (e) {
                console.error("Error during stabilization:", e)
              }
            }
          }, seekStateRef.current.stabilizationDelay)
        }
      }
      
      // Handle ended state
      if (playerState === 0) { // Ended
        console.log("Video ended, resetting seek state")
        seekStateRef.current.seekAttempts = 0
        seekStateRef.current.isStabilizing = false
      }
    } catch (e) {
      console.error("Error handling player state change:", e)
    }
  }

  // Handle time updates
  useEffect(() => {
    // Only set up time update interval when playing
    if (isPlaying && isPlayerReady && !isChangingStation) {
      if (!timeUpdateIntervalRef.current) {
        timeUpdateIntervalRef.current = setInterval(() => {
          try {
            if (youtubeRef.current) {
              const time = youtubeRef.current.getCurrentTime()
              if (time && onTimeUpdate) {
                onTimeUpdate(time)
              }
            }
          } catch (e) {
            console.log("Error getting current time:", e)
          }
        }, 1000)
      }
    } else {
      // Clear interval when not playing
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
    
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
  }, [isPlaying, isPlayerReady, isChangingStation, onTimeUpdate])

  // Handle play/pause state
  useEffect(() => {
    if (!isPlayerReady || !youtubeRef.current || isChangingStation) return
    
    try {
      if (isPlaying) {
        youtubeRef.current.playVideo()
      } else {
        youtubeRef.current.pauseVideo()
      }
    } catch (e) {
      console.error("Error changing play state:", e)
    }
  }, [isPlaying, isPlayerReady, isChangingStation])

  // Handle selected track changes (seeking)
  useEffect(() => {
    if (!isPlayerReady || !youtubeRef.current || !selectedTrack || isChangingStation) return
    
    try {
      const startTimeInSeconds = getTrackStartTimeInSeconds(selectedTrack)
      if (!startTimeInSeconds || startTimeInSeconds < 0) {
        console.error("Invalid start time for track:", selectedTrack)
        return
      }
      
      // Additional seek validation
      if (seekStateRef.current.isStabilizing) {
        console.log("Skipping seek - currently stabilizing")
        return
      }
      
      if (seekStateRef.current.totalSeeksThisSession >= seekStateRef.current.maxSeeksPerSession) {
        console.log("Maximum seeks per session reached, skipping seek")
        return
      }
      
      const now = Date.now()
      if (now - seekStateRef.current.lastSeekTime < seekStateRef.current.minSeekInterval) {
        console.log("Skipping track change seek - too soon after last seek")
        return
      }
      
      const currentTime = youtubeRef.current.getCurrentTime()
      if (Math.abs(currentTime - startTimeInSeconds) <= seekStateRef.current.seekThreshold) {
        console.log("Already at target track time, skipping seek")
        if (onTrackChange) {
          onTrackChange(selectedTrack)
        }
        return
      }
      
      seekStateRef.current.totalSeeksThisSession++
      seekStateRef.current.lastSeekTime = now
      seekStateRef.current.lastSeekPosition = startTimeInSeconds
      seekStateRef.current.seekAttempts = 0
      
      console.log(`Seeking to track: ${selectedTrack.title} at ${startTimeInSeconds}s (Seek #${seekStateRef.current.totalSeeksThisSession})`)
      youtubeRef.current.seekTo(startTimeInSeconds, true)
      
      if (onTrackChange) {
        onTrackChange(selectedTrack)
      }
    } catch (e) {
      console.error("Error seeking to track:", e)
    }
  }, [selectedTrack, isPlayerReady, onTrackChange, isChangingStation])

  // Handle volume changes
  useEffect(() => {
    if (!isPlayerReady || !youtubeRef.current) return
    
    try {
      youtubeRef.current.setVolume(volume)
    } catch (e) {
      console.error("Error changing volume:", e)
    }
  }, [volume, isPlayerReady])

  // Handle mute state
  useEffect(() => {
    if (!isPlayerReady || !youtubeRef.current) return
    
    try {
      if (isMuted) {
        youtubeRef.current.mute()
      } else {
        youtubeRef.current.unMute()
      }
    } catch (e) {
      console.error("Error changing mute state:", e)
    }
  }, [isMuted, isPlayerReady])

  // YouTube player options
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3, // Hide annotations
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      start: 0, // We'll seek manually after initialization
    },
  }

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onPlayerReady}
      onStateChange={onPlayerStateChange}
      onError={(e) => console.error("YouTube Player Error:", e)}
      className="w-0 h-0 overflow-hidden"
    />
  )
}

