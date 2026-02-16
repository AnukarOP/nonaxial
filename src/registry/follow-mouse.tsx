"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FollowMouseProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  timestamp: number;
}

export function FollowMouse({ children, className, strength = 0.1 }: FollowMouseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);
  const lastParticleTime = useRef(0);

  // Motion values for spring physics
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  // Multiple spring layers for complex lag effect
  const springConfig1 = { stiffness: 50, damping: 20, mass: 0.5 };
  const springConfig2 = { stiffness: 30, damping: 15, mass: 1 };
  const springConfig3 = { stiffness: 20, damping: 12, mass: 1.5 };

  const springX1 = useSpring(targetX, springConfig1);
  const springY1 = useSpring(targetY, springConfig1);
  const springX2 = useSpring(springX1, springConfig2);
  const springY2 = useSpring(springY1, springConfig2);
  const springX3 = useSpring(springX2, springConfig3);
  const springY3 = useSpring(springY2, springConfig3);

  // Glow intensity based on movement speed
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const glowIntensity = useTransform(
    [velocityX, velocityY],
    ([vx, vy]) => Math.min(1, (Math.abs(Number(vx)) + Math.abs(Number(vy))) / 50)
  );
  const springGlow = useSpring(glowIntensity, { stiffness: 100, damping: 20 });

  // Track velocity for glow effect
  const lastPos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const unsubX = springX1.on("change", (v) => {
      velocityX.set(v - lastPos.current.x);
      lastPos.current.x = v;
    });
    const unsubY = springY1.on("change", (v) => {
      velocityY.set(v - lastPos.current.y);
      lastPos.current.y = v;
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX1, springY1, velocityX, velocityY]);

  // Spawn trail particles
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const currentX = springX1.get();
      const currentY = springY1.get();

      // Update existing particles
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            scale: p.scale * 0.92,
            opacity: p.opacity * 0.9,
          }))
          .filter(p => p.opacity > 0.05)
      );

      // Add new particle if moving
      if (
        now - lastParticleTime.current > 30 &&
        (Math.abs(currentX) > 2 || Math.abs(currentY) > 2)
      ) {
        lastParticleTime.current = now;
        setParticles(prev => [
          ...prev.slice(-20),
          {
            id: particleIdRef.current++,
            x: currentX,
            y: currentY,
            scale: 1,
            opacity: 0.8,
            timestamp: now,
          },
        ]);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isActive, springX1, springY1]);

  // Update element center position
  useEffect(() => {
    const updateCenter = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setElementCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };
    updateCenter();
    window.addEventListener("resize", updateCenter);
    window.addEventListener("scroll", updateCenter);
    return () => {
      window.removeEventListener("resize", updateCenter);
      window.removeEventListener("scroll", updateCenter);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) * strength;
      const offsetY = (e.clientY - centerY) * strength;

      targetX.set(offsetX);
      targetY.set(offsetY);
      setMousePos({ x: e.clientX, y: e.clientY });
      setElementCenter({ x: centerX + offsetX, y: centerY + offsetY });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
      targetX.set(0);
      targetY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, targetX, targetY]);

  // Calculate connection line angle and length
  const lineAngle = Math.atan2(
    mousePos.y - elementCenter.y,
    mousePos.x - elementCenter.x
  ) * (180 / Math.PI);
  const lineLength = Math.sqrt(
    Math.pow(mousePos.x - elementCenter.x, 2) +
    Math.pow(mousePos.y - elementCenter.y, 2)
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: particle.opacity,
                scale: particle.scale,
                x: particle.x,
                y: particle.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                width: 8,
                height: 8,
                background: `radial-gradient(circle, rgba(139, 92, 246, ${particle.opacity}), rgba(59, 130, 246, ${particle.opacity * 0.5}))`,
                boxShadow: `0 0 ${10 * particle.scale}px rgba(139, 92, 246, ${particle.opacity * 0.5})`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      {isActive && lineLength > 20 && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: Math.min(lineLength * 0.6, 150),
            height: 2,
            x: springX1,
            y: springY1,
            rotate: lineAngle,
            transformOrigin: "left center",
            background: `linear-gradient(90deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.3), transparent)`,
            opacity: Math.min(lineLength / 200, 0.8),
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ x: springX3, y: springY3 }}
      >
        <div
          className="absolute inset-0 rounded-lg opacity-10"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ x: springX2, y: springY2 }}
      >
        <div
          className="absolute inset-0 rounded-lg opacity-20"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4))",
            filter: "blur(4px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{
          x: springX1,
          y: springY1,
        }}
        className="relative z-10"
      >
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: useTransform(
              springGlow,
              (g) => `0 0 ${20 + g * 40}px rgba(139, 92, 246, ${0.2 + g * 0.4}), 
                      0 0 ${40 + g * 60}px rgba(59, 130, 246, ${0.1 + g * 0.3})`
            ),
          }}
        />
        {children}
      </motion.div>
      {isActive && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            x: springX1,
            y: springY1,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <motion.div
            className="w-16 h-16 rounded-full border border-purple-400/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
