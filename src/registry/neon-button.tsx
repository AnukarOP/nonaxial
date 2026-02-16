"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: React.ReactNode;
  className?: string;
  color?: "purple" | "pink" | "blue" | "green" | "orange";
  variant?: "solid" | "outline";
  onClick?: () => void;
}

const colorConfig = {
  purple: { main: "#a855f7", glow: "139, 92, 246", secondary: "#c084fc" },
  pink: { main: "#ec4899", glow: "236, 72, 153", secondary: "#f472b6" },
  blue: { main: "#3b82f6", glow: "59, 130, 246", secondary: "#60a5fa" },
  green: { main: "#22c55e", glow: "34, 197, 94", secondary: "#4ade80" },
  orange: { main: "#f97316", glow: "249, 115, 22", secondary: "#fb923c" },
};

export function NeonButton({
  children,
  className,
  color = "purple",
  variant = "solid",
  onClick,
}: NeonButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [flickerIntensity, setFlickerIntensity] = useState(1);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [buzzLines, setBuzzLines] = useState<{ id: number; angle: number; length: number }[]>([]);

  const { main, glow, secondary } = colorConfig[color];

  // Neon flicker effect
  useEffect(() => {
    if (!isHovered) {
      setFlickerIntensity(1);
      return;
    }

    const flickerInterval = setInterval(() => {
      // Random flicker pattern simulating neon tube instability
      const random = Math.random();
      if (random > 0.92) {
        setFlickerIntensity(0.3 + Math.random() * 0.3);
        setTimeout(() => setFlickerIntensity(1), 50 + Math.random() * 100);
      } else if (random > 0.85) {
        setFlickerIntensity(0.6 + Math.random() * 0.3);
      } else {
        setFlickerIntensity(0.9 + Math.random() * 0.1);
      }
    }, 100);

    return () => clearInterval(flickerInterval);
  }, [isHovered]);

  // Glitch effect on hover
  useEffect(() => {
    if (!isHovered) {
      setGlitchOffset({ x: 0, y: 0 });
      return;
    }

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitchOffset({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 2,
        });
        setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 50);
      }
    }, 150);

    return () => clearInterval(glitchInterval);
  }, [isHovered]);

  // Electric buzz lines
  const spawnBuzzLine = useCallback(() => {
    if (!isHovered) return;
    const newLine = {
      id: Date.now() + Math.random(),
      angle: Math.random() * 360,
      length: 10 + Math.random() * 20,
    };
    setBuzzLines(prev => [...prev.slice(-8), newLine]);
    setTimeout(() => {
      setBuzzLines(prev => prev.filter(l => l.id !== newLine.id));
    }, 200);
  }, [isHovered]);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(spawnBuzzLine, 100);
    return () => clearInterval(interval);
  }, [isHovered, spawnBuzzLine]);

  return (
    <motion.button
      className={cn(
        "relative px-8 py-4 rounded-lg font-bold text-white overflow-visible",
        variant === "solid" ? "bg-zinc-950" : "bg-transparent",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{
        textShadow: isHovered 
          ? `0 0 ${10 * flickerIntensity}px ${main}, 0 0 ${20 * flickerIntensity}px ${main}, 0 0 ${40 * flickerIntensity}px ${main}`
          : `0 0 5px ${main}`,
      }}
    >
      <motion.div
        className="absolute -inset-1 rounded-lg pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${main}40 0%, transparent 50%, ${secondary}30 100%)`,
          boxShadow: `
            0 0 ${15 * flickerIntensity}px rgba(${glow}, 0.5),
            0 0 ${30 * flickerIntensity}px rgba(${glow}, 0.3),
            0 0 ${45 * flickerIntensity}px rgba(${glow}, 0.2),
            inset 0 0 ${20 * flickerIntensity}px rgba(${glow}, 0.1)
          `,
          opacity: flickerIntensity,
        }}
        animate={{
          opacity: isHovered ? flickerIntensity : 0.6,
        }}
      />
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `2px solid ${main}`,
          boxShadow: `
            0 0 ${5 * flickerIntensity}px ${main},
            inset 0 0 ${5 * flickerIntensity}px ${main}
          `,
          opacity: flickerIntensity,
        }}
      />
      <motion.div
        className="absolute inset-1 rounded-md pointer-events-none"
        style={{
          border: `1px solid ${secondary}50`,
          boxShadow: `inset 0 0 ${10 * flickerIntensity}px rgba(${glow}, 0.2)`,
        }}
        animate={{ opacity: isHovered ? 0.8 : 0.3 }}
      />
      <AnimatePresence>
        {buzzLines.map((line) => (
          <motion.div
            key={line.id}
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              width: line.length,
              height: 2,
              background: `linear-gradient(90deg, ${main}, transparent)`,
              transformOrigin: "left center",
              transform: `rotate(${line.angle}deg)`,
              filter: `blur(0.5px) drop-shadow(0 0 3px ${main})`,
            }}
            initial={{ opacity: 1, scaleX: 0 }}
            animate={{ opacity: [1, 0.5, 0], scaleX: [0, 1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </AnimatePresence>
      <motion.span
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"
        style={{ 
          color: "#00ffff",
          clipPath: "inset(45% 0 50% 0)",
        }}
        animate={{
          x: glitchOffset.x * 2,
          y: glitchOffset.y,
          opacity: isHovered ? [0.5, 0.3, 0.5] : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>

      <motion.span
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"
        style={{ 
          color: "#ff0066",
          clipPath: "inset(50% 0 40% 0)",
        }}
        animate={{
          x: -glitchOffset.x * 2,
          y: -glitchOffset.y,
          opacity: isHovered ? [0.5, 0.3, 0.5] : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>
      <motion.span
        className="relative z-10"
        animate={{
          x: glitchOffset.x,
          y: glitchOffset.y,
        }}
        transition={{ duration: 0.05 }}
      >
        {children}
      </motion.span>
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 4px
          )`,
          opacity: isHovered ? 0.4 : 0.2,
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 pointer-events-none"
          style={{
            top: i < 2 ? -1 : "auto",
            bottom: i >= 2 ? -1 : "auto",
            left: i % 2 === 0 ? -1 : "auto",
            right: i % 2 === 1 ? -1 : "auto",
            borderTop: i < 2 ? `2px solid ${main}` : "none",
            borderBottom: i >= 2 ? `2px solid ${main}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${main}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${main}` : "none",
            boxShadow: `0 0 ${5 * flickerIntensity}px ${main}`,
          }}
          animate={{ opacity: flickerIntensity }}
        />
      ))}
    </motion.button>
  );
}
