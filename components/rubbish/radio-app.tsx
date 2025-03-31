"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Square } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import StationLogo from "@/components/station-logo"
import YouTubePlayer from "@/components/youtube-player"

// Radio station data from the actual GTA V & GTA Online playlist
const radioStations = [
  {
    id: "space",
    name: "Space 103.2",
    videoId: "s9Ppv2Yjuv4", // GTA V & GTA Online — Space 103.2
    position: { top: "20%", left: "40%" },
    color: "#4b0082",
    tracks: [
      "Bootsy Collins - I'd Rather Be With You",
      "D-Train - You're the One for Me",
      "Eddie Murphy - Party All the Time",
    ],
    dj: "Bootsy Collins",
    genre: "Funk",
    logo: "/logos/space.png",
  },
  {
    id: "los-santos-rock",
    name: "Los Santos Rock Radio",
    videoId: "UxQkzPMaQns", // GTA V & GTA Online — Los Santos Rock Radio
    position: { top: "25%", left: "70%" },
    color: "#c0392b",
    tracks: ["Billy Squier - Lonely Is the Night", "Bob Seger - Hollywood Nights", "Chicago - If You Leave Me Now"],
    dj: "Kenny Loggins",
    genre: "Classic Rock",
    logo: "/logos/los-santos-rock.png",
  },
  {
    id: "non-stop-pop",
    name: "Non-Stop-Pop FM",
    videoId: "s9Ppv2Yjuv4", // GTA V & GTA Online — Non-Stop-Pop FM
    position: { top: "30%", left: "80%" },
    color: "#ff69b4",
    tracks: ["Britney Spears - Gimme More", "Rihanna - Only Girl", "Lady Gaga - Applause"],
    dj: "Cara Delevingne",
    genre: "Pop",
    logo: "/logos/non-stop-pop.png",
  },
  {
    id: "radio-los-santos",
    name: "Radio Los Santos",
    videoId: "6izkPo8GMoY", // GTA V & GTA Online — Radio Los Santos
    position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    color: "#00a1f1",
    tracks: ["Future - How It Was", "YG - I'm A Real 1", "Problem - Say That Then"],
    dj: "Big Boy",
    genre: "Contemporary Rap",
    logo: "/logos/radio-los-santos.png",
  },
  {
    id: "west-coast",
    name: "West Coast Classics",
    videoId: "F6VfsJ7Hp34", // GTA V & GTA Online — West Coast Classics
    position: { top: "75%", left: "60%" },
    color: "#b7a55a",
    tracks: ["2Pac - Ambitionz Az a Ridah", "Dr. Dre - Still D.R.E.", "Ice Cube - It Was A Good Day"],
    dj: "DJ Pooh",
    genre: "Classic Hip-Hop",
    logo: "/logos/west-coast.png",
  },
  {
    id: "rebel",
    name: "Rebel Radio",
    videoId: "lfJfJjJ1Wnk", // GTA V & GTA Online — Rebel Radio
    position: { top: "60%", left: "75%" },
    color: "#8b4513",
    tracks: [
      "Charlie Feathers - Can't Hardly Stand It",
      "Johnny Cash - General Lee",
      "Waylon Jennings - Are You Sure Hank Done It This Way",
    ],
    dj: "Jesco White",
    genre: "Country",
    logo: "/logos/rebel.png",
  },
  {
    id: "lowdown",
    name: "The Lowdown 91.1",
    videoId: "RQmEERvqq70", // GTA V & GTA Online — The Lowdown 91.1
    position: { top: "60%", left: "25%" },
    color: "#800080",
    tracks: [
      "War - The Cisco Kid",
      "The Delfonics - Ready or Not Here I Come",
      "The Dramatics - Whatcha See is Whatcha Get",
    ],
    dj: "Pam Grier",
    genre: "Soul",
    logo: "/logos/lowdown.png",
  },
  {
    id: "blue-ark",
    name: "Blue Ark",
    videoId: "MxwSVvvmDP4", // GTA V & GTA Online — Blue Ark
    position: { top: "70%", left: "30%" },
    color: "#1e90ff",
    tracks: ["Chronixx - Odd Ras", "Dennis Brown - Money In My Pocket", "Gregory Isaacs - Night Nurse"],
    dj: "Lee 'Scratch' Perry",
    genre: "Reggae",
    logo: "/logos/blue-ark.png",
  },
  {
    id: "worldwide",
    name: "WorldWide FM",
    videoId: "cdH0WJfM7Jw", // GTA V & GTA Online — Worldwide FM
    position: { top: "75%", left: "40%" },
    color: "#008080",
    tracks: ["Cashmere Cat - Mirror Maru", "Trickski - Beginning", "Mala - Ghost"],
    dj: "Gilles Peterson",
    genre: "Chillwave",
    logo: "/logos/worldwide.png",
  },
  {
    id: "channel-x",
    name: "Channel X",
    videoId: "woRc1uAjGPE", // GTA V & GTA Online — Channel X
    position: { top: "35%", left: "75%" },
    color: "#ffffff",
    tracks: ["Black Flag - My War", "Descendents - Pervert", "Circle Jerks - Rock House"],
    dj: "Keith Morris",
    genre: "Punk",
    logo: "/logos/channel-x.png",
  },
  {
    id: "radio-mirror",
    name: "Radio Mirror Park",
    videoId: "F6JwsEkMkQs", // GTA V & GTA Online — Radio Mirror Park
    position: { top: "45%", left: "25%" },
    color: "#9370db",
    tracks: ["Twin Shadow - Old Love / New Love", "Toro Y Moi - So Many Details", "Yeasayer - Don't Come Close"],
    dj: "Twin Shadow",
    genre: "Indie",
    logo: "/logos/radio-mirror.png",
  },
  {
    id: "soulwax",
    name: "Soulwax FM",
    videoId: "B1Oe70ySZs4", // GTA V & GTA Online — Soulwax FM
    position: { top: "25%", left: "20%" },
    color: "#ff4500",
    tracks: ["Palmbomen - Stock", "Fatal Error - Fatal Error", "Supersempfft - Let's Beam Him Up"],
    dj: "Soulwax",
    genre: "Electro House",
    logo: "/logos/soulwax.png",
  },
  {
    id: "flylo",
    name: "FlyLo FM",
    videoId: "XCUhH_g4JJM", // GTA V & GTA Online — FlyLo FM
    position: { top: "35%", left: "25%" },
    color: "#ff8c00",
    tracks: ["Flying Lotus - Computer Face", "Clams Casino - Crystals", "Hudson Mohawke - 100hm"],
    dj: "Flying Lotus",
    genre: "IDM",
    logo: "/logos/flylo.png",
  },
  {
    id: "vinewood",
    name: "Vinewood Boulevard",
    videoId: "95DpzqQ2ozc", // GTA V & GTA Online — Vinewood Boulevard Radio
    position: { top: "20%", left: "30%" },
    color: "#ff4500",
    tracks: ["Moon Duo - Sleepwalker", "Wavves - Nine Is God", "FIDLAR - Cocaine"],
    dj: "Nate & Stephen",
    genre: "Alternative Rock",
    logo: "/logos/vinewood.png",
  },
  {
    id: "ls-underground",
    name: "LS Underground Radio",
    videoId: "tmPDuCxrUKM", // GTA V & GTA Online — Los Santos Underground Radio
    position: { top: "40%", left: "70%" },
    color: "#c0c0c0",
    tracks: ["Solomun - Customer Is King", "Tale Of Us - Solitude", "Dixon - Polymorphic"],
    dj: "Various DJs",
    genre: "Techno",
    logo: "/logos/ls-underground.png",
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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<any>(null)

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
  const changeStation = (station: (typeof radioStations)[0]) => {
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
  const handleVolumeChange = (value: number[]) => {
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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video/image */}
      <div className="absolute inset-0 bg-black/80">
        <div className="absolute inset-0 bg-[url('/gta-city-bg.jpg')] bg-cover bg-center opacity-30 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
      </div>

      {/* Main radio interface */}
      <div className="relative z-10 max-w-4xl mx-auto h-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-black/70 backdrop-blur-md rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Radio header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white font-display">GTA Radio</h1>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
              <button onClick={togglePlayback} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                {isPlaying ? <Square className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Radio content */}
          <div className="p-6">
            {/* Station visualization (instead of YouTube video) */}
            <div
              className={cn(
                "relative aspect-video rounded-lg overflow-hidden border-4 border-gray-800 shadow-neon transition-all duration-500 flex items-center justify-center",
                selectedStation && `shadow-[0_0_15px_rgba(${hexToRgb(selectedStation.color)},0.7)]`,
              )}
            >
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

              {/* Visual station representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center p-6">
                {/* Station logo */}
                <div
                  className={cn(
                    "w-32 h-32 md:w-40 md:h-40 rounded-full bg-white flex items-center justify-center mb-4 transition-all duration-500",
                    isChangingStation && "animate-pulse",
                  )}
                  style={{
                    boxShadow: `0 0 20px ${selectedStation.color}`,
                    background: `radial-gradient(circle, white 60%, ${selectedStation.color}40 100%)`,
                  }}
                >
                  <div className="text-lg md:text-xl font-bold text-center text-black leading-tight">
                    {selectedStation.name.split(" ").map((word, i) => (
                      <div key={i}>{word}</div>
                    ))}
                  </div>
                </div>

                {/* Visualizer bars */}
                {isPlaying && !isChangingStation && (
                  <div className="flex items-end justify-center gap-1 h-16 mt-4">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-white rounded-sm visualizer-bar"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDuration: `${0.5 + Math.random() * 0.5}s`,
                          backgroundColor: selectedStation.color,
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Station info overlay */}
                {showStationInfo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 transition-opacity duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Now Playing on {selectedStation.name}</div>
                        <div className="text-lg font-bold">{currentTrack}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">DJ: {selectedStation.dj}</div>
                        <div className="text-sm">{selectedStation.genre}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay during station change */}
              {isChangingStation && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <div className="text-white text-xl font-bold animate-pulse">Tuning to {selectedStation.name}...</div>
                </div>
              )}
            </div>

            {/* Station info */}
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-white font-display">{selectedStation.name}</h2>
              <p className="text-gray-400 mt-1">{currentTrack}</p>
            </div>

            {/* Volume slider */}
            <div className="mt-6 flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>

            {/* Fake tuner */}
            <div className="mt-6 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 relative"
                style={{
                  width: `${((radioStations.findIndex((s) => s.id === selectedStation.id) + 1) / radioStations.length) * 100}%`,
                  transition: "width 0.5s ease-in-out",
                }}
              >
                <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full transform translate-x-1/2 -translate-y-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Radio station selection */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            {radioStations.map((station) => (
              <div
                key={station.id}
                className="absolute pointer-events-auto"
                style={{
                  top: station.position.top,
                  left: station.position.left,
                  transform: station.position.transform || "translate(-50%, -50%)",
                }}
              >
                <StationLogo
                  station={station}
                  isSelected={selectedStation.id === station.id}
                  onClick={() => changeStation(station)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Location name */}
        <div className="absolute bottom-4 right-4 z-30 text-white text-xl italic font-light">Los Santos</div>
      </div>

      <style jsx>{`
        .visualizer-bar {
          animation: visualize infinite ease-in-out alternate;
        }
        
        @keyframes visualize {
          0% {
            height: 10%;
          }
          100% {
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  // Remove the # if present
  hex = hex.replace("#", "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16) || 0
  const g = Number.parseInt(hex.substring(2, 4), 16) || 0
  const b = Number.parseInt(hex.substring(4, 6), 16) || 0

  return `${r},${g},${b}`
}

