"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const radioStations = [
  {
    id: "los-santos",
    name: "Radio Los Santos",
    position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    highlighted: true,
  },
  { id: "ls-ur", name: "LS UR", position: { top: "20%", left: "40%" } },
  { id: "blended", name: "Blended", position: { top: "20%", left: "30%" } },
  { id: "rock-radio", name: "Rock Radio", position: { top: "20%", left: "60%" } },
  { id: "vinewood", name: "Vinewood Boulevard", position: { top: "25%", left: "20%" } },
  { id: "space", name: "Space", position: { top: "35%", left: "25%" } },
  { id: "mirror-park", name: "Radio Mirror Park", position: { top: "45%", left: "25%" } },
  { id: "fly-fm", name: "Fly FM", position: { top: "70%", left: "30%" } },
  { id: "worldwide", name: "Worldwide", position: { top: "75%", left: "40%" } },
  { id: "west-coast", name: "West Coast Classics", position: { top: "75%", left: "60%" } },
  { id: "stop-pop", name: "Stop Pop", position: { top: "25%", left: "70%" } },
  { id: "channel-x", name: "Channel X", position: { top: "35%", left: "75%" } },
  { id: "rebel", name: "Rebel Radio", position: { top: "60%", left: "75%" } },
  { id: "lowdown", name: "The Lowdown", position: { top: "60%", left: "25%" } },
  { id: "blue-ark", name: "Blue Ark", position: { top: "65%", left: "65%" } },
]

export default function Component() {
  const [selectedStation, setSelectedStation] = useState("los-santos")

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Dark rainy background */}
      <div className="absolute inset-0 bg-black/80">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
        {/* Rain effect */}
        <div className="absolute inset-0 opacity-50 pointer-events-none rain-effect"></div>
      </div>

      {/* Car interior view */}
      <div className="absolute inset-0 z-10">
        {/* Steering wheel and hands */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
              <div className="relative w-full h-[300px]">
                {/* Steering wheel */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] rounded-full border-4 border-gray-800 bg-black/50"></div>

                {/* Left hand */}
                <div className="absolute bottom-[100px] left-[calc(50%-120px)] w-[100px] h-[180px] bg-gray-300 rounded-full transform rotate-45"></div>

                {/* Right hand */}
                <div className="absolute bottom-[100px] right-[calc(50%-120px)] w-[100px] h-[180px] bg-gray-300 rounded-full transform -rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard/speedometer */}
        <div className="absolute bottom-[300px] right-[100px] w-[200px] h-[100px] bg-black/80 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80px] h-[80px] rounded-full border-2 border-gray-600 bg-black flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full border border-gray-700 bg-black/90 flex items-center justify-center text-white text-xs">
                <div className="transform -rotate-45">
                  <div className="absolute top-[10px] left-[30px] text-[8px] text-gray-400">20</div>
                  <div className="absolute top-[20px] right-[10px] text-[8px] text-gray-400">40</div>
                  <div className="absolute bottom-[10px] right-[25px] text-[8px] text-gray-400">60</div>
                  <div className="absolute bottom-[20px] left-[10px] text-[8px] text-gray-400">80</div>
                  <div className="h-[30px] w-[1px] bg-white absolute top-[15px] left-[30px] transform origin-bottom rotate-[30deg]"></div>
                </div>
              </div>
            </div>
            <div className="w-[80px] h-[80px] rounded-full border-2 border-gray-600 bg-black ml-2 flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full border border-gray-700 bg-black/90"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Radio station interface */}
      <div className="absolute inset-0 z-20">
        {/* Radio station logos */}
        {radioStations.map((station) => (
          <div
            key={station.id}
            className={cn(
              "absolute w-[60px] h-[60px] rounded-full bg-white/90 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
              station.highlighted && "ring-4 ring-blue-400 ring-opacity-70 bg-blue-100",
            )}
            style={{
              top: station.position.top,
              left: station.position.left,
              transform: station.position.transform || "translate(-50%, -50%)",
            }}
            onClick={() => setSelectedStation(station.id)}
          >
            <div className="text-[8px] font-bold text-center text-black">
              {station.name.split(" ").map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
          </div>
        ))}

        {/* Selected station info */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Radio Los Santos</h2>
          <div className="flex flex-col gap-1">
            <div className="text-lg font-medium">FUTURE</div>
            <div className="text-lg font-medium">How It Was</div>
          </div>
        </div>
      </div>

      {/* HUD elements */}
      <div className="absolute bottom-4 left-4 z-30">
        {/* Mini map */}
        <div className="w-[150px] h-[100px] bg-gray-800 rounded-sm overflow-hidden">
          <div className="w-full h-full bg-gray-900 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-[30%] left-[40%] w-[40px] h-[1px] bg-gray-600"></div>
            <div className="absolute top-[60%] left-[20%] w-[80px] h-[1px] bg-gray-600"></div>
            <div className="absolute top-[40%] left-[30%] w-[1px] h-[30px] bg-gray-600"></div>
            <div className="absolute top-[20%] left-[70%] w-[1px] h-[40px] bg-gray-600"></div>
          </div>
        </div>

        {/* Health/status bars */}
        <div className="flex mt-1 gap-1">
          <div className="h-2 w-[50px] bg-green-500 rounded-sm"></div>
          <div className="h-2 w-[50px] bg-blue-500 rounded-sm"></div>
          <div className="h-2 w-[50px] bg-yellow-500 rounded-sm"></div>
        </div>
      </div>

      {/* Location name */}
      <div className="absolute bottom-4 right-4 z-30 text-white text-xl italic font-light">La Puerta</div>

      <style jsx>{`
        .rain-effect {
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%);
          background-size: 20px 100px;
          animation: rain 0.5s linear infinite;
        }
        
        @keyframes rain {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 20px 100px;
          }
        }
      `}</style>
    </div>
  )
}

