"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EventBadgeProps {
  title: string;
  date?: string;
  location?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "premium" | "live" | "upcoming";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export function EventBadge({
  title,
  date,
  location,
  icon,
  className,
  variant = "default",
  size = "md",
  glow = true,
}: EventBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    default: {
      bg: "bg-gradient-to-r from-violet-600 to-fuchsia-600",
      border: "border-violet-400/30",
      glow: "shadow-violet-500/50",
    },
    premium: {
      bg: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500",
      border: "border-amber-300/50",
      glow: "shadow-amber-400/50",
    },
    live: {
      bg: "bg-gradient-to-r from-red-500 to-rose-600",
      border: "border-red-400/30",
      glow: "shadow-red-500/50",
    },
    upcoming: {
      bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
      border: "border-cyan-400/30",
      glow: "shadow-cyan-500/50",
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full font-medium text-white cursor-pointer",
        sizeClasses[size],
        styles.bg,
        glow && `shadow-lg ${styles.glow}`,
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotateX: isHovered ? -10 : 0,
        rotateY: isHovered ? 10 : 0,
        scale: isHovered ? 1.05 : 1,
        z: isHovered ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          styles.bg,
          "opacity-40 blur-md"
        )}
        animate={{
          y: isHovered ? 8 : 4,
          scale: isHovered ? 1.1 : 1.05,
        }}
        style={{ zIndex: -1 }}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-full border",
          styles.border
        )}
      />
      <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
      {icon && (
        <motion.span
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
      )}
      {variant === "live" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}
      <div className="flex flex-col">
        <span className="font-semibold">{title}</span>
        {(date || location) && (
          <span className="text-white/70 text-xs">
            {date}
            {date && location && " • "}
            {location}
          </span>
        )}
      </div>
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        initial={false}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ["100%", "-100%"] : "-100%",
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
