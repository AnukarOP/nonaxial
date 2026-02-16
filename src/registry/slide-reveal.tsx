"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SlideRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function SlideReveal({ children, className, direction = "up" }: SlideRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const directionMap = {
    left: { x: -150, y: 0 },
    right: { x: 150, y: 0 },
    up: { x: 0, y: 150 },
    down: { x: 0, y: -150 },
  };

  const initial = directionMap[direction];
  const isHorizontal = direction === "left" || direction === "right";

  // Generate sparkle particles along the trail
  const sparkles: Sparkle[] = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: isHorizontal ? (direction === "left" ? -50 - Math.random() * 100 : 50 + Math.random() * 100) : Math.random() * 100 - 50,
      y: isHorizontal ? Math.random() * 100 - 50 : (direction === "up" ? 50 + Math.random() * 100 : -50 - Math.random() * 100),
      size: Math.random() * 6 + 2,
      delay: Math.random() * 0.3,
      duration: Math.random() * 0.5 + 0.3,
    }));
  }, [direction, isHorizontal]);

  // Spring for elastic momentum
  const springConfig = { stiffness: 120, damping: 14, mass: 1 };
  const progress = useSpring(0, springConfig);

  useEffect(() => {
    if (isInView) {
      progress.set(1);
    }
  }, [isInView, progress]);

  const x = useTransform(progress, [0, 1], [initial.x, 0]);
  const y = useTransform(progress, [0, 1], [initial.y, 0]);
  const opacity = useTransform(progress, [0, 0.3, 1], [0, 1, 1]);

  // Smear trail calculation
  const skewAmount = isHorizontal ? 15 : 0;
  const scaleX = isHorizontal ? 1.3 : 1;
  const scaleY = !isHorizontal ? 1.3 : 1;

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {[0.2, 0.4, 0.6].map((trailOpacity, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 pointer-events-none"
          initial={{ 
            opacity: 0,
            x: initial.x * (1 - i * 0.2),
            y: initial.y * (1 - i * 0.2),
            scaleX: isHorizontal ? 1 + (0.1 * (3 - i)) : 1,
            scaleY: !isHorizontal ? 1 + (0.1 * (3 - i)) : 1,
            skewX: isHorizontal ? skewAmount * (direction === "right" ? -1 : 1) * (1 - i * 0.3) : 0,
            skewY: !isHorizontal ? skewAmount * (direction === "down" ? -1 : 1) * (1 - i * 0.3) : 0,
          }}
          animate={isInView ? {
            opacity: [0, trailOpacity, 0],
            x: [initial.x * (1 - i * 0.2), initial.x * 0.3, 0],
            y: [initial.y * (1 - i * 0.2), initial.y * 0.3, 0],
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
          } : {}}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: "easeOut",
          }}
          style={{
            filter: `blur(${(3 - i) * 4}px)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
        </motion.div>
      ))}
      {hasAnimated && sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: sparkle.size,
            height: sparkle.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(251, 191, 36, 0.8) 50%, transparent 100%)",
            boxShadow: "0 0 8px rgba(251, 191, 36, 0.9), 0 0 16px rgba(255, 255, 255, 0.6)",
          }}
          initial={{
            x: sparkle.x,
            y: sparkle.y,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: sparkle.x * 0.2,
            y: sparkle.y * 0.2,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{
          opacity: 0,
          x: initial.x * 0.8,
          y: initial.y * 0.8,
        }}
        animate={isInView ? {
          opacity: [0, 0.6, 0],
          x: [initial.x * 0.8, initial.x * 0.2, 0],
          y: [initial.y * 0.8, initial.y * 0.2, 0],
        } : {}}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)",
          filter: "blur(20px)",
        }}
      />
      <motion.div
        className="relative"
        style={{ x, y, opacity }}
        initial={{
          scaleX,
          scaleY,
          skewX: isHorizontal ? skewAmount * (direction === "right" ? -1 : 1) : 0,
          skewY: !isHorizontal ? skewAmount * (direction === "down" ? -1 : 1) : 0,
        }}
        animate={isInView ? {
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          skewY: 0,
        } : {}}
        transition={{
          scaleX: { type: "spring", stiffness: 200, damping: 20 },
          scaleY: { type: "spring", stiffness: 200, damping: 20 },
          skewX: { type: "spring", stiffness: 200, damping: 20 },
          skewY: { type: "spring", stiffness: 200, damping: 20 },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
