"use client";

import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  maxOpacity?: number;
}

export function FlickeringGrid({
  className,
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(139, 92, 246)",
  maxOpacity = 0.3,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string, opacity: number) => {
      if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
      }
      if (color.startsWith("#")) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return `rgba(139, 92, 246, ${opacity})`;
    };
    return toRGBA;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const cols = Math.ceil(canvas.width / (squareSize + gridGap));
    const rows = Math.ceil(canvas.height / (squareSize + gridGap));

    // Initialize grid with random opacities
    const grid: number[][] = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = Math.random() * maxOpacity;
      }
    }

    let animationId: number;
    let lastTime = 0;
    const fps = 15;
    const interval = 1000 / fps;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Randomly flicker
          if (Math.random() < flickerChance) {
            grid[i][j] = Math.random() * maxOpacity;
          }

          const x = j * (squareSize + gridGap);
          const y = i * (squareSize + gridGap);

          ctx.fillStyle = memoizedColor(color, grid[i][j]);
          ctx.fillRect(x, y, squareSize, squareSize);
        }
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [squareSize, gridGap, flickerChance, color, maxOpacity, memoizedColor]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
