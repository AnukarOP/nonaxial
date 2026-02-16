"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlobCursorProps {
  className?: string;
  size?: number;
  children?: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  hue: number;
}

export function BlobCursor({
  className,
  size = 60,
  children,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const timeRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const hue = useMotionValue(0);

  // Physics-based lag with different spring configs
  const primarySpring = { damping: 15, stiffness: 150, mass: 0.5 };
  const secondarySpring = { damping: 20, stiffness: 100, mass: 0.8 };
  const tertiarySpring = { damping: 25, stiffness: 80, mass: 1.2 };

  const primaryX = useSpring(cursorX, primarySpring);
  const primaryY = useSpring(cursorY, primarySpring);
  const secondaryX = useSpring(cursorX, secondarySpring);
  const secondaryY = useSpring(cursorY, secondarySpring);
  const tertiaryX = useSpring(cursorX, tertiarySpring);
  const tertiaryY = useSpring(cursorY, tertiarySpring);

  // Noise-based morphing animation
  const [morphPath, setMorphPath] = useState("");
  
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    const time = timeRef.current;
    
    // Generate organic blob shape using noise
    const points = 12;
    const path: string[] = [];
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise1 = Math.sin(time * 2 + angle * 3) * 0.15;
      const noise2 = Math.cos(time * 1.5 + angle * 2) * 0.1;
      const noise3 = Math.sin(time * 3 + angle * 4) * 0.08;
      const radius = 1 + noise1 + noise2 + noise3;
      
      const x = 50 + Math.cos(angle) * 40 * radius;
      const y = 50 + Math.sin(angle) * 40 * radius;
      
      if (i === 0) {
        path.push(`M ${x} ${y}`);
      } else {
        const prevAngle = ((i - 1) / points) * Math.PI * 2;
        const cpRadius = radius * 1.1;
        const cpX = 50 + Math.cos(prevAngle + Math.PI / points) * 40 * cpRadius;
        const cpY = 50 + Math.sin(prevAngle + Math.PI / points) * 40 * cpRadius;
        path.push(`Q ${cpX} ${cpY} ${x} ${y}`);
      }
    }
    path.push("Z");
    setMorphPath(path.join(" "));
    
    // Animate hue
    hue.set((time * 30) % 360);
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cursorX.set(x - size / 2);
    cursorY.set(y - size / 2);
    setIsVisible(true);
    
    // Spawn particles on movement
    const dx = x - lastPosRef.current.x;
    const dy = y - lastPosRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x,
        y,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.5 + 0.5,
        hue: hue.get(),
      };
      setParticles(prev => [...prev.slice(-20), newParticle]);
      lastPosRef.current = { x, y };
    }
  }, [cursorX, cursorY, size, hue]);

  const handleMouseLeave = () => setIsVisible(false);

  // Clean up old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.slice(-15));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const currentHue = useTransform(hue, (h) => h);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsVisible(true)}
    >
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none absolute rounded-full"
          initial={{ opacity: particle.opacity, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: `hsla(${particle.hue}, 80%, 60%, 0.6)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(2px)",
          }}
        />
      ))}
      <motion.div
        className="pointer-events-none absolute z-40"
        style={{
          x: tertiaryX,
          y: tertiaryY,
          width: size * 1.3,
          height: size * 1.3,
          opacity: isVisible ? 0.3 : 0,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d={morphPath}
            style={{
              fill: `hsla(${currentHue.get() + 60}, 70%, 50%, 0.4)`,
            }}
            filter="url(#glow)"
          />
        </svg>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-45"
        style={{
          x: secondaryX,
          y: secondaryY,
          width: size * 1.1,
          height: size * 1.1,
          opacity: isVisible ? 0.5 : 0,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d={morphPath}
            style={{
              fill: `hsla(${currentHue.get() + 30}, 75%, 55%, 0.5)`,
            }}
            filter="url(#glow)"
          />
        </svg>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-50"
        style={{
          x: primaryX,
          y: primaryY,
          width: size,
          height: size,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <motion.stop
                offset="0%"
                style={{ stopColor: `hsla(${currentHue.get()}, 80%, 60%, 0.9)` }}
              />
              <motion.stop
                offset="50%"
                style={{ stopColor: `hsla(${currentHue.get() + 40}, 85%, 55%, 0.8)` }}
              />
              <motion.stop
                offset="100%"
                style={{ stopColor: `hsla(${currentHue.get() + 80}, 75%, 65%, 0.9)` }}
              />
            </linearGradient>
          </defs>
          <motion.path
            d={morphPath}
            fill="url(#blobGradient)"
            filter="url(#glow)"
          />
        </svg>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-50 rounded-full"
        style={{
          x: primaryX,
          y: primaryY,
          width: size * 0.3,
          height: size * 0.3,
          marginLeft: size * 0.35,
          marginTop: size * 0.35,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children || (
          <div className="flex items-center justify-center w-full h-full text-white/50 text-sm">
            Move your cursor here
          </div>
        )}
      </div>
    </div>
  );
}
