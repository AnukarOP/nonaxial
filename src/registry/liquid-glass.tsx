"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
}

interface AppleLiquidGlassProps {
  width?: number;
  height?: number;
  initialPosition?: Position;
  borderRadius?: number;
  className?: string;
  disabled?: boolean;
  constrainToViewport?: boolean;
  opacity?: number;
  blur?: number;
  contrast?: number;
  brightness?: number;
  saturate?: number;
  onDragStart?: (position: Position) => void;
  onDrag?: (position: Position) => void;
  onDragEnd?: (position: Position) => void;
  style?: React.CSSProperties;
}

export function AppleLiquidGlass({
  width = 300,
  height = 200,
  initialPosition,
  borderRadius = 60,
  className,
  disabled = false,
  constrainToViewport = true,
  opacity = 1,
  blur = 0.25,
  contrast = 1.2,
  brightness = 1.05,
  saturate = 1.1,
  onDragStart,
  onDrag,
  onDragEnd,
  style,
}: AppleLiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    setMounted(true);
    if (initialPosition) {
      x.set(initialPosition.x);
      y.set(initialPosition.y);
    } else if (typeof window !== "undefined") {
      x.set((window.innerWidth - width) / 2);
      y.set((window.innerHeight - height) / 2);
    }
  }, []);

  const handleDragStart = useCallback(() => {
    if (disabled) return;
    setIsDragging(true);
    onDragStart?.({ x: x.get(), y: y.get() });
  }, [disabled, onDragStart, x, y]);

  const handleDrag = useCallback(() => {
    if (disabled) return;
    onDrag?.({ x: x.get(), y: y.get() });
  }, [disabled, onDrag, x, y]);

  const handleDragEnd = useCallback(() => {
    if (disabled) return;
    setIsDragging(false);
    onDragEnd?.({ x: x.get(), y: y.get() });
  }, [disabled, onDragEnd, x, y]);

  const filterId = `apple-liquid-glass-${Math.random().toString(36).slice(2, 9)}`;

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur * 40} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values={`${contrast} 0 0 0 0 0 ${contrast} 0 0 0 0 0 ${contrast} 0 0 0 0 0 1 0`}
              result="contrast"
            />
            <feComponentTransfer in="contrast" result="brightness">
              <feFuncR type="linear" slope={brightness} />
              <feFuncG type="linear" slope={brightness} />
              <feFuncB type="linear" slope={brightness} />
            </feComponentTransfer>
            <feColorMatrix
              in="brightness"
              type="saturate"
              values={String(saturate)}
              result="saturate"
            />
            <feComposite in="saturate" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <motion.div
        className={cn(
          "absolute cursor-grab active:cursor-grabbing select-none touch-none",
          isDragging && "z-50"
        )}
        style={{
          x: springX,
          y: springY,
          width,
          height,
          opacity,
          ...style,
        }}
        drag={!disabled}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={
          constrainToViewport
            ? {
                left: 0,
                right: typeof window !== "undefined" ? window.innerWidth - width : 0,
                top: 0,
                bottom: typeof window !== "undefined" ? window.innerHeight - height : 0,
              }
            : undefined
        }
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02 }}
        transition={{ type: "spring", ...springConfig }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius }}
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur * 100}px) contrast(${contrast}) brightness(${brightness}) saturate(${saturate})`,
              WebkitBackdropFilter: `blur(${blur * 100}px) contrast(${contrast}) brightness(${brightness}) saturate(${saturate})`,
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
              borderRadius,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius,
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.4),
                inset 0 -1px 1px rgba(0,0,0,0.1),
                0 0 0 1px rgba(255,255,255,0.2),
                0 8px 32px rgba(0,0,0,0.15),
                0 2px 8px rgba(0,0,0,0.1)
              `,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius,
              background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 40%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30"
            animate={{ opacity: isDragging ? 0.6 : 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export function LiquidGlassCard({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.4)",
  intensity = 1,
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const glowX = useSpring(50, springConfig);
  const glowY = useSpring(50, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX.set(((y - centerY) / centerY) * -10 * intensity);
    rotateY.set(((x - centerX) / centerX) * 10 * intensity);
    glowX.set((x / rect.width) * 100);
    glowY.set((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, ${glowColor} 0%, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 rounded-2xl border border-white/20" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"
        style={{
          opacity: 0.5,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  duration?: number;
}

export function ShimmerEffect({
  children,
  className,
  shimmerColor = "rgba(255, 255, 255, 0.1)",
  duration = 2,
}: ShimmerEffectProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      />
    </div>
  );
}

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
}

export function GlowEffect({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.5)",
  intensity = "medium",
  animated = false,
}: GlowEffectProps) {
  const intensityMap = {
    low: "0 0 20px",
    medium: "0 0 40px",
    high: "0 0 60px",
  };

  return (
    <motion.div
      className={cn("relative", className)}
      animate={animated ? {
        boxShadow: [
          `${intensityMap[intensity]} ${glowColor}`,
          `${intensityMap[intensity]} ${glowColor.replace("0.5)", "0.8)")}`,
          `${intensityMap[intensity]} ${glowColor}`,
        ],
      } : {}}
      transition={animated ? {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      } : {}}
      style={!animated ? { boxShadow: `${intensityMap[intensity]} ${glowColor}` } : {}}
    >
      {children}
    </motion.div>
  );
}

interface HolographicEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function HolographicEffect({ children, className }: HolographicEffectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX.set(((y - centerY) / centerY) * -15);
    rotateY.set(((x - centerX) / centerX) * 15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative rounded-xl overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 219, 112, 0.3) 45%,
            rgba(198, 128, 255, 0.3) 50%,
            rgba(162, 255, 199, 0.3) 55%,
            transparent 60%
          )`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
      />
      {children}
    </motion.div>
  );
}
