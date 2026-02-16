"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticAreaProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
}

interface FieldLine {
  id: number;
  startAngle: number;
  length: number;
  opacity: number;
}

export function MagneticArea({ children, className, strength = 0.3 }: MagneticAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fieldLines, setFieldLines] = useState<FieldLine[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Force field ring scales based on mouse proximity
  const fieldIntensity = useMotionValue(0);
  const springIntensity = useSpring(fieldIntensity, { stiffness: 100, damping: 20 });
  const ring1Scale = useTransform(springIntensity, [0, 1], [0.8, 1.2]);
  const ring2Scale = useTransform(springIntensity, [0, 1], [0.6, 1.4]);
  const ring3Scale = useTransform(springIntensity, [0, 1], [0.4, 1.6]);
  const ringOpacity = useTransform(springIntensity, [0, 1], [0, 0.6]);

  // Generate field lines
  const generateFieldLines = useCallback(() => {
    const lines: FieldLine[] = [];
    const lineCount = 12;
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        id: i,
        startAngle: (i / lineCount) * 360,
        length: 60 + Math.random() * 40,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
    return lines;
  }, []);

  // Spawn attraction particles
  const spawnParticle = useCallback((centerX: number, centerY: number, rect: DOMRect) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 60;
    const particle: Particle = {
      id: particleIdRef.current++,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      angle,
      speed: 2 + Math.random() * 3,
      size: 2 + Math.random() * 4,
      opacity: 0.6 + Math.random() * 0.4,
    };
    return particle;
  }, []);

  useEffect(() => {
    setFieldLines(generateFieldLines());
  }, [generateFieldLines]);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        setParticles(prev => {
          const newParticles = prev
            .map(p => ({
              ...p,
              x: p.x * 0.92,
              y: p.y * 0.92,
              opacity: p.opacity * 0.96,
            }))
            .filter(p => Math.abs(p.x) > 5 || Math.abs(p.y) > 5);

          if (newParticles.length < 15 && Math.random() > 0.5) {
            newParticles.push(spawnParticle(centerX, centerY, rect));
          }
          return newParticles;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered, spawnParticle]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    mouseX.set(distanceX);
    mouseY.set(distanceY);

    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: normalizedX, y: normalizedY });

    // Calculate field intensity based on distance from center
    const distFromCenter = Math.sqrt(
      Math.pow((normalizedX - 0.5) * 2, 2) + Math.pow((normalizedY - 0.5) * 2, 2)
    );
    fieldIntensity.set(Math.max(0, 1 - distFromCenter));
  }, [strength, mouseX, mouseY, fieldIntensity]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    fieldIntensity.set(0.5);
  }, [fieldIntensity]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    fieldIntensity.set(0);
    setParticles([]);
  }, [mouseX, mouseY, fieldIntensity]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full border border-cyan-400/30"
          style={{
            width: "120%",
            height: "120%",
            scale: ring1Scale,
            opacity: ringOpacity,
          }}
        />
        <motion.div
          className="absolute rounded-full border border-purple-400/20"
          style={{
            width: "140%",
            height: "140%",
            scale: ring2Scale,
            opacity: ringOpacity,
          }}
        />
        <motion.div
          className="absolute rounded-full border border-blue-400/10"
          style={{
            width: "160%",
            height: "160%",
            scale: ring3Scale,
            opacity: ringOpacity,
          }}
        />
      </div>
      <AnimatePresence>
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {fieldLines.map((line) => (
              <motion.div
                key={line.id}
                className="absolute h-[2px] origin-left"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity: line.opacity * 0.5,
                  scaleX: 1,
                  rotate: line.startAngle + (mousePos.x - 0.5) * 20,
                }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.3, delay: line.id * 0.02 }}
                style={{
                  width: line.length,
                  background: `linear-gradient(90deg, rgba(99, 179, 237, 0.6), transparent)`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-cyan-400"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: particle.opacity,
                scale: 1,
                x: particle.x,
                y: particle.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.1 }}
              style={{
                width: particle.size,
                height: particle.size,
                boxShadow: `0 0 ${particle.size * 2}px rgba(34, 211, 238, 0.8)`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        style={{ x: springX, y: springY }}
        className="relative z-10"
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(34, 211, 238, 0.15), transparent 50%)`,
          opacity: springIntensity,
        }}
      />
    </div>
  );
}
