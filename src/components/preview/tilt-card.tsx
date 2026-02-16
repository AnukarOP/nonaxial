"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function TiltCard({ children, className, spotlightColor = "rgba(139, 92, 246, 0.15)" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const glareXSpring = useSpring(glareX, { stiffness: 300, damping: 30 });
  const glareYSpring = useSpring(glareY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.1, 0.9]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
    glareX.set((mouseX / rect.width) * 100);
    glareY.set((mouseY / rect.height) * 100);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        filter: useTransform(brightness, (b) => `brightness(${b})`),
      }}
      className={cn("relative cursor-pointer group", className)}
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: useTransform(
            [glareXSpring, glareYSpring],
            ([gx, gy]) => `radial-gradient(600px circle at ${gx}% ${gy}%, ${spotlightColor}, transparent 40%)`
          ),
        }}
      />
      
      {/* Border glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
      
      <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden" style={{ transform: "translateZ(0)" }}>
        {/* Inner glare */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"
          style={{
            background: useTransform(
              [glareXSpring, glareYSpring],
              ([gx, gy]) => `radial-gradient(300px circle at ${gx}% ${gy}%, white, transparent 50%)`
            ),
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}
