"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridBgProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
  perspective?: boolean;
}

interface GlowPoint {
  id: number;
  x: number;
  y: number;
  intensity: number;
  decay: number;
}

interface ScanLine {
  id: number;
  position: number;
  direction: "horizontal" | "vertical";
  speed: number;
  color: string;
}

interface PulseWave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function GridBg({
  children,
  className,
  gridSize = 50,
  perspective = true,
}: GridBgProps) {
  const [glowPoints, setGlowPoints] = useState<GlowPoint[]>([]);
  const [scanLines, setScanLines] = useState<ScanLine[]>([]);
  const [pulseWaves, setPulseWaves] = useState<PulseWave[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 50, y: 50 });
  const timeRef = useRef(0);

  const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#22c55e"];

  // Initialize scan lines
  useEffect(() => {
    const lines: ScanLine[] = [
      { id: 0, position: 0, direction: "horizontal", speed: 0.3, color: "#8b5cf6" },
      { id: 1, position: 100, direction: "horizontal", speed: -0.2, color: "#06b6d4" },
      { id: 2, position: 0, direction: "vertical", speed: 0.25, color: "#ec4899" },
      { id: 3, position: 100, direction: "vertical", speed: -0.35, color: "#22c55e" },
    ];
    setScanLines(lines);
  }, []);

  // Mouse tracking for grid interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };

      // Add glow point at intersections near mouse
      const gridX = Math.round(mouseRef.current.x / 10) * 10;
      const gridY = Math.round(mouseRef.current.y / 10) * 10;

      setGlowPoints((prev) => {
        const existing = prev.find((p) => p.x === gridX && p.y === gridY);
        if (existing) {
          return prev.map((p) =>
            p.x === gridX && p.y === gridY
              ? { ...p, intensity: Math.min(p.intensity + 0.2, 1) }
              : p
          );
        }
        return [
          ...prev.slice(-20),
          { id: Date.now(), x: gridX, y: gridY, intensity: 0.5, decay: 0.02 },
        ];
      });
    };

    const handleClick = () => {
      // Create pulse wave on click
      setPulseWaves((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          radius: 0,
          maxRadius: 50,
          opacity: 0.8,
        },
      ]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Animation loop
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;

    // Update scan lines
    setScanLines((prev) =>
      prev.map((line) => {
        let newPos = line.position + line.speed;
        if (newPos > 100) newPos = 0;
        if (newPos < 0) newPos = 100;
        return { ...line, position: newPos };
      })
    );

    // Decay glow points
    setGlowPoints((prev) =>
      prev
        .map((p) => ({ ...p, intensity: p.intensity - p.decay }))
        .filter((p) => p.intensity > 0)
    );

    // Update pulse waves
    setPulseWaves((prev) =>
      prev
        .map((w) => ({
          ...w,
          radius: w.radius + 0.8,
          opacity: w.opacity * 0.97,
        }))
        .filter((w) => w.radius < w.maxRadius)
    );

    // Auto-spawn pulse waves occasionally
    if (Math.random() < 0.005) {
      setPulseWaves((prev) => [
        ...prev.slice(-2),
        {
          id: t,
          x: Math.random() * 100,
          y: Math.random() * 100,
          radius: 0,
          maxRadius: 30,
          opacity: 0.4,
        },
      ]);
    }
  });

  // Generate grid CSS with glow
  const generateGridStyle = useCallback(() => {
    const baseGrid = `
      linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
    `;
    return baseGrid;
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: generateGridStyle(),
          backgroundSize: `${gridSize}px ${gridSize}px`,
          transform: perspective
            ? "perspective(500px) rotateX(60deg) scale(2.5)"
            : "none",
          transformOrigin: "center 120%",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      {glowPoints.map((point) => (
        <div
          key={point.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(139, 92, 246, ${point.intensity}) 0%, transparent 70%)`,
            boxShadow: `0 0 20px rgba(139, 92, 246, ${point.intensity * 0.5})`,
          }}
        />
      ))}
      {scanLines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute pointer-events-none"
          style={
            line.direction === "horizontal"
              ? {
                  left: 0,
                  right: 0,
                  top: `${line.position}%`,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${line.color}60, transparent)`,
                  boxShadow: `0 0 15px ${line.color}40`,
                }
              : {
                  top: 0,
                  bottom: 0,
                  left: `${line.position}%`,
                  width: 2,
                  background: `linear-gradient(180deg, transparent, ${line.color}60, transparent)`,
                  boxShadow: `0 0 15px ${line.color}40`,
                }
          }
        />
      ))}
      {pulseWaves.map((wave) => (
        <div
          key={wave.id}
          className="absolute rounded-full border-2 pointer-events-none"
          style={{
            left: `${wave.x}%`,
            top: `${wave.y}%`,
            width: `${wave.radius * 2}%`,
            height: `${wave.radius * 2}%`,
            transform: "translate(-50%, -50%)",
            borderColor: `rgba(139, 92, 246, ${wave.opacity})`,
            boxShadow: `0 0 20px rgba(139, 92, 246, ${wave.opacity * 0.5}), inset 0 0 20px rgba(139, 92, 246, ${wave.opacity * 0.3})`,
          }}
        />
      ))}
      {[
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 0, y: 100 },
        { x: 100, y: 100 },
      ].map((corner, i) => (
        <motion.div
          key={`corner-${i}`}
          className="absolute w-32 h-32 pointer-events-none"
          style={{
            left: `${corner.x}%`,
            top: `${corner.y}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${colors[i]}20 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse at 70% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse at 30% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {perspective && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(139, 92, 246, 0.2) 0%, transparent 100%)",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
