"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrokenGridProps {
  children: React.ReactNode;
  className?: string;
}

interface GridItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

function GridItem({ 
  child, 
  index, 
  onPositionUpdate 
}: { 
  child: React.ReactNode; 
  index: number;
  onPositionUpdate: (index: number, pos: GridItemPosition) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const rotateX = useTransform(springY, [-50, 50], [5, -5]);
  const rotateY = useTransform(springX, [-50, 50], [-5, 5]);
  const lift = useSpring(0, springConfig);

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        onPositionUpdate(index, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [index, onPositionUpdate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    lift.set(20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    lift.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: index * 0.1 
      }}
      style={{
        rotateX,
        rotateY,
        y: lift,
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-0 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(139, 92, 246, 0.4), transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="relative z-10 h-full"
        style={{
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)"
            : "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
        }}
        animate={{
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)"
            : "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      >
        {child}
      </motion.div>
    </motion.div>
  );
}

function ConnectionLines({ positions }: { positions: Map<number, GridItemPosition> }) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; key: string }[]>([]);
  
  useEffect(() => {
    const posArray = Array.from(positions.entries());
    const newLines: typeof lines = [];
    
    for (let i = 0; i < posArray.length; i++) {
      for (let j = i + 1; j < posArray.length; j++) {
        const [, pos1] = posArray[i];
        const [, pos2] = posArray[j];
        const distance = Math.hypot(pos2.x - pos1.x, pos2.y - pos1.y);
        
        if (distance < 400) {
          newLines.push({
            x1: pos1.x,
            y1: pos1.y,
            x2: pos2.x,
            y2: pos2.y,
            key: `${i}-${j}`,
          });
        }
      }
    }
    setLines(newLines);
  }, [positions]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
          <stop offset="50%" stopColor="rgba(236, 72, 153, 0.5)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map((line) => (
        <motion.line
          key={line.key}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#lineGradient)"
          strokeWidth="1"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
      {lines.map((line) => (
        <motion.circle
          key={`glow-${line.key}`}
          cx={(line.x1 + line.x2) / 2}
          cy={(line.y1 + line.y2) / 2}
          r="4"
          fill="rgba(236, 72, 153, 0.8)"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

export function BrokenGrid({ children, className }: BrokenGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<number, GridItemPosition>>(new Map());
  
  const handlePositionUpdate = useCallback((index: number, pos: GridItemPosition) => {
    setPositions(prev => {
      const next = new Map(prev);
      next.set(index, pos);
      return next;
    });
  }, []);

  const childArray = React.Children.toArray(children);

  return (
    <div ref={containerRef} className={cn("relative", className)} style={{ perspective: "1000px" }}>
      <ConnectionLines positions={positions} />
      <div
        className={cn(
          "grid gap-4 relative z-10",
          "[grid-template-columns:repeat(12,1fr)]",
          "[&>*:nth-child(1)]:col-span-7 [&>*:nth-child(1)]:row-span-2",
          "[&>*:nth-child(2)]:col-span-5 [&>*:nth-child(2)]:col-start-8",
          "[&>*:nth-child(3)]:col-span-5 [&>*:nth-child(3)]:col-start-8",
          "[&>*:nth-child(4)]:col-span-4",
          "[&>*:nth-child(5)]:col-span-4",
          "[&>*:nth-child(6)]:col-span-4"
        )}
      >
        {childArray.map((child, index) => (
          <GridItem 
            key={index} 
            child={child} 
            index={index} 
            onPositionUpdate={handlePositionUpdate}
          />
        ))}
      </div>
    </div>
  );
}
