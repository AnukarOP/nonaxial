"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlitchButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface StaticLine {
  id: number;
  y: number;
  height: number;
  opacity: number;
}

export function GlitchButton({ children, className, onClick }: GlitchButtonProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [rgbOffset, setRgbOffset] = useState({ r: 0, g: 0, b: 0 });
  const [staticLines, setStaticLines] = useState<StaticLine[]>([]);
  const [noiseOpacity, setNoiseOpacity] = useState(0);
  const [scanLinePos, setScanLinePos] = useState(0);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate static noise on canvas
  useEffect(() => {
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const generateNoise = () => {
      if (canvas.width === 0 || canvas.height === 0) return;
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = isGlitching ? 30 + Math.random() * 50 : 10;
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    if (isGlitching) {
      const interval = setInterval(generateNoise, 50);
      return () => clearInterval(interval);
    } else {
      generateNoise();
    }
  }, [isGlitching]);

  // RGB split effect
  useEffect(() => {
    if (!isGlitching) {
      setRgbOffset({ r: 0, g: 0, b: 0 });
      return;
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setRgbOffset({
          r: (Math.random() - 0.5) * 8,
          g: (Math.random() - 0.5) * 8,
          b: (Math.random() - 0.5) * 8,
        });
      } else {
        setRgbOffset({ r: 0, g: 0, b: 0 });
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isGlitching]);

  // Static line generation
  const spawnStaticLines = useCallback(() => {
    if (!isGlitching) return;
    
    const lines: StaticLine[] = Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, i) => ({
      id: Date.now() + i,
      y: Math.random() * 100,
      height: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    
    setStaticLines(lines);
    setTimeout(() => setStaticLines([]), 100);
  }, [isGlitching]);

  useEffect(() => {
    if (!isGlitching) return;
    const interval = setInterval(spawnStaticLines, 150);
    return () => clearInterval(interval);
  }, [isGlitching, spawnStaticLines]);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePos((prev) => (prev + 2) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Noise opacity pulse
  useEffect(() => {
    if (!isGlitching) {
      setNoiseOpacity(0.05);
      return;
    }

    const interval = setInterval(() => {
      setNoiseOpacity(0.1 + Math.random() * 0.2);
    }, 100);

    return () => clearInterval(interval);
  }, [isGlitching]);

  return (
    <motion.button
      className={cn(
        "relative px-10 py-5 font-bold text-white rounded-xl overflow-hidden",
        "bg-zinc-950 border border-violet-500/30",
        className
      )}
      onHoverStart={() => setIsGlitching(true)}
      onHoverEnd={() => setIsGlitching(false)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      <canvas
        ref={noiseCanvasRef}
        width={200}
        height={60}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
        style={{ opacity: noiseOpacity }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,0.3) 2px,
            rgba(0,0,0,0.3) 4px
          )`,
          opacity: 0.4,
        }}
      />
      <motion.div
        className="absolute inset-x-0 h-1 pointer-events-none"
        style={{
          top: `${scanLinePos}%`,
          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        }}
        animate={{
          opacity: isGlitching ? [0.3, 0.8, 0.3] : 0.2,
        }}
      />
      <AnimatePresence>
        {staticLines.map((line) => (
          <motion.div
            key={line.id}
            className="absolute inset-x-0 bg-white pointer-events-none"
            style={{
              top: `${line.y}%`,
              height: line.height,
              opacity: line.opacity,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </AnimatePresence>
      <motion.span
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          color: "#ff0000",
          mixBlendMode: "screen",
        }}
        animate={{
          x: rgbOffset.r,
          opacity: isGlitching ? 0.8 : 0,
          clipPath: isGlitching 
            ? `polygon(0 ${30 + Math.random() * 20}%, 100% ${30 + Math.random() * 20}%, 100% ${50 + Math.random() * 20}%, 0 ${50 + Math.random() * 20}%)`
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          color: "#00ffff",
          mixBlendMode: "screen",
        }}
        animate={{
          x: -rgbOffset.r,
          opacity: isGlitching ? 0.8 : 0,
          clipPath: isGlitching
            ? `polygon(0 ${50 + Math.random() * 20}%, 100% ${50 + Math.random() * 20}%, 100% ${70 + Math.random() * 20}%, 0 ${70 + Math.random() * 20}%)`
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        {children}
      </motion.span>
      <AnimatePresence>
        {isGlitching && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-y-0 bg-violet-500/20 pointer-events-none"
                style={{
                  left: `${20 + i * 25}%`,
                  width: "10%",
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 0],
                  opacity: [0, 0.5, 0],
                  x: [(Math.random() - 0.5) * 10, 0],
                }}
                transition={{
                  duration: 0.2,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 0.5 + Math.random(),
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          x: isGlitching ? [0, -2, 2, -1, 1, 0] : 0,
          y: isGlitching ? [0, 1, -1, 0] : 0,
        }}
        transition={{
          duration: 0.2,
          repeat: isGlitching ? Infinity : 0,
        }}
        style={{
          textShadow: isGlitching 
            ? `${rgbOffset.r}px 0 #ff0066, ${-rgbOffset.r}px 0 #00ffff`
            : "none",
        }}
      >
        {children}
      </motion.span>
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isGlitching
            ? [
                `inset 0 0 0 1px rgba(139, 92, 246, 0.5), ${rgbOffset.r}px 0 0 rgba(255, 0, 102, 0.5), ${-rgbOffset.r}px 0 0 rgba(0, 255, 255, 0.5)`,
                `inset 0 0 0 1px rgba(139, 92, 246, 0.8), 0 0 0 rgba(255, 0, 102, 0), 0 0 0 rgba(0, 255, 255, 0)`,
              ]
            : "inset 0 0 0 1px rgba(139, 92, 246, 0.3)",
        }}
        transition={{
          duration: 0.15,
          repeat: isGlitching ? Infinity : 0,
        }}
      />
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none rounded-xl"
        animate={{
          opacity: isGlitching && Math.random() > 0.95 ? [0, 0.3, 0] : 0,
        }}
        transition={{ duration: 0.05 }}
      />
    </motion.button>
  );
}
