"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonTextProps {
  children: string;
  className?: string;
  color?: "violet" | "cyan" | "pink" | "green";
}

interface ElectricSpark {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
}

interface BuzzLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function NeonText({ children, className, color = "violet" }: NeonTextProps) {
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const [sparks, setSparks] = useState<ElectricSpark[]>([]);
  const [buzzLines, setBuzzLines] = useState<BuzzLine[]>([]);
  const controls = useAnimationControls();
  const isMounted = useRef(false);

  const colors = useMemo(() => ({
    violet: {
      text: "#a78bfa",
      bright: "#c4b5fd",
      dim: "#6d28d9",
      glow: "0 0 5px #a78bfa, 0 0 10px #a78bfa, 0 0 20px #8b5cf6, 0 0 40px #8b5cf6, 0 0 80px #8b5cf660",
      glowBright: "0 0 10px #c4b5fd, 0 0 20px #a78bfa, 0 0 40px #8b5cf6, 0 0 80px #8b5cf6, 0 0 120px #8b5cf680",
      glowDim: "0 0 2px #6d28d9, 0 0 5px #6d28d940",
    },
    cyan: {
      text: "#22d3ee",
      bright: "#67e8f9",
      dim: "#0891b2",
      glow: "0 0 5px #22d3ee, 0 0 10px #22d3ee, 0 0 20px #06b6d4, 0 0 40px #06b6d4, 0 0 80px #06b6d460",
      glowBright: "0 0 10px #67e8f9, 0 0 20px #22d3ee, 0 0 40px #06b6d4, 0 0 80px #06b6d4, 0 0 120px #06b6d480",
      glowDim: "0 0 2px #0891b2, 0 0 5px #0891b240",
    },
    pink: {
      text: "#f472b6",
      bright: "#f9a8d4",
      dim: "#be185d",
      glow: "0 0 5px #f472b6, 0 0 10px #f472b6, 0 0 20px #ec4899, 0 0 40px #ec4899, 0 0 80px #ec489960",
      glowBright: "0 0 10px #f9a8d4, 0 0 20px #f472b6, 0 0 40px #ec4899, 0 0 80px #ec4899, 0 0 120px #ec489980",
      glowDim: "0 0 2px #be185d, 0 0 5px #be185d40",
    },
    green: {
      text: "#4ade80",
      bright: "#86efac",
      dim: "#15803d",
      glow: "0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 20px #22c55e, 0 0 40px #22c55e, 0 0 80px #22c55e60",
      glowBright: "0 0 10px #86efac, 0 0 20px #4ade80, 0 0 40px #22c55e, 0 0 80px #22c55e, 0 0 120px #22c55e80",
      glowDim: "0 0 2px #15803d, 0 0 5px #15803d40",
    },
  }), []);

  const colorConfig = colors[color];

  // Generate electric sparks
  const generateSparks = useCallback(() => {
    const newSparks: ElectricSpark[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      angle: Math.random() * 360,
      length: 10 + Math.random() * 20,
    }));
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 200);
  }, []);

  // Generate buzz lines
  const generateBuzzLines = useCallback(() => {
    const newLines: BuzzLine[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
    }));
    setBuzzLines(newLines);
    setTimeout(() => setBuzzLines([]), 100);
  }, []);

  // Power-on sequence
  useEffect(() => {
    isMounted.current = true;
    
    const powerOnSequence = async () => {
      // Initial flickers
      for (let i = 0; i < 4; i++) {
        if (!isMounted.current) return;
        setIsPoweredOn(true);
        generateSparks();
        await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
        if (!isMounted.current) return;
        setIsPoweredOn(false);
        await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
      }
      
      // Final power on
      if (!isMounted.current) return;
      setIsPoweredOn(true);
      generateSparks();
      
      // Ensure the motion component has mounted before starting animations
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      if (!isMounted.current) return;
      controls.start({
        scale: [0.98, 1.02, 1],
        transition: { duration: 0.3 }
      });
    };

    powerOnSequence();
    
    return () => {
      isMounted.current = false;
    };
  }, [controls, generateSparks]);

  // Random flickering
  useEffect(() => {
    if (!isPoweredOn) return;

    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setIsFlickering(true);
        generateBuzzLines();
        if (Math.random() > 0.7) generateSparks();
        
        setTimeout(() => setIsFlickering(false), 50 + Math.random() * 100);
      }
    }, 500);

    return () => clearInterval(flickerInterval);
  }, [isPoweredOn, generateBuzzLines, generateSparks]);

  const letters = children.split("");

  return (
    <motion.span
      className={cn("relative inline-block font-bold", className)}
      animate={controls}
    >
      <span
        className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.dim}40 0%, transparent 50%, ${colorConfig.dim}20 100%)`,
          border: `1px solid ${colorConfig.dim}30`,
        }}
      />
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute pointer-events-none z-30"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: spark.length,
              height: 2,
              background: `linear-gradient(90deg, ${colorConfig.bright}, transparent)`,
              transform: `rotate(${spark.angle}deg)`,
              boxShadow: `0 0 4px ${colorConfig.bright}, 0 0 8px ${colorConfig.text}`,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: [1, 0.8, 0], scale: [1, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {buzzLines.map((line) => (
          <motion.svg
            key={line.id}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.line
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke={colorConfig.bright}
              strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 3px ${colorConfig.text})` }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.1 }}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
      <span className="relative inline-flex">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="relative inline-block"
            style={{
              color: isPoweredOn 
                ? (isFlickering ? colorConfig.dim : colorConfig.text)
                : colorConfig.dim,
              textShadow: isPoweredOn
                ? (isFlickering ? colorConfig.glowDim : colorConfig.glow)
                : "none",
            }}
            animate={{
              opacity: isPoweredOn ? [0.95, 1, 0.98, 1, 0.97, 1] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          >
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${colorConfig.bright}40 0%, transparent 30%, transparent 70%, ${colorConfig.bright}20 100%)`,
                mixBlendMode: "overlay",
              }}
              animate={{
                opacity: isPoweredOn ? (isFlickering ? 0.2 : 0.6) : 0,
              }}
            />
            {letter === " " ? "\u00A0" : letter}
            <motion.span
              className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${colorConfig.bright}30 0%, transparent 100%)`,
                borderRadius: "2px 2px 0 0",
              }}
              animate={{
                opacity: isPoweredOn ? (isFlickering ? 0.1 : 0.4) : 0,
              }}
            />
          </motion.span>
        ))}
      </span>
      <motion.span
        className="absolute -bottom-2 left-0 right-0 h-8 blur-xl pointer-events-none -z-10"
        style={{
          background: `linear-gradient(0deg, ${colorConfig.text}40 0%, transparent 100%)`,
        }}
        animate={{
          opacity: isPoweredOn ? (isFlickering ? 0.2 : 0.6) : 0,
          scaleY: isPoweredOn ? (isFlickering ? 0.5 : 1) : 0,
        }}
        transition={{ duration: 0.1 }}
      />
      <motion.span
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: isPoweredOn ? [0, 0.5, -0.3, 0.2, 0] : 0,
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
      />
      <motion.span
        className="absolute inset-0 rounded pointer-events-none -z-10"
        style={{
          background: `radial-gradient(ellipse, ${colorConfig.text}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: isPoweredOn ? [1, 1.1, 1.05, 1.08, 1] : 0.8,
          opacity: isPoweredOn ? (isFlickering ? 0.3 : 0.6) : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.span>
  );
}
