"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipLoaderProps {
  className?: string;
  size?: number;
}

const faceColors = [
  { bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", glow: "#8b5cf6" },
  { bg: "linear-gradient(135deg, #d946ef 0%, #c026d3 100%)", glow: "#d946ef" },
  { bg: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", glow: "#06b6d4" },
  { bg: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)", glow: "#f472b6" },
  { bg: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)", glow: "#a855f7" },
  { bg: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)", glow: "#22d3ee" },
];

export function FlipLoader({ className, size = 60 }: FlipLoaderProps) {
  const halfSize = size / 2;

  return (
    <div 
      className={cn("relative", className)} 
      style={{ 
        width: size, 
        height: size, 
        perspective: size * 4,
      }}
    >
      <motion.div
        className="absolute"
        style={{
          width: size * 1.2,
          height: size * 0.3,
          left: "50%",
          bottom: -size * 0.4,
          x: "-50%",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{
          scaleX: [1, 0.8, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: [0, 0, 90, 90, 180, 180, 270, 270, 360],
          rotateY: [0, 90, 90, 180, 180, 270, 270, 360, 360],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: [0.68, -0.55, 0.27, 1.55], // Spring-like easing
          times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        }}
      >
        <motion.div
          className="absolute rounded-xl"
          style={{
            width: size,
            height: size,
            background: faceColors[0].bg,
            transform: `translateZ(${halfSize}px)`,
            boxShadow: `0 0 ${size * 0.4}px ${faceColors[0].glow}60`,
          }}
        >
          <CubeFaceContent size={size} color={faceColors[0].glow} />
        </motion.div>
        <motion.div
          className="absolute rounded-xl"
          style={{
            width: size,
            height: size,
            background: faceColors[1].bg,
            transform: `translateZ(${-halfSize}px) rotateY(180deg)`,
            boxShadow: `0 0 ${size * 0.4}px ${faceColors[1].glow}60`,
          }}
        >
          <CubeFaceContent size={size} color={faceColors[1].glow} />
        </motion.div>
        <motion.div
          className="absolute rounded-xl"
          style={{
            width: size,
            height: size,
            background: faceColors[2].bg,
            transform: `rotateY(90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 ${size * 0.4}px ${faceColors[2].glow}60`,
          }}
        >
          <CubeFaceContent size={size} color={faceColors[2].glow} />
        </motion.div>
        <motion.div
          className="absolute rounded-xl"
          style={{
            width: size,
            height: size,
            background: faceColors[3].bg,
            transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 ${size * 0.4}px ${faceColors[3].glow}60`,
          }}
        >
          <CubeFaceContent size={size} color={faceColors[3].glow} />
        </motion.div>
        <motion.div
          className="absolute rounded-xl"
          style={{
            width: size,
            height: size,
            background: faceColors[4].bg,
            transform: `rotateX(90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 ${size * 0.4}px ${faceColors[4].glow}60`,
          }}
        >
          <CubeFaceContent size={size} color={faceColors[4].glow} />
        </motion.div>
        <motion.div
          className="absolute rounded-xl"
          style={{
            width: size,
            height: size,
            background: faceColors[5].bg,
            transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
            boxShadow: `0 0 ${size * 0.4}px ${faceColors[5].glow}60`,
          }}
        >
          <CubeFaceContent size={size} color={faceColors[5].glow} />
        </motion.div>
      </motion.div>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            background: faceColors[i].glow,
            left: "50%",
            top: "50%",
            boxShadow: `0 0 8px ${faceColors[i].glow}`,
          }}
          animate={{
            x: [0, Math.cos(i * 60 * Math.PI / 180) * size],
            y: [0, Math.sin(i * 60 * Math.PI / 180) * size],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function CubeFaceContent({ size, color }: { size: number; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60%",
          height: "60%",
          top: "10%",
          left: "10%",
          background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          border: `2px solid ${color}80`,
          boxShadow: `inset 0 0 ${size * 0.2}px ${color}40`,
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, white 0%, ${color} 100%)`,
          boxShadow: `0 0 ${size * 0.2}px ${color}`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
