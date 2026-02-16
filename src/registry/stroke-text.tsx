"use client";

import React, { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StrokeTextProps {
  children: string;
  className?: string;
}

interface PathParticle {
  id: number;
  offset: number;
  size: number;
  delay: number;
}

export function StrokeText({ children, className }: StrokeTextProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const uniqueId = useId();
  
  // Path particles that follow the stroke
  const pathParticles: PathParticle[] = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      offset: i * 12.5,
      size: 2 + ((Math.sin(i * 5.7) + 1) / 2) * 2,
      delay: i * 0.1,
    }));
  }, []);

  // Trigger particles after stroke completes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={cn("relative inline-block", className)}>
      <svg 
        className="absolute inset-0 w-full h-full overflow-visible" 
        viewBox="0 0 100 30"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`strokeGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop
              offset="0%"
              animate={{
                stopColor: ["#8b5cf6", "#ec4899", "#06b6d4", "#8b5cf6"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.stop
              offset="50%"
              animate={{
                stopColor: ["#ec4899", "#06b6d4", "#8b5cf6", "#ec4899"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.stop
              offset="100%"
              animate={{
                stopColor: ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </linearGradient>

          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id={`intenseGlow-${uniqueId}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur1"/>
            <feGaussianBlur stdDeviation="6" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="transparent"
          stroke={`url(#strokeGradient-${uniqueId})`}
          strokeWidth="1.5"
          fontSize="20"
          fontWeight="bold"
          filter={`url(#intenseGlow-${uniqueId})`}
          initial={{ strokeDasharray: 300, strokeDashoffset: 300, opacity: 0.5 }}
          animate={{ strokeDashoffset: 0, opacity: 0.6 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          {children}
        </motion.text>

        <motion.text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="transparent"
          stroke={`url(#strokeGradient-${uniqueId})`}
          strokeWidth="0.8"
          fontSize="20"
          fontWeight="bold"
          filter={`url(#glow-${uniqueId})`}
          initial={{ strokeDasharray: 300, strokeDashoffset: 300 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {children}
        </motion.text>

        <motion.text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="transparent"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.3"
          fontSize="20"
          fontWeight="bold"
          initial={{ strokeDasharray: 300, strokeDashoffset: 300 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }}
        >
          {children}
        </motion.text>
      </svg>

      <AnimatePresence>
        {isAnimating && (
          <motion.span
            className="absolute w-3 h-3 rounded-full pointer-events-none z-20"
            style={{
              background: "radial-gradient(circle, white 0%, #8b5cf6 50%, transparent 70%)",
              boxShadow: "0 0 10px #8b5cf6, 0 0 20px #ec4899, 0 0 30px #8b5cf6",
              left: "0%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ left: "0%", opacity: 0, scale: 0 }}
            animate={{ 
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showParticles && pathParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              background: `hsl(${270 + particle.id * 15}, 80%, 70%)`,
              boxShadow: `0 0 4px hsl(${270 + particle.id * 15}, 80%, 70%)`,
              left: `${particle.offset}%`,
              top: "50%",
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{
              y: [0, -10 - Math.random() * 15, -25],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </AnimatePresence>
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          backgroundSize: "50% 100%",
        }}
        initial={{ backgroundPosition: "-100% 0%", opacity: 0 }}
        animate={{ 
          backgroundPosition: ["200% 0%", "-100% 0%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          delay: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
      <span className="opacity-0 select-none">{children}</span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <span
          className="text-xl font-bold"
          style={{
            background: "linear-gradient(135deg, #c4b5fd, #f9a8d4, #67e8f9)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: 0.15,
          }}
        >
          {children}
        </span>
      </motion.span>
      <motion.span
        className="absolute inset-0 blur-xl pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse, rgba(139, 92, 246, 0.3) 0%, transparent 60%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}
