"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LEDCardProps {
  children?: React.ReactNode;
  ledColor?: string;
  ledCount?: number;
  animationSpeed?: number;
  className?: string;
  variant?: "chase" | "pulse" | "random" | "wave";
}

export function LEDCard({
  children,
  ledColor = "#8b5cf6",
  ledCount = 20,
  animationSpeed = 0.1,
  className,
  variant = "chase",
}: LEDCardProps) {
  const [activeLeds, setActiveLeds] = useState<number[]>([0, 1, 2]);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % ledCount);

      switch (variant) {
        case "chase":
          setActiveLeds([(phase) % ledCount, (phase + 1) % ledCount, (phase + 2) % ledCount]);
          break;
        case "pulse":
          setActiveLeds(Array.from({ length: ledCount }, (_, i) => i));
          break;
        case "random":
          const randomLeds = Array.from({ length: 5 }, () => Math.floor(Math.random() * ledCount));
          setActiveLeds(randomLeds);
          break;
        case "wave":
          const waveLeds = Array.from({ length: ledCount }, (_, i) => i)
            .filter((i) => Math.sin((i + phase) * 0.5) > 0.5);
          setActiveLeds(waveLeds);
          break;
      }
    }, animationSpeed * 1000);

    return () => clearInterval(interval);
  }, [ledCount, animationSpeed, variant, phase]);

  const totalPerimeter = 100;
  const ledSpacing = totalPerimeter / ledCount;

  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="12"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        {Array.from({ length: ledCount }).map((_, i) => {
          const progress = (i / ledCount) * 100;
          const isActive = activeLeds.includes(i);
          const opacity = variant === "pulse" ? (Math.sin(phase * 0.2) + 1) / 2 : isActive ? 1 : 0.2;

          // Calculate position along the border
          let x = 0,
            y = 0;
          if (progress < 25) {
            x = (progress / 25) * 100;
            y = 0;
          } else if (progress < 50) {
            x = 100;
            y = ((progress - 25) / 25) * 100;
          } else if (progress < 75) {
            x = 100 - ((progress - 50) / 25) * 100;
            y = 100;
          } else {
            x = 0;
            y = 100 - ((progress - 75) / 25) * 100;
          }

          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="3"
              fill={ledColor}
              opacity={opacity}
              filter={isActive ? "url(#glow)" : undefined}
              style={{
                transition: "opacity 0.1s ease",
              }}
            />
          );
        })}
      </svg>
      <div className="relative z-0 bg-zinc-900/50 border border-white/10 rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  borderWidth?: number;
  borderColor?: string;
  duration?: number;
  className?: string;
}

export function AnimatedBorderCard({
  children,
  borderWidth = 2,
  borderColor = "#8b5cf6",
  duration = 3,
  className,
}: AnimatedBorderCardProps) {
  return (
    <div className={cn("relative rounded-xl p-[2px]", className)}>
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${borderColor}, transparent)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative bg-zinc-900 rounded-xl p-6">{children}</div>
    </div>
  );
}

interface GlowingBorderCardProps {
  children: React.ReactNode;
  glowColor?: string;
  intensity?: number;
  className?: string;
}

export function GlowingBorderCard({
  children,
  glowColor = "rgba(139, 92, 246, 0.5)",
  intensity = 1,
  className,
}: GlowingBorderCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 200 * intensity,
          height: 200 * intensity,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          left: position.x - 100 * intensity,
          top: position.y - 100 * intensity,
        }}
      />
      <div className="relative z-10 p-6">{children}</div>
    </motion.div>
  );
}

interface NeonBorderCardProps {
  children: React.ReactNode;
  color?: string;
  animated?: boolean;
  className?: string;
}

export function NeonBorderCard({
  children,
  color = "#8b5cf6",
  animated = true,
  className,
}: NeonBorderCardProps) {
  return (
    <motion.div
      className={cn("relative rounded-xl p-[1px]", className)}
      style={{
        background: `linear-gradient(135deg, ${color}, transparent, ${color})`,
      }}
      animate={animated ? {
        boxShadow: [
          `0 0 10px ${color}40, 0 0 20px ${color}20`,
          `0 0 20px ${color}60, 0 0 40px ${color}30`,
          `0 0 10px ${color}40, 0 0 20px ${color}20`,
        ],
      } : {}}
      transition={animated ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      } : {}}
    >
      <div className="bg-zinc-900 rounded-xl p-6">{children}</div>
    </motion.div>
  );
}

interface RainbowBorderCardProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function RainbowBorderCard({
  children,
  speed = 3,
  className,
}: RainbowBorderCardProps) {
  return (
    <div className={cn("relative rounded-xl p-[2px] overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative bg-zinc-900 rounded-xl p-6">{children}</div>
    </div>
  );
}
