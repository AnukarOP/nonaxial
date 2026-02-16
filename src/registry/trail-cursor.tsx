"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrailCursorProps {
  children: React.ReactNode;
  className?: string;
  trailLength?: number;
}

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
  hue: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  hue: number;
}

export function TrailCursor({ children, className, trailLength = 20 }: TrailCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);
  const sparkleIdRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const hueRef = useRef(0);
  const timeRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Different spring configs for leading cursor elements
  const fastSpring = { stiffness: 400, damping: 25, mass: 0.5 };
  const slowSpring = { stiffness: 150, damping: 20, mass: 0.8 };
  
  const leadX = useSpring(mouseX, fastSpring);
  const leadY = useSpring(mouseY, fastSpring);
  const lagX = useSpring(mouseX, slowSpring);
  const lagY = useSpring(mouseY, slowSpring);

  // Rainbow color cycle
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    hueRef.current = (timeRef.current * 50) % 360;
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Calculate velocity
    const dx = x - lastPosRef.current.x;
    const dy = y - lastPosRef.current.y;
    const dt = Math.max(now - lastPosRef.current.time, 1);
    const velocity = Math.sqrt(dx * dx + dy * dy) / dt * 10;
    
    // Add new trail point with spring lag
    const newPoint: TrailPoint = {
      id: idRef.current++,
      x,
      y,
      timestamp: now,
      velocity: Math.min(velocity, 5),
      hue: hueRef.current,
    };
    
    setTrail(prev => [...prev.slice(-(trailLength - 1)), newPoint]);
    
    // Spawn sparkles occasionally
    if (Math.random() < 0.3 && velocity > 0.5) {
      const sparkle: Sparkle = {
        id: sparkleIdRef.current++,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        hue: hueRef.current,
      };
      setSparkles(prev => [...prev.slice(-15), sparkle]);
    }
    
    lastPosRef.current = { x, y, time: now };
  }, [mouseX, mouseY, trailLength]);

  // Clean up old sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => prev.slice(-10));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
    >
      {trail.map((point, index) => {
        const progress = index / trail.length;
        const baseSize = 8 + progress * 16;
        const velocityScale = 1 + point.velocity * 0.3;
        const size = baseSize * velocityScale;
        const opacity = 0.2 + progress * 0.6;
        
        return (
          <motion.div
            key={point.id}
            className="pointer-events-none absolute rounded-full"
            initial={{ opacity: opacity, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              left: point.x,
              top: point.y,
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, hsla(${point.hue}, 80%, 60%, 0.9) 0%, hsla(${point.hue + 30}, 70%, 50%, 0.5) 70%, transparent 100%)`,
              boxShadow: `0 0 ${size * 0.5}px hsla(${point.hue}, 80%, 60%, 0.5)`,
            }}
          />
        );
      })}

      <svg className="pointer-events-none absolute inset-0 z-20" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {trail.slice(-10).map((point, i, arr) => (
              <stop
                key={point.id}
                offset={`${(i / (arr.length - 1)) * 100}%`}
                stopColor={`hsla(${point.hue}, 80%, 60%, ${0.3 + (i / arr.length) * 0.4})`}
              />
            ))}
          </linearGradient>
        </defs>
        {trail.length > 1 && (
          <motion.path
            d={trail.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            style={{ filter: "blur(1px)" }}
          />
        )}
      </svg>

      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="pointer-events-none absolute z-30"
          initial={{ opacity: 1, scale: 1, rotate: sparkle.rotation }}
          animate={{ opacity: 0, scale: 0, rotate: sparkle.rotation + 180 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z"
              fill={`hsla(${sparkle.hue}, 85%, 70%, 0.9)`}
              style={{ filter: `drop-shadow(0 0 3px hsla(${sparkle.hue}, 85%, 70%, 0.8))` }}
            />
          </svg>
        </motion.div>
      ))}
      <motion.div
        className="pointer-events-none absolute z-40 rounded-full"
        style={{
          x: lagX,
          y: lagY,
          translateX: "-50%",
          translateY: "-50%",
          width: 30,
          height: 30,
          background: `radial-gradient(circle, hsla(${hueRef.current + 60}, 80%, 70%, 0.6), transparent)`,
          filter: "blur(8px)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute z-50 rounded-full"
        style={{
          x: leadX,
          y: leadY,
          translateX: "-50%",
          translateY: "-50%",
          width: 16,
          height: 16,
          background: `radial-gradient(circle, white 0%, hsla(${hueRef.current}, 80%, 60%, 0.9) 70%)`,
          boxShadow: `0 0 15px 5px hsla(${hueRef.current}, 80%, 60%, 0.5)`,
        }}
      />

      <motion.div
        className="pointer-events-none absolute z-50 rounded-full bg-white"
        style={{
          x: leadX,
          y: leadY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
