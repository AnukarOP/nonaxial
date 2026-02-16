"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface BounceLoaderProps {
  className?: string;
  size?: number;
  color?: string;
  count?: number;
}

export function BounceLoader({
  className,
  size = 20,
  color = "#8b5cf6",
  count = 3,
}: BounceLoaderProps) {
  const colors = useMemo(() => [
    "#8b5cf6",
    "#a855f7", 
    "#d946ef",
    "#f472b6",
    "#fb7185",
  ].slice(0, count), [count]);

  const bounceHeight = size * 2.5;

  return (
    <div className={cn("flex items-end gap-2 relative", className)} style={{ height: bounceHeight + size }}>
      {Array.from({ length: count }).map((_, index) => {
        const baseColor = colors[index % colors.length];
        const delay = index * 0.15;
        
        return (
          <div key={index} className="relative" style={{ width: size }}>
            <motion.div
              className="absolute rounded-full"
              style={{
                width: size,
                height: size * 0.3,
                background: `radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)`,
                bottom: 0,
                left: 0,
              }}
              animate={{
                scaleX: [1, 0.5, 1],
                scaleY: [1, 0.8, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
            {[...Array(4)].map((_, dustIndex) => (
              <motion.div
                key={`dust-${dustIndex}`}
                className="absolute rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  background: baseColor,
                  bottom: size * 0.2,
                  left: size / 2,
                }}
                animate={{
                  x: [(dustIndex - 1.5) * 2, (dustIndex - 1.5) * 15],
                  y: [0, -10 - dustIndex * 3],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  delay: delay + 0.35,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle at 30% 30%, white 0%, ${baseColor} 50%, ${baseColor}cc 100%)`,
                boxShadow: `0 0 ${size * 0.5}px ${baseColor}60, inset 0 -${size * 0.1}px ${size * 0.2}px ${baseColor}40`,
                left: 0,
                transformOrigin: "center bottom",
              }}
              animate={{
                y: [0, -bounceHeight, 0],
                scaleX: [1, 0.9, 1, 1.3, 1],
                scaleY: [1, 1.1, 1, 0.7, 1],
                backgroundColor: [baseColor, colors[(index + 1) % colors.length], baseColor],
              }}
              transition={{
                y: {
                  duration: 0.5,
                  repeat: Infinity,
                  delay,
                  ease: [0.25, 0.1, 0.25, 1],
                  times: [0, 0.45, 1],
                },
                scaleX: {
                  duration: 0.5,
                  repeat: Infinity,
                  delay,
                  times: [0, 0.4, 0.45, 0.55, 1],
                },
                scaleY: {
                  duration: 0.5,
                  repeat: Infinity,
                  delay,
                  times: [0, 0.4, 0.45, 0.55, 1],
                },
                backgroundColor: {
                  duration: 1,
                  repeat: Infinity,
                  delay,
                },
              }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: size * 0.3,
                  height: size * 0.3,
                  background: "rgba(255,255,255,0.6)",
                  top: size * 0.15,
                  left: size * 0.2,
                  filter: "blur(2px)",
                }}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
