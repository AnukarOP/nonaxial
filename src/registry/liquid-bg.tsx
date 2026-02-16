"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidBgProps {
  children?: React.ReactNode;
  className?: string;
  ballCount?: number;
}

interface MetaBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

// Calculate metaball field value at a point
function calculateField(
  x: number,
  y: number,
  balls: MetaBall[],
  width: number,
  height: number
): { value: number; colorMix: { r: number; g: number; b: number } } {
  let totalValue = 0;
  let r = 0,
    g = 0,
    b = 0;
  let totalWeight = 0;

  balls.forEach((ball) => {
    const bx = (ball.x / 100) * width;
    const by = (ball.y / 100) * height;
    const br = (ball.radius / 100) * Math.min(width, height);

    const dx = x - bx;
    const dy = y - by;
    const distSq = dx * dx + dy * dy;
    const influence = (br * br) / distSq;
    totalValue += influence;

    // Color mixing based on influence
    const color = hexToRgb(ball.color);
    if (color) {
      r += color.r * influence;
      g += color.g * influence;
      b += color.b * influence;
      totalWeight += influence;
    }
  });

  if (totalWeight > 0) {
    r /= totalWeight;
    g /= totalWeight;
    b /= totalWeight;
  }

  return { value: totalValue, colorMix: { r, g, b } };
}

// Hex to RGB converter
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function LiquidBg({ children, className, ballCount = 6 }: LiquidBgProps) {
  const [balls, setBalls] = useState<MetaBall[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);

  const colors = [
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#22c55e", // Green
    "#f59e0b", // Amber
    "#6366f1", // Indigo
  ];

  // Initialize metaballs
  useEffect(() => {
    const newBalls: MetaBall[] = Array.from({ length: ballCount }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 12 + Math.random() * 10,
      color: colors[i % colors.length],
      mass: 1 + Math.random(),
    }));
    setBalls(newBalls);
  }, [ballCount]);

  // Canvas rendering with marching squares
  const renderMetaballs = (currentBalls: MetaBall[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    if (width === 0 || height === 0) return;
    const resolution = 4; // Lower = higher quality, higher = better performance
    const cols = Math.ceil(width / resolution);
    const rows = Math.ceil(height / resolution);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create image data for pixel manipulation
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Calculate field values and render
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const { value, colorMix } = calculateField(
          px,
          py,
          currentBalls,
          width,
          height
        );

        // Threshold for metaball surface
        if (value > 1) {
          const idx = (py * width + px) * 4;
          const intensity = Math.min(value - 1, 1);

          data[idx] = Math.min(255, colorMix.r * 1.2);
          data[idx + 1] = Math.min(255, colorMix.g * 1.2);
          data[idx + 2] = Math.min(255, colorMix.b * 1.2);
          data[idx + 3] = Math.min(255, intensity * 200);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Add glow effect with gradient overlay
    ctx.globalCompositeOperation = "source-over";
    currentBalls.forEach((ball) => {
      const bx = (ball.x / 100) * width;
      const by = (ball.y / 100) * height;
      const br = (ball.radius / 100) * Math.min(width, height);

      const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br * 2);
      gradient.addColorStop(0, `${ball.color}40`);
      gradient.addColorStop(0.5, `${ball.color}20`);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(bx - br * 2, by - br * 2, br * 4, br * 4);
    });
  };

  // Physics simulation
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;

    setBalls((prev) => {
      const newBalls = prev.map((ball) => {
        let newVx = ball.vx;
        let newVy = ball.vy;

        // Surface tension - balls attract slightly
        prev.forEach((other) => {
          if (other.id === ball.id) return;
          const dx = other.x - ball.x;
          const dy = other.y - ball.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Attraction when close
          if (dist < 30 && dist > 5) {
            const force = 0.001 * (1 - dist / 30);
            newVx += (dx / dist) * force;
            newVy += (dy / dist) * force;
          }
          // Repulsion when very close (surface tension)
          if (dist < 10 && dist > 0) {
            const force = 0.01 * ((10 - dist) / 10);
            newVx -= (dx / dist) * force;
            newVy -= (dy / dist) * force;
          }
        });

        // Add some randomness for organic movement
        newVx += (Math.random() - 0.5) * 0.02;
        newVy += (Math.random() - 0.5) * 0.02;

        // Damping
        newVx *= 0.995;
        newVy *= 0.995;

        // Speed limit
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > 0.8) {
          newVx = (newVx / speed) * 0.8;
          newVy = (newVy / speed) * 0.8;
        }

        // Boundary forces
        let newX = ball.x + newVx;
        let newY = ball.y + newVy;

        if (newX < 10) {
          newVx += 0.05;
          newX = 10;
        }
        if (newX > 90) {
          newVx -= 0.05;
          newX = 90;
        }
        if (newY < 10) {
          newVy += 0.05;
          newY = 10;
        }
        if (newY > 90) {
          newVy -= 0.05;
          newY = 90;
        }

        return {
          ...ball,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });

      // Render metaballs
      renderMetaballs(newBalls);

      return newBalls;
    });
  });

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        // Use lower resolution for performance
        canvas.width = Math.floor(rect.width / 2);
        canvas.height = Math.floor(rect.height / 2);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // SVG filter for gooey effect
  const gooFilter = useMemo(
    () => (
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquidGoo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    ),
    []
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {gooFilter}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: "blur(8px) contrast(1.5)",
          mixBlendMode: "screen",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: "url(#liquidGoo)" }}
      >
        <defs>
          <filter id="liquidFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {balls.map((ball) => (
          <motion.circle
            key={ball.id}
            cx={ball.x}
            cy={ball.y}
            r={ball.radius}
            fill={`${ball.color}60`}
            filter="url(#liquidFilter)"
          />
        ))}
      </svg>
      {balls.map((ball) => (
        <motion.div
          key={`glow-${ball.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            width: `${ball.radius * 2}%`,
            height: `${ball.radius * 2}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${ball.color}30 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2 + ball.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {balls.slice(0, 3).map((ball, i) => (
        <motion.div
          key={`reflect-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${ball.x - 3}%`,
            top: `${ball.y - 3}%`,
            width: ball.radius * 0.4,
            height: ball.radius * 0.4,
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
