"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealCardProps {
  children: React.ReactNode;
  className?: string;
  revealContent?: React.ReactNode;
}

interface RevealParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

export function RevealCard({ children, className, revealContent }: RevealCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for smooth reveal
  const revealProgress = useSpring(0, { stiffness: 80, damping: 15, mass: 1 });
  const blurAmount = useSpring(0, { stiffness: 100, damping: 20 });

  // Particles for curtain edge
  const particles = useMemo((): RevealParticle[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: 2 + ((Math.sin(i * 5.3) + 1) / 2) * 4,
      speed: 0.3 + ((Math.sin(i * 7.1) + 1) / 2) * 0.5,
      delay: ((Math.sin(i * 2.9) + 1) / 2) * 0.3,
    }));
  }, []);

  useEffect(() => {
    revealProgress.set(isHovered ? 1 : 0);
    blurAmount.set(isHovered ? 10 : 0);
  }, [isHovered, revealProgress, blurAmount]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  // Transform for curtain positions
  const leftCurtain = useTransform(revealProgress, [0, 1], ["0%", "-52%"]);
  const rightCurtain = useTransform(revealProgress, [0, 1], ["0%", "52%"]);
  const contentBlur = useTransform(blurAmount, v => `blur(${10 - v}px)`);
  const contentOpacity = useTransform(revealProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          filter: contentBlur,
          opacity: contentOpacity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {revealContent || (
            <div className="text-center">
              <motion.div
                className="text-4xl mb-4"
                animate={isHovered ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.div>
              <p className="text-white font-semibold text-lg">Content Revealed!</p>
              <p className="text-white/60 text-sm mt-2">Hidden content is now visible</p>
            </div>
          )}
        </div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 60% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(139, 92, 246, 0.3) 0%,
              transparent 60%
            )`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-20"
        style={{ x: leftCurtain }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.1) 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 2px,
                transparent 8px
              )`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(0, 0, 0, 0.2) 30%,
                transparent 50%,
                rgba(0, 0, 0, 0.15) 70%,
                rgba(0, 0, 0, 0.3) 100%
              )`,
            }}
          />
          <motion.div
            className="absolute -right-4 inset-y-0 w-8"
            style={{
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(139, 92, 246, 0.5) 100%
              )`,
              filter: "blur(4px)",
              opacity: useTransform(revealProgress, [0, 0.5, 1], [0, 1, 0.5]),
            }}
          />
        </div>
        {particles.slice(0, 15).map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: particle.size,
              height: particle.size,
              right: -particle.size,
              top: `${particle.y}%`,
            }}
            animate={isHovered ? {
              x: [0, -30, -60],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            } : {
              opacity: 0,
            }}
            transition={{
              duration: particle.speed,
              delay: particle.delay,
              repeat: isHovered ? Infinity : 0,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-20"
        style={{ x: rightCurtain }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-violet-600 via-violet-500 to-fuchsia-500">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.1) 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 2px,
                transparent 8px
              )`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                -90deg,
                transparent 0%,
                rgba(0, 0, 0, 0.2) 30%,
                transparent 50%,
                rgba(0, 0, 0, 0.15) 70%,
                rgba(0, 0, 0, 0.3) 100%
              )`,
            }}
          />
          <motion.div
            className="absolute -left-4 inset-y-0 w-8"
            style={{
              background: `linear-gradient(
                -90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(139, 92, 246, 0.5) 100%
              )`,
              filter: "blur(4px)",
              opacity: useTransform(revealProgress, [0, 0.5, 1], [0, 1, 0.5]),
            }}
          />
        </div>
        {particles.slice(15).map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: particle.size,
              height: particle.size,
              left: -particle.size,
              top: `${particle.y}%`,
            }}
            animate={isHovered ? {
              x: [0, 30, 60],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            } : {
              opacity: 0,
            }}
            transition={{
              duration: particle.speed,
              delay: particle.delay,
              repeat: isHovered ? Infinity : 0,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center"
        style={{
          opacity: useTransform(revealProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
        }}
      >
        <div
          className="w-2 h-[120%]"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              rgba(139, 92, 246, 0.8) 20%,
              rgba(255, 255, 255, 0.9) 50%,
              rgba(139, 92, 246, 0.8) 80%,
              transparent 100%
            )`,
            filter: "blur(8px)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-30"
        style={{
          boxShadow: `
            inset 0 0 30px rgba(139, 92, 246, ${isHovered ? 0.3 : 0}),
            0 0 30px rgba(139, 92, 246, ${isHovered ? 0.2 : 0})
          `,
          transition: "box-shadow 0.4s ease",
        }}
      />
    </motion.div>
  );
}
