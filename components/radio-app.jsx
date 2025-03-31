"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, List, X, Pause, Music } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import StationLogo from "@/components/station-logo"
import YouTubePlayer from "@/components/youtube-player"
import RetroBackground from "@/components/retro-background"
import DebugInfo from "@/components/debug-info"
import { radioStations, findCurrentTrack, getRandomTrack, getTrackStartTimeInSeconds } from "@/lib/data/stations"
import { useTimeFormat } from "@/hooks/useTimeFormat"

// Sound effect files for station changes
const stationChangeSounds = [
  "/sounds/006.wav",
  "/sounds/008.wav",
  "/sounds/07 Line Break.wav",
  "/sounds/Sound Effect Glitch.mp3"
]

export default function RadioApp() {
  const [selectedStation, setSelectedStation] = useState(radioStations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(70)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isChangingStation, setIsChangingStation] = useState(false)
  const [showStationInfo, setShowStationInfo] = useState(false)
  const [playerTime, setPlayerTime] = useState(0)
  const [showTrackList, setShowTrackList] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [stationChangeProgress, setStationChangeProgress] = useState(0)
  const [stationChangeSound, setStationChangeSound] = useState(null)
  const [animatedTime, setAnimatedTime] = useState("00:00")
  const [isAppInitialized, setIsAppInitialized] = useState(false)
  const audioRef = useRef(null)
  const playerRef = useRef(null)
  const progressTimerRef = useRef(null)
  const { formatTimeMMSS, formatTimeHHMMSS } = useTimeFormat()

  // Initialize radio app
  useEffect(() => {
    console.log("Initializing radio app...");
    
    // Select a random station for initial load
    const randomStationIndex = Math.floor(Math.random() * radioStations.length);
    const initialStation = radioStations[randomStationIndex];
    console.log(`Selecting random station: ${initialStation.name}`);
    setSelectedStation(initialStation);
    
    // Stay paused during initialization
    setIsPlaying(false);
    
    // Select a random track from this station to eventually play
    if (initialStation.tracks && initialStation.tracks.length > 0) {
      const randomTrackIndex = Math.floor(Math.random() * initialStation.tracks.length);
      const randomTrack = initialStation.tracks[randomTrackIndex];
      
      if (randomTrack) {
        console.log(`Selected random track to start from: ${randomTrack.title}`);
        setCurrentTrack(randomTrack);
      }
    }
    
    // Wait for YouTube API to initialize
    setTimeout(() => {
      console.log("Preparing to start playback...");
      
      // Now set the selected track for seeking
      if (initialStation.tracks && initialStation.tracks.length > 0) {
        const randomTrackIndex = Math.floor(Math.random() * initialStation.tracks.length);
        const randomTrack = initialStation.tracks[randomTrackIndex];
        
        if (randomTrack) {
          console.log(`Setting up track: ${randomTrack.title}`);
          setSelectedTrack(randomTrack);
          
          // Start playing after additional delay
          setTimeout(() => {
            console.log("Starting playback...");
            setIsPlaying(true);
            setIsAppInitialized(true);
            
            // Show station info briefly
            setShowStationInfo(true);
            setTimeout(() => {
              setShowStationInfo(false);
            }, 5000);
          }, 3000);
        }
      }
    }, 6000);
  }, []);

  // Initialize audio element for station changing sound
  useEffect(() => {
    // Select a random station change sound
    const randomSoundIndex = Math.floor(Math.random() * stationChangeSounds.length)
    setStationChangeSound(stationChangeSounds[randomSoundIndex])
    
    // Initialize audio with selected sound
    if (stationChangeSound) {
      audioRef.current = new Audio(stationChangeSound)
    } else {
      audioRef.current = new Audio(stationChangeSounds) // Fallback
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [stationChangeSound])

  // Handle station change
  const changeStation = (station) => {
    if (station.id === selectedStation.id) return

    console.log(`Changing station to: ${station.name} (${station.youtubeId})`)
    setIsChangingStation(true)
    setStationChangeProgress(0)
    
    // Select a new random sound for station change
    const randomSoundIndex = Math.floor(Math.random() * stationChangeSounds.length)
    const newSound = stationChangeSounds[randomSoundIndex]
    console.log(`Playing station change sound: ${newSound}`)
    
    // Update audio element with new sound
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = new Audio(newSound)
      audioRef.current.volume = volume / 100
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }

    // Animated progress for station change
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    
    progressTimerRef.current = setInterval(() => {
      setStationChangeProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimerRef.current)
          return 100
        }
        return prev + 5
      })
    }, 50)

    // Set new station
    setSelectedStation(station)
    
    // Select a random track from the new station to start from
    if (station.tracks && station.tracks.length > 0) {
      const randomTrackIndex = Math.floor(Math.random() * station.tracks.length);
      const randomTrack = station.tracks[randomTrackIndex];
      console.log(`Will start from track: ${randomTrack.title}`);
      // We'll set this as the selected track, but not as current track yet
      // The current track will be determined when playback starts and handleTimeUpdate is called
      setSelectedTrack(randomTrack);
    } else {
      setSelectedTrack(null);
    }

    // Animate time display during station change
    const timeValues = ["--:--", "00:00", "--:--", "88:88", "__:__", "··:··"]
    let timeIndex = 0
    
    const timeAnimInterval = setInterval(() => {
      setAnimatedTime(timeValues[timeIndex % timeValues.length])
      timeIndex++
    }, 150)
    
    // After station change sound finishes, reset changing state
    setTimeout(() => {
      console.log(`Station change to ${station.name} complete`)
      setIsChangingStation(false)
      setIsPlaying(true)
      clearInterval(timeAnimInterval)
      setStationChangeProgress(100)
      
      // Show station info briefly
      setShowStationInfo(true)
      setTimeout(() => {
        setShowStationInfo(false)
      }, 5000)
    }, 2000) // Slightly longer delay to ensure sound effect completes
  }

  // Handle toggle playback
  const togglePlayback = () => {
    try {
      setIsPlaying((prev) => !prev);
      // We don't directly call player methods here - the effect in YouTube component will handle this
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    try {
      const newVolume = value[0];
      setVolume(newVolume);
      
      if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
        try {
          playerRef.current.setVolume(newVolume);
        } catch (err) {
          console.error("Error setting volume on player:", err);
        }
      }
      
      // Also update volume of sound effects
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }

      // Auto-unmute if volume is increased from zero
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    } catch (error) {
      console.error("Error handling volume change:", error);
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    try {
      setIsMuted((prev) => !prev);
      
      if (playerRef.current && typeof playerRef.current.mute === 'function') {
        try {
          playerRef.current.mute(!isMuted);
        } catch (err) {
          console.error("Error toggling mute on player:", err);
        }
      }
      
      // Also mute sound effects
      if (audioRef.current) {
        audioRef.current.muted = !isMuted;
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  }

  // Handle YouTube player time update
  const handleTimeUpdate = (time) => {
    setPlayerTime(time)
    
    // Find current track based on time
    const track = findCurrentTrack(selectedStation, time)
    if (track && (!currentTrack || track.title !== currentTrack.title)) {
      console.log(`Now playing: ${track.title} at ${time}s`);
      setCurrentTrack(track)
      
      // Show station info when track changes automatically
      setShowStationInfo(true)
      setTimeout(() => {
        setShowStationInfo(false)
      }, 5000)
    }
  }

  // Handle track change from YouTube player
  const handleTrackChange = (track) => {
    setCurrentTrack(track)
    
    // Show station info when track changes
    setShowStationInfo(true)
    setTimeout(() => {
      setShowStationInfo(false)
    }, 5000)
  }

  // Handle track selection from track list
  const handleTrackSelect = (track) => {
    setSelectedTrack(track)
    setShowTrackList(false)
    
    // Make sure the player is playing
    if (!isPlaying) {
      setIsPlaying(true)
    }
  }

  // Toggle track list visibility
  const toggleTrackList = () => {
    setShowTrackList(!showTrackList)
  }

  // Calculate track progress
  const calculateTrackProgress = () => {
    if (!currentTrack || !playerTime) return 0
    
    const startParts = currentTrack.start.split(':').map(Number)
    const endParts = currentTrack.end.split(':').map(Number)
    
    const startSeconds = (startParts[0] || 0) * 3600 + (startParts[1] || 0) * 60 + (startParts[2] || 0)
    const endSeconds = (endParts[0] || 0) * 3600 + (endParts[1] || 0) * 60 + (endParts[2] || 0)
    
    const trackDuration = endSeconds - startSeconds
    const currentPosition = playerTime - startSeconds
    
    return Math.min(100, Math.max(0, (currentPosition / trackDuration) * 100))
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a0933]">
      {/* Retro background with cityscape and palm trees */}
      <RetroBackground />

      {/* Debug info component (hidden by default, toggle with Ctrl+D) */}
      <DebugInfo 
        playerRef={playerRef} 
        selectedStation={selectedStation} 
        isPlaying={isPlaying} 
        currentTrack={currentTrack} 
      />

      {/* Main radio interface */}
      <div className="relative z-10 w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center px-4">
        <div className="w-full bg-[#1a0933] rounded-3xl border-4 border-[#ff3e96] shadow-[0_0_20px_rgba(255,62,150,0.7)] overflow-hidden">
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left section - Station logos */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {radioStations.map((station) => (
                <div key={station.id} className="relative mb-2">
                  <StationLogo
                    station={station}
                    isSelected={selectedStation?.id === station.id}
                    onClick={() => changeStation(station)}
                    isChanging={isChangingStation && selectedStation?.id === station.id}
                  />
                </div>
              ))}
            </div>

            {/* Right section - Now playing and controls */}
            <div className="flex flex-col justify-between">
              {/* Now playing display */}
              <div
                className="bg-[#1a0933] rounded-xl border-2 p-4 mb-4 text-center"
                style={{
                  borderColor: selectedStation.color,
                  boxShadow: `0 0 10px ${selectedStation.color}`,
                }}
              >
                <div className="text-[#00e5ff] text-sm font-bold mb-1 neon-text-secondary">NOW PLAYING</div>
                <div className="text-xl font-bold neon-text" style={{ color: selectedStation.color }}>
                  {selectedStation.displayName}
                </div>
                
                {isChangingStation ? (
                  <div className="py-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>TUNING</span>
                      <span>{stationChangeProgress}%</span>
                    </div>
                    <div className="h-2 bg-[#3a1466] rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-100 ease-in-out"
                        style={{ 
                          width: `${stationChangeProgress}%`, 
                          backgroundColor: selectedStation.color
                        }}
                      ></div>
                    </div>
                    <div className="text-center text-white mt-2 font-mono">{animatedTime}</div>
                  </div>
                ) : (
                  currentTrack && (
                    <>
                      <div className="text-white text-sm mt-2 truncate">{currentTrack.title}</div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatTimeMMSS(playerTime)}</span>
                        <span>{currentTrack.end}</span>
                      </div>
                      <div className="h-1.5 bg-[#3a1466] rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full transition-width duration-300 ease-linear"
                          style={{ 
                            width: `${calculateTrackProgress()}%`, 
                            backgroundColor: selectedStation.color
                          }}
                        ></div>
                      </div>
                    </>
                  )
                )}
              </div>

              {/* Frequency tuner */}
              <div className="mb-6">
                <div className="flex justify-between text-white text-xs mb-1">
                  <span>88</span>
                  <span>90</span>
                  <span>92</span>
                  <span>96</span>
                  <span>108</span>
                </div>
                <div className="h-2 bg-[#3a1466] rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={cn(
                        "h-4 w-1 rounded-full z-10 transition-all duration-500",
                        isChangingStation ? "animate-pulse" : ""
                      )}
                      style={{
                        left: `${((Number.parseFloat(selectedStation.frequency) - 88) / (108 - 88)) * 100}%`,
                        transform: "translateX(-50%)",
                        backgroundColor: isChangingStation ? "#ffffff" : "#ff3e96"
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between">
                <button
                  onClick={togglePlayback}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                    isChangingStation ? "opacity-50 cursor-not-allowed" : "opacity-100"
                  )}
                  style={{
                    backgroundColor: "#3a1466",
                    border: "2px solid #ff3e96",
                    boxShadow: "0 0 10px rgba(255, 62, 150, 0.7)",
                  }}
                  disabled={isChangingStation}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-[#ff3e96]" />
                  ) : (
                    <Play className="w-6 h-6 text-[#ff3e96] ml-1" />
                  )}
                </button>

                <button
                  onClick={toggleTrackList}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                    isChangingStation ? "opacity-50 cursor-not-allowed" : "opacity-100"
                  )}
                  style={{
                    backgroundColor: "#3a1466",
                    border: "2px solid #ff3e96",
                    boxShadow: "0 0 10px rgba(255, 62, 150, 0.7)",
                  }}
                  disabled={isChangingStation}
                >
                  <Music className="w-6 h-6 text-[#ff3e96]" />
                </button>

                <button
                  onClick={toggleMute}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "#3a1466",
                    border: "2px solid #00e5ff",
                    boxShadow: "0 0 10px rgba(0, 229, 255, 0.7)",
                  }}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-[#00e5ff]" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-[#00e5ff]" />
                  )}
                </button>
              </div>

              {/* Volume slider (all devices) */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Station info and currently playing track */}
          {showStationInfo && currentTrack && !isChangingStation && (
            <div 
              className="p-4 flex items-center justify-center border-t-2 border-gray-800 transition-opacity duration-300" 
              style={{ borderColor: selectedStation.color }}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-sm opacity-70">DJ: {selectedStation.dj}</div>
                  <div className="text-sm opacity-70">Genre: {selectedStation.genre}</div>
                </div>
                <div>
                  <div className="font-bold" style={{ color: selectedStation.color }}>Now Playing:</div>
                  <div className="text-lg">{currentTrack.title}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Track list modal */}
      {showTrackList && (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black/70">
          <div 
            className="bg-[#1a0933] rounded-xl border-4 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
            style={{
              borderColor: selectedStation.color,
              boxShadow: `0 0 20px ${selectedStation.color}`,
            }}
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center" style={{ borderColor: selectedStation.color }}>
              <h3 className="text-xl font-bold neon-text" style={{ color: selectedStation.color }}>
                {selectedStation.displayName} - Tracklist
              </h3>
              <button onClick={toggleTrackList} className="text-white hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {selectedStation.tracks.map((track, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-white/10 rounded-lg transition-colors mb-1", 
                    currentTrack?.title === track.title ? "bg-white/20" : ""
                  )}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="text-white">{track.title}</div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>{track.start}</span>
                    <span>{track.end}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden YouTube player (audio only) */}
      <div className="absolute opacity-0 pointer-events-none">
        <YouTubePlayer
          videoId={selectedStation.youtubeId}
          station={selectedStation}
          isChangingStation={isChangingStation}
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          playerRef={playerRef}
          onTimeUpdate={handleTimeUpdate}
          onTrackChange={handleTrackChange}
          selectedTrack={selectedTrack}
        />
      </div>
    </div>
  )
}

