"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
}

export function GlassCard({
  children,
  className,
  blur = "md",
  opacity = 0.1,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [shimmerPos, setShimmerPos] = useState(-100);
  const [noiseOffset, setNoiseOffset] = useState({ x: 0, y: 0 });
  
  const mouseXSpring = useSpring(0.5, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(0.5, { stiffness: 100, damping: 20 });

  const blurValues = {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  };

  // Generate floating particles
  const particles = useMemo((): FloatingParticle[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: 2 + ((Math.sin(i * 5.3) + 1) / 2) * 4,
      speed: 2 + ((Math.sin(i * 7.1) + 1) / 2) * 3,
      delay: ((Math.sin(i * 2.9) + 1) / 2) * 5,
      opacity: 0.2 + ((Math.sin(i * 4.3) + 1) / 2) * 0.4,
    }));
  }, []);

  // Animated noise refraction
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setNoiseOffset({
        x: Math.sin(Date.now() * 0.001) * 10,
        y: Math.cos(Date.now() * 0.0012) * 10,
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Shimmer sweep animation
  useEffect(() => {
    if (!isHovered) {
      setShimmerPos(-100);
      return;
    }
    const interval = setInterval(() => {
      setShimmerPos(prev => {
        if (prev > 200) return -100;
        return prev + 3;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
    mouseXSpring.set(x);
    mouseYSpring.set(y);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${opacity})`,
          backdropFilter: `blur(${blurValues[blur]})`,
          WebkitBackdropFilter: `blur(${blurValues[blur]})`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundPosition: `${noiseOffset.x}px ${noiseOffset.y}px`,
          opacity: isHovered ? 0.08 : 0.04,
          mixBlendMode: "overlay",
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              opacity: isHovered ? particle.opacity : 0,
            }}
            animate={isHovered ? {
              y: [0, -100, 0],
              x: [0, Math.sin(particle.id) * 20, 0],
              opacity: [0, particle.opacity, 0],
            } : {
              opacity: 0,
            }}
            transition={{
              duration: particle.speed,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 150% 100% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.05) 30%,
              transparent 60%
            )
          `,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerPos}%`,
            width: "50%",
            height: "100%",
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 40%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0.1) 60%,
              transparent 100%
            )`,
            transform: "skewX(-20deg)",
          }}
        />
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePos.x * 90}deg,
              rgba(139, 92, 246, 0.2) 0%,
              rgba(236, 72, 153, 0.15) 25%,
              rgba(6, 182, 212, 0.2) 50%,
              rgba(34, 197, 94, 0.15) 75%,
              rgba(139, 92, 246, 0.2) 100%
            )
          `,
          opacity: isHovered ? 0.5 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          border: `1px solid rgba(255, 255, 255, ${isHovered ? 0.4 : 0.2})`,
          boxShadow: isHovered
            ? `
              inset 0 1px 1px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(139, 92, 246, 0.2),
              0 0 40px rgba(139, 92, 246, 0.1)
            `
            : "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          transition: "all 0.4s ease",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            rgba(255, 255, 255, ${isHovered ? 0.1 : 0.05}),
            transparent
          )`,
          transition: "background 0.4s ease",
        }}
      />
    </motion.div>
  );
}
