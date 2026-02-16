"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseLoaderProps {
  className?: string;
  size?: number;
  color?: string;
}

export function PulseLoader({ className, size = 80, color = "#ef4444" }: PulseLoaderProps) {
  const ekgWidth = size * 2.5;
  const ekgHeight = size * 0.6;
  
  // EKG path points
  const ekgPath = `M 0,${ekgHeight/2} 
    L ${ekgWidth * 0.15},${ekgHeight/2} 
    L ${ekgWidth * 0.2},${ekgHeight/2} 
    L ${ekgWidth * 0.25},${ekgHeight * 0.8} 
    L ${ekgWidth * 0.3},${ekgHeight * 0.2} 
    L ${ekgWidth * 0.35},${ekgHeight * 0.9} 
    L ${ekgWidth * 0.4},${ekgHeight * 0.1} 
    L ${ekgWidth * 0.45},${ekgHeight/2} 
    L ${ekgWidth * 0.5},${ekgHeight/2} 
    L ${ekgWidth * 0.55},${ekgHeight * 0.4} 
    L ${ekgWidth * 0.6},${ekgHeight/2} 
    L ${ekgWidth},${ekgHeight/2}`;

  return (
    <div className={cn("relative flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={`ring-${index}`}
            className="absolute rounded-full"
            style={{
              inset: -index * 8,
              border: `2px solid ${color}`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4 - index * 0.1, 0, 0.4 - index * 0.1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeOut",
            }}
          />
        ))}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: "-20%",
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: "blur(10px)",
          }}
          animate={{
            scale: [0.8, 1.3, 0.9, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            times: [0, 0.15, 0.3, 0.45, 1],
          }}
        />
        <motion.div
          className="absolute inset-[15%] rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}ff 0%, ${color}cc 50%, ${color}99 100%)`,
            boxShadow: `0 0 ${size * 0.3}px ${color}, 0 0 ${size * 0.5}px ${color}80`,
          }}
          animate={{
            scale: [1, 1.25, 1.05, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            times: [0, 0.15, 0.3, 0.45, 1],
            ease: "easeOut",
          }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "30%",
              height: "30%",
              top: "15%",
              left: "20%",
              background: "rgba(255,255,255,0.5)",
              filter: "blur(3px)",
            }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-[30%] rounded-full"
          style={{
            background: `radial-gradient(circle, white 0%, ${color} 100%)`,
          }}
          animate={{
            scale: [1, 1.4, 1.1, 1.3, 1],
            opacity: [0.8, 1, 0.9, 1, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            times: [0, 0.15, 0.3, 0.45, 1],
          }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: color,
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              x: [0, Math.cos(i * 45 * Math.PI / 180) * size * 0.8],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * size * 0.8],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.1,
              repeatDelay: 0.6,
            }}
          />
        ))}
      </div>
      <div className="relative overflow-hidden" style={{ width: ekgWidth, height: ekgHeight }}>
        <svg
          width={ekgWidth}
          height={ekgHeight}
          className="absolute"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        >
          <motion.path
            d={ekgPath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.path
            d={ekgPath}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "blur(3px)" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            background: "white",
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            top: ekgHeight / 2 - 4,
          }}
          animate={{
            left: [0, ekgWidth],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
