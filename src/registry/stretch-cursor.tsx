"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface StretchCursorProps {
  children: React.ReactNode;
  className?: string;
}

interface MotionBlurSegment {
  id: number;
  x: number;
  y: number;
  angle: number;
  stretch: number;
}

export function StretchCursor({ children, className }: StretchCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [motionBlurSegments, setMotionBlurSegments] = useState<MotionBlurSegment[]>([]);
  const segmentIdRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  
  // Spring configs for squash and stretch
  const positionSpring = { stiffness: 200, damping: 20 };
  const stretchSpring = { stiffness: 300, damping: 15 };
  
  const springX = useSpring(mouseX, positionSpring);
  const springY = useSpring(mouseY, positionSpring);
  
  // Stretch/Squash values
  const stretchX = useSpring(1, stretchSpring);
  const stretchY = useSpring(1, stretchSpring);
  const rotation = useSpring(0, { stiffness: 150, damping: 20 });
  
  // Calculate total velocity magnitude for effects
  const speed = useTransform([velocityX, velocityY], ([vx, vy]) => {
    return Math.sqrt((vx as number) ** 2 + (vy as number) ** 2);
  });

  // Animation frame for physics simulation
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    
    // Decay velocity smoothly
    velocityRef.current.x *= 0.95;
    velocityRef.current.y *= 0.95;
    
    velocityX.set(velocityRef.current.x);
    velocityY.set(velocityRef.current.y);
    
    // Calculate stretch based on velocity
    const vel = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
    const stretchFactor = Math.min(vel * 0.02 + 1, 2.5);
    const squashFactor = Math.max(1 / stretchFactor, 0.5);
    
    // Calculate rotation based on movement direction
    if (vel > 0.5) {
      const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x) * (180 / Math.PI);
      rotation.set(angle);
    }
    
    stretchX.set(stretchFactor);
    stretchY.set(squashFactor);
    
    // Clean up old motion blur segments
    setMotionBlurSegments(prev => prev.slice(-8));
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    
    // Calculate velocity
    const dt = Math.max(now - lastPosRef.current.time, 1);
    const vx = (x - lastPosRef.current.x) / dt * 16;
    const vy = (y - lastPosRef.current.y) / dt * 16;
    
    velocityRef.current = { x: vx, y: vy };
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Add motion blur segment on fast movement
    const vel = Math.sqrt(vx * vx + vy * vy);
    if (vel > 5) {
      const segment: MotionBlurSegment = {
        id: segmentIdRef.current++,
        x: lastPosRef.current.x,
        y: lastPosRef.current.y,
        angle: Math.atan2(vy, vx) * (180 / Math.PI),
        stretch: Math.min(vel * 0.5, 30),
      };
      setMotionBlurSegments(prev => [...prev, segment]);
    }
    
    lastPosRef.current = { x, y, time: now };
  }, [mouseX, mouseY]);

  // Calculate cursor scale based on direction
  const cursorScaleX = useTransform(stretchX, s => s);
  const cursorScaleY = useTransform(stretchY, s => s);
  const cursorRotation = useTransform(rotation, r => r);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
    >
      {motionBlurSegments.map((segment, index) => (
        <motion.div
          key={segment.id}
          className="pointer-events-none absolute"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            left: segment.x,
            top: segment.y,
            transform: `translate(-50%, -50%) rotate(${segment.angle}deg)`,
          }}
        >
          <div
            className="rounded-full bg-violet-400/40"
            style={{
              width: 24 + segment.stretch,
              height: 16,
              filter: `blur(${3 + segment.stretch * 0.2}px)`,
            }}
          />
        </motion.div>
      ))}

      <motion.div
        className="pointer-events-none absolute z-40"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scaleX: cursorScaleX,
          scaleY: cursorScaleY,
          rotate: cursorRotation,
        }}
      >
        <div
          className="rounded-full bg-violet-500/20"
          style={{
            width: 50,
            height: 50,
            filter: "blur(15px)",
          }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute z-50"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scaleX: cursorScaleX,
          scaleY: cursorScaleY,
          rotate: cursorRotation,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 32,
            height: 32,
            background: `radial-gradient(ellipse at center, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(139, 92, 246, 0.9) 40%, 
              rgba(109, 40, 217, 0.8) 70%, 
              rgba(91, 33, 182, 0.4) 100%
            )`,
            boxShadow: `
              0 0 15px rgba(139, 92, 246, 0.6),
              0 0 30px rgba(139, 92, 246, 0.3)
            `,
          }}
        />
      </motion.div>

      {/* Inner core (doesn't stretch as much) */}
      <motion.div
        className="pointer-events-none absolute z-50 rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scaleX: useTransform(cursorScaleX, s => 1 + (s - 1) * 0.3),
          scaleY: useTransform(cursorScaleY, s => 1 + (s - 1) * 0.3),
          rotate: cursorRotation,
          width: 12,
          height: 12,
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute z-45"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: cursorRotation,
          opacity: useTransform(speed, [0, 10, 50], [0, 0, 0.6]),
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            marginLeft: 25,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: "10px solid rgba(139, 92, 246, 0.6)",
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-40 rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 40,
          height: 40,
          border: "2px solid rgba(139, 92, 246, 0.3)",
          scaleX: useTransform(cursorScaleY, s => s), // Inverted for squash effect
          scaleY: useTransform(cursorScaleX, s => s),
          rotate: cursorRotation,
          opacity: useTransform(speed, [0, 5, 20], [0, 0, 0.5]),
        }}
      />
      <motion.div
        className="pointer-events-none absolute z-35"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: cursorRotation,
          opacity: useTransform(speed, [0, 10, 40], [0, 0, 0.4]),
        }}
      >
        {[-8, 0, 8].map((offset) => (
          <motion.div
            key={offset}
            className="absolute bg-violet-400/50"
            style={{
              width: useTransform(speed, [0, 50], [0, 20]),
              height: 2,
              right: 20,
              top: offset,
              borderRadius: 1,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
