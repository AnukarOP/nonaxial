"use client";

import React, { useMemo, useCallback } from "react";
import { motion, Variants, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaveTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

interface FoamParticle {
  id: number;
  x: number;
  delay: number;
  size: number;
}

interface DripTrail {
  id: number;
  delay: number;
  duration: number;
}

function WaveLetter({ 
  char, 
  index, 
  totalLetters 
}: { 
  char: string; 
  index: number; 
  totalLetters: number;
}) {
  const controls = useAnimationControls();
  
  // Ocean wave physics with multiple wave frequencies
  const wavePhase = (index / totalLetters) * Math.PI * 2;
  const primaryWave = Math.sin(wavePhase) * 15;
  const secondaryWave = Math.sin(wavePhase * 2.5 + 0.5) * 8;
  const tertiaryWave = Math.sin(wavePhase * 0.5) * 5;

  // Generate foam particles at wave peaks
  const foamParticles: FoamParticle[] = useMemo(() => {
    if (primaryWave > 10) {
      return Array.from({ length: 3 }, (_, i) => ({
        id: i,
        x: (Math.sin(i * 3.7) * 0.5) * 20,
        delay: ((Math.sin(i * 5.3) + 1) / 2) * 0.3,
        size: ((Math.sin(i * 7.1) + 1) / 2) * 4 + 2,
      }));
    }
    return [];
  }, [primaryWave]);

  // Drip trails for letters going down
  const dripTrails: DripTrail[] = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      delay: i * 0.2,
      duration: 0.8 + ((Math.sin(i * 9.1) + 1) / 2) * 0.4,
    }));
  }, []);

  const letterVariants: Variants = {
    initial: { y: 50, opacity: 0, rotateZ: 5 },
    animate: {
      y: [primaryWave, -primaryWave - secondaryWave, primaryWave + tertiaryWave, -primaryWave],
      opacity: 1,
      rotateZ: [2, -2, 1, -1, 2],
      scaleY: [1, 1.05, 0.98, 1.02, 1],
      transition: {
        y: {
          duration: 3 + Math.random() * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.08,
        },
        rotateZ: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.06,
        },
        scaleY: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.05,
        },
        opacity: { duration: 0.3 },
      },
    },
  };

  return (
    <motion.span
      className="relative inline-block"
      variants={letterVariants}
      initial="initial"
      animate="animate"
      style={{
        textShadow: "0 4px 8px rgba(6, 182, 212, 0.3)",
        color: "inherit",
      }}
    >
      {foamParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute -top-2 left-1/2 rounded-full bg-white/80"
          style={{
            width: particle.size,
            height: particle.size,
            x: particle.x,
          }}
          animate={{
            y: [-5, -20, -30],
            opacity: [0.8, 0.5, 0],
            scale: [1, 0.8, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: particle.delay + index * 0.1,
            ease: "easeOut",
          }}
        />
      ))}

      {dripTrails.map((drip) => (
        <motion.span
          key={drip.id}
          className="absolute bottom-0 left-1/2 w-[2px] bg-gradient-to-b from-cyan-400/60 to-transparent"
          style={{ transformOrigin: "top" }}
          animate={{
            height: [0, 20, 30, 0],
            opacity: [0, 0.7, 0.5, 0],
          }}
          transition={{
            duration: drip.duration,
            repeat: Infinity,
            delay: drip.delay + index * 0.15,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.1,
          ease: "easeInOut",
        }}
      />

      <span 
        className="relative z-10"
        style={{
          background: "linear-gradient(180deg, #22d3ee 0%, #0891b2 50%, #164e63 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>

      <motion.span
        className="absolute top-full left-0 opacity-30 scale-y-[-0.3] blur-[1px]"
        style={{
          background: "linear-gradient(180deg, #22d3ee 0%, transparent 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.08 }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </motion.span>
  );
}

export function WaveText({
  children,
  className,
  delay = 0.05,
  duration = 0.5,
}: WaveTextProps) {
  const letters = children.split("");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay },
    },
  };

  return (
    <motion.span
      className={cn("inline-flex relative", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.1) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 50%", "-200% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {letters.map((letter, index) => (
        <WaveLetter 
          key={index} 
          char={letter} 
          index={index} 
          totalLetters={letters.length}
        />
      ))}
    </motion.span>
  );
}
