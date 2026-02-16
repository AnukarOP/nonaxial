"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UnderlineRevealProps {
  children: string;
  className?: string;
}

interface LeadingEdgeParticle {
  id: number;
  y: number;
  size: number;
  delay: number;
}

interface SparkParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export function UnderlineReveal({ children, className }: UnderlineRevealProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparks, setShowSparks] = useState(false);

  // Particles at the leading edge of the underline
  const leadingEdgeParticles: LeadingEdgeParticle[] = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      y: (Math.sin(i * 3.7) * 0.5) * 20,
      size: 2 + ((Math.sin(i * 5.3) + 1) / 2) * 3,
      delay: i * 0.03,
    }));
  }, []);

  // Spark burst particles
  const sparkParticles: SparkParticle[] = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 4.1) * 0.5) * 30,
      y: (Math.cos(i * 4.1) * 0.5) * 30,
      angle: (i / 8) * 360,
    }));
  }, []);

  return (
    <motion.span 
      className={cn("relative inline-block group cursor-pointer", className)}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowSparks(true);
        setTimeout(() => setShowSparks(false), 400);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{children}</span>

      <motion.span
        className="absolute bottom-0 left-0 h-[3px] rounded-full"
        style={{
          backgroundImage: "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)",
          backgroundSize: "200% 100%",
        }}
        initial={{ width: 0 }}
        animate={{ 
          width: isHovered ? "100%" : 0,
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.34, 1.56, 0.64, 1], // Bounce ease
        }}
      >
        <motion.span
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b, #8b5cf6)",
            backgroundSize: "300% 100%",
          }}
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%"] : "0% 50%",
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />

        <motion.span
          className="absolute inset-0 blur-sm"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)",
          }}
          animate={{ 
            opacity: isHovered ? [0.5, 1, 0.5] : 0,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      </motion.span>

      <motion.span
        className="absolute bottom-0 left-0 h-[3px] rounded-full opacity-30"
        style={{
          background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
        }}
        initial={{ width: 0, y: 0 }}
        animate={{ 
          width: isHovered ? "100%" : 0,
          y: isHovered ? [0, -4, 0] : 0,
        }}
        transition={{ 
          width: { duration: 0.3, ease: "easeOut" },
          y: { duration: 0.4, delay: 0.2, ease: "easeOut" },
        }}
      />

      <AnimatePresence>
        {isHovered && leadingEdgeParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute bottom-0 rounded-full pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              background: "linear-gradient(135deg, #f59e0b, #ec4899)",
              boxShadow: "0 0 4px #ec4899",
            }}
            initial={{ right: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              right: ["0%", "100%"],
              y: particle.y,
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.5,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showSparks && sparkParticles.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute bottom-0 right-0 pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: spark.x,
              y: spark.y,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span 
              className="block w-1 h-1 rounded-full"
              style={{
                background: `hsl(${spark.angle % 60 + 270}, 80%, 60%)`,
                boxShadow: `0 0 3px hsl(${spark.angle % 60 + 270}, 80%, 60%)`,
              }}
            />
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.5), transparent)",
          backgroundSize: "50% 100%",
        }}
        animate={{
          backgroundPosition: isHovered ? ["200% 0%", "-100% 0%"] : "200% 0%",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          backgroundPosition: { duration: 1, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.2 },
        }}
      />
      <motion.span
        className="absolute -bottom-3 left-0 right-0 h-6 blur-lg pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(245, 158, 11, 0.3))",
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scaleX: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ec4899)",
              boxShadow: "0 0 8px rgba(236, 72, 153, 0.8)",
            }}
            initial={{ scale: 0, y: 0 }}
            animate={{ 
              scale: [0, 1.5, 1],
              y: [0, -8, 0, -4, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { duration: 0.3, delay: 0.3 },
              y: { duration: 0.5, delay: 0.3, ease: "easeOut" },
            }}
          />
        )}
      </AnimatePresence>
    </motion.span>
  );
}
