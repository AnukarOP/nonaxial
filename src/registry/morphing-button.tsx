"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MorphingButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MorphingButton({ children, className, onClick }: MorphingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [blobPath, setBlobPath] = useState("");
  const [noiseOffset, setNoiseOffset] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  // Generate organic blob shape with noise deformation
  const generateBlobPath = (offset: number) => {
    const points = 12;
    const baseRadius = 45;
    const variation = isHovered ? 8 : 3;
    
    let path = "";
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise = Math.sin(angle * 3 + offset) * variation + 
                   Math.cos(angle * 2 + offset * 1.5) * (variation * 0.5);
      const radius = baseRadius + noise;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      
      if (i === 0) {
        path += `M ${x} ${y} `;
      } else {
        // Bezier curve for smooth organic shape
        const prevAngle = ((i - 1) / points) * Math.PI * 2;
        const prevNoise = Math.sin(prevAngle * 3 + offset) * variation + 
                         Math.cos(prevAngle * 2 + offset * 1.5) * (variation * 0.5);
        const prevRadius = baseRadius + prevNoise;
        const prevX = 50 + prevRadius * Math.cos(prevAngle);
        const prevY = 50 + prevRadius * Math.sin(prevAngle);
        
        const cp1x = prevX + (x - prevX) * 0.5 + Math.sin(offset + i) * 2;
        const cp1y = prevY + (y - prevY) * 0.3;
        const cp2x = prevX + (x - prevX) * 0.5 - Math.cos(offset + i) * 2;
        const cp2y = prevY + (y - prevY) * 0.7;
        
        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
      }
    }
    path += "Z";
    return path;
  };

  // Animate blob morphing
  useEffect(() => {
    const animate = () => {
      setNoiseOffset((prev) => prev + (isHovered ? 0.08 : 0.02));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  // Update blob path when noise changes
  useEffect(() => {
    setBlobPath(generateBlobPath(noiseOffset));
  }, [noiseOffset, isHovered]);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "relative px-10 py-5 font-bold text-white",
        className
      )}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <filter id="blobNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isHovered ? "0.015" : "0.01"}
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isHovered ? "5" : "2"}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="blobGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={blobPath}
          fill="url(#blobGradient)"
          opacity={0.3}
          filter="url(#blobGlow)"
          animate={{
            scale: isHovered ? 1.15 : 1.05,
          }}
          style={{ transformOrigin: "center center" }}
        />
        <motion.path
          d={blobPath}
          fill="url(#blobGradient)"
          filter={isHovered ? "url(#blobNoise)" : undefined}
          animate={{
            scale: isHovered ? 1 : 0.98,
          }}
          style={{ transformOrigin: "center center" }}
        />
        <motion.path
          d={blobPath}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
          animate={{
            scale: isHovered ? 0.95 : 0.93,
            opacity: isHovered ? 1 : 0.5,
          }}
          style={{ transformOrigin: "center center" }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${50 + Math.sin(noiseOffset) * 20}% ${50 + Math.cos(noiseOffset) * 20}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundImage: `radial-gradient(circle at ${30 + Math.sin(noiseOffset * 2) * 20}% ${40 + Math.cos(noiseOffset * 2) * 20}%, rgba(255,255,255,0.5) 0%, transparent 30%),
                               radial-gradient(circle at ${70 + Math.sin(noiseOffset * 1.5) * 20}% ${60 + Math.cos(noiseOffset * 1.5) * 20}%, rgba(255,255,255,0.3) 0%, transparent 20%)`,
            }}
          />
        )}
      </AnimatePresence>
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          scale: isHovered ? 1.05 : 1,
          x: Math.sin(noiseOffset * 0.5) * (isHovered ? 2 : 0.5),
          y: Math.cos(noiseOffset * 0.5) * (isHovered ? 2 : 0.5),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>
      {isHovered && Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/60 pointer-events-none"
          style={{
            left: `${50 + Math.cos((noiseOffset + i) * 0.5) * 45}%`,
            top: `${50 + Math.sin((noiseOffset + i) * 0.5) * 45}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.button>
  );
}
