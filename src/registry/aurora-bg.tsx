"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraBgProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  baseOpacity: number;
}

interface AuroraCurtain {
  id: number;
  offset: number;
  speed: number;
  amplitude: number;
  colors: string[];
  height: number;
}

export function AuroraBg({ children, className, intensity = 1 }: AuroraBgProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [curtains, setCurtains] = useState<AuroraCurtain[]>([]);
  const timeRef = useRef(0);
  const [waveOffset, setWaveOffset] = useState(0);

  // Initialize stars and aurora curtains
  useEffect(() => {
    // Generate twinkling stars
    const newStars: Star[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // Stars only in upper portion
      size: 0.5 + Math.random() * 2,
      twinkleSpeed: 1 + Math.random() * 3,
      baseOpacity: 0.3 + Math.random() * 0.7,
    }));
    setStars(newStars);

    // Generate aurora curtains
    const newCurtains: AuroraCurtain[] = [
      {
        id: 0,
        offset: 0,
        speed: 0.8,
        amplitude: 30,
        colors: ["#06b6d4", "#8b5cf6", "#06b6d4"],
        height: 60,
      },
      {
        id: 1,
        offset: 2,
        speed: 0.6,
        amplitude: 25,
        colors: ["#22c55e", "#06b6d4", "#8b5cf6"],
        height: 50,
      },
      {
        id: 2,
        offset: 4,
        speed: 1,
        amplitude: 35,
        colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
        height: 55,
      },
      {
        id: 3,
        offset: 6,
        speed: 0.5,
        amplitude: 20,
        colors: ["#8b5cf6", "#ec4899", "#f97316"],
        height: 45,
      },
    ];
    setCurtains(newCurtains);
  }, []);

  // Animation loop for wave motion
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    setWaveOffset(t * 0.0003);
  });

  // Generate wave path for aurora curtain
  const generateWavePath = (curtain: AuroraCurtain): string => {
    const points: string[] = [];
    const segments = 20;
    const time = timeRef.current * curtain.speed + curtain.offset;

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      const wave1 = Math.sin(time + (i / segments) * Math.PI * 2) * curtain.amplitude;
      const wave2 = Math.sin(time * 1.3 + (i / segments) * Math.PI * 3) * (curtain.amplitude * 0.5);
      const wave3 = Math.sin(time * 0.7 + (i / segments) * Math.PI * 4) * (curtain.amplitude * 0.3);
      const y = 20 + wave1 + wave2 + wave3;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }

    // Close the path to create filled area
    points.push(`L 100 100 L 0 100 Z`);
    return points.join(" ");
  };

  return (
    <div className={cn("relative overflow-hidden bg-zinc-950", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)",
        }}
      />
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255,255,255,0.3)`,
          }}
          animate={{
            opacity: [
              star.baseOpacity,
              star.baseOpacity * 0.3,
              star.baseOpacity,
            ],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.twinkleSpeed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {curtains.map((curtain) => (
            <linearGradient
              key={`grad-${curtain.id}`}
              id={`aurora-gradient-${curtain.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              {curtain.colors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (curtain.colors.length - 1)) * 100}%`}
                  stopColor={color}
                  stopOpacity={0.4 * intensity}
                />
              ))}
            </linearGradient>
          ))}
          <filter id="auroraGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="auroraBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {curtains.map((curtain) => (
          <motion.path
            key={curtain.id}
            d={generateWavePath(curtain)}
            fill={`url(#aurora-gradient-${curtain.id})`}
            filter="url(#auroraGlow)"
            style={{
              mixBlendMode: "screen",
            }}
            animate={{
              opacity: [0.5 * intensity, 0.8 * intensity, 0.5 * intensity],
            }}
            transition={{
              duration: 3 + curtain.id,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 70% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 25%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 30% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${20 + i * 30}%`,
            top: "10%",
            width: "30%",
            height: "40%",
            background: `radial-gradient(ellipse, ${
              ["#06b6d4", "#8b5cf6", "#22c55e"][i]
            }20 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut",
          }}
        />
      ))}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(139, 92, 246, 0.1) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
