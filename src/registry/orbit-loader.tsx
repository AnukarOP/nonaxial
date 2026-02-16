"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface OrbitLoaderProps {
  className?: string;
  size?: number;
  color?: string;
  speed?: number;
}

export function OrbitLoader({
  className,
  size = 80,
  color = "#8b5cf6",
  speed = 3,
}: OrbitLoaderProps) {
  const rings = useMemo(() => [
    { angle: 0, particles: 3, radius: size * 0.35, duration: speed, color: "#8b5cf6" },
    { angle: 60, particles: 4, radius: size * 0.45, duration: speed * 0.8, color: "#a855f7" },
    { angle: -30, particles: 2, radius: size * 0.28, duration: speed * 1.2, color: "#d946ef" },
  ], [size, speed]);

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size, perspective: size * 2 }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          boxShadow: `0 0 ${size * 0.3}px ${color}, 0 0 ${size * 0.5}px ${color}`,
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.25,
          height: size * 0.25,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {rings.map((ring, ringIndex) => (
        <motion.div
          key={ringIndex}
          className="absolute"
          style={{
            width: ring.radius * 2,
            height: ring.radius * 2,
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            borderRadius: "50%",
            border: `1px solid ${ring.color}30`,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: ring.angle,
            rotateY: [0, 360],
          }}
          transition={{
            rotateY: {
              duration: ring.duration,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {Array.from({ length: ring.particles }).map((_, particleIndex) => {
            const particleAngle = (particleIndex * 360) / ring.particles;
            return (
              <motion.div
                key={particleIndex}
                className="absolute"
                style={{
                  width: size * 0.08,
                  height: size * 0.08,
                  left: "50%",
                  top: 0,
                  x: "-50%",
                  y: "-50%",
                  transformOrigin: `50% ${ring.radius}px`,
                  transform: `rotate(${particleAngle}deg)`,
                }}
              >
                {[...Array(3)].map((_, trailIndex) => (
                  <motion.div
                    key={trailIndex}
                    className="absolute rounded-full"
                    style={{
                      width: size * 0.06 * (1 - trailIndex * 0.25),
                      height: size * 0.06 * (1 - trailIndex * 0.25),
                      left: "50%",
                      top: "50%",
                      x: "-50%",
                      y: "-50%",
                      background: ring.color,
                      opacity: 0.3 - trailIndex * 0.1,
                      transform: `translateX(${-trailIndex * 4}px)`,
                    }}
                  />
                ))}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: size * 0.08,
                    height: size * 0.08,
                    left: "50%",
                    top: "50%",
                    x: "-50%",
                    y: "-50%",
                    background: `radial-gradient(circle, white 0%, ${ring.color} 50%, transparent 100%)`,
                    boxShadow: `0 0 ${size * 0.1}px ${ring.color}, 0 0 ${size * 0.2}px ${ring.color}80`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: particleIndex * 0.2,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      ))}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            background: color,
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [0, Math.cos(i * 60 * Math.PI / 180) * size * 0.5],
            y: [0, Math.sin(i * 60 * Math.PI / 180) * size * 0.5],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
