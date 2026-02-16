"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: "circle" | "square" | "star";
}

interface ConfettiButtonProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
  colors?: string[];
  onClick?: () => void;
  variant?: "default" | "gradient" | "outline";
}

export function ConfettiButton({
  children,
  className,
  particleCount = 30,
  colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
  onClick,
  variant = "default",
}: ConfettiButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  const createParticles = useCallback(() => {
    const shapes: ("circle" | "square" | "star")[] = ["circle", "square", "star"];
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: Math.random() * -200 - 50,
        rotation: Math.random() * 720 - 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    return newParticles;
  }, [particleCount, colors]);

  const handleClick = () => {
    setIsExploding(true);
    setParticles(createParticles());
    onClick?.();

    setTimeout(() => {
      setIsExploding(false);
      setParticles([]);
    }, 1000);
  };

  const variantStyles = {
    default: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25",
    gradient: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-violet-500/25",
    outline: "bg-transparent border-2 border-violet-500 text-violet-400 hover:bg-violet-500/10",
  };

  const renderParticle = (particle: Particle) => {
    if (particle.shape === "star") {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill={particle.color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    if (particle.shape === "square") {
      return (
        <div
          className="w-full h-full rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      );
    }
    return (
      <div
        className="w-full h-full rounded-full"
        style={{ backgroundColor: particle.color }}
      />
    );
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleClick}
        className={cn(
          "relative px-6 py-3 rounded-xl font-medium transition-all overflow-hidden",
          variantStyles[variant],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={isExploding ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>
      <AnimatePresence>
        {isExploding && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  scale: particle.scale,
                  rotate: particle.rotation,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {renderParticle(particle)}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
