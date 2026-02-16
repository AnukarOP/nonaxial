"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  
  // Multi-layer parallax transforms
  const layer1Y = useTransform(scrollYProgress, [0, 1], [150 * speed * multiplier, -150 * speed * multiplier]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [50 * speed * multiplier, -50 * speed * multiplier]);
  const contentY = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  
  // Spring physics for smooth parallax
  const springConfig = { stiffness: 50, damping: 20 };
  const springLayer1 = useSpring(layer1Y, springConfig);
  const springLayer2 = useSpring(layer2Y, springConfig);
  const springLayer3 = useSpring(layer3Y, springConfig);
  const springContent = useSpring(contentY, springConfig);

  // Depth fog opacity based on scroll
  const fogOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.1, 0.3]);

  // Ambient glow intensity
  const glowIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  // Initialize particles
  useEffect(() => {
    const newParticles: FloatingParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.2 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Mouse tracking for interactive ambient glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate floating particles
  useAnimationFrame(() => {
    setParticles(prev => prev.map(p => ({
      ...p,
      y: p.y - p.speed < 0 ? 100 : p.y - p.speed,
      x: p.x + p.drift,
    })));
  });

  // Generate depth layers with different visual effects
  const depthLayers = useMemo(() => [
    { blur: 8, opacity: 0.3, scale: 1.1, color: "rgba(139, 92, 246, 0.1)" },
    { blur: 4, opacity: 0.5, scale: 1.05, color: "rgba(236, 72, 153, 0.08)" },
    { blur: 2, opacity: 0.7, scale: 1.02, color: "rgba(59, 130, 246, 0.06)" },
  ], []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 -z-30"
        style={{ y: springLayer1 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${depthLayers[0].color}, transparent 50%)`,
            filter: `blur(${depthLayers[0].blur}px)`,
            opacity: depthLayers[0].opacity,
            transform: `scale(${depthLayers[0].scale})`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 -z-20"
        style={{ y: springLayer2 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 70% 60%, ${depthLayers[1].color}, transparent 50%)`,
            filter: `blur(${depthLayers[1].blur}px)`,
            opacity: depthLayers[1].opacity,
            transform: `scale(${depthLayers[1].scale})`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: springLayer3 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${depthLayers[2].color}, transparent 50%)`,
            filter: `blur(${depthLayers[2].blur}px)`,
            opacity: depthLayers[2].opacity,
            transform: `scale(${depthLayers[2].scale})`,
          }}
        />
      </motion.div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        <defs>
          <filter id="parallaxParticleGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill={particle.id % 3 === 0 
              ? "rgba(139, 92, 246, 0.7)" 
              : particle.id % 3 === 1 
                ? "rgba(236, 72, 153, 0.7)" 
                : "rgba(59, 130, 246, 0.7)"
            }
            filter="url(#parallaxParticleGlow)"
            opacity={particle.opacity}
            style={{
              // Particles at different depths move at different speeds
              transform: `translateY(${(particle.id % 3) * 10}px)`,
            }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute inset-0 pointer-events-none z-15"
        style={{
          background: `linear-gradient(
            to ${direction === "up" ? "top" : "bottom"},
            transparent 0%,
            rgba(0, 0, 0, 0.1) 30%,
            transparent 60%,
            rgba(0, 0, 0, 0.05) 100%
          )`,
          opacity: fogOpacity,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(
            circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(139, 92, 246, 0.15),
            transparent 40%
          )`,
          opacity: glowIntensity,
        }}
      />
      <motion.div
        className="absolute top-0 inset-x-0 h-px z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5), transparent)",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-px z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.5), transparent)",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-40 h-40 pointer-events-none z-5"
          style={{
            top: i < 2 ? "-20px" : "auto",
            bottom: i >= 2 ? "-20px" : "auto",
            left: i % 2 === 0 ? "-20px" : "auto",
            right: i % 2 === 1 ? "-20px" : "auto",
            background: `radial-gradient(circle, 
              ${i % 2 === 0 ? "rgba(139, 92, 246, 0.2)" : "rgba(236, 72, 153, 0.2)"}, 
              transparent 70%
            )`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
      <motion.div 
        style={{ y: springContent }}
        className="relative z-30"
      >
        {children}
      </motion.div>
    </div>
  );
}
