"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElasticDragProps {
  children: React.ReactNode;
  className?: string;
  elasticity?: number;
}

interface SnapParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
}

interface BounceTrail {
  id: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

export function ElasticDrag({ children, className, elasticity = 0.2 }: ElasticDragProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapParticles, setSnapParticles] = useState<SnapParticle[]>([]);
  const [bounceTrail, setBounceTrail] = useState<BounceTrail[]>([]);
  const particleIdRef = useRef(0);
  const trailIdRef = useRef(0);

  // Motion values for position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring config for rubber band effect
  const rubberSpringConfig = { damping: 8, stiffness: 100, mass: 0.8 };
  const springX = useSpring(x, rubberSpringConfig);
  const springY = useSpring(y, rubberSpringConfig);

  // Stretch transforms based on drag distance
  const stretchX = useTransform(x, [-200, 0, 200], [0.85, 1, 0.85]);
  const stretchY = useTransform(y, [-200, 0, 200], [0.85, 1, 0.85]);
  const skewX = useTransform(x, [-200, 0, 200], [-5, 0, 5]);
  const skewY = useTransform(y, [-200, 0, 200], [-5, 0, 5]);

  // Rotation based on drag
  const rotateZ = useTransform(
    [x, y],
    ([px, py]) => (Number(px) + Number(py)) * 0.05
  );

  // Spring versions for smooth animations
  const springStretchX = useSpring(stretchX, { stiffness: 200, damping: 15 });
  const springStretchY = useSpring(stretchY, { stiffness: 200, damping: 15 });
  const springSkewX = useSpring(skewX, { stiffness: 150, damping: 20 });
  const springSkewY = useSpring(skewY, { stiffness: 150, damping: 20 });
  const springRotateZ = useSpring(rotateZ, { stiffness: 100, damping: 10 });

  // Glow based on stretch
  const stretchAmount = useTransform(
    [x, y],
    ([px, py]) => Math.sqrt(Number(px) ** 2 + Number(py) ** 2)
  );
  const glowOpacity = useTransform(stretchAmount, [0, 150], [0, 0.8]);
  const springGlow = useSpring(glowOpacity, { stiffness: 100, damping: 20 });

  // Rubber band line visualization
  const bandLength = useTransform(stretchAmount, (d) => Math.min(d, 200));
  const bandAngle = useTransform([x, y], ([px, py]) =>
    Math.atan2(Number(py), Number(px)) * (180 / Math.PI)
  );

  // Spawn snap-back particles when released
  const spawnSnapParticles = useCallback((currentX: number, currentY: number) => {
    const particleCount = Math.min(Math.floor(Math.sqrt(currentX ** 2 + currentY ** 2) / 10), 15);
    const newParticles: SnapParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;
      newParticles.push({
        id: particleIdRef.current++,
        x: currentX * 0.3,
        y: currentY * 0.3,
        vx: Math.cos(angle) * speed + currentX * 0.02,
        vy: Math.sin(angle) * speed + currentY * 0.02,
        scale: 0.5 + Math.random() * 1,
        opacity: 0.8,
      });
    }
    setSnapParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Spawn bounce trail during drag
  const spawnBounceTrail = useCallback((currentX: number, currentY: number) => {
    setBounceTrail(prev => [
      ...prev.slice(-10),
      {
        id: trailIdRef.current++,
        x: currentX,
        y: currentY,
        scaleX: 1 + Math.abs(currentX) * 0.003,
        scaleY: 1 + Math.abs(currentY) * 0.003,
        opacity: 0.4,
      },
    ]);
  }, []);

  // Animate particles
  useEffect(() => {
    if (snapParticles.length === 0) return;

    const interval = setInterval(() => {
      setSnapParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * 0.95,
            vy: p.vy * 0.95,
            scale: p.scale * 0.92,
            opacity: p.opacity * 0.9,
          }))
          .filter(p => p.opacity > 0.05)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [snapParticles.length]);

  // Fade bounce trail
  useEffect(() => {
    if (bounceTrail.length === 0) return;

    const interval = setInterval(() => {
      setBounceTrail(prev =>
        prev
          .map(t => ({ ...t, opacity: t.opacity * 0.85 }))
          .filter(t => t.opacity > 0.02)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [bounceTrail.length]);

  // Track drag for trail
  useEffect(() => {
    if (!isDragging) return;

    const interval = setInterval(() => {
      const currentX = x.get();
      const currentY = y.get();
      if (Math.abs(currentX) > 10 || Math.abs(currentY) > 10) {
        spawnBounceTrail(currentX, currentY);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isDragging, x, y, spawnBounceTrail]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback((_: any, info: { offset: { x: number; y: number } }) => {
    x.set(info.offset.x);
    y.set(info.offset.y);
  }, [x, y]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const currentX = x.get();
    const currentY = y.get();

    // Spawn particles on release
    if (Math.abs(currentX) > 20 || Math.abs(currentY) > 20) {
      spawnSnapParticles(currentX, currentY);
    }

    x.set(0);
    y.set(0);
  }, [x, y, spawnSnapParticles]);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {bounceTrail.map((trail) => (
            <motion.div
              key={trail.id}
              className="absolute rounded-lg"
              initial={{ opacity: 0 }}
              animate={{
                opacity: trail.opacity,
                x: trail.x,
                y: trail.y,
                scaleX: trail.scaleX,
                scaleY: trail.scaleY,
              }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(236, 72, 153, 0.3)",
                background: `radial-gradient(ellipse, rgba(236, 72, 153, ${trail.opacity * 0.1}), transparent)`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      {isDragging && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: bandLength,
            height: 3,
            rotate: bandAngle,
            transformOrigin: "left center",
            background: `linear-gradient(90deg, 
              rgba(236, 72, 153, 0.8) 0%, 
              rgba(139, 92, 246, 0.6) 50%,
              rgba(236, 72, 153, 0.4) 100%)`,
            boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
            borderRadius: 2,
          }}
        >
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-400"
            style={{
              boxShadow: "0 0 8px rgba(236, 72, 153, 0.8)",
            }}
          />
        </motion.div>
      )}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {snapParticles.map((particle) => (
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
                width: 6,
                height: 6,
                background: `radial-gradient(circle, rgba(236, 72, 153, ${particle.opacity}), rgba(139, 92, 246, ${particle.opacity * 0.5}))`,
                boxShadow: `0 0 ${8 * particle.scale}px rgba(236, 72, 153, ${particle.opacity * 0.6})`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          x: springX,
          y: springY,
          scaleX: springStretchX,
          scaleY: springStretchY,
          opacity: 0.3,
          background: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))",
          filter: "blur(8px)",
        }}
      />
      <motion.div
        ref={ref}
        className={cn("cursor-grab active:cursor-grabbing relative z-10")}
        drag
        dragElastic={elasticity}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x: springX,
          y: springY,
          scaleX: springStretchX,
          scaleY: springStretchY,
          skewX: springSkewX,
          skewY: springSkewY,
          rotate: springRotateZ,
        }}
        whileDrag={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: useTransform(
              springGlow,
              (g) => `0 0 ${20 + g * 30}px rgba(236, 72, 153, ${g * 0.5}), 
                      0 0 ${40 + g * 50}px rgba(139, 92, 246, ${g * 0.3}),
                      inset 0 0 ${10 + g * 20}px rgba(236, 72, 153, ${g * 0.2})`
            ),
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
          style={{ opacity: springGlow }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                ${90 + springSkewX.get() * 2}deg,
                transparent 0%,
                rgba(236, 72, 153, 0.1) 30%,
                rgba(139, 92, 246, 0.15) 50%,
                rgba(236, 72, 153, 0.1) 70%,
                transparent 100%
              )`,
            }}
          />
        </motion.div>

        {children}
      </motion.div>
      {isDragging && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <motion.div
            className="w-4 h-4 rounded-full border-2 border-pink-400/50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400/60" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
