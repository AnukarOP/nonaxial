"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10px", "10px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10px", "10px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      {/* Animated glow */}
      <div className={cn(
        "absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500",
        variant === "primary" && "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500",
        variant === "secondary" && "bg-gradient-to-r from-zinc-400 to-zinc-600"
      )} />
      
      <motion.button
        style={{ transform: "translateZ(30px)" }}
        className={cn(
          "relative px-8 py-4 rounded-xl font-medium text-sm backdrop-blur-xl shadow-2xl",
          variant === "primary" && "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border border-white/20",
          variant === "secondary" && "bg-black/80 text-white border border-white/10 hover:border-white/20",
          className
        )}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
      </motion.button>
    </motion.div>
  );
}
