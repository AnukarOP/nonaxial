"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export function ParticleField({ count = 50, className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.6)";
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
    />
  );
}

interface WaveAnimationProps {
  amplitude?: number;
  frequency?: number;
  className?: string;
}

export function WaveAnimation({
  amplitude = 30,
  frequency = 0.02,
  className,
}: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const layers = [
        { color: "rgba(139, 92, 246, 0.3)", offset: 0 },
        { color: "rgba(168, 85, 247, 0.4)", offset: Math.PI / 3 },
        { color: "rgba(217, 70, 239, 0.5)", offset: (Math.PI * 2) / 3 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin(x * frequency + offsetRef.current + layer.offset) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = layer.color;
        ctx.fill();
      });

      offsetRef.current += 0.03;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [amplitude, frequency]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
    />
  );
}

interface GravityBallsProps {
  count?: number;
  className?: string;
}

export function GravityBalls({ count = 10, className }: GravityBallsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<
    { id: number; x: number; y: number; vx: number; vy: number; radius: number; color: string }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const colors = ["#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f97316"];

    const initialBalls = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: 0,
      radius: Math.random() * 20 + 10,
      color: colors[i % colors.length],
    }));

    setBalls(initialBalls);

    const gravity = 0.3;
    const bounce = 0.7;
    const friction = 0.99;

    let animationId: number;

    const animate = () => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, vx, vy, radius } = ball;

          vy += gravity;
          x += vx;
          y += vy;

          if (y + radius > height) {
            y = height - radius;
            vy = -vy * bounce;
          }

          if (x - radius < 0) {
            x = radius;
            vx = -vx * bounce;
          } else if (x + radius > width) {
            x = width - radius;
            vx = -vx * bounce;
          }

          vx *= friction;

          return { ...ball, x, y, vx, vy };
        })
      );

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [count]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden", className)}>
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute rounded-full"
          style={{
            width: ball.radius * 2,
            height: ball.radius * 2,
            left: ball.x - ball.radius,
            top: ball.y - ball.radius,
            backgroundColor: ball.color,
            boxShadow: `0 0 20px ${ball.color}`,
          }}
        />
      ))}
    </div>
  );
}

interface ShootingStarsProps {
  frequency?: number;
  className?: string;
}

export function ShootingStars({ frequency = 2000, className }: ShootingStarsProps) {
  const [stars, setStars] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = {
        id: idRef.current++,
        startX: Math.random() * 100,
        startY: Math.random() * 50,
      };

      setStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 1000);
    }, frequency);

    return () => clearInterval(interval);
  }, [frequency]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-0.5 h-20 bg-gradient-to-b from-white to-transparent"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              rotate: "45deg",
            }}
            initial={{ opacity: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, x: 200, y: 200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface PulsatingCirclesProps {
  count?: number;
  className?: string;
}

export function PulsatingCircles({ count = 5, className }: PulsatingCirclesProps) {
  return (
    <div className={cn("relative flex items-center justify-center w-full h-full", className)}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-violet-500/30"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 3,
            delay: i * (3 / count),
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{ width: 100, height: 100 }}
        />
      ))}
      <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-violet-500/40" />
      </div>
    </div>
  );
}

interface DNAHelixProps {
  segments?: number;
  className?: string;
}

export function DNAHelix({ segments = 20, className }: DNAHelixProps) {
  return (
    <div className={cn("relative h-full w-16 flex items-center justify-center", className)}>
      {Array.from({ length: segments }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-full flex justify-between"
          style={{ top: `${(i / segments) * 100}%` }}
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 4,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <div className="flex-1 h-0.5 bg-white/20 self-center" />
          <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
        </motion.div>
      ))}
    </div>
  );
}

interface FlowingDotsProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function FlowingDots({ rows = 10, cols = 15, className }: FlowingDotsProps) {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn("grid w-full h-full", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -100, y: -100 })}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const cellX = ((col + 0.5) / cols) * (containerRef.current?.offsetWidth || 0);
        const cellY = ((row + 0.5) / rows) * (containerRef.current?.offsetHeight || 0);
        const dx = mousePos.x - cellX;
        const dy = mousePos.y - cellY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;
        const scale = dist < maxDist ? 1 + (1 - dist / maxDist) * 2 : 1;
        const opacity = dist < maxDist ? 0.5 + (1 - dist / maxDist) * 0.5 : 0.3;

        return (
          <motion.div
            key={i}
            className="flex items-center justify-center"
            animate={{ scale, opacity }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          </motion.div>
        );
      })}
    </div>
  );
}
