"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCursorProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

interface LensFlare {
  offset: number;
  size: number;
  opacity: number;
  color: string;
}

export function GlowCursor({ children, className, color = "rgba(139, 92, 246, 0.5)" }: GlowCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 25 };
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
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  // Lens flares configuration
  const lensFlares: LensFlare[] = [
    { offset: 0.3, size: 20, opacity: 0.4, color: "rgba(255, 100, 100, 0.6)" },
    { offset: 0.5, size: 15, opacity: 0.3, color: "rgba(100, 255, 100, 0.5)" },
    { offset: 0.7, size: 25, opacity: 0.35, color: "rgba(100, 100, 255, 0.5)" },
    { offset: 0.9, size: 10, opacity: 0.25, color: "rgba(255, 255, 100, 0.4)" },
    { offset: 1.2, size: 30, opacity: 0.2, color: "rgba(255, 100, 255, 0.3)" },
  ];

  // Pulse animation
  const [pulse, setPulse] = useState(1);
  const [pulseOpacity, setPulseOpacity] = useState(0.5);
  useEffect(() => {
    let frame: number;
    const animate = (t: number) => {
      setPulse(Math.sin(t * 0.002) * 0.15 + 1);
      setPulseOpacity(Math.sin(t * 0.0015) * 0.1 + 0.5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Precompute lens flare positions
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        w: containerRef.current.clientWidth,
        h: containerRef.current.clientHeight,
      });
    }
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          left: cursorPos.x,
          top: cursorPos.y,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${color.replace("0.5", "0.2")} 0%, transparent 70%)`,
          filter: "blur(40px)",
          scale: pulse,
          opacity: isHovering ? pulseOpacity : 0,
        }}
      />
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          left: cursorPos.x,
          top: cursorPos.y,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${color.replace("0.5", "0.4")} 0%, transparent 60%)`,
          filter: "blur(25px)",
          opacity: isHovering ? 0.8 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          left: cursorPos.x,
          top: cursorPos.y,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, ${color} 30%, transparent 70%)`,
          filter: "blur(15px)",
          opacity: isHovering ? 1 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 30,
          height: 30,
          left: cursorPos.x,
          top: cursorPos.y,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.5), 0 0 60px 20px rgba(139, 92, 246, 0.4)",
          opacity: isHovering ? 1 : 0,
        }}
      />
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
          {[0, 45, 90, 135].map((angle) => (
            <motion.div
              key={angle}
              className="absolute"
              style={{
                width: 2,
                height: 80,
                left: "50%",
                top: "50%",
                background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent)`,
                transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                transformOrigin: "bottom center",
                opacity: 0.4,
              }}
              animate={{
                height: [80, 100, 80],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: angle * 0.01,
              }}
            />
          ))}
        </motion.div>
      )}
      {isHovering && lensFlares.map((flare, index) => {
        // Calculate flare position based on offset from center
        const cx = containerSize.w / 2;
        const cy = containerSize.h / 2;
        const fx = cx + (cursorPos.x - cx) * flare.offset;
        const fy = cy + (cursorPos.y - cy) * flare.offset;
        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: flare.size,
              height: flare.size,
              left: fx,
              top: fy,
              translateX: "-50%",
              translateY: "-50%",
              backgroundColor: flare.color,
              filter: "blur(3px)",
              opacity: flare.opacity,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          />
        );
      })}
      {isHovering && (
        (() => {
          const cx = containerSize.w / 2;
          const cy = containerSize.h / 2;
          const fx = cx + (cursorPos.x - cx) * 0.6;
          const fy = cy + (cursorPos.y - cy) * 0.6;
          return (
            <motion.div
              className="pointer-events-none absolute"
              style={{
                left: fx,
                top: fy,
                translateX: "-50%",
                translateY: "-50%",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon
                  points="20,2 35,10 35,30 20,38 5,30 5,10"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
          );
        })()
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
