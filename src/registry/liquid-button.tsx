"use client";

import { useEffect, useState, useId } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropProps {
  index: number;
  x: number;
  parentWidth: number;
  onComplete: () => void;
}

function Drop({ index, x, parentWidth, onComplete }: DropProps) {
  const size = 8 + Math.random() * 8;
  const duration = 0.6 + Math.random() * 0.4;
  const delay = index * 0.05;

  return (
    <motion.div
      className="absolute rounded-full bg-violet-500"
      style={{
        width: size,
        height: size,
        left: x,
        top: "100%",
      }}
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{
        y: [0, 40 + Math.random() * 30],
        opacity: [1, 1, 0],
        scale: [1, 0.6, 0.2],
      }}
      transition={{
        duration,
        delay,
        ease: "easeIn",
      }}
      onAnimationComplete={onComplete}
    />
  );
}

interface LiquidButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LiquidButton({ children, className, onClick }: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [drops, setDrops] = useState<{ id: number; x: number }[]>([]);
  const [dropCounter, setDropCounter] = useState(0);

  const mouseX = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  
  const skewX = useTransform(springX, [0, 1], [-3, 3]);
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);

  // Generate drops on hover
  useEffect(() => {
    if (!isHovered) return;
    
    const interval = setInterval(() => {
      const newDrop = {
        id: dropCounter,
        x: 20 + Math.random() * 120, // Random position within button
      };
      setDrops(prev => [...prev, newDrop]);
      setDropCounter(prev => prev + 1);
    }, 150);

    return () => clearInterval(interval);
  }, [isHovered, dropCounter]);

  const handleDropComplete = (id: number) => {
    setDrops(prev => prev.filter(drop => drop.id !== id));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    mouseX.set(x);
  };

  // Unique filter ID to avoid conflicts (useId generates colons which need CSS escaping)
  const rawId = useId();
  const filterId = `goo${rawId.replace(/:/g, '')}`;

  return (
    <div className="relative" style={{ filter: `url(#${filterId})` }}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <motion.button
        className={cn(
          "relative px-10 py-5 bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 text-white font-semibold rounded-2xl overflow-visible cursor-pointer border-none shadow-lg shadow-violet-500/30",
          className
        )}
        style={{ skewX, rotateY }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0.5);
        }}
        onMouseMove={handleMouseMove}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
        <span className="relative z-10 text-base tracking-wide">{children}</span>
        {drops.map(drop => (
          <Drop
            key={drop.id}
            index={drop.id}
            x={drop.x}
            parentWidth={160}
            onComplete={() => handleDropComplete(drop.id)}
          />
        ))}
      </motion.button>
    </div>
  );
}
