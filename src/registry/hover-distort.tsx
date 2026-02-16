"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverDistortProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function HoverDistort({ children, className, intensity = 10 }: HoverDistortProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [noiseOffset, setNoiseOffset] = useState({ x: 0, y: 0 });
  const rippleIdRef = useRef(0);
  const lastRippleTime = useRef(0);

  // Motion values for smooth transforms
  const skewX = useMotionValue(0);
  const skewY = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Color shift values
  const hueRotate = useMotionValue(0);
  const saturate = useMotionValue(1);

  // Spring configurations for liquid feel
  const liquidSpring = { stiffness: 200, damping: 25, mass: 0.5 };
  const springSkewX = useSpring(skewX, liquidSpring);
  const springSkewY = useSpring(skewY, liquidSpring);
  const springScaleX = useSpring(scaleX, liquidSpring);
  const springScaleY = useSpring(scaleY, liquidSpring);
  const springHue = useSpring(hueRotate, { stiffness: 100, damping: 20 });
  const springSaturate = useSpring(saturate, { stiffness: 100, damping: 20 });

  // Liquid wave displacement
  const waveX = useTransform(springSkewX, [-intensity, intensity], [-3, 3]);
  const waveY = useTransform(springSkewY, [-intensity, intensity], [-3, 3]);

  // Noise displacement animation
  useEffect(() => {
    if (!isHovered) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      const noiseX = Math.sin(time * 2) * 2 + Math.sin(time * 3.7) * 1.5;
      const noiseY = Math.cos(time * 2.3) * 2 + Math.cos(time * 3.2) * 1.5;
      setNoiseOffset({ x: noiseX, y: noiseY });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  // Clean up old ripples
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRipples(prev => prev.filter(r => now - r.timestamp < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);

    // Liquid distortion
    skewX.set(x * intensity);
    skewY.set(y * intensity * 0.5);
    scaleX.set(1 + Math.abs(x) * 0.15);
    scaleY.set(1 + Math.abs(y) * 0.15);

    // Color shift based on position
    hueRotate.set(x * 30);
    saturate.set(1 + Math.abs(y) * 0.3);

    // Spawn ripple on significant movement
    const now = Date.now();
    if (now - lastRippleTime.current > 150) {
      lastRippleTime.current = now;
      const rippleX = (e.clientX - rect.left) / rect.width * 100;
      const rippleY = (e.clientY - rect.top) / rect.height * 100;
      setRipples(prev => [
        ...prev.slice(-5),
        { id: rippleIdRef.current++, x: rippleX, y: rippleY, timestamp: now }
      ]);
    }
  }, [intensity, skewX, skewY, scaleX, scaleY, hueRotate, saturate, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    skewX.set(0);
    skewY.set(0);
    scaleX.set(1);
    scaleY.set(1);
    hueRotate.set(0);
    saturate.set(1);
    setNoiseOffset({ x: 0, y: 0 });
  }, [skewX, skewY, scaleX, scaleY, hueRotate, saturate]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        skewX: springSkewX,
        skewY: springSkewY,
        scaleX: springScaleX,
        scaleY: springScaleY,
        filter: useTransform(
          [springHue, springSaturate],
          ([hue, sat]) => `hue-rotate(${hue}deg) saturate(${sat})`
        ),
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: isHovered ? noiseOffset.x : 0,
          y: isHovered ? noiseOffset.y : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, 
              rgba(139, 92, 246, 0.3), transparent 50%)`,
          }}
        />
      </motion.div>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full border-2 border-purple-400/50"
            initial={{ 
              width: 0, 
              height: 0, 
              x: `${ripple.x}%`, 
              y: `${ripple.y}%`,
              opacity: 0.8,
            }}
            animate={{ 
              width: 200, 
              height: 200, 
              x: `calc(${ripple.x}% - 100px)`, 
              y: `calc(${ripple.y}% - 100px)`,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
            }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            ${45 + springSkewX.get() * 2}deg,
            transparent 0%,
            rgba(139, 92, 246, 0.1) 25%,
            transparent 50%,
            rgba(59, 130, 246, 0.1) 75%,
            transparent 100%
          )`,
          x: waveX,
          y: waveY,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        animate={{
          background: isHovered
            ? `radial-gradient(ellipse 80% 80% at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, 
                rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.2), transparent)`
            : "transparent",
        }}
        transition={{ duration: 0.2 }}
      />
      <div className="relative z-10">{children}</div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: useTransform(
            [springSkewX, springSkewY],
            ([sx, sy]) => `inset 0 0 ${Math.abs(Number(sx)) + Math.abs(Number(sy))}px rgba(139, 92, 246, 0.2)`
          ),
        }}
      />
    </motion.div>
  );
}
