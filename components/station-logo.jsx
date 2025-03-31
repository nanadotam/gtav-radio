import { cn } from "@/lib/utils"

export default function StationLogo({ station, isSelected }) {
  // Different logo styles based on station
  const renderLogo = () => {
    switch (station.id) {
      case "ls-underground":
        return (
          <div
            className="flex items-center justify-center w-full h-full rounded-lg border-4 p-2"
            style={{
              borderColor: station.color,
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
          >
            <div className="text-2xl font-bold" style={{ color: station.color }}>
              {station.displayName}
            </div>
          </div>
        )

      case "vinewood":
        return (
          <div
            className="flex items-center justify-center w-full h-full rounded-3xl border-2 p-2"
            style={{
              borderColor: station.color,
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
          >
            <div className="text-xl font-bold text-white">{station.displayName}</div>
          </div>
        )

      case "v-rock":
        return (
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold mb-1" style={{ color: station.color }}>
              V
            </div>
            <div className="text-white font-bold text-lg">RADIO</div>
          </div>
        )

      case "west-coast":
        return (
          <div
            className="flex items-center justify-center w-full h-full rounded-full border-4 p-2 aspect-square"
            style={{
              borderColor: station.color,
              backgroundColor: isSelected ? station.color + "20" : "transparent",
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
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
            className="flex items-center justify-center w-full h-full rounded-full border-4 p-2 aspect-square"
            style={{
              borderColor: station.color,
              backgroundColor: isSelected ? station.color + "20" : "transparent",
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
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
          <div className="flex flex-col items-center">
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
            className="flex items-center justify-center w-full h-full rounded-lg border-2 p-2"
            style={{
              borderColor: station.color,
              boxShadow: isSelected ? `0 0 15px ${station.color}` : "none",
            }}
          >
            <div className="text-lg font-bold" style={{ color: station.color }}>
              {station.displayName}
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn("transition-all duration-300", isSelected ? "opacity-100" : "opacity-80 hover:opacity-100")}>
      {renderLogo()}
    </div>
  )
}

