"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightButtonProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
}

interface LensFlare {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function SpotlightButton({
  children,
  className,
  spotlightColor = "rgba(255, 255, 255, 0.9)",
  onClick,
}: SpotlightButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [lensFlares, setLensFlares] = useState<LensFlare[]>([]);
  const [ambientPulse, setAmbientPulse] = useState(0);

  // Animate ambient glow pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientPulse((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });

    // Generate lens flares along the light path
    if (Math.random() > 0.7) {
      const flareCount = 3 + Math.floor(Math.random() * 3);
      const newFlares: LensFlare[] = Array.from({ length: flareCount }, (_, i) => {
        const progress = (i + 1) / (flareCount + 1);
        // Flares extend from spotlight toward opposite corner
        const flareX = x + (50 - x) * progress * 1.5;
        const flareY = y + (50 - y) * progress * 1.5;
        return {
          id: Date.now() + i,
          x: flareX,
          y: flareY,
          size: 5 + Math.random() * 15 * (1 - progress),
          opacity: 0.3 - progress * 0.2,
        };
      });
      setLensFlares(newFlares);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setLensFlares([]);
    setPosition({ x: 50, y: 50 });
  }, []);

  const ambientIntensity = 0.3 + Math.sin(ambientPulse) * 0.1;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden px-10 py-5 rounded-2xl font-bold text-white",
        "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, 
            rgba(139, 92, 246, ${ambientIntensity * 0.3}) 0%, 
            transparent 70%
          )`,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          background: `
            radial-gradient(
              circle 60px at ${position.x}% ${position.y}%,
              ${spotlightColor} 0%,
              rgba(255, 255, 255, 0.5) 20%,
              rgba(255, 255, 255, 0.2) 40%,
              rgba(255, 255, 255, 0.05) 60%,
              transparent 100%
            )
          `,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 0.6 : 0,
        }}
        style={{
          background: `
            radial-gradient(
              circle 100px at ${position.x}% ${position.y}%,
              rgba(139, 92, 246, 0.3) 0%,
              rgba(168, 85, 247, 0.15) 40%,
              transparent 100%
            )
          `,
          filter: "blur(10px)",
        }}
      />

      <AnimatePresence>
        {lensFlares.map((flare) => (
          <motion.div
            key={flare.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${flare.x}%`,
              top: `${flare.y}%`,
              width: flare.size,
              height: flare.size,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, rgba(255,255,255,${flare.opacity}) 0%, rgba(139,92,246,${flare.opacity * 0.5}) 50%, transparent 100%)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="absolute pointer-events-none"
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0,
          scale: isHovered ? [1, 1.1, 1] : 0.8,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: 30,
          height: 30,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      {isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.3, rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <polygon
              points="40,5 70,22 70,58 40,75 10,58 10,22"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      )}

      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{ opacity: isHovered ? 0.4 : 0 }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 + position.x) % 360;
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: 60,
                height: 1,
                background: "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
                transformOrigin: "left center",
                transform: `rotate(${angle}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleX: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          );
        })}
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      <motion.div
        className="absolute -inset-1 rounded-2xl pointer-events-none"
        style={{
          background: "transparent",
          boxShadow: `
            0 0 ${20 + Math.sin(ambientPulse) * 10}px rgba(139, 92, 246, ${ambientIntensity}),
            0 0 ${40 + Math.sin(ambientPulse) * 10}px rgba(139, 92, 246, ${ambientIntensity * 0.5})
          `,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? `inset 0 0 30px rgba(255, 255, 255, 0.1)`
            : `inset 0 0 0px rgba(255, 255, 255, 0)`,
        }}
      />

      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />

      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        style={{
          textShadow: isHovered
            ? `0 0 20px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)`
            : "0 2px 4px rgba(0,0,0,0.3)",
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
