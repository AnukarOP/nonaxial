"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface RingCursorProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

interface PulseWave {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

export function RingCursor({ children, className, size = 50 }: RingCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [pulseWaves, setPulseWaves] = useState<PulseWave[]>([]);
  const pulseIdRef = useRef(0);
  const timeRef = useRef(0);
  const lastClickRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ringRotation = useMotionValue(0);
  const innerRotation = useMotionValue(0);
  const pulseScale = useMotionValue(1);
  const hueShift = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Outer ring with slower spring
  const outerSpringConfig = { stiffness: 150, damping: 20 };
  const outerX = useSpring(mouseX, outerSpringConfig);
  const outerY = useSpring(mouseY, outerSpringConfig);

  // Animation frame for continuous effects
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    
    // Ring rotations
    ringRotation.set(timeRef.current * 30);
    innerRotation.set(-timeRef.current * 50);
    
    // Pulse effect
    pulseScale.set(1 + Math.sin(timeRef.current * 3) * 0.08);
    
    // Hue shift for neon effect
    hueShift.set((timeRef.current * 20) % 360);
    
    // Clean up old pulse waves
    setPulseWaves(prev => prev.filter(wave => timeRef.current - wave.startTime < 1));
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (timeRef.current - lastClickRef.current < 0.3) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const wave: PulseWave = {
      id: pulseIdRef.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      startTime: timeRef.current,
    };
    setPulseWaves(prev => [...prev, wave]);
    lastClickRef.current = timeRef.current;
  }, []);

  const currentHue = useTransform(hueShift, h => h);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      {pulseWaves.map((wave) => (
        <motion.div
          key={wave.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: wave.x,
            top: wave.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: size, height: size, opacity: 0.8, borderWidth: 3 }}
          animate={{ width: size * 6, height: size * 6, opacity: 0, borderWidth: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div
            className="w-full h-full rounded-full border-violet-400"
            style={{
              borderWidth: "inherit",
              borderStyle: "solid",
              boxShadow: `0 0 20px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.2)`,
            }}
          />
        </motion.div>
      ))}

      {/* Outermost ring (most lag, dashed) */}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            x: outerX,
            y: outerY,
            translateX: "-50%",
            translateY: "-50%",
            rotate: ringRotation,
          }}
        >
          <svg width={size * 2.5} height={size * 2.5} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="outerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={`hsla(${currentHue.get()}, 80%, 60%, 0.6)`} />
                <stop offset="50%" stopColor={`hsla(${currentHue.get() + 60}, 80%, 60%, 0.6)`} />
                <stop offset="100%" stopColor={`hsla(${currentHue.get() + 120}, 80%, 60%, 0.6)`} />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#outerRingGradient)"
              strokeWidth="2"
              strokeDasharray="10 5"
              style={{ filter: "blur(1px)" }}
            />
          </svg>
        </motion.div>
      )}

      {/* Second ring (medium lag, dotted) */}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            rotate: innerRotation,
            scale: pulseScale,
          }}
        >
          <svg width={size * 1.8} height={size * 1.8} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={`hsla(${currentHue.get() + 30}, 85%, 65%, 0.7)`}
              strokeWidth="2"
              strokeDasharray="3 6"
            />
          </svg>
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              border: `3px solid hsla(${currentHue.get()}, 80%, 60%, 0.9)`,
              boxShadow: `
                0 0 10px hsla(${currentHue.get()}, 80%, 60%, 0.8),
                0 0 20px hsla(${currentHue.get()}, 80%, 60%, 0.6),
                0 0 30px hsla(${currentHue.get()}, 80%, 60%, 0.4),
                0 0 40px hsla(${currentHue.get()}, 80%, 60%, 0.2),
                inset 0 0 15px hsla(${currentHue.get()}, 80%, 60%, 0.3)
              `,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            rotate: ringRotation,
          }}
        >
          <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`hsla(${currentHue.get() + 60}, 80%, 70%, 0.5)`}
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke={`hsla(${currentHue.get() + 90}, 80%, 70%, 0.4)`}
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-50 rounded-full"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: 8,
            height: 8,
            backgroundColor: `hsla(${currentHue.get()}, 80%, 70%, 1)`,
            boxShadow: `
              0 0 10px hsla(${currentHue.get()}, 80%, 60%, 1),
              0 0 20px hsla(${currentHue.get()}, 80%, 60%, 0.8)
            `,
          }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {isHovering && [0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.25,
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              backgroundColor: `hsla(${currentHue.get() + i * 30}, 80%, 60%, 0.9)`,
              boxShadow: `0 0 8px hsla(${currentHue.get() + i * 30}, 80%, 60%, 0.8)`,
              transform: `translateX(${size * 0.6}px)`,
            }}
          />
        </motion.div>
      ))}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          width: size * 2,
          height: size * 2,
          background: `radial-gradient(circle, hsla(${currentHue.get()}, 70%, 50%, 0.15) 0%, transparent 70%)`,
          filter: "blur(20px)",
          opacity: isHovering ? 1 : 0,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
