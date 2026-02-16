"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface WaveLoaderProps {
  className?: string;
  barCount?: number;
  barWidth?: number;
  barHeight?: number;
  color?: string;
}

export function WaveLoader({
  className,
  barCount = 12,
  barWidth = 6,
  barHeight = 50,
  color = "#8b5cf6",
}: WaveLoaderProps) {
  const gradientColors = useMemo(() => [
    "#06b6d4", // cyan
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#f472b6", // pink
    "#8b5cf6", // violet
    "#06b6d4", // cyan
  ], []);

  return (
    <div 
      className={cn("relative flex items-end justify-center", className)} 
      style={{ height: barHeight * 1.4, gap: barWidth * 0.3 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center bottom, ${color}30 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {Array.from({ length: barCount }).map((_, index) => {
        const colorIndex = Math.floor((index / barCount) * gradientColors.length);
        const barColor = gradientColors[colorIndex];
        const waveDelay = index * 0.08;
        const randomOffset = Math.sin(index * 0.5) * 0.2;

        return (
          <div key={index} className="relative" style={{ width: barWidth }}>
            {index % 3 === 0 && (
              <>
                {[...Array(3)].map((_, foamIndex) => (
                  <motion.div
                    key={`foam-${foamIndex}`}
                    className="absolute rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      background: "white",
                      left: barWidth / 2 - 2,
                    }}
                    animate={{
                      y: [0, -barHeight * 0.4 - foamIndex * 8],
                      x: [(foamIndex - 1) * 3, (foamIndex - 1) * 8],
                      opacity: [0, 0.8, 0],
                      scale: [0.5, 1, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: waveDelay + 0.3,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}

            <motion.div
              className="rounded-t-full relative overflow-hidden"
              style={{
                width: barWidth,
                height: barHeight,
                transformOrigin: "bottom",
              }}
              animate={{
                scaleY: [0.2 + randomOffset, 1, 0.2 + randomOffset],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: waveDelay,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${barColor}cc, ${barColor}, ${barColor}ee)`,
                }}
                animate={{
                  background: [
                    `linear-gradient(to top, ${barColor}cc, ${barColor}, ${barColor}ee)`,
                    `linear-gradient(to top, ${gradientColors[(colorIndex + 2) % gradientColors.length]}cc, ${gradientColors[(colorIndex + 1) % gradientColors.length]}, ${barColor}ee)`,
                    `linear-gradient(to top, ${barColor}cc, ${barColor}, ${barColor}ee)`,
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: waveDelay,
                }}
              />
              
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                animate={{
                  x: [-barWidth * 2, barWidth * 2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: waveDelay * 2,
                  ease: "linear",
                }}
              />

              <motion.div
                className="absolute top-0 left-0 right-0 rounded-t-full"
                style={{
                  height: barWidth,
                  background: `radial-gradient(ellipse at center, white 0%, ${barColor} 100%)`,
                  boxShadow: `0 0 ${barWidth}px ${barColor}`,
                }}
              />
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-1/2"
              style={{
                width: barWidth * 2,
                height: 4,
                x: "-50%",
                background: `radial-gradient(ellipse, ${barColor}60 0%, transparent 70%)`,
              }}
              animate={{
                scaleX: [0.5, 1.5, 0.5],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: waveDelay,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
