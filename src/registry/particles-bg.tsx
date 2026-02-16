"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticlesBgProps {
  children?: React.ReactNode;
  className?: string;
  count?: number;
  connectionDistance?: number;
  mouseAttraction?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  mass: number;
  pulse: number;
  pulseSpeed: number;
}

interface PulseWave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function ParticlesBg({
  children,
  className,
  count = 60,
  connectionDistance = 120,
  mouseAttraction = true,
}: ParticlesBgProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pulseWaves, setPulseWaves] = useState<PulseWave[]>([]);
  const [connections, setConnections] = useState<{ from: number; to: number; opacity: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lastPulseRef = useRef(0);
  const dimensionsRef = useRef({ width: 1, height: 1 });

  const colors = ["#8b5cf6", "#ec4899", "#06b6d4", "#22c55e", "#f59e0b"];

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      mass: 0.5 + Math.random() * 1.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));
    setParticles(newParticles);
  }, [count]);

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

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Create pulse wave on click
      setPulseWaves((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          x,
          y,
          radius: 0,
          maxRadius: 40,
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

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        dimensionsRef.current = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate connections between particles
  const calculateConnections = useCallback(
    (particles: Particle[]) => {
      const newConnections: { from: number; to: number; opacity: number }[] = [];
      const { width, height } = dimensionsRef.current;
      const scale = Math.min(width, height);
      const threshold = (connectionDistance / scale) * 100;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < threshold) {
            newConnections.push({
              from: i,
              to: j,
              opacity: 1 - distance / threshold,
            });
          }
        }
      }
      return newConnections;
    },
    [connectionDistance]
  );

  // Physics simulation
  useAnimationFrame((t) => {
    const mouse = mouseRef.current;

    // Auto pulse waves
    if (t - lastPulseRef.current > 3000) {
      lastPulseRef.current = t;
      setPulseWaves((prev) => [
        ...prev.slice(-2),
        {
          id: t,
          x: Math.random() * 100,
          y: Math.random() * 100,
          radius: 0,
          maxRadius: 30,
          opacity: 0.5,
        },
      ]);
    }

    // Update pulse waves
    setPulseWaves((prev) =>
      prev
        .map((w) => ({
          ...w,
          radius: w.radius + 0.5,
          opacity: w.opacity * 0.98,
        }))
        .filter((w) => w.radius < w.maxRadius)
    );

    setParticles((prev) => {
      const newParticles = prev.map((p) => {
        let newVx = p.vx;
        let newVy = p.vy;

        // Mouse attraction/repulsion
        if (mouseAttraction && mouse.x > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20 && distance > 0) {
            const force = (20 - distance) / 20 * 0.05;
            newVx += (dx / distance) * force;
            newVy += (dy / distance) * force;
          }
        }

        // Pulse wave effect
        pulseWaves.forEach((wave) => {
          const dx = p.x - wave.x;
          const dy = p.y - wave.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const waveRadius = wave.radius;

          if (Math.abs(distance - waveRadius) < 5) {
            const force = wave.opacity * 0.1;
            newVx += (dx / (distance || 1)) * force;
            newVy += (dy / (distance || 1)) * force;
          }
        });

        // Inter-particle forces (soft collision)
        prev.forEach((other) => {
          if (other.id === p.id) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 8 && distance > 0) {
            const force = ((8 - distance) / 8) * 0.02;
            newVx += (dx / distance) * force;
            newVy += (dy / distance) * force;
          }
        });

        // Damping
        newVx *= 0.99;
        newVy *= 0.99;

        // Speed limit
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > 0.5) {
          newVx = (newVx / speed) * 0.5;
          newVy = (newVy / speed) * 0.5;
        }

        // Boundary bounce
        let newX = p.x + newVx;
        let newY = p.y + newVy;

        if (newX < 0 || newX > 100) {
          newVx *= -0.8;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY < 0 || newY > 100) {
          newVy *= -0.8;
          newY = Math.max(0, Math.min(100, newY));
        }

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          pulse: p.pulse + p.pulseSpeed,
        };
      });

      // Update connections
      setConnections(calculateConnections(newParticles));
      return newParticles;
    });
  });

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {connections.map((conn, i) => {
          const p1 = particles[conn.from];
          const p2 = particles[conn.to];
          if (!p1 || !p2) return null;

          return (
            <line
              key={i}
              x1={`${p1.x}%`}
              y1={`${p1.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke={p1.color}
              strokeWidth="0.5"
              strokeOpacity={conn.opacity * 0.3}
              filter="url(#particleGlow)"
            />
          );
        })}
      </svg>
      {pulseWaves.map((wave) => (
        <div
          key={wave.id}
          className="absolute rounded-full border pointer-events-none"
          style={{
            left: `${wave.x}%`,
            top: `${wave.y}%`,
            width: `${wave.radius * 2}%`,
            height: `${wave.radius * 2}%`,
            transform: "translate(-50%, -50%)",
            borderColor: `rgba(139, 92, 246, ${wave.opacity * 0.5})`,
            boxShadow: `0 0 20px rgba(139, 92, 246, ${wave.opacity * 0.3})`,
          }}
        />
      ))}
      {particles.map((p) => {
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size * pulseScale,
              height: p.size * pulseScale,
              backgroundColor: p.color,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        );
      })}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
