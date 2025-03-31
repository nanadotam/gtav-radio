import Image from "next/image"
import { cn } from "@/lib/utils"

export default function StationLogo({ station, isSelected, onClick, isChanging }) {
  // Different logo styles based on station
  const renderLogo = () => {
    // If station has an icon path, render the image
    if (station.iconPath) {
      return (
        <div
          className={cn(
            "relative flex items-center justify-center w-full h-full rounded-full border-4 p-2 aspect-square overflow-hidden",
            isSelected ? "border-opacity-100" : "border-opacity-70",
            isChanging && isSelected ? "static-noise station-tuning" : ""
          )}
          style={{
            borderColor: station.color,
            backgroundColor: isSelected ? station.color + "20" : "transparent",
            boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
          }}
          onClick={onClick}
        >
          <Image
            src={station.iconPath}
            alt={station.name}
            className={cn(
              "object-cover rounded-full",
              isChanging && isSelected ? "opacity-80" : ""
            )}
            fill
            priority
            sizes="(max-width: 768px) 80px, 100px"
          />
        </div>
      )
    }

    // Fallback to the previous rendering logic
    switch (station.id) {
      case "ls-underground":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-full h-full rounded-lg border-4 p-2",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )}
            style={{
              borderColor: station.color,
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
            onClick={onClick}
          >
            <div className="text-2xl font-bold" style={{ color: station.color }}>
              {station.displayName}
            </div>
          </div>
        )

      case "vinewood":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-full h-full rounded-3xl border-2 p-2",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )}
            style={{
              borderColor: station.color,
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
            onClick={onClick}
          >
            <div className="text-xl font-bold text-white">{station.displayName}</div>
          </div>
        )

      case "v-rock":
        return (
          <div 
            className={cn(
              "flex flex-col items-center",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )} 
            onClick={onClick}
          >
            <div className="text-5xl font-bold mb-1" style={{ color: station.color }}>
              V
            </div>
            <div className="text-white font-bold text-lg">RADIO</div>
          </div>
        )

      case "west-coast":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-full h-full rounded-full border-4 p-2 aspect-square",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )}
            style={{
              borderColor: station.color,
              backgroundColor: isSelected ? station.color + "20" : "transparent",
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
            onClick={onClick}
          >
            <div className="text-center">
              <div className="text-sm font-bold" style={{ color: station.color }}>
                WEST
                <br />
                COAST
                <br />
                CLASSICS
              </div>
            </div>
          </div>
        )

      case "los-santos-rock":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-full h-full rounded-full border-4 p-2 aspect-square",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )}
            style={{
              borderColor: station.color,
              backgroundColor: isSelected ? station.color + "20" : "transparent",
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
            onClick={onClick}
          >
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: station.color }}>
                LOS
                <br />
                SANTOS
                <br />
                ROCK
                <br />
                RADIO
              </div>
            </div>
          </div>
        )

      case "space":
        return (
          <div 
            className={cn(
              "flex flex-col items-center",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )} 
            onClick={onClick}
          >
            <div className="text-3xl font-bold" style={{ color: station.color }}>
              SPACE
            </div>
            <div className="text-4xl font-bold" style={{ color: station.color }}>
              103.2
            </div>
          </div>
        )

      default:
        return (
          <div
            className={cn(
              "flex items-center justify-center w-full h-full rounded-lg border-2 p-2",
              isChanging && isSelected ? "static-noise station-tuning" : ""
            )}
            style={{
              borderColor: station.color,
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
            onClick={onClick}
          >
            <div className="text-lg font-bold" style={{ color: station.color }}>
              {station.displayName}
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 cursor-pointer transform hover:scale-105",
        isSelected ? "opacity-100 scale-105" : "opacity-80 hover:opacity-100"
      )}
    >
      {renderLogo()}
    </div>
  )
}

