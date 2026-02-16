"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoiseBgProps {
  children?: React.ReactNode;
  className?: string;
  opacity?: number;
  particleCount?: number;
  colorTint?: string;
}

interface GrainParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  drift: number;
}

export function NoiseBg({
  children,
  className,
  opacity = 0.08,
  particleCount = 150,
  colorTint = "#8b5cf6",
}: NoiseBgProps) {
  const [particles, setParticles] = useState<GrainParticle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const frameRef = useRef(0);

  // Initialize grain particles
  useEffect(() => {
    const newParticles: GrainParticle[] = Array.from(
      { length: particleCount },
      (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.4,
        speed: 0.02 + Math.random() * 0.05,
        angle: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.02,
      })
    );
    setParticles(newParticles);
  }, [particleCount]);

  // Animated grain canvas
  const drawGrain = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    if (width === 0 || height === 0) return;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Dynamic grain density based on time
    const densityWave = 0.7 + Math.sin(timeRef.current * 0.002) * 0.3;

    for (let i = 0; i < data.length; i += 4) {
      const random = Math.random();
      if (random < 0.15 * densityWave) {
        const brightness = Math.random() * 255;
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
        data[i + 3] = Math.random() * 30;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  // Animation frame for grain
  useAnimationFrame((t) => {
    timeRef.current = t;
    frameRef.current++;
    
    // Update grain every 2 frames for performance
    if (frameRef.current % 2 === 0) {
      drawGrain();
    }

    // Update floating particles
    setParticles((prev) =>
      prev.map((p) => {
        let newX = p.x + Math.cos(p.angle) * p.speed;
        let newY = p.y + Math.sin(p.angle) * p.speed;
        let newAngle = p.angle + p.drift;

        // Wrap around screen
        if (newX < -5) newX = 105;
        if (newX > 105) newX = -5;
        if (newY < -5) newY = 105;
        if (newY > 105) newY = -5;

        return { ...p, x: newX, y: newY, angle: newAngle };
      })
    );
  });

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = 256;
      canvas.height = 256;
    };
    resize();
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: opacity * 0.5,
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: opacity,
        }}
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.id % 3 === 0 ? colorTint : "#ffffff",
            opacity: p.opacity * opacity * 3,
          }}
          animate={{
            opacity: [
              p.opacity * opacity * 3,
              p.opacity * opacity * 5,
              p.opacity * opacity * 3,
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${colorTint}08 0%, transparent 70%)`,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${colorTint}05 50%, transparent 100%)`,
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorTint}15, transparent)`,
        }}
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
