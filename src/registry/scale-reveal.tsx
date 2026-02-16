"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScaleRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function ScaleReveal({ children, className }: ScaleRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Generate ring waves
  const rings = [0, 1, 2, 3];

  return (
    <div ref={ref} className={cn("relative", className)}>
      {hasTriggered && rings.map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "50%",
            border: "2px solid",
            borderColor: ring % 2 === 0 
              ? "rgba(139, 92, 246, 0.6)" 
              : "rgba(236, 72, 153, 0.6)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            width: "10%",
            height: "10%",
            opacity: 0.9,
          }}
          animate={{
            width: "200%",
            height: "200%",
            opacity: 0,
          }}
          transition={{
            duration: 1 + ring * 0.1,
            delay: ring * 0.12,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(139, 92, 246, 0.4) 30%, transparent 60%)",
          borderRadius: "50%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{
          width: "20%",
          height: "20%",
          opacity: 0,
        }}
        animate={isInView ? {
          width: ["20%", "150%", "100%"],
          height: ["20%", "150%", "100%"],
          opacity: [0, 0.8, 0],
        } : {}}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "transparent",
          boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.3), 0 0 30px 10px rgba(139, 92, 246, 0.3)",
        }}
        initial={{
          width: "5%",
          height: "5%",
          opacity: 0,
        }}
        animate={isInView ? {
          width: "180%",
          height: "180%",
          opacity: [0, 0.7, 0],
        } : {}}
        transition={{
          duration: 0.9,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
      {hasTriggered && Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360;
        const rad = (angle * Math.PI) / 180;
        const distance = 80 + Math.random() * 60;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              borderRadius: "50%",
              background: i % 3 === 0 
                ? "rgba(251, 191, 36, 0.9)"
                : i % 3 === 1
                ? "rgba(139, 92, 246, 0.9)"
                : "rgba(236, 72, 153, 0.9)",
              boxShadow: "0 0 10px currentColor",
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: Math.cos(rad) * distance,
              y: Math.sin(rad) * distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.7,
              delay: Math.random() * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}
      <motion.div
        className="relative"
        initial={{ 
          opacity: 0, 
          scale: 0,
          filter: "brightness(3) blur(10px)",
        }}
        animate={isInView ? { 
          opacity: 1, 
          scale: 1,
          filter: "brightness(1) blur(0px)",
        } : {}}
        transition={{
          opacity: { duration: 0.3 },
          scale: { 
            type: "spring", 
            stiffness: 300, 
            damping: 15,
            mass: 0.8,
          },
          filter: { duration: 0.5, delay: 0.1 },
        }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-inherit"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%)",
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: [0, 0.8, 0],
          } : {}}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
