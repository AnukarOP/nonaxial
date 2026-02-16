"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipDirection?: "horizontal" | "vertical";
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  distance: number;
  delay: number;
}

export function FlipCard({
  front,
  back,
  className,
  flipDirection = "horizontal",
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Spring physics for the flip
  const flipProgress = useSpring(0, { 
    stiffness: 80, 
    damping: 15,
    mass: 1.2,
  });

  // Edge glow particles
  const edgeParticles = useMemo((): Particle[] => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: i < 10 ? 0 : i < 20 ? 100 : i < 30 ? (i - 20) * 10 : (i - 30) * 10,
      y: i < 10 ? i * 10 : i < 20 ? (i - 10) * 10 : i < 30 ? 0 : 100,
      size: 2 + ((Math.sin(i * 5.3) + 1) / 2) * 3,
      angle: ((Math.sin(i * 3.7) + 1) / 2) * 360,
      distance: 10 + ((Math.sin(i * 7.1) + 1) / 2) * 20,
      delay: ((Math.sin(i * 2.9) + 1) / 2) * 0.5,
    }));
  }, []);

  // Compute rotation values from flip progress
  const frontRotation = useTransform(
    flipProgress,
    [0, 1],
    flipDirection === "horizontal" ? [0, 180] : [0, 180]
  );
  const backRotation = useTransform(
    flipProgress,
    [0, 1],
    flipDirection === "horizontal" ? [180, 360] : [180, 360]
  );

  // Parallax depth effect
  const parallaxX = useTransform(flipProgress, [0, 0.5, 1], [0, 15, 0]);
  const parallaxY = useTransform(flipProgress, [0, 0.5, 1], [0, -10, 0]);

  // Edge glow intensity peaks at mid-flip
  const edgeGlow = useTransform(flipProgress, [0, 0.3, 0.5, 0.7, 1], [0, 0.5, 1, 0.5, 0]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const targetValue = isFlipped ? 0 : 1;
    flipProgress.set(targetValue);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  const rotationAxis = flipDirection === "horizontal" ? "rotateY" : "rotateX";

  return (
    <motion.div
      ref={ref}
      className={cn("relative cursor-pointer", className)}
      style={{ perspective: 1500 }}
      onClick={handleFlip}
      onMouseMove={handleMouse}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="absolute -inset-2 rounded-[inherit] pointer-events-none z-0"
        style={{
          opacity: edgeGlow,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 50%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 50%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)
          `,
          filter: "blur(15px)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none z-20">
        {edgeParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.6))`,
              opacity: edgeGlow,
              x: useTransform(edgeGlow, [0, 1], [0, Math.cos(particle.angle * Math.PI / 180) * particle.distance]),
              y: useTransform(edgeGlow, [0, 1], [0, Math.sin(particle.angle * Math.PI / 180) * particle.distance]),
              scale: useTransform(edgeGlow, [0, 0.5, 1], [0, 1.5, 0.5]),
            }}
          />
        ))}
      </div>
      <motion.div
        className="absolute inset-0 backface-hidden rounded-[inherit] overflow-hidden"
        style={{
          [rotationAxis]: frontRotation,
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
        >
          {front}
        </motion.div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${135 + mousePos.x * 90}deg,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 50%
            )`,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 backface-hidden rounded-[inherit] overflow-hidden"
        style={{
          [rotationAxis]: backRotation,
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            x: useTransform(parallaxX, v => -v),
            y: useTransform(parallaxY, v => -v),
          }}
        >
          {back}
        </motion.div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${-135 + mousePos.x * 90}deg,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 50%
            )`,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-[inherit] -z-10"
        style={{
          opacity: useTransform(edgeGlow, [0, 0.5, 1], [0.2, 0.4, 0.2]),
          transform: useTransform(flipProgress, [0, 0.5, 1], [
            "translateZ(-20px) translateY(10px) scale(0.95)",
            "translateZ(-40px) translateY(20px) scale(0.9)",
            "translateZ(-20px) translateY(10px) scale(0.95)"
          ]),
          background: "rgba(0, 0, 0, 0.3)",
          filter: "blur(20px)",
        }}
      />
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `conic-gradient(
            from ${mousePos.x * 360}deg,
            rgba(139, 92, 246, 0.5),
            rgba(236, 72, 153, 0.5),
            rgba(6, 182, 212, 0.5),
            rgba(139, 92, 246, 0.5)
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: useTransform(edgeGlow, v => 0.3 + v * 0.7),
        }}
      />
    </motion.div>
  );
}
