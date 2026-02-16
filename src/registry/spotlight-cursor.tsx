"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCursorProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

export function SpotlightCursor({ children, className, size = 250 }: SpotlightCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [dustParticles, setDustParticles] = useState<DustParticle[]>([]);
  const particleIdRef = useRef(0);
  const timeRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const flickerIntensity = useMotionValue(1);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Initialize dust particles
  useEffect(() => {
    const particles: DustParticle[] = Array.from({ length: 40 }, (_, i) => ({
      id: particleIdRef.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
    }));
    setDustParticles(particles);
  }, []);

  // Animate dust particles and spotlight flicker
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    
    // Realistic flicker effect
    const flicker = 0.95 + Math.random() * 0.1 + Math.sin(timeRef.current * 10) * 0.02;
    flickerIntensity.set(flicker);
    
    // Update dust particles
    setDustParticles(prev => prev.map(p => ({
      ...p,
      x: (p.x + Math.cos(p.angle) * p.speed * 0.1 + 100) % 100,
      y: (p.y + Math.sin(p.angle) * p.speed * 0.1 + Math.sin(timeRef.current + p.id) * 0.05 + 100) % 100,
      opacity: 0.2 + Math.sin(timeRef.current * 2 + p.id) * 0.15,
    })));
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: isHovering ? `radial-gradient(
            ellipse ${size}px ${size * 1.5}px at var(--x) var(--y),
            transparent 0%,
            transparent 20%,
            rgba(0, 0, 0, 0.3) 40%,
            rgba(0, 0, 0, 0.6) 60%,
            rgba(0, 0, 0, 0.85) 100%
          )` : "none",
          // @ts-ignore
          "--x": springX,
          "--y": springY,
        }}
      />

      <motion.div
        className="pointer-events-none absolute z-25"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size * 1.5,
          opacity: isHovering ? flickerIntensity : 0,
        }}
      >
        <svg viewBox="0 0 100 150" className="w-full h-full" style={{ filter: "blur(1px)" }}>
          <defs>
            <radialGradient id="spotlightGradient" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="rgba(255, 250, 220, 0.9)" />
              <stop offset="30%" stopColor="rgba(255, 245, 200, 0.5)" />
              <stop offset="60%" stopColor="rgba(255, 240, 180, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="spotlightBlur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <ellipse
            cx="50"
            cy="75"
            rx="45"
            ry="70"
            fill="url(#spotlightGradient)"
            filter="url(#spotlightBlur)"
          />
        </svg>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute z-30 rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 20,
          height: 20,
          background: "radial-gradient(circle, rgba(255, 255, 240, 1) 0%, rgba(255, 250, 200, 0.8) 50%, transparent 100%)",
          boxShadow: "0 0 30px 15px rgba(255, 250, 200, 0.5), 0 0 60px 30px rgba(255, 245, 180, 0.3)",
          opacity: isHovering ? flickerIntensity : 0,
        }}
      />

      {isHovering && (
        <motion.div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-15"
          style={{
            height: "30%",
            background: `radial-gradient(
              ellipse 300px 100px at var(--rx) 100%,
              rgba(255, 250, 220, 0.15) 0%,
              transparent 70%
            )`,
            // @ts-ignore
            "--rx": springX,
          }}
        />
      )}

      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-22"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-40%",
            width: size * 0.8,
            height: size * 1.2,
          }}
        >
          {dustParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white/80"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity * flickerIntensity.get(),
                boxShadow: `0 0 ${particle.size * 2}px rgba(255, 250, 220, 0.5)`,
              }}
            />
          ))}
        </motion.div>
      )}

      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-21"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-20%",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: 3,
                height: size * 0.8,
                left: "50%",
                top: 0,
                background: `linear-gradient(to bottom, rgba(255, 250, 220, ${0.1 + Math.random() * 0.1}), transparent)`,
                transform: `translateX(-50%) rotate(${(i - 3.5) * 5}deg)`,
                transformOrigin: "top center",
                filter: "blur(2px)",
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        className="pointer-events-none absolute z-19 rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: size * 0.4,
          height: size * 0.4,
          border: "1px solid rgba(255, 250, 220, 0.2)",
          boxShadow: "0 0 20px rgba(255, 250, 220, 0.2), inset 0 0 20px rgba(255, 250, 220, 0.1)",
          opacity: isHovering ? 0.6 : 0,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
