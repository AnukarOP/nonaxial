"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useRef, useMemo, Children, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.12,
  duration = 0.7,
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [itemRefs, setItemRefs] = useState<(HTMLDivElement | null)[]>([]);
  const childArray = Children.toArray(children);

  // Spring physics for bounce overshoot
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
      rotateX: -15,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 1,
        velocity: 2,
      },
    },
  };

  // Calculate connection line positions
  const connectionLines = useMemo(() => {
    if (itemRefs.length < 2 || !containerRef.current) return [];
    
    const lines: { x1: number; y1: number; x2: number; y2: number; index: number }[] = [];
    
    for (let i = 0; i < itemRefs.length - 1; i++) {
      const current = itemRefs[i];
      const next = itemRefs[i + 1];
      
      if (current && next && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        
        lines.push({
          x1: currentRect.left + currentRect.width / 2 - containerRect.left,
          y1: currentRect.top + currentRect.height / 2 - containerRect.top,
          x2: nextRect.left + nextRect.width / 2 - containerRect.left,
          y2: nextRect.top + nextRect.height / 2 - containerRect.top,
          index: i,
        });
      }
    }
    
    return lines;
  }, [itemRefs]);

  useEffect(() => {
    setItemRefs(new Array(childArray.length).fill(null));
  }, [childArray.length]);

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative", className)}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      style={{ perspective: 1000 }}
    >
      {connectionLines.length > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.8)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {connectionLines.map((line, idx) => (
            <motion.line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                pathLength: { 
                  duration: 0.5, 
                  delay: staggerDelay * (line.index + 1) + 0.2,
                  ease: "easeOut"
                },
                opacity: { duration: 0.2, delay: staggerDelay * (line.index + 1) }
              }}
            />
          ))}
          {connectionLines.map((line, idx) => (
            <motion.circle
              key={`dot-${idx}`}
              cx={line.x2}
              cy={line.y2}
              r="4"
              fill="rgba(236, 72, 153, 0.9)"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: staggerDelay * (line.index + 2),
              }}
            />
          ))}
        </svg>
      )}
      {childArray.map((child, index) => (
        <motion.div 
          key={index} 
          variants={item}
          ref={(el) => {
            if (itemRefs.length > index) {
              const newRefs = [...itemRefs];
              newRefs[index] = el;
              if (el && !itemRefs[index]) {
                setItemRefs(newRefs);
              }
            }
          }}
          className="relative"
          style={{ zIndex: 1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { 
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.1, 1],
            } : {}}
            transition={{
              duration: 0.6,
              delay: staggerDelay * index + 0.1,
              ease: "easeOut",
            }}
            style={{
              background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
