"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Square, Pause } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import StationLogo from "@/components/station-logo"
import YouTubePlayer from "@/components/youtube-player"
import RetroBackground from "@/components/retro-background"

// Radio station data from the actual GTA V & GTA Online playlist
const radioStations = [
  {
    id: "space",
    name: "Space 103.2",
    displayName: "SPACE 103.2",
    videoId: "s9Ppv2Yjuv4", // GTA V & GTA Online — Space 103.2
    color: "#ff00ff", // Magenta
    tracks: [
      "Bootsy Collins - I'd Rather Be With You",
      "D-Train - You're the One for Me",
      "Eddie Murphy - Party All the Time",
    ],
    dj: "Bootsy Collins",
    genre: "Funk",
    frequency: "103.2",
  },
  {
    id: "los-santos-rock",
    name: "Los Santos Rock Radio",
    displayName: "LOS SANTOS ROCK",
    videoId: "UxQkzPMaQns", // GTA V & GTA Online — Los Santos Rock Radio
    color: "#ff3e96", // Pink
    tracks: ["Billy Squier - Lonely Is the Night", "Bob Seger - Hollywood Nights", "Chicago - If You Leave Me Now"],
    dj: "Kenny Loggins",
    genre: "Classic Rock",
    frequency: "90.2",
  },
  {
    id: "non-stop-pop",
    name: "Non-Stop-Pop FM",
    displayName: "NON-STOP-POP",
    videoId: "s9Ppv2Yjuv4", // GTA V & GTA Online — Non-Stop-Pop FM
    color: "#ff69b4", // Hot Pink
    tracks: ["Britney Spears - Gimme More", "Rihanna - Only Girl", "Lady Gaga - Applause"],
    dj: "Cara Delevingne",
    genre: "Pop",
    frequency: "96.6",
  },
  {
    id: "radio-los-santos",
    name: "Radio Los Santos",
    displayName: "RADIO LOS SANTOS",
    videoId: "6izkPo8GMoY", // GTA V & GTA Online — Radio Los Santos
    color: "#00e5ff", // Cyan
    tracks: ["Future - How It Was", "YG - I'm A Real 1", "Problem - Say That Then"],
    dj: "Big Boy",
    genre: "Contemporary Rap",
    frequency: "92.3",
  },
  {
    id: "west-coast",
    name: "West Coast Classics",
    displayName: "WEST COAST CLASSICS",
    videoId: "F6VfsJ7Hp34", // GTA V & GTA Online — West Coast Classics
    color: "#ffd700", // Gold
    tracks: ["2Pac - Ambitionz Az a Ridah", "Dr. Dre - Still D.R.E.", "Ice Cube - It Was A Good Day"],
    dj: "DJ Pooh",
    genre: "Classic Hip-Hop",
    frequency: "88.5",
  },
  {
    id: "vinewood",
    name: "Vinewood Boulevard",
    displayName: "VINEWOOD",
    videoId: "95DpzqQ2ozc", // GTA V & GTA Online — Vinewood Boulevard Radio
    color: "#ff00ff", // Magenta
    tracks: ["Moon Duo - Sleepwalker", "Wavves - Nine Is God", "FIDLAR - Cocaine"],
    dj: "Nate & Stephen",
    genre: "Alternative Rock",
    frequency: "95.6",
  },
  {
    id: "ls-underground",
    name: "LS Underground Radio",
    displayName: "LSU",
    videoId: "tmPDuCxrUKM", // GTA V & GTA Online — Los Santos Underground Radio
    color: "#00e5ff", // Cyan
    tracks: ["Solomun - Customer Is King", "Tale Of Us - Solitude", "Dixon - Polymorphic"],
    dj: "Various DJs",
    genre: "Techno",
    frequency: "108.5",
  },
  {
    id: "v-rock",
    name: "V-Rock",
    displayName: "V RADIO",
    videoId: "UxQkzPMaQns", // Using Los Santos Rock Radio as placeholder
    color: "#00e5ff", // Cyan
    tracks: [
      "Judas Priest - You've Got Another Thing Comin'",
      "Mötley Crüe - Too Young to Fall in Love",
      "Ozzy Osbourne - Bark at the Moon",
    ],
    dj: "Lazlow",
    genre: "Heavy Metal",
    frequency: "89.5",
  },
]

export default function RadioApp() {
  const [selectedStation, setSelectedStation] = useState(radioStations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(70)
  const [currentTrack, setCurrentTrack] = useState("")
  const [isChangingStation, setIsChangingStation] = useState(false)
  const [showStationInfo, setShowStationInfo] = useState(false)
  const audioRef = useRef(null)
  const playerRef = useRef(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/scrubbing.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Handle station change
  const changeStation = (station) => {
    if (station.id === selectedStation.id) return

    setIsChangingStation(true)

    // Play scrubbing sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }

    // Set new station
    setSelectedStation(station)

    // Set random track from station's track list
    const randomTrackIndex = Math.floor(Math.random() * station.tracks.length)
    setCurrentTrack(station.tracks[randomTrackIndex])

    // Show station info briefly
    setShowStationInfo(true)
    setTimeout(() => {
      setShowStationInfo(false)
    }, 5000)

    // After scrubbing sound finishes, reset changing state
    setTimeout(() => {
      setIsChangingStation(false)
      setIsPlaying(true)
    }, 1000)
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }

    // Auto-unmute if volume is increased from zero
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (playerRef.current) {
      playerRef.current.mute(!isMuted)
    }
  }

  // Handle play/stop toggle
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }

  // Set initial track on component mount
  useEffect(() => {
    if (selectedStation.tracks.length > 0) {
      const randomTrackIndex = Math.floor(Math.random() * selectedStation.tracks.length)
      setCurrentTrack(selectedStation.tracks[randomTrackIndex])
      setShowStationInfo(true)
      setTimeout(() => {
        setShowStationInfo(false)
      }, 5000)
    }
  }, [])

  // Change track periodically to simulate radio
  useEffect(() => {
    if (!isPlaying || isChangingStation) return

    const trackInterval = setInterval(
      () => {
        const randomTrackIndex = Math.floor(Math.random() * selectedStation.tracks.length)
        setCurrentTrack(selectedStation.tracks[randomTrackIndex])
        setShowStationInfo(true)
        setTimeout(() => {
          setShowStationInfo(false)
        }, 5000)
      },
      60000 + Math.random() * 120000,
    ) // Change track every 1-3 minutes

    return () => clearInterval(trackInterval)
  }, [isPlaying, isChangingStation, selectedStation])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a0933]">
      {/* Retro background with cityscape and palm trees */}
      <RetroBackground />

      {/* Main radio interface */}
      <div className="relative z-10 w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center px-4">
        <div className="w-full bg-[#1a0933] rounded-3xl border-4 border-[#ff3e96] shadow-[0_0_20px_rgba(255,62,150,0.7)] overflow-hidden">
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left section - Station logos */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {radioStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => changeStation(station)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 transform hover:scale-105",
                    selectedStation.id === station.id ? "scale-105" : "",
                  )}
                >
                  <StationLogo station={station} isSelected={selectedStation.id === station.id} />
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
                <div className="text-[#00e5ff] text-sm font-bold mb-1">NOW PLAYING</div>
                <div className="text-xl font-bold" style={{ color: selectedStation.color }}>
                  {selectedStation.displayName}
                </div>
                <div className="text-white text-sm mt-2 truncate">{currentTrack}</div>
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
                      className="h-4 w-1 bg-[#ff3e96] rounded-full z-10"
                      style={{
                        left: `${((Number.parseFloat(selectedStation.frequency) - 88) / (108 - 88)) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between">
                <button
                  onClick={togglePlayback}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "#3a1466",
                    border: "2px solid #ff3e96",
                    boxShadow: "0 0 10px rgba(255, 62, 150, 0.7)",
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-[#ff3e96]" />
                  ) : (
                    <Play className="w-6 h-6 text-[#ff3e96] ml-1" />
                  )}
                </button>

                <button
                  onClick={() => {}}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "#3a1466",
                    border: "2px solid #ff3e96",
                    boxShadow: "0 0 10px rgba(255, 62, 150, 0.7)",
                  }}
                >
                  <Square className="w-6 h-6 text-[#ff3e96]" />
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

              {/* Volume slider (mobile only) */}
              <div className="mt-4 md:hidden">
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden YouTube player (audio only) */}
      <div className="absolute opacity-0 pointer-events-none h-1">
        <YouTubePlayer
          videoId={selectedStation.videoId}
          isChangingStation={isChangingStation}
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          playerRef={playerRef}
        />
      </div>
    </div>
  )
}

