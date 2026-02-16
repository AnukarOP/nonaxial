"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltedSectionProps {
  children: React.ReactNode;
  className?: string;
  angle?: number;
  direction?: "left" | "right";
  bgColor?: string;
}

interface EdgeParticle {
  id: number;
  progress: number;
  speed: number;
  size: number;
  offset: number;
}

export function TiltedSection({
  children,
  className,
  angle = 3,
  direction = "right",
  bgColor = "var(--card)",
}: TiltedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<EdgeParticle[]>([]);
  const [waveTime, setWaveTime] = useState(0);
  const [gradientHue, setGradientHue] = useState(0);
  
  const skewValue = direction === "right" ? -angle : angle;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animated tilt based on scroll
  const dynamicSkew = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [skewValue - 1, skewValue, skewValue + 1]
  );
  const springSkew = useSpring(dynamicSkew, { stiffness: 100, damping: 20 });

  // Initialize particles
  useEffect(() => {
    const newParticles: EdgeParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      progress: Math.random(),
      speed: 0.001 + Math.random() * 0.002,
      size: 2 + Math.random() * 3,
      offset: (Math.random() - 0.5) * 10,
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

  // Animation frame for wave motion and particles
  useAnimationFrame((time) => {
    setWaveTime(time / 500);
    setGradientHue((time / 50) % 360);
    
    setParticles(prev => prev.map(p => ({
      ...p,
      progress: (p.progress + p.speed) % 1,
    })));
  });

  // Generate wavy edge path with animation
  const generateWavyEdge = (isTop: boolean) => {
    const points = 50;
    const pathPoints: string[] = [];
    const amplitude = 8;
    const frequency = 3;
    
    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      const x = progress * dimensions.width;
      
      // Calculate base Y position with skew
      const skewOffset = isTop 
        ? (direction === "right" ? progress : 1 - progress) * Math.tan((angle * Math.PI) / 180) * dimensions.width * 0.1
        : dimensions.height - (direction === "right" ? 1 - progress : progress) * Math.tan((angle * Math.PI) / 180) * dimensions.width * 0.1;
      
      // Add wave motion
      const wave = Math.sin(progress * Math.PI * frequency + waveTime) * amplitude;
      const y = skewOffset + wave;
      
      pathPoints.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    
    return pathPoints.join(" ");
  };

  // Get particle position along edge
  const getParticlePosition = (progress: number, isTop: boolean) => {
    const x = progress * dimensions.width;
    const amplitude = 8;
    const frequency = 3;
    
    const skewOffset = isTop 
      ? (direction === "right" ? progress : 1 - progress) * Math.tan((angle * Math.PI) / 180) * dimensions.width * 0.1
      : dimensions.height - (direction === "right" ? 1 - progress : progress) * Math.tan((angle * Math.PI) / 180) * dimensions.width * 0.1;
    
    const wave = Math.sin(progress * Math.PI * frequency + waveTime) * amplitude;
    
    return { x, y: skewOffset + wave };
  };

  return (
    <div ref={containerRef} className={cn("relative py-20 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: bgColor,
          skewY: springSkew,
          transformOrigin: direction === "right" ? "top left" : "top right",
        }}
      />

      <motion.div
        className="absolute inset-0 -z-9 pointer-events-none"
        style={{
          background: `linear-gradient(
            ${direction === "right" ? 135 : 45}deg,
            hsla(${gradientHue}, 70%, 60%, 0.05) 0%,
            hsla(${(gradientHue + 60) % 360}, 70%, 60%, 0.08) 50%,
            hsla(${(gradientHue + 120) % 360}, 70%, 60%, 0.05) 100%
          )`,
          skewY: springSkew,
          transformOrigin: direction === "right" ? "top left" : "top right",
        }}
      />

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="tiltedGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="tiltedEdgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="30%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(236, 72, 153, 1)" />
            <stop offset="70%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={generateWavyEdge(true)}
          stroke="url(#tiltedEdgeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#tiltedGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d={generateWavyEdge(false)}
          stroke="url(#tiltedEdgeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#tiltedGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />

        {particles.map((particle) => {
          const isTop = particle.id % 2 === 0;
          const pos = getParticlePosition(particle.progress, isTop);
          return (
            <motion.circle
              key={particle.id}
              cx={pos.x}
              cy={pos.y + particle.offset}
              r={particle.size}
              fill={particle.id % 3 === 0 ? "rgba(139, 92, 246, 0.9)" : "rgba(236, 72, 153, 0.9)"}
              filter="url(#tiltedGlow)"
            />
          );
        })}
      </svg>

      <motion.div
        className="absolute -z-5 pointer-events-none"
        style={{
          top: direction === "right" ? 0 : "auto",
          bottom: direction === "left" ? 0 : "auto",
          left: 0,
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -z-5 pointer-events-none"
        style={{
          top: direction === "left" ? 0 : "auto",
          bottom: direction === "right" ? 0 : "auto",
          right: 0,
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div 
        className="relative z-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
