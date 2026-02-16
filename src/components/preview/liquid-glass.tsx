"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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
  blur?: number;
  contrast?: number;
  brightness?: number;
  saturate?: number;
}

export function AppleLiquidGlass({
  width = 200,
  height = 140,
  initialPosition,
  borderRadius = 50,
  className,
  blur = 0.25,
  contrast = 1.2,
  brightness = 1.05,
  saturate = 1.1,
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
    } else {
      x.set(40);
      y.set(40);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
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
        }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
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

export function LiquidGlassPreview() {
  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
        alt="Nature background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-lg font-medium drop-shadow-lg z-10 pointer-events-none">Drag the glass</p>
      </div>
      <AppleLiquidGlass
        width={160}
        height={100}
        borderRadius={45}
        initialPosition={{ x: 60, y: 80 }}
      />
    </div>
  );
}
