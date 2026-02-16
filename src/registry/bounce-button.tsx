"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BounceButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface WobbleTrail {
  id: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

export function BounceButton({ children, className, onClick }: BounceButtonProps) {
  const controls = useAnimation();
  const [isPressed, setIsPressed] = useState(false);
  const [wobbleTrails, setWobbleTrails] = useState<WobbleTrail[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Rubber physics with squash/stretch
  const handlePress = async () => {
    setIsPressed(true);
    
    // Create wobble trail effect
    const trails: WobbleTrail[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      scaleX: 1.15 - i * 0.05,
      scaleY: 0.85 + i * 0.05,
      opacity: 0.3 - i * 0.1,
    }));
    setWobbleTrails(trails);

    // Squash on press (rubber compression)
    await controls.start({
      scaleX: 1.15,
      scaleY: 0.85,
      y: 4,
      transition: { type: "spring", stiffness: 800, damping: 15 },
    });
  };

  const handleRelease = async () => {
    setIsPressed(false);
    
    // Stretch on release (rubber expansion)
    await controls.start({
      scaleX: 0.9,
      scaleY: 1.15,
      y: -8,
      transition: { type: "spring", stiffness: 600, damping: 12 },
    });

    // Bounce sequence with decreasing amplitude
    await controls.start({
      scaleX: 1.08,
      scaleY: 0.92,
      y: 2,
      transition: { type: "spring", stiffness: 500, damping: 10 },
    });

    await controls.start({
      scaleX: 0.96,
      scaleY: 1.05,
      y: -3,
      transition: { type: "spring", stiffness: 400, damping: 12 },
    });

    // Settle back to normal
    await controls.start({
      scaleX: 1,
      scaleY: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    });

    // Clear wobble trails
    setTimeout(() => setWobbleTrails([]), 300);
    
    onClick?.();
  };

  // Idle wobble animation when hovered
  useEffect(() => {
    if (!isHovered || isPressed) return;

    const idleWobble = async () => {
      await controls.start({
        scaleX: [1, 1.02, 0.98, 1],
        scaleY: [1, 0.98, 1.02, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      });
    };

    idleWobble();

    return () => {
      controls.stop();
    };
  }, [isHovered, isPressed, controls]);

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {wobbleTrails.map((trail, index) => (
          <motion.div
            key={trail.id}
            className="absolute inset-0 rounded-2xl bg-violet-500/20 pointer-events-none"
            initial={{
              scaleX: trail.scaleX,
              scaleY: trail.scaleY,
              opacity: trail.opacity,
            }}
            animate={{
              scaleX: 1,
              scaleY: 1,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-violet-900/50 pointer-events-none"
        animate={{
          y: isPressed ? 2 : 6,
          scaleX: isPressed ? 1.1 : 1,
          scaleY: isPressed ? 0.9 : 1,
          opacity: isPressed ? 0.3 : 0.5,
          filter: isPressed ? "blur(4px)" : "blur(8px)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      />

      <motion.button
        animate={controls}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isPressed) handleRelease();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        className={cn(
          "relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden",
          "bg-gradient-to-b from-violet-500 via-violet-600 to-fuchsia-600",
          "shadow-lg",
          className
        )}
        style={{
          transformOrigin: "center bottom",
        }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
          }}
        />
        <motion.div
          className="absolute top-1 left-2 right-2 h-2 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
          }}
          animate={{
            scaleX: isPressed ? 1.1 : 1,
            opacity: isPressed ? 0.8 : 0.6,
          }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 flex justify-center gap-4 pointer-events-none"
          animate={{
            y: isPressed ? -2 : 0,
            opacity: isPressed ? 1 : 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-white/30 rounded-full"
              animate={{
                height: isPressed ? 8 : 0,
              }}
              transition={{
                delay: i * 0.02,
              }}
            />
          ))}
        </motion.div>
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{
            y: isPressed ? 1 : 0,
            scale: isPressed ? 0.98 : 1,
          }}
        >
          {children}
        </motion.span>
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
          }}
          animate={{
            scaleY: isPressed ? 0.5 : 1,
          }}
        />
      </motion.button>
    </div>
  );
}
