"use client"

import { useState, useEffect } from "react"

export default function RetroBackground() {
  const [stars, setStars] = useState([])

  useEffect(() => {
    // Generate stars on the client side to avoid hydration mismatch
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      key: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: Math.random() * 5,
      animationDuration: Math.random() * 3 + 2,
    }))
    setStars(generatedStars)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a0080] to-[#1a0933]"></div>

      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.key}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
            }}
          ></div>
        ))}
      </div>

      {/* City silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-[#2d0b4e]">
        {/* Buildings */}
        <div className="absolute bottom-0 left-0 right-0 h-full">
          {/* Building 1 */}
          <div className="absolute bottom-0 left-[5%] w-[5%] h-[40%] bg-[#2d0b4e]"></div>
          {/* Building 2 */}
          <div className="absolute bottom-0 left-[12%] w-[8%] h-[70%] bg-[#2d0b4e]">
            <div className="absolute top-[10%] left-[20%] right-[20%] bottom-0 flex flex-col gap-[10%]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full h-[5%] bg-[#ff3e96] opacity-20"></div>
              ))}
            </div>
          </div>
          {/* Building 3 */}
          <div className="absolute bottom-0 left-[22%] w-[6%] h-[50%] bg-[#2d0b4e]"></div>
          {/* Building 4 */}
          <div className="absolute bottom-0 left-[30%] w-[10%] h-[80%] bg-[#2d0b4e]">
            <div className="absolute top-0 left-0 right-0 h-[20%] bg-[#2d0b4e]"></div>
          </div>
          {/* Building 5 */}
          <div className="absolute bottom-0 left-[42%] w-[8%] h-[100%] bg-[#2d0b4e]">
            <div className="absolute top-[10%] left-[30%] right-[30%] h-[20%] bg-[#2d0b4e]"></div>
          </div>
          {/* Building 6 */}
          <div className="absolute bottom-0 left-[52%] w-[7%] h-[60%] bg-[#2d0b4e]"></div>
          {/* Building 7 */}
          <div className="absolute bottom-0 left-[61%] w-[9%] h-[75%] bg-[#2d0b4e]"></div>
          {/* Building 8 */}
          <div className="absolute bottom-0 left-[72%] w-[5%] h-[45%] bg-[#2d0b4e]"></div>
          {/* Building 9 */}
          <div className="absolute bottom-0 left-[79%] w-[7%] h-[55%] bg-[#2d0b4e]"></div>
          {/* Building 10 */}
          <div className="absolute bottom-0 left-[88%] w-[10%] h-[65%] bg-[#2d0b4e]"></div>
        </div>
      </div>

      {/* Palm trees */}
      <div className="absolute bottom-[28vh] left-[5%] w-[15%] h-[25vh]">
        <div className="absolute bottom-0 left-[50%] w-[10%] h-[40%] bg-[#1a0933] transform -translate-x-1/2"></div>
        <div className="absolute bottom-[40%] left-[50%] transform -translate-x-1/2]">
          <div className="relative">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[20px] h-[80px] bg-[#1a0933] origin-bottom"
                style={{
                  transform: `rotate(${i * 30 - 90}deg)`,
                  borderRadius: "100% 0 0 0",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[28vh] right-[5%] w-[15%] h-[25vh]">
        <div className="absolute bottom-0 left-[50%] w-[10%] h-[40%] bg-[#1a0933] transform -translate-x-1/2"></div>
        <div className="absolute bottom-[40%] left-[50%] transform -translate-x-1/2]">
          <div className="relative">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[20px] h-[80px] bg-[#1a0933] origin-bottom"
                style={{
                  transform: `rotate(${i * 30 - 90}deg)`,
                  borderRadius: "100% 0 0 0",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

