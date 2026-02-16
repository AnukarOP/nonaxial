"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatTextProps {
  children: string;
  className?: string;
  floatDistance?: number;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface MicroMovement {
  xAmplitude: number;
  yAmplitude: number;
  rotateAmplitude: number;
  duration: number;
  phase: number;
}

function FloatLetter({ 
  char, 
  index, 
  floatDistance 
}: { 
  char: string; 
  index: number;
  floatDistance: number;
}) {
  // Complex micro-movement parameters for zero-gravity effect
  const microMovement: MicroMovement = useMemo(() => ({
    xAmplitude: 3 + ((Math.sin(index * 3.7) + 1) / 2) * 4,
    yAmplitude: floatDistance + ((Math.sin(index * 5.3) + 1) / 2) * 5,
    rotateAmplitude: 5 + ((Math.sin(index * 7.1) + 1) / 2) * 8,
    duration: 3 + ((Math.sin(index * 2.9) + 1) / 2) * 2,
    phase: index * 0.3,
  }), [index, floatDistance]);

  // Dust particles around each letter
  const dustParticles: DustParticle[] = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: (Math.sin((index + i) * 3.7) * 0.5) * 40,
      y: (Math.cos((index + i) * 3.7) * 0.5) * 40,
      size: ((Math.sin((index + i) * 5.3) + 1) / 2) * 2 + 1,
      delay: ((Math.sin((index + i) * 7.1) + 1) / 2) * 3,
      duration: 4 + ((Math.sin((index + i) * 2.9) + 1) / 2) * 3,
    }));
  }, [index]);

  return (
    <motion.span
      className="relative inline-block"
      animate={{
        y: [
          0, 
          -microMovement.yAmplitude, 
          microMovement.yAmplitude * 0.3, 
          -microMovement.yAmplitude * 0.6,
          0
        ],
        x: [
          0, 
          microMovement.xAmplitude, 
          -microMovement.xAmplitude * 0.5, 
          microMovement.xAmplitude * 0.3,
          0
        ],
        rotate: [
          0, 
          microMovement.rotateAmplitude, 
          -microMovement.rotateAmplitude * 0.5, 
          microMovement.rotateAmplitude * 0.3,
          0
        ],
        scale: [1, 1.02, 0.98, 1.01, 1],
      }}
      transition={{
        duration: microMovement.duration,
        repeat: Infinity,
        delay: microMovement.phase,
        ease: "easeInOut",
      }}
      style={{
        filter: "drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))",
      }}
    >
      <motion.span
        className="absolute inset-0 blur-lg pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1.1, 1.2, 1],
          opacity: [0.4, 0.7, 0.5, 0.6, 0.4],
        }}
        transition={{
          duration: microMovement.duration * 0.8,
          repeat: Infinity,
          delay: microMovement.phase,
          ease: "easeInOut",
        }}
      />

      <motion.span
        className="absolute inset-0 blur-md pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(96,165,250,0.3) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1.1, 1, 1.2, 1.05, 1.1],
          opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
        }}
        transition={{
          duration: microMovement.duration * 1.2,
          repeat: Infinity,
          delay: microMovement.phase + 0.5,
          ease: "easeInOut",
        }}
      />
      {dustParticles.map((dust) => (
        <motion.span
          key={dust.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: dust.size,
            height: dust.size,
            left: "50%",
            top: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(167,139,250,0.4) 100%)",
            boxShadow: "0 0 4px rgba(167,139,250,0.6)",
          }}
          animate={{
            x: [dust.x * 0.3, dust.x, dust.x * 0.5, dust.x * 0.8, dust.x * 0.3],
            y: [dust.y * 0.3, dust.y, dust.y * 0.7, dust.y * 0.4, dust.y * 0.3],
            opacity: [0, 0.8, 0.5, 0.7, 0],
            scale: [0.5, 1, 0.8, 1.1, 0.5],
          }}
          transition={{
            duration: dust.duration,
            repeat: Infinity,
            delay: dust.delay + index * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.span
        className="relative z-10"
        style={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #c4b5fd 30%, #a78bfa 60%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
      <motion.span
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
          mixBlendMode: "overlay",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
        }}
        transition={{
          duration: microMovement.duration,
          repeat: Infinity,
          delay: microMovement.phase,
        }}
      />
      <motion.span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-violet-400/50 to-transparent pointer-events-none"
        animate={{
          height: [0, 15, 8, 12, 0],
          opacity: [0, 0.6, 0.3, 0.4, 0],
        }}
        transition={{
          duration: microMovement.duration,
          repeat: Infinity,
          delay: microMovement.phase,
          ease: "easeInOut",
        }}
      />
    </motion.span>
  );
}

export function FloatText({ children, className, floatDistance = 8 }: FloatTextProps) {
  const letters = children.split("");

  // Background ambient particles
  const ambientParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: ((Math.sin(i * 5.3) + 1) / 2) * 3 + 1,
      duration: 5 + ((Math.sin(i * 7.1) + 1) / 2) * 5,
      delay: ((Math.sin(i * 2.9) + 1) / 2) * 5,
    }));
  }, []);

  return (
    <motion.span 
      className={cn("relative inline-flex", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {ambientParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "radial-gradient(circle, rgba(167,139,250,0.6) 0%, transparent 70%)",
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 10, -15, 5, 0],
            opacity: [0, 0.5, 0.3, 0.6, 0],
            scale: [0.5, 1.2, 0.8, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.span
        className="absolute inset-0 -z-10 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {letters.map((letter, index) => (
        <FloatLetter
          key={index}
          char={letter}
          index={index}
          floatDistance={floatDistance}
        />
      ))}
    </motion.span>
  );
}
