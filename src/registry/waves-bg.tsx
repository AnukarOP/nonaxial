"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface WavesBgProps {
  children?: React.ReactNode;
  className?: string;
  waveCount?: number;
}

interface FoamParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface SprayParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export function WavesBg({ children, className, waveCount = 5 }: WavesBgProps) {
  const [foam, setFoam] = useState<FoamParticle[]>([]);
  const [spray, setSpray] = useState<SprayParticle[]>([]);
  const timeRef = useRef(0);
  const lastSprayRef = useRef(0);

  // Wave layer configurations
  const waveLayers = useMemo(
    () => [
      { color: "rgba(6, 182, 212, 0.08)", speed: 0.3, amplitude: 15, offset: 0, y: 70 },
      { color: "rgba(59, 130, 246, 0.1)", speed: 0.4, amplitude: 20, offset: 1, y: 65 },
      { color: "rgba(99, 102, 241, 0.12)", speed: 0.5, amplitude: 18, offset: 2, y: 60 },
      { color: "rgba(139, 92, 246, 0.15)", speed: 0.35, amplitude: 22, offset: 3, y: 55 },
      { color: "rgba(168, 85, 247, 0.18)", speed: 0.45, amplitude: 25, offset: 4, y: 50 },
    ].slice(0, waveCount),
    [waveCount]
  );

  // Initialize foam particles
  useEffect(() => {
    const newFoam: FoamParticle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 55 + Math.random() * 40,
      size: 1 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.4,
      speed: 0.02 + Math.random() * 0.04,
    }));
    setFoam(newFoam);
  }, []);

  // Generate wave path
  const generateWavePath = (layer: (typeof waveLayers)[0], time: number): string => {
    const points: string[] = [];
    const segments = 30;

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      const wave1 = Math.sin(time * layer.speed + (i / segments) * Math.PI * 4 + layer.offset) * layer.amplitude;
      const wave2 = Math.sin(time * layer.speed * 1.5 + (i / segments) * Math.PI * 6 + layer.offset) * (layer.amplitude * 0.3);
      const wave3 = Math.sin(time * layer.speed * 0.7 + (i / segments) * Math.PI * 2 + layer.offset) * (layer.amplitude * 0.5);
      const y = layer.y + wave1 + wave2 + wave3;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }

    points.push("L 100 120 L 0 120 Z");
    return points.join(" ");
  };

  // Animation loop
  useAnimationFrame((t) => {
    timeRef.current = t * 0.002;

    // Update foam particles
    setFoam((prev) =>
      prev.map((p) => {
        let newX = p.x - p.speed;
        if (newX < -5) newX = 105;

        // Vertical bobbing based on wave
        const waveY = Math.sin(timeRef.current * 0.5 + p.x * 0.1) * 3;

        return { ...p, x: newX, y: p.y + waveY * 0.01 };
      })
    );

    // Spawn spray particles occasionally
    if (t - lastSprayRef.current > 500) {
      lastSprayRef.current = t;
      const spawnX = 10 + Math.random() * 80;
      const newSpray: SprayParticle[] = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: spawnX,
        y: 55 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 0.5,
        size: 1 + Math.random() * 2,
        life: 60,
        maxLife: 60,
      }));
      setSpray((prev) => [...prev.slice(-30), ...newSpray]);
    }

    // Update spray particles
    setSpray((prev) =>
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.02, // Gravity
          life: p.life - 1,
        }))
        .filter((p) => p.life > 0)
    );
  });

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(15, 23, 42, 0) 0%, rgba(30, 58, 138, 0.1) 50%, rgba(99, 102, 241, 0.2) 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(139, 92, 246, 0.15) 0%, transparent 40%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {waveLayers.map((layer, i) => (
            <linearGradient
              key={`wave-grad-${i}`}
              id={`wave-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={layer.color.replace(/[\d.]+\)$/, "0.6)")} />
              <stop offset="100%" stopColor={layer.color.replace(/[\d.]+\)$/, "0.1)")} />
            </linearGradient>
          ))}
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {waveLayers.map((layer, i) => (
          <motion.path
            key={i}
            d={generateWavePath(layer, timeRef.current)}
            fill={`url(#wave-gradient-${i})`}
            filter="url(#waveGlow)"
          />
        ))}
        <motion.path
          d={generateWavePath(waveLayers[waveLayers.length - 1], timeRef.current)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="0.3"
          filter="url(#waveGlow)"
        />
      </svg>
      {foam.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            filter: "blur(0.5px)",
          }}
          animate={{
            opacity: [p.opacity, p.opacity * 0.5, p.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
          }}
        />
      ))}
      {spray.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: (p.life / p.maxLife) * 0.6,
            filter: "blur(0.5px)",
          }}
        />
      ))}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "20%",
          top: "50%",
          width: "60%",
          height: "30%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scaleX: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`caustic-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${15 + i * 20}%`,
            top: "60%",
            width: "15%",
            height: "8%",
            background: "radial-gradient(ellipse, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleX: [1, 1.3, 1],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
