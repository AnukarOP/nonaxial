"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function SkeletonLoader({
  className,
  variant = "rectangular",
  width = "100%",
  height = 20,
  animation = "wave",
}: SkeletonLoaderProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const numericWidth = typeof width === "number" ? width : 200;
  const numericHeight = typeof height === "number" ? height : 20;

  // Generate random glitch block positions
  const glitchBlocks = useMemo(() => 
    Array.from({ length: 5 }).map((_, i) => ({
      x: ((Math.sin(i * 3.7) + 1) / 2) * 80 + 10,
      y: ((Math.sin(i * 5.3) + 1) / 2) * 60 + 20,
      w: ((Math.sin(i * 7.1) + 1) / 2) * 15 + 5,
      h: ((Math.sin(i * 2.9) + 1) / 2) * 20 + 10,
      delay: i * 0.4,
    })), []);

  // Generate bone structure lines
  const boneLines = useMemo(() => 
    Array.from({ length: 3 }).map((_, i) => ({
      y: 25 + i * 25,
      width: 60 + ((Math.sin(i * 4.1) + 1) / 2) * 30,
      delay: i * 0.2,
    })), []);

  if (animation === "none") {
    return (
      <div
        className={cn(
          "bg-muted/30",
          variantClasses[variant],
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(120,120,130,0.15) 0%, rgba(80,80,90,0.2) 50%, rgba(120,120,130,0.15) 100%)",
        }}
      />

      {boneLines.map((line, i) => (
        <motion.div
          key={`bone-${i}`}
          className="absolute left-[10%] rounded-full"
          style={{
            top: `${line.y}%`,
            width: `${line.width}%`,
            height: "2px",
            background: "rgba(255,255,255,0.08)",
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scaleX: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: line.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: "overlay",
        }}
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 40%, rgba(217,70,239,0.08) 50%, rgba(139,92,246,0.05) 60%, transparent 100%)",
        }}
        animate={{
          x: ["-150%", "250%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5,
        }}
      />

      {glitchBlocks.map((block, i) => (
        <motion.div
          key={`glitch-${i}`}
          className="absolute"
          style={{
            left: `${block.x}%`,
            top: `${block.y}%`,
            width: `${block.w}%`,
            height: `${block.h}%`,
            background: "rgba(139,92,246,0.1)",
          }}
          animate={{
            opacity: [0, 0.3, 0, 0.2, 0],
            x: [0, -2, 4, -1, 0],
            scaleX: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 2 + block.delay,
            delay: block.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 20px rgba(139,92,246,0.1)",
        }}
        animate={{
          boxShadow: [
            "inset 0 0 20px rgba(139,92,246,0.05)",
            "inset 0 0 30px rgba(139,92,246,0.12)",
            "inset 0 0 20px rgba(139,92,246,0.05)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        }}
        animate={{
          top: ["-5%", "105%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
