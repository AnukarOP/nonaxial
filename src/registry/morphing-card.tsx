"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MorphingCardProps {
  children: React.ReactNode;
  className?: string;
}

interface NoisePoint {
  id: number;
  baseX: number;
  baseY: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

export function MorphingCard({ children, className }: MorphingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [time, setTime] = useState(0);
  
  // Spring for organic movement
  const morphProgress = useSpring(0, { stiffness: 50, damping: 15, mass: 1.5 });
  const scaleSpring = useSpring(1, { stiffness: 150, damping: 20 });

  // Generate noise control points for blob deformation
  const noisePoints = useMemo((): NoisePoint[] => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      baseX: Math.cos((i / 8) * Math.PI * 2),
      baseY: Math.sin((i / 8) * Math.PI * 2),
      amplitude: 15 + ((Math.sin(i * 5.3) + 1) / 2) * 20,
      frequency: 0.5 + ((Math.sin(i * 7.1) + 1) / 2) * 1,
      phase: ((Math.sin(i * 2.9) + 1) / 2) * Math.PI * 2,
    }));
  }, []);

  // Animate time for continuous morphing
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setTime(prev => prev + 0.03);
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    morphProgress.set(isHovered ? 1 : 0);
    scaleSpring.set(isHovered ? 1.02 : 1);
  }, [isHovered, morphProgress, scaleSpring]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  // Generate organic blob path based on noise
  const generateBlobPath = (progress: number, noiseTime: number) => {
    const points: string[] = [];
    const centerX = 50;
    const centerY = 50;
    const baseRadius = 45;
    
    for (let i = 0; i < 360; i += 10) {
      const angle = (i * Math.PI) / 180;
      
      // Combine multiple noise frequencies for organic shape
      let noiseValue = 0;
      noisePoints.forEach((np) => {
        const pointAngle = (np.id / noisePoints.length) * Math.PI * 2;
        const angleDiff = Math.abs(angle - pointAngle);
        const influence = Math.cos(angleDiff) * 0.5 + 0.5;
        noiseValue += Math.sin(noiseTime * np.frequency + np.phase) * np.amplitude * influence * progress;
      });
      
      // Add mouse influence
      const mouseAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5);
      const mouseInfluence = Math.cos(angle - mouseAngle) * 10 * progress;
      
      const radius = baseRadius + noiseValue + mouseInfluence;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      points.push(`${x},${y}`);
    }
    
    return `M ${points[0]} ${points.slice(1).map(p => `L ${p}`).join(" ")} Z`;
  };

  const blobPath = generateBlobPath(isHovered ? 1 : 0, time);

  // Gradient colors based on mouse position
  const gradientAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5) * (180 / Math.PI);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ scale: scaleSpring }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="blobGradient"
            gradientTransform={`rotate(${gradientAngle + 45})`}
          >
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="33%" stopColor="#ec4899" />
            <stop offset="66%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={blobPath}
          fill="none"
          stroke="url(#blobGradient)"
          strokeWidth="4"
          filter="url(#glow)"
          style={{
            opacity: isHovered ? 0.6 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <motion.path
          d={blobPath}
          fill="none"
          stroke="url(#blobGradient)"
          strokeWidth="2"
          style={{
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.3s ease",
          }}
        />
      </svg>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={blobPath}
          fill="rgba(24, 24, 27, 0.9)"
        />
      </svg>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `path('${blobPath}')`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: isHovered ? 0.1 : 0.05,
          transition: "opacity 0.3s ease",
          mixBlendMode: "overlay",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `path('${blobPath}')`,
          background: `radial-gradient(
            ellipse 60% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(139, 92, 246, 0.3) 0%,
            rgba(236, 72, 153, 0.15) 40%,
            transparent 70%
          )`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {[...Array(5)].map((_, i) => {
        const orbX = 20 + (i % 3) * 30;
        const orbY = 30 + Math.floor(i / 3) * 40;
        const orbSize = 30 + (i % 2) * 20;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${orbX}%`,
              top: `${orbY}%`,
              width: orbSize,
              height: orbSize,
              background: `radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={isHovered ? {
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            } : {
              scale: 1,
              opacity: 0,
            }}
            transition={{
              duration: 2 + i * 0.3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      <motion.div
        className="relative z-10 p-6"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * 5}px, ${(mousePos.y - 0.5) * 5}px)`,
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          clipPath: `path('${blobPath}')`,
          opacity: isHovered ? 0.5 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "-100%",
            left: "-100%",
            width: "300%",
            height: "300%",
            background: `linear-gradient(
              ${gradientAngle + 90}deg,
              transparent 40%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 60%
            )`,
          }}
          animate={isHovered ? {
            x: ["0%", "100%"],
            y: ["0%", "100%"],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
