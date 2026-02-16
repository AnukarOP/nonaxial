"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientShiftButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GradientShiftButton({ children, className, onClick }: GradientShiftButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [gradientOffset, setGradientOffset] = useState(0);
  const [liquidOffset, setLiquidOffset] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  // Animate flowing aurora gradient
  useEffect(() => {
    const animate = () => {
      setGradientOffset((prev) => (prev + (isHovered ? 1.5 : 0.5)) % 360);
      setLiquidOffset((prev) => prev + (isHovered ? 0.03 : 0.01));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  // Generate liquid wave positions
  const wave1 = Math.sin(liquidOffset) * 20 + 50;
  const wave2 = Math.cos(liquidOffset * 0.7) * 25 + 50;
  const wave3 = Math.sin(liquidOffset * 1.3) * 15 + 50;

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "relative px-10 py-5 rounded-2xl font-bold text-white overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            ${gradientOffset}deg,
            hsl(${(gradientOffset) % 360}, 80%, 60%) 0%,
            hsl(${(gradientOffset + 60) % 360}, 85%, 55%) 25%,
            hsl(${(gradientOffset + 120) % 360}, 90%, 50%) 50%,
            hsl(${(gradientOffset + 180) % 360}, 85%, 55%) 75%,
            hsl(${(gradientOffset + 240) % 360}, 80%, 60%) 100%
          )`,
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background: `linear-gradient(
            ${gradientOffset + 90}deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) ${wave1}%,
            transparent 100%
          )`,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse ${isHovered ? 80 : 60}% ${isHovered ? 60 : 40}% at ${wave1}% ${wave2}%,
              hsla(${(gradientOffset + 90) % 360}, 100%, 70%, 0.4) 0%,
              transparent 100%
            )
          `,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse ${isHovered ? 70 : 50}% ${isHovered ? 50 : 30}% at ${100 - wave2}% ${wave3}%,
              hsla(${(gradientOffset + 180) % 360}, 100%, 65%, 0.3) 0%,
              transparent 100%
            )
          `,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse ${isHovered ? 60 : 40}% ${isHovered ? 70 : 50}% at ${wave3}% ${100 - wave1}%,
              hsla(${(gradientOffset + 270) % 360}, 100%, 60%, 0.35) 0%,
              transparent 100%
            )
          `,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{
          opacity: isHovered ? 0.4 : 0.2,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              left: 0,
              right: 0,
              top: `${20 + i * 20 + Math.sin(liquidOffset + i) * 5}%`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,255,255,${0.3 + Math.sin(liquidOffset + i) * 0.2}) ${wave1}%, 
                transparent 100%
              )`,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            ${135 + Math.sin(liquidOffset) * 20}deg,
            transparent 0%,
            rgba(255, 255, 255, ${0.1 + Math.sin(liquidOffset * 2) * 0.1}) 50%,
            transparent 100%
          )`,
        }}
      />
      <motion.div
        className="absolute top-0 inset-x-0 h-1/3 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
          borderRadius: "1rem 1rem 0 0",
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.5,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `
            0 0 20px hsla(${gradientOffset % 360}, 80%, 60%, 0.4),
            0 0 40px hsla(${(gradientOffset + 120) % 360}, 80%, 60%, 0.2),
            inset 0 0 20px hsla(${(gradientOffset + 240) % 360}, 80%, 60%, 0.1)
          `,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.6,
        }}
      />
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />
      {isHovered && Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: `hsla(${(gradientOffset + i * 60) % 360}, 100%, 80%, 0.6)`,
            left: `${10 + Math.sin(liquidOffset + i) * 40 + 40}%`,
            bottom: "10%",
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, -50 - Math.random() * 30],
            x: [0, (Math.random() - 0.5) * 20],
            opacity: [0.8, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        style={{
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
