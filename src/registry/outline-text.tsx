"use client";

import React, { useState, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface OutlineTextProps {
  children: string;
  className?: string;
  strokeWidth?: number;
}

interface GlowPulse {
  delay: number;
  duration: number;
}

export function OutlineText({ children, className, strokeWidth = 2 }: OutlineTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();
  const letters = children.split("");

  // Per-letter glow pulse configuration
  const glowPulses: GlowPulse[] = useMemo(() => {
    return letters.map((_, i) => ({
      delay: i * 0.05,
      duration: 1.5 + Math.random() * 0.5,
    }));
  }, [letters.length]);

  // Animated stroke dash offset for drawing effect
  const strokeDashArray = 100;
  
  return (
    <motion.span
      className={cn("relative inline-flex font-bold cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="outlineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <motion.stop
              offset="0%"
              animate={{
                stopColor: isHovered 
                  ? ["#8b5cf6", "#ec4899", "#06b6d4", "#8b5cf6"]
                  : "#8b5cf6",
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.stop
              offset="50%"
              animate={{
                stopColor: isHovered 
                  ? ["#ec4899", "#06b6d4", "#8b5cf6", "#ec4899"]
                  : "#a855f7",
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.stop
              offset="100%"
              animate={{
                stopColor: isHovered 
                  ? ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"]
                  : "#c084fc",
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </linearGradient>
        </defs>
      </svg>

      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="relative inline-block"
          animate={{
            y: isHovered ? [0, -3, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            delay: index * 0.02,
          }}
        >
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{
              WebkitTextStroke: `${strokeWidth}px transparent`,
              background: "linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: "blur(4px)",
            }}
            animate={{
              opacity: isHovered 
                ? [0.3, 0.7, 0.3] 
                : [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: glowPulses[index].duration,
              repeat: Infinity,
              delay: glowPulses[index].delay,
              ease: "easeInOut",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{
              WebkitTextStroke: `${strokeWidth + 2}px transparent`,
              background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: "blur(8px)",
            }}
            animate={{
              opacity: isHovered ? [0.2, 0.5, 0.2] : 0.1,
              scale: isHovered ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: glowPulses[index].delay + 0.2,
              ease: "easeInOut",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          <motion.span
            className="relative z-10"
            style={{
              WebkitTextStroke: `${strokeWidth}px`,
              WebkitTextStrokeColor: "url(#outlineStrokeGradient)",
              WebkitTextFillColor: isHovered ? "currentColor" : "transparent",
              color: isHovered ? "rgba(139, 92, 246, 0.1)" : "transparent",
              transition: "color 0.3s ease, -webkit-text-fill-color 0.3s ease",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          <motion.span
            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{
              clipPath: isHovered 
                ? "inset(0 0% 0 0)" 
                : ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)"],
            }}
            transition={{
              duration: isHovered ? 0.4 : 2,
              delay: isHovered ? index * 0.03 : index * 0.1,
              ease: "easeOut",
            }}
          >
            <span
              style={{
                WebkitTextStroke: `${strokeWidth}px #fff`,
                WebkitTextFillColor: "transparent",
                opacity: 0.3,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          </motion.span>
          <motion.span
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{
              backgroundPosition: ["200% 0%", "-200% 0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              delay: index * 0.05,
              ease: "easeInOut",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </motion.span>
      ))}
      <motion.span
        className="absolute -bottom-3 left-0 right-0 h-4 blur-md pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)",
          opacity: 0.3,
        }}
        animate={{
          opacity: isHovered ? 0.5 : 0.2,
          scaleY: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.span>
  );
}
