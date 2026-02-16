"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface MorphLoaderProps {
  className?: string;
  size?: number;
}

export function MorphLoader({ className, size = 80 }: MorphLoaderProps) {
  // Generate noise-like morph keyframes
  const morphKeyframes = useMemo(() => [
    "60% 40% 30% 70% / 60% 30% 70% 40%",
    "30% 60% 70% 40% / 50% 60% 30% 60%",
    "40% 60% 60% 40% / 60% 40% 60% 40%",
    "60% 40% 30% 70% / 40% 70% 40% 60%",
    "40% 60% 70% 30% / 60% 40% 60% 40%",
    "70% 30% 50% 50% / 30% 60% 70% 40%",
    "50% 50% 60% 40% / 50% 50% 40% 60%",
    "60% 40% 30% 70% / 60% 30% 70% 40%",
  ], []);

  const colorKeyframes = useMemo(() => [
    "linear-gradient(45deg, #8b5cf6, #d946ef, #8b5cf6)",
    "linear-gradient(90deg, #d946ef, #06b6d4, #d946ef)",
    "linear-gradient(135deg, #06b6d4, #8b5cf6, #06b6d4)",
    "linear-gradient(180deg, #8b5cf6, #f472b6, #8b5cf6)",
    "linear-gradient(225deg, #f472b6, #d946ef, #f472b6)",
    "linear-gradient(270deg, #d946ef, #8b5cf6, #d946ef)",
    "linear-gradient(315deg, #8b5cf6, #06b6d4, #8b5cf6)",
    "linear-gradient(45deg, #8b5cf6, #d946ef, #8b5cf6)",
  ], []);

  // Particle trail positions
  const particles = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      angle: (i * 30) * Math.PI / 180,
      distance: size * 0.5 + Math.random() * size * 0.2,
      size: 3 + Math.random() * 4,
      delay: i * 0.15,
    })), [size]);

  return (
    <div 
      className={cn("relative", className)} 
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      <motion.div
        className="absolute"
        style={{
          inset: "-20%",
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: "50%",
            top: "50%",
            background: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#d946ef" : "#06b6d4",
            boxShadow: `0 0 ${particle.size * 2}px currentColor`,
          }}
          animate={{
            x: [
              Math.cos(particle.angle) * size * 0.3,
              Math.cos(particle.angle + Math.PI * 0.5) * particle.distance,
              Math.cos(particle.angle + Math.PI) * size * 0.3,
              Math.cos(particle.angle + Math.PI * 1.5) * particle.distance,
              Math.cos(particle.angle) * size * 0.3,
            ],
            y: [
              Math.sin(particle.angle) * size * 0.3,
              Math.sin(particle.angle + Math.PI * 0.5) * particle.distance,
              Math.sin(particle.angle + Math.PI) * size * 0.3,
              Math.sin(particle.angle + Math.PI * 1.5) * particle.distance,
              Math.sin(particle.angle) * size * 0.3,
            ],
            opacity: [0.2, 0.8, 0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="absolute"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          filter: "blur(8px)",
          opacity: 0.5,
        }}
        animate={{
          borderRadius: morphKeyframes,
          background: colorKeyframes,
          rotate: [0, -180, -360],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute overflow-hidden"
        style={{
          width: size,
          height: size,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          borderRadius: morphKeyframes,
          background: colorKeyframes,
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.15,
            mixBlendMode: "overlay",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "40%",
            height: "40%",
            top: "15%",
            left: "15%",
            background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
            filter: "blur(5px)",
          }}
          animate={{
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, 10, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute inset-[20%] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.2,
          height: size * 1.2,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          border: "2px solid rgba(139,92,246,0.3)",
          filter: "blur(2px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
          borderRadius: morphKeyframes,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
