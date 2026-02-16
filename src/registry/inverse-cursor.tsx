"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface InverseCursorProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

export function InverseCursor({ children, className, size = 100 }: InverseCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const expandScale = useMotionValue(1);
  const hueRotate = useMotionValue(0);
  const featherAmount = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Smoother spring for outer elements
  const smoothSpringConfig = { stiffness: 150, damping: 25 };
  const smoothX = useSpring(mouseX, smoothSpringConfig);
  const smoothY = useSpring(mouseY, smoothSpringConfig);
  
  // Animated scale for expand effect
  const springScale = useSpring(expandScale, { stiffness: 200, damping: 20 });

  // Animation frame for continuous effects
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    
    // Subtle color shift
    hueRotate.set(Math.sin(timeRef.current * 0.5) * 30);
    
    // Feather breathing
    featherAmount.set(10 + Math.sin(timeRef.current * 2) * 5);
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const handleMouseDown = useCallback(() => {
    expandScale.set(2.5);
    setIsExpanded(true);
  }, [expandScale]);

  const handleMouseUp = useCallback(() => {
    expandScale.set(1);
    setIsExpanded(false);
  }, [expandScale]);

  const currentHue = useTransform(hueRotate, h => h);
  const currentFeather = useTransform(featherAmount, f => f);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            width: size * 1.4,
            height: size * 1.4,
            scale: springScale,
            background: `radial-gradient(circle, transparent 40%, rgba(255, 255, 255, 0.1) 60%, transparent 80%)`,
            filter: `blur(${currentFeather.get()}px)`,
            mixBlendMode: "difference",
          }}
        />
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            width: size * 1.2,
            height: size * 1.2,
            scale: springScale,
            mixBlendMode: "hue",
            filter: `hue-rotate(${currentHue.get()}deg)`,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, 
                hsla(${280 + currentHue.get()}, 70%, 50%, 0.3) 0%, 
                hsla(${320 + currentHue.get()}, 60%, 40%, 0.2) 50%, 
                transparent 80%
              )`,
            }}
          />
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: size,
            height: size,
            scale: springScale,
            mixBlendMode: "difference",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, 
                white 0%, 
                rgba(255, 255, 255, 0.95) 30%, 
                rgba(255, 255, 255, 0.8) 60%, 
                rgba(255, 255, 255, 0.4) 80%, 
                transparent 100%
              )`,
            }}
          />
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full bg-white"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: size * 0.3,
            height: size * 0.3,
            scale: springScale,
            mixBlendMode: "difference",
          }}
          animate={{
            scale: isExpanded ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: isExpanded ? Infinity : 0,
          }}
        />
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: size,
            height: size,
            scale: springScale,
            border: "2px solid white",
            mixBlendMode: "exclusion",
          }}
        />
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            width: size * 0.8,
            height: size * 0.8,
            scale: springScale,
            mixBlendMode: "saturation",
            background: "radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%)",
          }}
        />
      )}
      {isHovering && isExpanded && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute rounded-full border border-white mix-blend-difference"
              style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ width: size, height: size, opacity: 0.8 }}
              animate={{ 
                width: size * 3, 
                height: size * 3, 
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: size * 2,
          height: size * 2,
          scale: springScale,
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%)",
          filter: "blur(20px)",
          mixBlendMode: "overlay",
          opacity: isHovering ? 1 : 0,
        }}
      />
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
            className="absolute bg-white mix-blend-difference"
            style={{
              width: 1,
              height: 12,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <motion.div
            className="absolute bg-white mix-blend-difference"
            style={{
              width: 12,
              height: 1,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
