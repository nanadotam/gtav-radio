"use client"

import { cn } from "@/lib/utils"

type StationProps = {
  station: {
    id: string
    name: string
    color: string
  }
  isSelected: boolean
  onClick: () => void
}

export default function StationLogo({ station, isSelected, onClick }: StationProps) {
  return (
    <button
      className={cn(
        "w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 hover:scale-110",
        isSelected && "ring-4 ring-opacity-70 scale-110",
        isSelected && `ring-[${station.color}]`,
      )}
      style={{
        boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
        background: isSelected ? `radial-gradient(circle, white 60%, ${station.color}40 100%)` : "white",
      }}
      onClick={onClick}
    >
      <div className="text-xs md:text-sm font-bold text-center text-black leading-tight">
        {station.name.split(" ").map((word, i) => (
          <div key={i}>{word}</div>
        ))}
      </div>
    </button>
  )
}

