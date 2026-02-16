"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CursorTrailProps {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  fadeDelay?: number;
  className?: string;
}

export function CursorTrail({
  color = "#8b5cf6",
  particleCount = 20,
  particleSize = 8,
  fadeDelay = 0.1,
  className,
}: CursorTrailProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setParticles((prev) => {
        const newParticle = { id: particleIdRef.current++, x, y };
        const updated = [...prev, newParticle];
        return updated.slice(-particleCount);
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [particleCount]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: particleSize,
              height: particleSize,
              backgroundColor: color,
              left: particle.x - particleSize / 2,
              top: particle.y - particleSize / 2,
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: index * fadeDelay * 0.1 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface SpotlightCursorProps {
  spotlightSize?: number;
  spotlightColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SpotlightCursor({
  spotlightSize = 200,
  spotlightColor = "rgba(139, 92, 246, 0.15)",
  className,
  children,
}: SpotlightCursorProps) {
  const [position, setPosition] = useState({ x: -spotlightSize, y: -spotlightSize });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setPosition({ x: -spotlightSize, y: -spotlightSize });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [spotlightSize]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: spotlightSize,
          height: spotlightSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
        }}
        animate={{
          left: position.x - spotlightSize / 2,
          top: position.y - spotlightSize / 2,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      {children}
    </div>
  );
}

interface FollowCursorProps {
  children: React.ReactNode;
  offset?: { x: number; y: number };
  className?: string;
}

export function FollowCursor({
  children,
  offset = { x: 20, y: 20 },
  className,
}: FollowCursorProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!position) return null;

  return (
    <motion.div
      className={cn("fixed pointer-events-none z-50", className)}
      animate={{
        left: position.x + offset.x,
        top: position.y + offset.y,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}

interface RippleCursorProps {
  color?: string;
  duration?: number;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

export function RippleCursor({
  color = "rgba(139, 92, 246, 0.3)",
  duration = 1,
  size = 100,
  className,
  children,
}: RippleCursorProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = { id: rippleIdRef.current++, x, y };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, duration * 1000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleClick);
      }
    };
  }, [duration]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x - size / 2,
              top: ripple.y - size / 2,
              width: size,
              height: size,
              border: `2px solid ${color}`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface MorphingCursorProps {
  shapes?: ("circle" | "square" | "triangle")[];
  size?: number;
  color?: string;
  className?: string;
}

export function MorphingCursor({
  shapes = ["circle", "square", "triangle"],
  size = 24,
  color = "#8b5cf6",
  className,
}: MorphingCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [shapeIndex, setShapeIndex] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [shapes.length]);

  const getShapePath = (shape: string) => {
    switch (shape) {
      case "circle":
        return { borderRadius: "50%" };
      case "square":
        return { borderRadius: "4px" };
      case "triangle":
        return { 
          borderRadius: "0",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        };
      default:
        return { borderRadius: "50%" };
    }
  };

  return (
    <motion.div
      className={cn("fixed pointer-events-none z-50", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        ...getShapePath(shapes[shapeIndex]),
      }}
      animate={{
        left: position.x - size / 2,
        top: position.y - size / 2,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    />
  );
}
