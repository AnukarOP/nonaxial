"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticCursorProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticCursor({ children, className, strength = 0.5 }: MagneticCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Track cursor position for rendering
  useEffect(() => {
    const unsubX = springX.on("change", (x) => {
      setCursorPos(prev => ({ ...prev, x }));
    });
    const unsubY = springY.on("change", (y) => {
      setCursorPos(prev => ({ ...prev, y }));
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Generate field lines
  const fieldLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { angle, length: 60 };
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && [1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="pointer-events-none absolute rounded-full border border-violet-500/30"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            translateX: "-50%",
            translateY: "-50%",
            width: 30 + ring * 30,
            height: 30 + ring * 30,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ring * 0.2,
          }}
        />
      ))}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <svg width="160" height="160" viewBox="-80 -80 160 160" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="magneticFieldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.7)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
              </linearGradient>
            </defs>
            {fieldLines.map((line, i) => {
              const x1 = Math.cos(line.angle) * 15;
              const y1 = Math.sin(line.angle) * 15;
              const x2 = Math.cos(line.angle) * line.length;
              const y2 = Math.sin(line.angle) * line.length;
              
              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#magneticFieldGradient)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-violet-400/40"
              style={{
                left: "50%",
                top: "50%",
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                width: [100, 20],
                height: [100, 20],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeIn",
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      )}
      <motion.div
        className="pointer-events-none absolute z-50 rounded-full"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          translateX: "-50%",
          translateY: "-50%",
          width: 20,
          height: 20,
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(139, 92, 246, 0.8) 50%, transparent 100%)",
          boxShadow: "0 0 15px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.4)",
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? [1, 1.1, 1] : 1,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 1, repeat: Infinity },
        }}
      />
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-40 rounded-full"
          style={{
            left: cursorPos.x,
            top: cursorPos.y - 30,
            translateX: "-50%",
            translateY: "-50%",
            width: 8,
            height: 8,
            backgroundColor: "rgba(255, 100, 100, 0.8)",
            boxShadow: "0 0 8px rgba(255, 100, 100, 0.6)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-40 rounded-full"
          style={{
            left: cursorPos.x,
            top: cursorPos.y + 30,
            translateX: "-50%",
            translateY: "-50%",
            width: 8,
            height: 8,
            backgroundColor: "rgba(100, 100, 255, 0.8)",
            boxShadow: "0 0 8px rgba(100, 100, 255, 0.6)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
