"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function FadeReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.8,
}: FadeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 80, y: 0 },
    right: { x: -80, y: 0 },
  };

  // Generate dissolve particles
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: ((Math.sin(i * 5.3) + 1) / 2) * 6 + 2,
      delay: ((Math.sin(i * 7.1) + 1) / 2) * 0.3,
      duration: ((Math.sin(i * 2.9) + 1) / 2) * 0.4 + 0.3,
    }));
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.6, 0] } : {}}
        transition={{ duration: duration * 1.5, delay, ease: "easeOut" }}
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.2) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      {hasAnimated && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, rgba(167, 139, 250, 0.9) 0%, rgba(236, 72, 153, 0.6) 100%)`,
            boxShadow: "0 0 6px rgba(167, 139, 250, 0.8)",
          }}
          initial={{ 
            opacity: 0.9, 
            scale: 1,
            x: directions[direction].x * 0.5,
            y: directions[direction].y * 0.5,
          }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0,
          }}
          transition={{
            duration: particle.duration,
            delay: delay + particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        initial={{ opacity: 0.8 }}
        animate={isInView ? { opacity: 0 } : {}}
        transition={{ duration: duration * 0.8, delay: delay + 0.1 }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
      <motion.div
        className="relative"
        initial={{ 
          opacity: 0, 
          ...directions[direction],
          filter: "blur(8px) brightness(1.5)",
        }}
        animate={isInView ? { 
          opacity: 1, 
          x: 0, 
          y: 0,
          filter: "blur(0px) brightness(1)",
        } : {}}
        transition={{ 
          duration, 
          delay, 
          ease: [0.25, 0.46, 0.45, 0.94],
          filter: { duration: duration * 0.7, delay }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
