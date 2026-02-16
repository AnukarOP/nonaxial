"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "top" | "bottom";
}

export function ClipReveal({ children, className, direction = "left" }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Liquid/organic blob animation keyframes
  const liquidClipPaths = {
    left: {
      initial: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      mid1: "polygon(0% 0%, 25% 5%, 20% 95%, 0% 100%)",
      mid2: "polygon(0% 0%, 60% 10%, 55% 90%, 0% 100%)",
      mid3: "polygon(0% 0%, 90% 5%, 85% 95%, 0% 100%)",
      final: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    right: {
      initial: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      mid1: "polygon(75% 5%, 100% 0%, 100% 100%, 80% 95%)",
      mid2: "polygon(40% 10%, 100% 0%, 100% 100%, 45% 90%)",
      mid3: "polygon(10% 5%, 100% 0%, 100% 100%, 15% 95%)",
      final: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    top: {
      initial: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      mid1: "polygon(5% 0%, 95% 0%, 90% 25%, 10% 20%)",
      mid2: "polygon(10% 0%, 90% 0%, 85% 60%, 15% 55%)",
      mid3: "polygon(5% 0%, 95% 0%, 90% 90%, 10% 85%)",
      final: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    bottom: {
      initial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      mid1: "polygon(10% 80%, 90% 75%, 95% 100%, 5% 100%)",
      mid2: "polygon(15% 45%, 85% 40%, 90% 100%, 10% 100%)",
      mid3: "polygon(10% 15%, 90% 10%, 95% 100%, 5% 100%)",
      final: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
  };

  const clipPath = liquidClipPaths[direction];

  // Edge position for glow border
  const glowEdgeStyle = {
    left: { left: 0, top: 0, width: "4px", height: "100%" },
    right: { right: 0, top: 0, width: "4px", height: "100%" },
    top: { top: 0, left: 0, width: "100%", height: "4px" },
    bottom: { bottom: 0, left: 0, width: "100%", height: "4px" },
  };

  const glowGradient = {
    left: "linear-gradient(180deg, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)",
    right: "linear-gradient(180deg, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)",
    top: "linear-gradient(90deg, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)",
    bottom: "linear-gradient(90deg, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)",
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          ...glowEdgeStyle[direction],
          background: glowGradient[direction],
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(236, 72, 153, 0.6)",
          filter: "blur(1px)",
        }}
        initial={{ 
          opacity: 0,
          scale: direction === "left" || direction === "right" ? 1 : 1,
        }}
        animate={isInView ? {
          opacity: [0, 1, 1, 0],
          [direction === "left" ? "x" : direction === "right" ? "x" : direction === "top" ? "y" : "y"]: 
            direction === "left" ? ["0%", "0%", "2500%", "2500%"] :
            direction === "right" ? ["0%", "0%", "-2500%", "-2500%"] :
            direction === "top" ? ["0%", "0%", "2500%", "2500%"] :
            ["0%", "0%", "-2500%", "-2500%"],
        } : {}}
        transition={{
          duration: 1,
          times: [0, 0.1, 0.9, 1],
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        initial={{ opacity: 0.6 }}
        animate={isInView ? { opacity: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
          clipPath: clipPath.initial,
        }}
      />
      {hasTriggered && Array.from({ length: 12 }).map((_, i) => {
        const isHorizontal = direction === "left" || direction === "right";
        const startPos = isHorizontal 
          ? { x: direction === "left" ? 0 : "100%", y: `${(i / 12) * 100}%` }
          : { x: `${(i / 12) * 100}%`, y: direction === "top" ? 0 : "100%" };
        
        const offsetX = isHorizontal ? (direction === "left" ? 20 + Math.random() * 40 : -20 - Math.random() * 40) : (Math.random() - 0.5) * 30;
        const offsetY = !isHorizontal ? (direction === "top" ? 20 + Math.random() * 40 : -20 - Math.random() * 40) : (Math.random() - 0.5) * 30;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none z-30"
            style={{
              left: startPos.x,
              top: startPos.y,
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: `radial-gradient(circle, rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 80}, 246, 0.9) 0%, transparent 70%)`,
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
            }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: offsetX,
              y: offsetY,
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 0.6,
              delay: 0.1 + i * 0.04,
              ease: "easeOut",
            }}
          />
        );
      })}
      <motion.div
        className="relative"
        initial={{ 
          clipPath: clipPath.initial,
          filter: "saturate(1.3) brightness(1.1)",
        }}
        animate={isInView ? {
          clipPath: [clipPath.initial, clipPath.mid1, clipPath.mid2, clipPath.mid3, clipPath.final],
          filter: "saturate(1) brightness(1)",
        } : {}}
        transition={{ 
          clipPath: {
            duration: 1,
            times: [0, 0.2, 0.5, 0.8, 1],
            ease: [0.25, 0.1, 0.25, 1],
          },
          filter: { duration: 0.5, delay: 0.5 },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
