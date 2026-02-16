"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  onClick?: () => void;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
  hue: number;
  delay: number;
}

export function RippleButton({
  children,
  className,
  rippleColor,
  onClick,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const [baseHue, setBaseHue] = useState(260);

  const createRipples = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.5;

    // Create multiple ripples with varying sizes and delays
    const newRipples: Ripple[] = Array.from({ length: 4 }, (_, i) => ({
      x: x - (size * (0.7 + i * 0.1)) / 2,
      y: y - (size * (0.7 + i * 0.1)) / 2,
      size: size * (0.7 + i * 0.1),
      id: Date.now() + i,
      hue: (baseHue + i * 30) % 360,
      delay: i * 0.08,
    }));

    // Shift base hue for next click (color cycling)
    setBaseHue((prev) => (prev + 45) % 360);

    setRipples((prev) => [...prev, ...newRipples]);

    // Elastic bounce feedback
    controls.start({
      scale: [1, 0.92, 1.05, 0.98, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.2, 0.4, 0.7, 1],
        ease: "easeOut",
      },
    });

    // Remove ripples after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => !newRipples.find((nr) => nr.id === r.id)));
    }, 1200);

    onClick?.();
  }, [baseHue, controls, onClick]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={createRipples}
      animate={controls}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 0 30px hsla(${baseHue}, 80%, 60%, 0.4)`,
      }}
      className={cn(
        "relative overflow-hidden px-8 py-4 rounded-2xl font-semibold",
        "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white",
        "shadow-lg shadow-purple-500/25",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsla(${baseHue}, 80%, 60%, 0.3) 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ 
              scale: [0, 1, 1.2],
              opacity: [0.9, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1,
              delay: ripple.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              background: rippleColor || `radial-gradient(circle, hsla(${ripple.hue}, 100%, 70%, 0.8) 0%, hsla(${ripple.hue + 40}, 100%, 60%, 0.4) 50%, transparent 70%)`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="absolute inset-1 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
        }}
      />
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ripples.length > 0 ? 1 : 0 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-white/60"
            animate={ripples.length > 0 ? {
              y: [0, -4, 0],
              opacity: [0.6, 1, 0.6],
            } : {}}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              repeat: ripples.length > 0 ? 2 : 0,
            }}
          />
        ))}
      </motion.div>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div 
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, hsla(${baseHue}, 100%, 80%, 0.6) 50%, transparent 100%)`
        }}
      />
    </motion.button>
  );
}
