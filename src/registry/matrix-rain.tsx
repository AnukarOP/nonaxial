"use client";

import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface MatrixRainProps {
  className?: string;
  color?: string;
  fontSize?: number;
  speed?: number;
  density?: number;
  characters?: string;
}

export function MatrixRain({
  className,
  color = "#8b5cf6",
  fontSize = 14,
  speed = 1,
  density = 0.05,
  characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const charArray = useMemo(() => characters.split(""), [characters]);

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

    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    let animationId: number;
    let lastTime = 0;
    const interval = 1000 / (30 * speed);

    const draw = (currentTime: number) => {
      animationId = requestAnimationFrame(draw);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime;

      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Glow effect for leading character
        if (Math.random() > 0.5) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, y);

        // Reset drop or continue falling
        if (y > canvas.height && Math.random() > 1 - density) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [charArray, color, fontSize, speed, density]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden bg-black", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
