"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SplitRevealProps {
  children: React.ReactNode;
  className?: string;
}

interface BurstParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  color: string;
}

export function SplitReveal({ children, className }: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Generate particle burst from center
  const burstParticles: BurstParticle[] = useMemo(() => {
    const colors = [
      "rgba(139, 92, 246, 0.9)",
      "rgba(236, 72, 153, 0.9)",
      "rgba(251, 191, 36, 0.9)",
      "rgba(34, 211, 238, 0.9)",
    ];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      angle: (i / 32) * 360 + (Math.sin(i * 3.7) * 10),
      distance: 80 + ((Math.sin(i * 5.3) + 1) / 2) * 120,
      size: ((Math.sin(i * 7.1) + 1) / 2) * 8 + 3,
      delay: ((Math.sin(i * 2.3) + 1) / 2) * 0.15,
      color: colors[i % colors.length],
    }));
  }, []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 z-20 origin-left"
        style={{
          background: "linear-gradient(90deg, rgba(15, 15, 20, 0.98) 0%, rgba(30, 30, 40, 0.95) 100%)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.5)",
        }}
        initial={{ scaleX: 1, x: 0 }}
        animate={isInView ? { scaleX: 0, x: "-10%" } : {}}
        transition={{ 
          duration: 0.9, 
          ease: [0.76, 0, 0.24, 1],
          delay: 0.1,
        }}
      />
      <motion.div
        className="absolute inset-0 z-20 origin-right"
        style={{
          background: "linear-gradient(-90deg, rgba(15, 15, 20, 0.98) 0%, rgba(30, 30, 40, 0.95) 100%)",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.5)",
        }}
        initial={{ scaleX: 1, x: 0 }}
        animate={isInView ? { scaleX: 0, x: "10%" } : {}}
        transition={{ 
          duration: 0.9, 
          ease: [0.76, 0, 0.24, 1],
          delay: 0.1,
        }}
      />
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-1 z-30 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.9) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 80%, transparent 100%)",
          boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.8), 0 0 60px 20px rgba(139, 92, 246, 0.6)",
          transform: "translateX(-50%)",
        }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={isInView ? { 
          opacity: [0, 1, 1, 0],
          scaleY: [0, 1, 1, 1],
        } : {}}
        transition={{ 
          duration: 1.2,
          times: [0, 0.2, 0.7, 1],
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-y-0 w-32 z-25 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
          filter: "blur(8px)",
        }}
        initial={{ left: "50%", x: "-50%", opacity: 0 }}
        animate={isInView ? {
          left: ["50%", "0%", "100%"],
          x: ["-50%", "-100%", "0%"],
          opacity: [0, 0.8, 0],
        } : {}}
        transition={{
          duration: 1,
          times: [0, 0.5, 1],
          ease: "easeOut",
          delay: 0.2,
        }}
      />
      {hasTriggered && burstParticles.map((particle) => {
        const rad = (particle.angle * Math.PI) / 180;
        const endX = Math.cos(rad) * particle.distance;
        const endY = Math.sin(rad) * particle.distance;
        
        return (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 top-1/2 rounded-full z-40 pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            initial={{ 
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{ 
              x: endX,
              y: endY,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.8,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}
      <motion.div
        className="relative z-10"
        initial={{ 
          clipPath: "inset(0 50% 0 50%)",
          filter: "brightness(2)",
        }}
        animate={isInView ? { 
          clipPath: "inset(0 0% 0 0%)",
          filter: "brightness(1)",
        } : {}}
        transition={{ 
          clipPath: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
          filter: { duration: 0.5, delay: 0.4 },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
