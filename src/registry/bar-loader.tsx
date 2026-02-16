"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface BarLoaderProps {
  className?: string;
  width?: number;
  height?: number;
}

export function BarLoader({ className, width = 250, height = 12 }: BarLoaderProps) {
  // Generate rising particles
  const particles = useMemo(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      x: (i / 15) * 100,
      size: 2 + ((Math.sin(i * 5.3) + 1) / 2) * 3,
      delay: i * 0.15,
      duration: 1 + ((Math.sin(i * 7.1) + 1) / 2) * 0.5,
    })), []);

  // Energy pulse segments
  const segments = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      x: (i / 20) * 100,
      delay: i * 0.05,
    })), []);

  return (
    <div
      className={cn("relative", className)}
      style={{ width, height: height * 4 }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            bottom: height,
            background: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#d946ef" : "#06b6d4",
            boxShadow: `0 0 ${particle.size * 2}px currentColor`,
          }}
          animate={{
            y: [0, -height * 3],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-full"
        style={{ height }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(30,30,40,0.8) 0%, rgba(40,40,50,0.9) 50%, rgba(30,30,40,0.8) 100%)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
          }}
        />
        <div className="absolute inset-0 flex">
          {segments.map((segment, i) => (
            <motion.div
              key={`segment-${i}`}
              className="flex-1 mx-px"
              style={{
                background: "linear-gradient(to top, #8b5cf6, #d946ef)",
              }}
              animate={{
                scaleY: [0.1, 1, 0.1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: segment.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            background: "linear-gradient(90deg, #06b6d4 0%, #8b5cf6 30%, #d946ef 60%, #f472b6 80%, #fb7185 100%)",
          }}
          animate={{
            width: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-y-0"
          style={{
            width: 20,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            filter: "blur(4px)",
          }}
          animate={{
            left: ["-20px", `${width}px`],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 rounded-full"
          style={{
            width: height * 1.5,
            height: height * 1.5,
            y: "-50%",
            background: "radial-gradient(circle, white 0%, #d946ef 50%, transparent 100%)",
            boxShadow: "0 0 15px #d946ef, 0 0 30px #8b5cf6",
          }}
          animate={{
            left: [`${-height}px`, `${width - height * 0.5}px`, `${-height}px`],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 rounded-full"
          style={{
            height: height * 0.3,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-full"
        style={{
          height: height * 2,
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.4) 0%, transparent 70%)",
          filter: "blur(8px)",
          y: height,
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`arc-${i}`}
          className="absolute"
          style={{
            width: 2,
            height: height * 2,
            bottom: height,
            background: "linear-gradient(to top, #8b5cf6, transparent)",
            filter: "blur(1px)",
            transformOrigin: "bottom",
          }}
          animate={{
            left: [`${i * 30 + 10}%`, `${i * 30 + 20}%`, `${i * 30 + 10}%`],
            rotate: [-15, 15, -15],
            opacity: [0, 0.8, 0],
            scaleY: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.2,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}
