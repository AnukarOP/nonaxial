"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoiseCardProps {
  children: React.ReactNode;
  className?: string;
  noiseOpacity?: number;
}

interface GrainParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  flickerSpeed: number;
}

export function NoiseCard({ children, className, noiseOpacity = 0.08 }: NoiseCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [noiseOffset, setNoiseOffset] = useState({ x: 0, y: 0 });
  const [frame, setFrame] = useState(0);
  
  // Spring for smooth interactions
  const scaleSpring = useSpring(1, { stiffness: 200, damping: 25 });
  const glowSpring = useSpring(0, { stiffness: 150, damping: 20 });

  // Grain shimmer particles
  const grainParticles = useMemo((): GrainParticle[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: 1 + ((Math.sin(i * 5.3) + 1) / 2) * 2,
      opacity: 0.2 + ((Math.sin(i * 7.1) + 1) / 2) * 0.6,
      flickerSpeed: 50 + ((Math.sin(i * 2.9) + 1) / 2) * 100,
    }));
  }, []);

  // Animate noise texture
  useEffect(() => {
    const interval = setInterval(() => {
      setNoiseOffset({
        x: Math.sin(Date.now() * 0.002) * 50,
        y: Math.cos(Date.now() * 0.0015) * 50,
      });
      setFrame(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scaleSpring.set(isHovered ? 1.02 : 1);
    glowSpring.set(isHovered ? 1 : 0);
  }, [isHovered, scaleSpring, glowSpring]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  // Generate multiple noise layers with different frequencies
  const noiseStyles = [
    { frequency: 0.9, octaves: 4, opacity: noiseOpacity },
    { frequency: 1.5, octaves: 2, opacity: noiseOpacity * 0.5 },
    { frequency: 0.5, octaves: 3, opacity: noiseOpacity * 0.7 },
  ];

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-zinc-900/80 border border-white/10 overflow-hidden cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ scale: scaleSpring }}
    >
      {noiseStyles.map((style, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter${i}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${style.frequency}' numOctaves='${style.octaves}' seed='${frame % 10}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter${i})'/%3E%3C/svg%3E")`,
            backgroundPosition: `${noiseOffset.x * (i + 1) * 0.5}px ${noiseOffset.y * (i + 1) * 0.5}px`,
            opacity: isHovered ? style.opacity * 1.5 : style.opacity,
            mixBlendMode: i === 0 ? "overlay" : "soft-light",
            transition: "opacity 0.3s ease",
          }}
        />
      ))}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {grainParticles.map((particle) => {
          const flicker = Math.sin(frame / particle.flickerSpeed * Math.PI) * 0.5 + 0.5;
          return (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: isHovered ? particle.opacity * flicker : particle.opacity * flicker * 0.3,
                transition: "opacity 0.1s ease",
              }}
            />
          );
        })}
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(255, 0, 0, 0.03) 0%,
              transparent 30%
            )
          `,
          transform: "translate(-2px, 0)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(0, 0, 255, 0.03) 0%,
              transparent 30%
            )
          `,
          transform: "translate(2px, 0)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 0.1 : 0.05,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              rgba(0, 0, 0, 0.3) 2px,
              rgba(0, 0, 0, 0.3) 4px
            )`,
            animation: "scanlines 8s linear infinite",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 50% 40% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 50%
            )
          `,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0, 0, 0, ${isHovered ? 0.4 : 0.6}) 100%
          )`,
          transition: "background 0.3s ease",
        }}
      />
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `linear-gradient(
            ${45 + mousePos.x * 90}deg,
            rgba(139, 92, 246, 0.5) 0%,
            rgba(236, 72, 153, 0.4) 50%,
            rgba(6, 182, 212, 0.5) 100%
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: isHovered ? 0.8 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="absolute -inset-4 rounded-[inherit] -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(139, 92, 246, 0.2) 0%,
            transparent 60%
          )`,
          filter: "blur(20px)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
      <style jsx>{`
        @keyframes scanlines {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
      `}</style>
    </motion.div>
  );
}
