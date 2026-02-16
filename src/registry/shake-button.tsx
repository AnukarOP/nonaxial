"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShakeButtonProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "strong";
  onClick?: () => void;
}

interface FallingParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
  rotation: number;
}

interface CrackLine {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
}

export function ShakeButton({ 
  children, 
  className, 
  intensity = "medium",
  onClick,
}: ShakeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<FallingParticle[]>([]);
  const [cracks, setCracks] = useState<CrackLine[]>([]);
  const controls = useAnimation();

  const intensityValues = {
    light: { shake: 2, particles: 3, crackChance: 0.3 },
    medium: { shake: 4, particles: 5, crackChance: 0.5 },
    strong: { shake: 8, particles: 8, crackChance: 0.7 },
  };

  const config = intensityValues[intensity];

  // Spawn falling particles
  const spawnParticles = useCallback(() => {
    const newParticles: FallingParticle[] = Array.from(
      { length: config.particles },
      (_, i) => ({
        id: Date.now() + i,
        x: 10 + Math.random() * 80,
        size: 2 + Math.random() * 4,
        delay: i * 0.05,
        rotation: Math.random() * 360,
      })
    );
    setParticles((prev) => [...prev.slice(-10), ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 1500);
  }, [config.particles]);

  // Spawn crack effects
  const spawnCracks = useCallback(() => {
    if (Math.random() > config.crackChance) return;
    
    const newCracks: CrackLine[] = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      angle: Math.random() * 360,
      length: 10 + Math.random() * 20,
    }));
    setCracks(newCracks);

    setTimeout(() => setCracks([]), 500);
  }, [config.crackChance]);

  // Earthquake tremor animation
  useEffect(() => {
    if (!isHovered) {
      controls.start({ x: 0, y: 0, rotate: 0 });
      return;
    }

    const shake = async () => {
      await controls.start({
        x: [
          0, -config.shake, config.shake, -config.shake * 0.8, 
          config.shake * 0.8, -config.shake * 0.5, config.shake * 0.5, 0
        ],
        y: [
          0, config.shake * 0.5, -config.shake * 0.5, config.shake * 0.3, 
          -config.shake * 0.3, config.shake * 0.2, -config.shake * 0.2, 0
        ],
        rotate: [
          0, -config.shake * 0.3, config.shake * 0.3, -config.shake * 0.2, 
          config.shake * 0.2, -config.shake * 0.1, config.shake * 0.1, 0
        ],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    };

    shake();
    const particleInterval = setInterval(() => {
      if (isHovered) spawnParticles();
    }, 400);

    const crackInterval = setInterval(() => {
      if (isHovered) spawnCracks();
    }, 800);

    return () => {
      clearInterval(particleInterval);
      clearInterval(crackInterval);
      controls.stop();
    };
  }, [isHovered, controls, config.shake, spawnParticles, spawnCracks]);

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: 0,
              width: particle.size,
              height: particle.size,
              background: `linear-gradient(135deg, #f97316 0%, #ea580c 50%, #9a3412 100%)`,
              borderRadius: 1,
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: [0, 60, 80],
              opacity: [1, 0.8, 0],
              rotate: particle.rotation,
              x: [0, (Math.random() - 0.5) * 20],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              delay: particle.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="absolute inset-x-0 -bottom-1 h-2 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scaleX: isHovered ? [1, 1.1, 0.95, 1.05, 1] : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
      />

      <motion.button
        animate={controls}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        className={cn(
          "relative px-10 py-5 rounded-2xl font-bold text-white overflow-hidden",
          "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600",
          className
        )}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {cracks.map((crack) => (
            <motion.div
              key={crack.id}
              className="absolute pointer-events-none"
              style={{
                left: `${crack.x}%`,
                top: `${crack.y}%`,
                width: crack.length,
                height: 2,
                background: "linear-gradient(90deg, rgba(0,0,0,0.6), transparent)",
                transformOrigin: "left center",
                rotate: crack.angle,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </AnimatePresence>

        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 45%, rgba(0,0,0,0.1) 50%, transparent 55%),
              linear-gradient(-45deg, transparent 45%, rgba(0,0,0,0.1) 50%, transparent 55%)
            `,
            backgroundSize: "10px 10px",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? [0, 0.3, 0] : 0,
          }}
          transition={{ duration: 0.2, repeat: Infinity }}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
            filter: "blur(2px)",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? [
                  "0 0 0 0 rgba(249, 115, 22, 0.4)",
                  "0 0 0 10px rgba(249, 115, 22, 0)",
                ]
              : "0 0 0 0 rgba(249, 115, 22, 0)",
          }}
          transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
        />

        <motion.div
          className="absolute inset-y-0 left-0 w-2 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 4px, #000 4px, #000 8px)",
          }}
          animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-2 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(-45deg, #fbbf24 0, #fbbf24 4px, #000 4px, #000 8px)",
          }}
          animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -bottom-4 inset-x-0 h-8 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              style={{
                background: "radial-gradient(ellipse at center bottom, rgba(194, 65, 12, 0.4) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
          )}
        </AnimatePresence>

        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{
            x: isHovered ? [0, -1, 1, 0] : 0,
          }}
          transition={{ duration: 0.1, repeat: isHovered ? Infinity : 0 }}
        >
          {children}
        </motion.span>
      </motion.button>
    </div>
  );
}
