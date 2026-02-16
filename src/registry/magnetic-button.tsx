"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  strength?: number;
  onClick?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  life: number;
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  strength = 0.5,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for magnetic pull
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Glow intensity based on proximity
  const glowIntensity = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return Math.min(1, distance / 30);
    }
  );

  // Rotation based on mouse position
  const rotateX = useTransform(y, [-20, 20], [10, -10]);
  const rotateY = useTransform(x, [-20, 20], [-10, 10]);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);

    // Spawn particles along the magnetic trail
    if (Math.random() > 0.6) {
      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: clientX - left,
        y: clientY - top,
        angle: Math.atan2(deltaY, deltaX) + Math.PI + (Math.random() - 0.5) * 0.5,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 4,
        life: 1,
      };
      setParticles(prev => [...prev.slice(-15), newParticle]);
    }
  }, [strength, mouseX, mouseY]);

  const reset = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            life: p.life - 0.03,
            size: p.size * 0.97,
          }))
          .filter(p => p.life > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles.length]);

  const sizeClasses = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-7 py-3.5 text-sm",
    lg: "px-9 py-4.5 text-base",
  };

  const variantStyles = {
    primary: {
      bg: "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
      glow: "rgba(139, 92, 246, 0.8)",
      particle: "#a78bfa",
    },
    secondary: {
      bg: "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700",
      glow: "rgba(100, 116, 139, 0.6)",
      particle: "#94a3b8",
    },
    outline: {
      bg: "bg-transparent border-2 border-violet-500",
      glow: "rgba(139, 92, 246, 0.5)",
      particle: "#8b5cf6",
    },
  };

  const currentStyle = variantStyles[variant];

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      onClick={onClick}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={cn(
        "relative rounded-full font-semibold text-white overflow-visible",
        sizeClasses[size],
        currentStyle.bg,
        className
      )}
    >
      <motion.div
        className="absolute -inset-3 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentStyle.glow} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-6 rounded-full border pointer-events-none"
        style={{ borderColor: currentStyle.glow }}
        animate={{
          opacity: isHovered ? [0, 0.5, 0] : 0,
          scale: isHovered ? [0.8, 1.2, 0.8] : 0.8,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-10 rounded-full border pointer-events-none"
        style={{ borderColor: currentStyle.glow }}
        animate={{
          opacity: isHovered ? [0, 0.3, 0] : 0,
          scale: isHovered ? [0.9, 1.3, 0.9] : 0.9,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: currentStyle.particle,
              boxShadow: `0 0 ${particle.size * 2}px ${currentStyle.particle}`,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: particle.life, scale: particle.life }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        style={{ transform: "translateZ(10px)" }}
      >
        {children}
      </motion.span>
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          }}
          animate={{
            x: isHovered ? ["-100%", "200%"] : "-100%",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.button>
  );
}
