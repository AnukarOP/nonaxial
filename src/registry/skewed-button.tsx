"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkewedButtonProps {
  children: React.ReactNode;
  className?: string;
  skewDegree?: number;
  onClick?: () => void;
}

export function SkewedButton({
  children,
  className,
  skewDegree = -12,
  onClick,
}: SkewedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Perspective warp transforms
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const skewX = useTransform(x, [-0.5, 0.5], [skewDegree - 5, skewDegree + 5]);
  const skewY = useTransform(y, [-0.5, 0.5], [-3, 3]);

  // Shadow stretch based on position
  const shadowX = useTransform(x, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(y, [-0.5, 0.5], [20, -20]);
  const shadowBlur = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return 20 + distance * 30;
    }
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  return (
    <div 
      className="relative inline-block"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-black/40 pointer-events-none"
        style={{
          x: shadowX,
          y: shadowY,
          filter: "blur(15px)",
          transform: "translateZ(-50px)",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.5 : 0.3,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
          x: useTransform(shadowX, (v) => v * 0.5),
          y: useTransform(shadowY, (v) => v * 0.5),
          filter: "blur(10px)",
          skewX: useTransform(skewX, (v) => v * 0.3),
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0.2,
        }}
      />

      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={cn(
          "relative px-10 py-5 rounded-2xl font-bold text-white overflow-hidden",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          rotateX,
          rotateY,
          skewX: isHovered ? skewX : skewDegree,
          skewY: isHovered ? skewY : 0,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 30%, #d946ef 70%, #ec4899 100%)",
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)",
          }}
          initial={{ x: "-100%", skewX: 20 }}
          animate={{
            x: isHovered ? "0%" : "-100%",
            skewX: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)",
          }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-1 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5,
            scaleY: isHovered ? 1.1 : 1,
          }}
        />

        <motion.div
          className="absolute inset-y-0 right-0 w-1 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5,
          }}
        />
        <motion.div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          }}
          animate={{
            scaleX: isHovered ? 1.2 : 1,
            opacity: isHovered ? 1 : 0.5,
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: isHovered ? 0.15 : 0 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-white/40"
              style={{
                left: 0,
                right: 0,
                top: `${20 + i * 15}%`,
                transform: `skewX(${-skewDegree}deg)`,
              }}
              animate={{
                x: isHovered ? [0, 10, 0] : 0,
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          style={{
            transform: `skewX(${-skewDegree}deg)`,
          }}
        >
          {children}
        </motion.span>
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 30px rgba(255,255,255,0.2)"
              : "inset 0 0 0px rgba(255,255,255,0)",
          }}
        />
      </motion.button>
    </div>
  );
}
