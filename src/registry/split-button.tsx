"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SplitButton({ children, className, onClick }: SplitButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [splitActive, setSplitActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic snap back effect
  const springConfig = { stiffness: 400, damping: 25 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
    setSplitActive(false);
  };

  const handleClick = () => {
    setSplitActive(true);
    setTimeout(() => setSplitActive(false), 600);
    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        "relative px-10 py-5 font-bold text-white rounded-2xl overflow-hidden",
        className
      )}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
        animate={{
          x: splitActive ? -20 : isHovered ? -8 : 0,
          y: splitActive ? -20 : isHovered ? -8 : 0,
          opacity: isHovered || splitActive ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
        animate={{
          x: splitActive ? 20 : isHovered ? 8 : 0,
          y: splitActive ? 20 : isHovered ? 8 : 0,
          opacity: isHovered || splitActive ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)",
        }}
        animate={{
          opacity: splitActive ? [0, 1, 0] : isHovered ? 0.5 : 0,
          scale: splitActive ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: "inset 0 0 30px rgba(255,255,255,0.2)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
          borderColor: splitActive 
            ? "rgba(255,255,255,0.8)" 
            : "rgba(255,255,255,0.3)",
        }}
      />

      {splitActive && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
              }}
              initial={{
                x: (i % 2 === 0 ? -1 : 1) * (10 + i * 5),
                y: (i < 3 ? -1 : 1) * (10 + i * 3),
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.03,
                ease: "easeIn",
              }}
            />
          ))}
        </>
      )}

      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          x: splitActive ? [0, -5, 5, 0] : 0,
          y: splitActive ? [0, -3, 3, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>

      <motion.div
        className="absolute -inset-2 rounded-3xl pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
          scale: splitActive ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
