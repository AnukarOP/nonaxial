"use client";

import React, { useState, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDTextProps {
  children: string;
  className?: string;
  depth?: number;
  color?: string;
}

export function ThreeDText({ 
  children, 
  className, 
  depth = 6,
  color = "#8b5cf6"
}: ThreeDTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();

  // Generate clean 3D extrusion shadows
  const textShadow = useMemo(() => {
    const shadows: string[] = [];
    
    // Create layered 3D extrusion
    for (let i = 1; i <= depth; i++) {
      const darkness = 0.15 + (i / depth) * 0.4;
      shadows.push(`${i}px ${i}px 0 rgba(0, 0, 0, ${darkness})`);
    }
    
    // Add soft drop shadow
    shadows.push(`${depth + 2}px ${depth + 2}px ${depth}px rgba(0, 0, 0, 0.25)`);
    
    return shadows.join(", ");
  }, [depth]);

  return (
    <motion.span
      className={cn("relative inline-flex font-bold cursor-pointer select-none", className)}
      onMouseEnter={() => {
        setIsHovered(true);
        controls.start({ 
          rotateX: -8, 
          rotateY: 8,
          scale: 1.05,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        controls.start({ 
          rotateX: 0, 
          rotateY: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 200, damping: 25 }
        });
      }}
      animate={controls}
      style={{
        transformStyle: "preserve-3d",
        perspective: "600px",
        color: color,
        textShadow: textShadow,
      }}
    >
      <span
        style={{
          backgroundImage: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: textShadow,
        }}
      >
        {children}
      </span>
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: isHovered ? 0.8 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
