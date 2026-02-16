"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBorderCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  borderWidth?: number;
  animate?: boolean;
}

interface EdgeParticle {
  id: number;
  position: number; // 0-1 along the perimeter
  size: number;
  speed: number;
  opacity: number;
  offset: number;
}

export function GradientBorderCard({
  children,
  className,
  gradientColors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
  borderWidth = 2,
  animate = true,
}: GradientBorderCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [gradientAngle, setGradientAngle] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  // Spring for inner glow response
  const glowIntensity = useSpring(0, { stiffness: 150, damping: 20 });

  // Edge particles for trail effect
  const edgeParticles = useMemo((): EdgeParticle[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      position: i / 30,
      size: 3 + Math.random() * 4,
      speed: 0.002 + Math.random() * 0.003,
      opacity: 0.4 + Math.random() * 0.4,
      offset: Math.random() * borderWidth * 2,
    }));
  }, [borderWidth]);

  const [particlePositions, setParticlePositions] = useState<number[]>(
    edgeParticles.map(p => p.position)
  );

  // Animate gradient rotation
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setGradientAngle(prev => (prev + 1) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [animate]);

  // Animate particles along edge
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setParticlePositions(prev =>
        prev.map((pos, i) => (pos + edgeParticles[i].speed) % 1)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered, edgeParticles]);

  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    glowIntensity.set(isHovered ? 1 : 0);
  }, [isHovered, glowIntensity]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
    setDimensions({ width, height });
  };

  // Convert position (0-1) to x,y coordinates along the perimeter
  const getPerimeterPosition = (pos: number) => {
    const { width, height } = dimensions;
    const perimeter = 2 * (width + height);
    const distance = pos * perimeter;

    if (distance < width) {
      // Top edge
      return { x: distance, y: 0 };
    } else if (distance < width + height) {
      // Right edge
      return { x: width, y: distance - width };
    } else if (distance < 2 * width + height) {
      // Bottom edge
      return { x: width - (distance - width - height), y: height };
    } else {
      // Left edge
      return { x: 0, y: height - (distance - 2 * width - height) };
    }
  };

  const gradientString = gradientColors.join(", ");

  return (
    <motion.div
      ref={ref}
      className={cn("relative rounded-xl cursor-pointer", className)}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: borderWidth,
          backgroundImage: `linear-gradient(${gradientAngle}deg, ${gradientString})`,
          backgroundSize: "200% 200%",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          padding: borderWidth,
          backgroundImage: `linear-gradient(${gradientAngle + 180}deg, ${gradientString})`,
          backgroundSize: "200% 200%",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: "blur(4px)",
          opacity: isHovered ? 0.8 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-visible">
        {edgeParticles.map((particle, i) => {
          const pos = getPerimeterPosition(particlePositions[i]);
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                left: pos.x - particle.size / 2,
                top: pos.y - particle.size / 2,
                background: `radial-gradient(circle, ${gradientColors[i % gradientColors.length]}, transparent)`,
                opacity: isHovered ? particle.opacity : 0,
                boxShadow: isHovered
                  ? `0 0 ${particle.size * 2}px ${gradientColors[i % gradientColors.length]}`
                  : "none",
                transition: "opacity 0.3s ease",
              }}
            />
          );
        })}
      </div>
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            ${gradientColors[0]}20 0%,
            transparent 50%
          )`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 0.3 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: borderWidth,
            borderRadius: "inherit",
            background: `conic-gradient(
              from ${gradientAngle}deg at 50% 50%,
              ${gradientColors.map((c, i) => `${c}40 ${(i / gradientColors.length) * 100}%`).join(", ")},
              ${gradientColors[0]}40 100%
            )`,
            filter: "blur(20px)",
          }}
        />
      </motion.div>
      <div
        className="relative rounded-[10px] bg-background h-full"
        style={{ margin: borderWidth }}
      >
        <div className="relative z-10">
          {children}
        </div>
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          style={{
            opacity: isHovered ? 0.5 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: `linear-gradient(
                ${gradientAngle + 45}deg,
                transparent 40%,
                rgba(255, 255, 255, 0.05) 50%,
                transparent 60%
              )`,
            }}
          />
        </motion.div>
      </div>
      <motion.div
        className="absolute -inset-4 rounded-[inherit] -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            ${gradientColors[0]}30 0%,
            transparent 60%
          )`,
          filter: "blur(20px)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
}
