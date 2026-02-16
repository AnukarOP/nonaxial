"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AsymmetricGridProps {
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
  onPositionUpdate,
}: { 
  child: React.ReactNode; 
  index: number;
  onPositionUpdate: (index: number, pos: GridItemPosition) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 200, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  // Track position for connection lines
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

  // Intersection observer for stagger reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: index * 0.15, // Stagger reveal
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: "1000px",
      }}
      className="relative h-full"
    >
      <motion.div
        className="absolute -inset-4 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, 
            rgba(139, 92, 246, 0.2), 
            transparent 70%
          )`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.3,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-20"
        style={{
          background: `radial-gradient(
            circle at ${50 + springX.get() * 100}% ${50 + springY.get() * 100}%,
            rgba(255, 255, 255, 0.15),
            transparent 50%
          )`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: "1px solid transparent",
        }}
        animate={{
          borderColor: isHovered 
            ? "rgba(139, 92, 246, 0.5)" 
            : "rgba(139, 92, 246, 0.1)",
          boxShadow: isHovered
            ? "0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.05)"
            : "0 5px 20px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="relative z-10 h-full"
        animate={{
          y: isHovered ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {child}
      </motion.div>
      {isHovered && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "rgba(139, 92, 246, 0.8)" : "rgba(236, 72, 153, 0.8)",
                top: i < 2 ? "-4px" : "auto",
                bottom: i >= 2 ? "-4px" : "auto",
                left: i % 2 === 0 ? "-4px" : "auto",
                right: i % 2 === 1 ? "-4px" : "auto",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0.7],
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

function ConnectionLines({ positions }: { positions: Map<number, GridItemPosition> }) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; key: string }[]>([]);
  
  useEffect(() => {
    const posArray = Array.from(positions.entries());
    const newLines: typeof lines = [];
    
    // Connect adjacent items
    const adjacentPairs = [[0, 1], [0, 2], [1, 2], [3, 4]];
    adjacentPairs.forEach(([i, j]) => {
      const pos1 = positions.get(i);
      const pos2 = positions.get(j);
      if (pos1 && pos2) {
        newLines.push({
          x1: pos1.x,
          y1: pos1.y,
          x2: pos2.x,
          y2: pos2.y,
          key: `${i}-${j}`,
        });
      }
    });
    
    setLines(newLines);
  }, [positions]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="asymLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
          <stop offset="50%" stopColor="rgba(236, 72, 153, 0.4)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
        </linearGradient>
        <filter id="asymGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
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
          stroke="url(#asymLineGradient)"
          strokeWidth="1"
          strokeDasharray="4 4"
          filter="url(#asymGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ))}
      {lines.map((line) => (
        <motion.circle
          key={`dot-${line.key}`}
          r="3"
          fill="rgba(236, 72, 153, 0.8)"
          filter="url(#asymGlow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            cx: [line.x1, line.x2],
            cy: [line.y1, line.y2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

export function AsymmetricGrid({ children, className }: AsymmetricGridProps) {
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
    <div 
      ref={containerRef} 
      className={cn("relative", className)}
      style={{ perspective: "1000px" }}
    >
      <ConnectionLines positions={positions} />
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at 30% 30%, rgba(139, 92, 246, 0.08), transparent 50%)",
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at 70% 70%, rgba(236, 72, 153, 0.08), transparent 50%)",
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      <div
        className={cn(
          "grid gap-4 relative z-10",
          "grid-cols-3 grid-rows-3",
          "[&>*:nth-child(1)]:col-span-2 [&>*:nth-child(1)]:row-span-2",
          "[&>*:nth-child(2)]:col-start-3",
          "[&>*:nth-child(3)]:col-start-3 [&>*:nth-child(3)]:row-start-2",
          "[&>*:nth-child(4)]:col-span-1",
          "[&>*:nth-child(5)]:col-span-2"
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
