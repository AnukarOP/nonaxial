"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
}

interface BokehParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  blur: number;
  opacity: number;
  delay: number;
  color: string;
}

export function BlurReveal({ children, className }: BlurRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Generate bokeh particles
  const bokehParticles: BokehParticle[] = useMemo(() => {
    const colors = [
      "rgba(139, 92, 246, 0.6)",
      "rgba(236, 72, 153, 0.5)",
      "rgba(251, 191, 36, 0.5)",
      "rgba(34, 211, 238, 0.5)",
      "rgba(255, 255, 255, 0.4)",
    ];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: ((Math.sin(i * 5.3) + 1) / 2) * 60 + 20,
      blur: ((Math.sin(i * 7.1) + 1) / 2) * 15 + 10,
      opacity: ((Math.sin(i * 2.9) + 1) / 2) * 0.4 + 0.2,
      delay: ((Math.sin(i * 4.3) + 1) / 2) * 0.5,
      color: colors[i % colors.length],
    }));
  }, []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {hasTriggered && bokehParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle at 30% 30%, ${particle.color}, transparent 70%)`,
            filter: `blur(${particle.blur}px)`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            opacity: particle.opacity,
            scale: 1.5,
          }}
          animate={{
            opacity: [particle.opacity, particle.opacity * 1.5, 0],
            scale: [1.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.2) 100%)",
        }}
        initial={{ opacity: 0.8 }}
        animate={isInView ? { opacity: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        <motion.div
          className="absolute h-1 w-full"
          style={{
            top: "50%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)",
            filter: "blur(2px)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? {
            scaleX: [0, 1.5, 0],
            opacity: [0, 0.8, 0],
          } : {}}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "2px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "4px",
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={isInView ? {
          opacity: [0, 0.8, 0],
          scale: [1.1, 1, 0.98],
        } : {}}
        transition={{
          duration: 0.5,
          delay: 0.4,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        initial={{ opacity: 0.5 }}
        animate={isInView ? { opacity: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(255, 0, 0, 0.1) 0%, transparent 50%, rgba(0, 0, 255, 0.1) 100%)",
            filter: "blur(5px)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 50%)",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? {
          opacity: [0, 0.6, 0],
        } : {}}
        transition={{
          duration: 0.4,
          delay: 0.5,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="relative"
        initial={{ 
          opacity: 0, 
          filter: "blur(30px) saturate(0.5) brightness(1.2)",
          scale: 1.05,
        }}
        animate={isInView ? { 
          opacity: 1, 
          filter: "blur(0px) saturate(1) brightness(1)",
          scale: 1,
        } : {}}
        transition={{ 
          opacity: { duration: 0.3 },
          filter: { 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
          },
          scale: {
            duration: 0.6,
            ease: "easeOut",
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
