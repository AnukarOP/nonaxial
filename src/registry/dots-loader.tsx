"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface DotsLoaderProps {
  className?: string;
  size?: number;
}

export function DotsLoader({ className, size = 80 }: DotsLoaderProps) {
  const dotCount = 12;
  const helixHeight = size * 1.2;
  const helixRadius = size * 0.35;
  const dotSize = size * 0.1;

  const colorWave = useMemo(() => [
    "#06b6d4", "#8b5cf6", "#d946ef", "#f472b6", 
    "#fb7185", "#f472b6", "#d946ef", "#8b5cf6",
    "#06b6d4", "#22d3ee", "#06b6d4", "#8b5cf6",
  ], []);

  return (
    <div 
      className={cn("relative", className)} 
      style={{ 
        width: size, 
        height: helixHeight,
        perspective: size * 3,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
          filter: "blur(15px)",
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: dotCount }).map((_, i) => {
          const yPos = (i / dotCount) * helixHeight;
          const angle = (i / dotCount) * 360 * 2; // Two full rotations
          const xOffset = Math.cos(angle * Math.PI / 180) * helixRadius;
          const zOffset = Math.sin(angle * Math.PI / 180) * helixRadius;
          const color = colorWave[i % colorWave.length];

          return (
            <motion.div
              key={`a-${i}`}
              className="absolute rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                left: "50%",
                top: yPos,
                x: xOffset - dotSize / 2,
                z: zOffset,
                background: `radial-gradient(circle at 30% 30%, white, ${color})`,
                boxShadow: `0 0 ${dotSize}px ${color}, 0 0 ${dotSize * 2}px ${color}60`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          );
        })}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: dotCount }).map((_, i) => {
          const yPos = (i / dotCount) * helixHeight;
          const angle = (i / dotCount) * 360 * 2 + 180; // Opposite phase
          const xOffset = Math.cos(angle * Math.PI / 180) * helixRadius;
          const zOffset = Math.sin(angle * Math.PI / 180) * helixRadius;
          const color = colorWave[(i + 6) % colorWave.length];

          return (
            <motion.div
              key={`b-${i}`}
              className="absolute rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                left: "50%",
                top: yPos,
                x: xOffset - dotSize / 2,
                z: zOffset,
                background: `radial-gradient(circle at 30% 30%, white, ${color})`,
                boxShadow: `0 0 ${dotSize}px ${color}, 0 0 ${dotSize * 2}px ${color}60`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1 + 0.5,
              }}
            />
          );
        })}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: dotCount }).map((_, i) => {
          const yPos = (i / dotCount) * helixHeight + dotSize / 2;
          const angle = (i / dotCount) * 360 * 2;
          const color = colorWave[i % colorWave.length];

          return (
            <motion.div
              key={`line-${i}`}
              className="absolute"
              style={{
                width: helixRadius * 2,
                height: 2,
                left: "50%",
                top: yPos,
                x: "-50%",
                transformOrigin: "center",
                transform: `rotateY(${angle}deg)`,
                background: `linear-gradient(90deg, ${color}80, ${color}20, ${color}80)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          );
        })}
      </motion.div>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`spiral-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            left: "50%",
            background: colorWave[i * 2],
            boxShadow: `0 0 8px ${colorWave[i * 2]}`,
          }}
          animate={{
            top: [0, helixHeight],
            x: [
              Math.cos(0) * helixRadius * 0.8,
              Math.cos(Math.PI) * helixRadius * 0.8,
              Math.cos(Math.PI * 2) * helixRadius * 0.8,
            ],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear",
          }}
        />
      ))}
      <motion.div
        className="absolute left-0 right-0 h-[20%]"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.3), transparent)",
          filter: "blur(5px)",
        }}
        animate={{
          top: ["-20%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
