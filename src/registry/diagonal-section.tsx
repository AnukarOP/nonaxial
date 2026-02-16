"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiagonalSectionProps {
  children: React.ReactNode;
  className?: string;
  angle?: number;
  bgColor?: string;
}

interface Particle {
  id: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
}

export function DiagonalSection({ 
  children, 
  className, 
  angle = 3,
  bgColor = "var(--background)" 
}: DiagonalSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waveOffset, setWaveOffset] = useState(0);
  const [gradientPosition, setGradientPosition] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animated wave motion for the diagonal edge
  const waveAmplitude = useTransform(scrollYProgress, [0, 0.5, 1], [2, 5, 2]);
  const springWave = useSpring(waveAmplitude, { stiffness: 100, damping: 20 });

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Animation frame for particles, wave, and gradient
  useAnimationFrame((time) => {
    // Wave motion
    setWaveOffset(Math.sin(time / 1000) * 3);
    
    // Gradient sweep position
    setGradientPosition((time / 50) % 200);
    
    // Update particles
    setParticles(prev => prev.map(p => ({
      ...p,
      progress: (p.progress + p.speed) % 1,
    })));
  });

  // Calculate particle positions along diagonal edge
  const getParticlePosition = (progress: number, isTop: boolean) => {
    const angleRad = (angle * Math.PI) / 180;
    const x = progress * dimensions.width;
    const baseY = isTop 
      ? (angle / 100) * dimensions.height * (1 - progress)
      : dimensions.height - (angle / 100) * dimensions.height * progress;
    const wave = Math.sin(progress * Math.PI * 4 + waveOffset) * 5;
    return { x, y: baseY + wave };
  };

  // Generate wavy clip path
  const generateWavyClipPath = useMemo(() => {
    const points = 20;
    const topPoints: string[] = [];
    const bottomPoints: string[] = [];
    
    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      const wave = Math.sin(progress * Math.PI * 3 + waveOffset) * 0.5;
      const topY = angle * (1 - progress) + wave;
      const bottomY = 100 - angle * progress - wave;
      topPoints.push(`${progress * 100}% ${topY}%`);
      bottomPoints.unshift(`${progress * 100}% ${bottomY}%`);
    }
    
    return `polygon(${topPoints.join(", ")}, ${bottomPoints.join(", ")})`;
  }, [angle, waveOffset]);

  return (
    <div ref={containerRef} className={cn("relative py-20 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: bgColor,
          clipPath: generateWavyClipPath,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            90deg,
            transparent ${gradientPosition - 30}%,
            rgba(139, 92, 246, 0.1) ${gradientPosition - 15}%,
            rgba(236, 72, 153, 0.15) ${gradientPosition}%,
            rgba(139, 92, 246, 0.1) ${gradientPosition + 15}%,
            transparent ${gradientPosition + 30}%
          )`,
          clipPath: generateWavyClipPath,
        }}
      />
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="20%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(236, 72, 153, 1)" />
            <stop offset="80%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 0 ${(angle / 100) * dimensions.height} L ${dimensions.width} 0`}
          stroke="url(#edgeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#particleGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d={`M 0 ${dimensions.height} L ${dimensions.width} ${dimensions.height - (angle / 100) * dimensions.height}`}
          stroke="url(#edgeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#particleGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        {particles.map((particle) => {
          const pos = getParticlePosition(particle.progress, particle.id % 2 === 0);
          return (
            <motion.circle
              key={particle.id}
              cx={pos.x}
              cy={pos.y}
              r={particle.size}
              fill={particle.id % 2 === 0 ? "rgba(139, 92, 246, 0.9)" : "rgba(236, 72, 153, 0.9)"}
              filter="url(#particleGlow)"
              opacity={particle.opacity}
            />
          );
        })}
      </svg>
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="relative z-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
