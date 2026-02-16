"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RotateRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function RotateReveal({ children, className }: RotateRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  return (
    <div 
      ref={ref} 
      className={cn("relative", className)} 
      style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}
    >
      {[1, 2, 3].map((trail, i) => (
        <motion.div
          key={trail}
          className="absolute inset-0 pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
          initial={{ 
            opacity: 0,
            rotateY: -180 + i * 10,
            rotateX: -20 + i * 5,
          }}
          animate={isInView ? {
            opacity: [0, 0.3 - i * 0.08, 0],
            rotateY: [-180 + i * 10, -90, 0],
            rotateX: [-20 + i * 5, 0, 0],
          } : {}}
          transition={{
            duration: 0.8,
            delay: i * 0.03,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div 
            className="w-full h-full rounded-lg"
            style={{
              background: `linear-gradient(${45 + i * 30}deg, rgba(139, 92, 246, ${0.2 - i * 0.05}) 0%, rgba(236, 72, 153, ${0.2 - i * 0.05}) 100%)`,
              filter: `blur(${4 + i * 3}px)`,
            }}
          />
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.8) 45%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.8) 55%, transparent 60%)",
          transformStyle: "preserve-3d",
        }}
        initial={{ 
          opacity: 0,
          rotateY: -180,
          x: "-100%",
        }}
        animate={isInView ? {
          opacity: [0, 1, 0],
          rotateY: 0,
          x: ["0%", "100%"],
        } : {}}
        transition={{
          duration: 1,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "inherit",
          boxShadow: "inset 0 0 0 2px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.4)",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? {
          opacity: [0, 1, 0.3, 0],
        } : {}}
        transition={{
          duration: 1,
          times: [0, 0.3, 0.7, 1],
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        <motion.div
          className="absolute w-[200%] h-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.15) 49%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.15) 51%, transparent 60%, transparent 100%)",
            left: "-100%",
          }}
          initial={{ x: 0 }}
          animate={isInView ? { x: "100%" } : {}}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-x-4 bottom-0 h-4 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
          filter: "blur(4px)",
          transformOrigin: "center bottom",
        }}
        initial={{ 
          opacity: 0,
          scaleX: 0.3,
          scaleY: 0.5,
          y: 10,
        }}
        animate={isInView ? {
          opacity: [0, 0.5, 0.3],
          scaleX: [0.3, 1.2, 1],
          scaleY: [0.5, 1, 0.8],
          y: [10, 15, 8],
        } : {}}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        initial={{ 
          opacity: 0, 
          rotateY: -180,
          rotateX: -15,
          scale: 0.8,
          z: -100,
        }}
        animate={isInView ? { 
          opacity: 1, 
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          z: 0,
        } : {}}
        transition={{
          opacity: { duration: 0.4 },
          rotateY: { 
            type: "spring", 
            stiffness: 80, 
            damping: 12,
            mass: 1,
          },
          rotateX: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
          scale: {
            type: "spring",
            stiffness: 200,
            damping: 20,
          },
          z: { duration: 0.6, ease: "easeOut" },
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(30, 30, 45, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%)",
            backfaceVisibility: "visible",
            transform: "rotateY(180deg)",
            boxShadow: "inset 0 0 40px rgba(139, 92, 246, 0.2)",
          }}
          initial={{ opacity: 1 }}
          animate={isInView ? { opacity: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        />
        {children}
      </motion.div>
    </div>
  );
}
