"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: string;
  className?: string;
  colors?: string[];
  animationDuration?: number;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  delay: number;
  size: number;
}

interface ShimmerConfig {
  delay: number;
  duration: number;
}

export function GradientText({
  children,
  className,
  colors = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"],
  animationDuration = 8,
}: GradientTextProps) {
  const letters = children.split("");

  // Generate sparkle particles
  const sparkles: Sparkle[] = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      top: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      delay: ((Math.sin(i * 5.3) + 1) / 2) * 3,
      size: ((Math.sin(i * 7.1) + 1) / 2) * 4 + 2,
    }));
  }, []);

  // Per-letter shimmer configuration  
  const letterShimmers: ShimmerConfig[] = useMemo(() => {
    return letters.map((_, i) => ({
      delay: i * 0.1,
      duration: 2 + ((Math.sin(i * 4.3) + 1) / 2),
    }));
  }, [letters.length]);

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="absolute inset-0 opacity-30 blur-xl pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(45deg, ${colors.join(", ")})`,
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "50% 100%", "0% 50%"],
        }}
        transition={{
          duration: animationDuration * 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          animate={{
            opacity: [0, 1, 0.8, 1, 0],
            scale: [0, 1, 1.2, 0.8, 0],
            y: [-5, -15, -10, -20],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </motion.span>
      ))}
      <span className="relative z-10 inline-flex">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block relative"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})`,
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              delay: index * 0.05,
              ease: "linear",
            }}
          >
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                mixBlendMode: "overlay",
              }}
              animate={{
                backgroundPosition: ["-100% 0%", "200% 0%"],
              }}
              transition={{
                duration: letterShimmers[index].duration,
                repeat: Infinity,
                delay: letterShimmers[index].delay,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="absolute inset-0 blur-[2px] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})`,
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: 0.5,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.08,
                ease: "easeInOut",
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>

            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>
      <motion.span
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["-100% 0%", "200% 0%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut",
        }}
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={`dust-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white/50 pointer-events-none"
          style={{
            left: `${10 + i * 12}%`,
            top: "50%",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.span>
  );
}
