"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface BounceTextProps {
  children: string;
  className?: string;
  delay?: number;
}

interface WobbleTrail {
  id: number;
  offsetY: number;
  opacity: number;
  blur: number;
  scale: number;
}

function BounceLetter({ 
  char, 
  index, 
  delay, 
  totalLetters 
}: { 
  char: string; 
  index: number; 
  delay: number; 
  totalLetters: number;
}) {
  // Wobble trail ghosts
  const wobbleTrails: WobbleTrail[] = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      offsetY: (i + 1) * 3,
      opacity: 0.3 - i * 0.1,
      blur: (i + 1) * 2,
      scale: 1 - (i + 1) * 0.05,
    }));
  }, []);

  // Rubber physics parameters
  const bounceHeight = 25 + Math.sin(index * 0.5) * 10;
  const stretchFactor = 1.3 + ((Math.sin(index * 3.7) + 1) / 2) * 0.2;
  const squashFactor = 0.7 - ((Math.sin(index * 5.3) + 1) / 2) * 0.1;

  const letterVariants: Variants = {
    initial: {
      y: 0,
      scaleX: 1,
      scaleY: 1,
    },
    bounce: {
      y: [0, -bounceHeight, 0, -bounceHeight * 0.4, 0, -bounceHeight * 0.15, 0],
      scaleX: [1, 0.9, stretchFactor, 0.95, 1.1, 0.98, 1],
      scaleY: [1, 1.15, squashFactor, 1.08, 0.95, 1.02, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatDelay: totalLetters * delay + 0.5,
        delay: index * delay,
        times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.span
      className="relative inline-block"
      variants={letterVariants}
      initial="initial"
      animate="bounce"
      style={{ 
        originY: 1,
        transformStyle: "preserve-3d",
      }}
    >
      {wobbleTrails.map((trail) => (
        <motion.span
          key={trail.id}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            filter: `blur(${trail.blur}px)`,
            opacity: trail.opacity,
            transform: `scale(${trail.scale})`,
          }}
          animate={{
            y: [0, -bounceHeight + trail.offsetY, trail.offsetY, -bounceHeight * 0.4 + trail.offsetY, trail.offsetY],
            opacity: [trail.opacity, trail.opacity * 1.5, trail.opacity, trail.opacity * 1.2, trail.opacity],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: totalLetters * delay + 0.5,
            delay: index * delay + trail.id * 0.03,
            ease: "easeInOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      <motion.span
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-2 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scaleX: [1, 0.6, 1.4, 0.8, 1.15, 0.95, 1],
          opacity: [0.3, 0.15, 0.5, 0.25, 0.35, 0.28, 0.3],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: totalLetters * delay + 0.5,
          delay: index * delay,
          ease: "easeInOut",
        }}
      />
      <motion.span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: 20,
          height: 6,
          border: "2px solid rgba(139, 92, 246, 0.5)",
        }}
        animate={{
          scale: [0, 1.5, 2],
          opacity: [0.8, 0.3, 0],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatDelay: totalLetters * delay + 1.3,
          delay: index * delay + 0.35,
        }}
      />
      <span 
        className="relative z-10 inline-block"
        style={{
          background: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #6d28d9 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
      <motion.span
        className="absolute top-0 left-0 right-0 h-[30%] pointer-events-none rounded-t-lg"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
          mixBlendMode: "overlay",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.2, 0.5, 0.3],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: totalLetters * delay + 0.5,
          delay: index * delay,
        }}
      />
      {[0, 1].map((p) => (
        <motion.span
          key={p}
          className="absolute bottom-0 rounded-full bg-violet-400 pointer-events-none"
          style={{
            width: 3,
            height: 3,
            left: p === 0 ? "20%" : "80%",
          }}
          animate={{
            y: [0, -15, -25],
            x: [0, p === 0 ? -10 : 10, p === 0 ? -20 : 20],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0],
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatDelay: totalLetters * delay + 1.3,
            delay: index * delay + 0.35,
          }}
        />
      ))}
    </motion.span>
  );
}

export function BounceText({ children, className, delay = 0.05 }: BounceTextProps) {
  const letters = children.split("");

  return (
    <span className={cn("inline-flex", className)}>
      {letters.map((letter, index) => (
        <BounceLetter
          key={index}
          char={letter}
          index={index}
          delay={delay}
          totalLetters={letters.length}
        />
      ))}
    </span>
  );
}
