"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ children, className, intensity = "medium" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(children);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const glitchIntensity = {
    low: { interval: 100, duration: 150, probability: 0.3 },
    medium: { interval: 50, duration: 100, probability: 0.5 },
    high: { interval: 30, duration: 50, probability: 0.7 },
  };

  const config = glitchIntensity[intensity];

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    let iterations = 0;
    const maxIterations = Math.ceil(children.length * 2);

    const interval = setInterval(() => {
      setGlitchText(
        children
          .split("")
          .map((char, index) => {
            if (index < iterations / 2) return children[index];
            if (Math.random() < config.probability) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return char;
          })
          .join("")
      );

      iterations++;
      if (iterations > maxIterations) {
        clearInterval(interval);
        setGlitchText(children);
        setIsGlitching(false);
      }
    }, config.duration);
  }, [children, config]);

  useEffect(() => {
    const randomTrigger = setInterval(() => {
      if (Math.random() > 0.7) triggerGlitch();
    }, 3000);
    return () => clearInterval(randomTrigger);
  }, [triggerGlitch]);

  return (
    <motion.span
      className={cn("relative inline-block cursor-pointer", className)}
      onMouseEnter={triggerGlitch}
      whileHover={{ scale: 1.02 }}
    >
      {/* Base text */}
      <span className="relative z-10">{glitchText}</span>
      
      {/* Chromatic aberration layers */}
      <AnimatePresence>
        {isGlitching && (
          <>
            <motion.span
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 0.8, x: [-3, 2, -1, 3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 z-0 text-cyan-400"
              style={{ mixBlendMode: "screen" }}
              aria-hidden="true"
            >
              {glitchText}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 0.8, x: [3, -2, 1, -3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 z-0 text-fuchsia-500"
              style={{ mixBlendMode: "screen" }}
              aria-hidden="true"
            >
              {glitchText}
            </motion.span>
          </>
        )}
      </AnimatePresence>
      
      {/* Scan lines */}
      <span 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
        aria-hidden="true"
      />
      
      {/* Random noise flicker */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
          transition={{ duration: 0.2, repeat: 2 }}
          aria-hidden="true"
        />
      )}
    </motion.span>
  );
}
