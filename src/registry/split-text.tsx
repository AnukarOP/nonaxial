"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  children: string;
  className?: string;
}

interface LandingParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
}

function SplitLetter({ 
  char, 
  index, 
  fromAbove 
}: { 
  char: string; 
  index: number; 
  fromAbove: boolean;
}) {
  // Landing particles when letter arrives
  const landingParticles: LandingParticle[] = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 30,
      size: Math.random() * 3 + 1,
      delay: 0.3 + index * 0.05 + i * 0.02,
    }));
  }, [index]);

  const letterVariants: Variants = {
    initial: {
      y: fromAbove ? -150 : 150,
      opacity: 0,
      rotateX: fromAbove ? -90 : 90,
      scale: 0.5,
    },
    animate: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        y: {
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: index * 0.05,
        },
        opacity: {
          duration: 0.2,
          delay: index * 0.05,
        },
        rotateX: {
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: index * 0.05,
        },
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 10,
          delay: index * 0.05,
        },
      },
    },
    hover: {
      y: -15,
      scale: 1.2,
      rotateZ: (Math.random() - 0.5) * 15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <motion.span
      className="relative inline-block cursor-default"
      variants={letterVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "500px",
      }}
    >
      {landingParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute bottom-0 left-1/2 rounded-full pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            background: fromAbove 
              ? "linear-gradient(135deg, #8b5cf6, #a855f7)" 
              : "linear-gradient(135deg, #ec4899, #f472b6)",
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0,
            scale: 0,
          }}
          animate={{ 
            x: particle.x, 
            y: [0, -20 - Math.random() * 20, 10],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 0.5,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.span
        className="inline-block"
        initial={{ scaleX: 1, scaleY: 1 }}
        animate={{
          scaleX: [1, 1.3, 0.9, 1.05, 1],
          scaleY: [1, 0.7, 1.1, 0.98, 1],
        }}
        transition={{
          duration: 0.4,
          delay: 0.2 + index * 0.05,
          ease: "easeOut",
        }}
        style={{ 
          originY: fromAbove ? 1 : 0,
          display: "inline-block",
        }}
      >
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-[4px] rounded-full blur-[2px] pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.3)",
            transformOrigin: "center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: [0, 1.5, 1],
            opacity: [0, 0.5, 0.3],
          }}
          transition={{
            duration: 0.3,
            delay: 0.25 + index * 0.05,
          }}
        />

        <span
          className="relative z-10"
          style={{
            background: fromAbove
              ? "linear-gradient(180deg, #c4b5fd, #8b5cf6)"
              : "linear-gradient(0deg, #fbcfe8, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          {char}
        </span>

        <motion.span
          className="absolute inset-0 blur-md pointer-events-none"
          style={{
            background: fromAbove ? "#8b5cf6" : "#ec4899",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            duration: 0.3,
            delay: 0.2 + index * 0.05,
          }}
        >
          {char}
        </motion.span>
      </motion.span>
      <motion.span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.4, 0],
          scale: [0.5, 1.5, 2],
          y: [0, -5, -10],
        }}
        transition={{
          duration: 0.4,
          delay: 0.22 + index * 0.05,
        }}
      >
        <span 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${fromAbove ? 'rgba(139,92,246,0.3)' : 'rgba(236,72,153,0.3)'} 0%, transparent 70%)`,
          }}
        />
      </motion.span>
    </motion.span>
  );
}

export function SplitText({ children, className }: SplitTextProps) {
  const words = children.split(" ");

  return (
    <span className={cn("inline-flex flex-wrap gap-x-3", className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex overflow-visible">
          {word.split("").map((char, charIndex) => (
            <SplitLetter
              key={`${wordIndex}-${charIndex}`}
              char={char}
              index={wordIndex * 10 + charIndex}
              fromAbove={(wordIndex + charIndex) % 2 === 0}
            />
          ))}
        </span>
      ))}
    </span>
  );
}
