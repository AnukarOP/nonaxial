"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

interface ScanLine {
  id: number;
  top: number;
}

interface NoiseBlock {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
}

interface GlitchSlice {
  id: number;
  clipTop: number;
  clipBottom: number;
  translateX: number;
}

export function GlitchText({
  children,
  className,
  intensity = "medium",
}: GlitchTextProps) {
  const intensityConfig = useMemo(() => ({
    low: { glitchInterval: 3000, glitchDuration: 150, displacement: 3, scanLineCount: 3 },
    medium: { glitchInterval: 2000, glitchDuration: 200, displacement: 6, scanLineCount: 5 },
    high: { glitchInterval: 800, glitchDuration: 300, displacement: 10, scanLineCount: 8 },
  }), []);

  const config = intensityConfig[intensity];
  const [isGlitching, setIsGlitching] = useState(false);
  const [scanLines, setScanLines] = useState<ScanLine[]>([]);
  const [noiseBlocks, setNoiseBlocks] = useState<NoiseBlock[]>([]);
  const [glitchSlices, setGlitchSlices] = useState<GlitchSlice[]>([]);
  const redControls = useAnimationControls();
  const blueControls = useAnimationControls();
  const greenControls = useAnimationControls();
  const mainControls = useAnimationControls();

  const generateScanLines = useCallback(() => {
    return Array.from({ length: config.scanLineCount }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
    }));
  }, [config.scanLineCount]);

  const generateNoiseBlocks = useCallback(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 30 + 10,
      height: Math.random() * 10 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  const generateGlitchSlices = useCallback(() => {
    const slices: GlitchSlice[] = [];
    let currentTop = 0;
    let id = 0;
    while (currentTop < 100) {
      const height = Math.random() * 15 + 5;
      slices.push({
        id: id++,
        clipTop: currentTop,
        clipBottom: 100 - currentTop - height,
        translateX: (Math.random() - 0.5) * config.displacement * 2,
      });
      currentTop += height;
    }
    return slices;
  }, [config.displacement]);

  const triggerGlitch = useCallback(async () => {
    setIsGlitching(true);
    setScanLines(generateScanLines());
    setNoiseBlocks(generateNoiseBlocks());
    setGlitchSlices(generateGlitchSlices());

    const d = config.displacement;
    
    await Promise.all([
      redControls.start({
        x: [0, -d, d, -d/2, 0],
        opacity: [0.7, 0.9, 0.7, 0.8, 0.7],
        transition: { duration: config.glitchDuration / 1000, ease: "easeInOut" }
      }),
      blueControls.start({
        x: [0, d, -d, d/2, 0],
        opacity: [0.7, 0.9, 0.7, 0.8, 0.7],
        transition: { duration: config.glitchDuration / 1000, ease: "easeInOut" }
      }),
      greenControls.start({
        y: [0, -d/2, d/2, 0],
        opacity: [0.5, 0.7, 0.5, 0.6, 0.5],
        transition: { duration: config.glitchDuration / 1000, ease: "easeInOut" }
      }),
      mainControls.start({
        x: [0, -d/3, d/3, 0],
        skewX: [0, -2, 2, 0],
        transition: { duration: config.glitchDuration / 1000, ease: "easeInOut" }
      })
    ]);

    setIsGlitching(false);
  }, [config, redControls, blueControls, greenControls, mainControls, generateScanLines, generateNoiseBlocks, generateGlitchSlices]);

  useEffect(() => {
    // Ensure controls.start() is only called after component is mounted
    const timeoutId = setTimeout(() => {
      triggerGlitch();
    }, 0);
    const interval = setInterval(triggerGlitch, config.glitchInterval);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [config.glitchInterval, triggerGlitch]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span 
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />
      {isGlitching && scanLines.map((line) => (
        <motion.span
          key={line.id}
          className="absolute left-0 right-0 h-[2px] bg-white/20 pointer-events-none z-30"
          style={{ top: `${line.top}%` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      ))}
      {isGlitching && noiseBlocks.map((block) => (
        <motion.span
          key={block.id}
          className="absolute pointer-events-none z-25"
          style={{
            left: `${block.left}%`,
            top: `${block.top}%`,
            width: `${block.width}%`,
            height: `${block.height}px`,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${block.opacity}), transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.1 }}
        />
      ))}
      <motion.span
        className="absolute top-0 left-0 text-[#ff0000] mix-blend-screen pointer-events-none"
        animate={redControls}
        style={{ opacity: 0.7 }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute top-0 left-0 text-[#00ff00] mix-blend-screen pointer-events-none"
        animate={greenControls}
        style={{ opacity: 0.5 }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute top-0 left-0 text-[#0000ff] mix-blend-screen pointer-events-none"
        animate={blueControls}
        style={{ opacity: 0.7 }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
      {isGlitching && glitchSlices.map((slice) => (
        <motion.span
          key={slice.id}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            clipPath: `inset(${slice.clipTop}% 0 ${slice.clipBottom}% 0)`,
          }}
          initial={{ x: 0 }}
          animate={{ x: [0, slice.translateX, 0] }}
          transition={{ duration: 0.1, ease: "linear" }}
          aria-hidden="true"
        >
          {children}
        </motion.span>
      ))}
      <motion.span className="relative z-10" animate={mainControls}>
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 bg-white pointer-events-none z-40"
        animate={{
          opacity: isGlitching ? [0, 0.03, 0, 0.02, 0] : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </span>
  );
}
