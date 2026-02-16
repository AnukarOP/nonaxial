"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface DotsBgProps {
  children?: React.ReactNode;
  className?: string;
  dotSize?: number;
  gap?: number;
  interactive?: boolean;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  baseSize: number;
  currentSize: number;
  targetSize: number;
  opacity: number;
  targetOpacity: number;
  hue: number;
  wave: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export function DotsBg({
  children,
  className,
  dotSize = 3,
  gap = 30,
  interactive = true,
}: DotsBgProps) {
  const [dots, setDots] = useState<Dot[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  // Initialize dot grid
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cols = Math.ceil(rect.width / gap) + 1;
    const rows = Math.ceil(rect.height / gap) + 1;

    const newDots: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newDots.push({
          id: row * cols + col,
          x: (col / (cols - 1)) * 100,
          y: (row / (rows - 1)) * 100,
          baseSize: dotSize,
          currentSize: dotSize,
          targetSize: dotSize,
          opacity: 0.3,
          targetOpacity: 0.3,
          hue: 0,
          wave: Math.random() * Math.PI * 2,
        });
      }
    }
    setDots(newDots);
  }, [gap, dotSize]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate connections between active dots
  const calculateConnections = useCallback((dots: Dot[]): Connection[] => {
    const activeDots = dots.filter((d) => d.opacity > 0.5);
    const newConnections: Connection[] = [];

    for (let i = 0; i < activeDots.length && i < 20; i++) {
      for (let j = i + 1; j < activeDots.length && j < 20; j++) {
        const dx = activeDots[i].x - activeDots[j].x;
        const dy = activeDots[i].y - activeDots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
          newConnections.push({
            from: activeDots[i].id,
            to: activeDots[j].id,
            opacity: ((15 - distance) / 15) * 0.5,
          });
        }
      }
    }
    return newConnections;
  }, []);

  // Animation loop
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    const mouse = mouseRef.current;

    setDots((prev) => {
      const newDots = prev.map((dot) => {
        // Wave pattern animation
        const waveOffset = Math.sin(timeRef.current * 0.5 + dot.wave + dot.x * 0.05 + dot.y * 0.03) * 0.5 + 0.5;
        const baseWaveSize = dot.baseSize * (0.8 + waveOffset * 0.4);
        const baseWaveOpacity = 0.2 + waveOffset * 0.2;

        let targetSize = baseWaveSize;
        let targetOpacity = baseWaveOpacity;
        let hue = 270; // Violet base

        // Mouse interaction
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const interactionRadius = 15;

          if (distance < interactionRadius) {
            const intensity = 1 - distance / interactionRadius;
            targetSize = dot.baseSize * (1 + intensity * 2);
            targetOpacity = 0.3 + intensity * 0.7;
            hue = 270 - intensity * 90; // Shift towards cyan
          }
        }

        // Smooth interpolation
        const newCurrentSize = dot.currentSize + (targetSize - dot.currentSize) * 0.1;
        const newOpacity = dot.opacity + (targetOpacity - dot.opacity) * 0.1;

        return {
          ...dot,
          currentSize: newCurrentSize,
          targetSize,
          opacity: newOpacity,
          targetOpacity,
          hue,
        };
      });

      // Update connections
      setConnections(calculateConnections(newDots));
      return newDots;
    });
  });

  // Get dot by ID for connections
  const getDot = useCallback(
    (id: number) => dots.find((d) => d.id === id),
    [dots]
  );

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.15) ${dotSize * 0.5}px, transparent ${dotSize * 0.5}px)`,
          backgroundSize: `${gap}px ${gap}px`,
        }}
      />
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {connections.map((conn, i) => {
          const dotFrom = getDot(conn.from);
          const dotTo = getDot(conn.to);
          if (!dotFrom || !dotTo) return null;

          return (
            <line
              key={i}
              x1={`${dotFrom.x}%`}
              y1={`${dotFrom.y}%`}
              x2={`${dotTo.x}%`}
              y2={`${dotTo.y}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              strokeOpacity={conn.opacity}
              filter="url(#dotGlow)"
            />
          );
        })}
      </svg>
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full pointer-events-none transition-colors duration-200"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.currentSize,
            height: dot.currentSize,
            transform: "translate(-50%, -50%)",
            backgroundColor: `hsla(${dot.hue}, 70%, 60%, ${dot.opacity})`,
            boxShadow:
              dot.opacity > 0.5
                ? `0 0 ${dot.currentSize * 2}px hsla(${dot.hue}, 70%, 60%, ${dot.opacity * 0.5})`
                : "none",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.05) 30%, transparent 60%)",
            "linear-gradient(45deg, transparent 40%, rgba(139, 92, 246, 0.05) 70%, transparent 100%)",
            "linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.05) 30%, transparent 60%)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
