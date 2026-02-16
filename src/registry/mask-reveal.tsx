"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MaskRevealProps {
  children: React.ReactNode;
  className?: string;
}

interface EdgeParticle {
  id: number;
  y: number;
  size: number;
  delay: number;
  drift: number;
}

export function MaskReveal({ children, className }: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Generate particles that follow the mask edge
  const edgeParticles: EdgeParticle[] = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      y: (i / 16) * 100,
      size: ((Math.sin(i * 5.3) + 1) / 2) * 6 + 3,
      delay: (i / 16) * 0.4,
      drift: (Math.sin(i * 3.7) * 0.5) * 20,
    }));
  }, []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(139, 92, 246, 1) 0%, rgba(236, 72, 153, 1) 40%, rgba(251, 191, 36, 1) 60%, rgba(34, 211, 238, 1) 100%)",
        }}
        initial={{ x: 0 }}
        animate={isInView ? { x: "100%" } : {}}
        transition={{ 
          duration: 1,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.05,
        }}
      />
      <motion.div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(15, 15, 25, 0.95) 0%, rgba(30, 30, 50, 0.9) 100%)",
        }}
        initial={{ x: 0 }}
        animate={isInView ? { x: "100%" } : {}}
        transition={{ 
          duration: 0.9,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.15,
        }}
      />
      <motion.div
        className="absolute inset-y-0 w-32 z-25 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.9) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 70%, transparent 100%)",
          boxShadow: "0 0 40px 10px rgba(255, 255, 255, 0.5)",
          filter: "blur(2px)",
        }}
        initial={{ left: "-20%" }}
        animate={isInView ? { left: "120%" } : {}}
        transition={{
          duration: 1,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1,
        }}
      />
      <motion.div
        className="absolute inset-y-0 w-24 z-24 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.6) 40%, rgba(236, 72, 153, 0.6) 60%, transparent 100%)",
          filter: "blur(8px)",
        }}
        initial={{ left: "-15%" }}
        animate={isInView ? { left: "115%" } : {}}
        transition={{
          duration: 1.1,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.05,
        }}
      />
      {hasTriggered && edgeParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute z-30 pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            top: `${particle.y}%`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(139, 92, 246, 0.7) 50%, transparent 100%)`,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(139, 92, 246, 0.6)",
          }}
          initial={{ left: "0%", opacity: 0, y: 0 }}
          animate={{
            left: "100%",
            opacity: [0, 1, 1, 0],
            y: particle.drift,
          }}
          transition={{
            duration: 0.9,
            delay: particle.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      ))}
      {hasTriggered && Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute z-30 pointer-events-none"
          style={{
            right: 0,
            top: `${(i / 8) * 100 + 6}%`,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 6px white, 0 0 12px rgba(251, 191, 36, 0.8)",
          }}
          initial={{ opacity: 0, scale: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, 20 + Math.random() * 20, 40],
          }}
          transition={{
            duration: 0.5,
            delay: 0.8 + i * 0.03,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? {
          opacity: [0, 0.8, 0],
        } : {}}
        transition={{
          duration: 1.2,
          delay: 0.3,
        }}
      />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
