"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  color?: string;
  bgColor?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showValue = true,
  color = "url(#gradient)",
  bgColor = "rgba(255,255,255,0.1)",
  animated = true,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <motion.span
            className="text-2xl font-bold text-white"
            initial={animated ? { opacity: 0, scale: 0.5 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// Linear progress bar
interface ProgressBarProps {
  progress: number;
  className?: string;
  height?: number;
  showValue?: boolean;
  animated?: boolean;
  variant?: "default" | "gradient" | "striped" | "glow";
}

export function ProgressBar({
  progress,
  className,
  height = 8,
  showValue = false,
  animated = true,
  variant = "default",
}: ProgressBarProps) {
  const variantClasses = {
    default: "bg-violet-500",
    gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    striped: "bg-violet-500 bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]",
    glow: "bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full bg-white/10 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className={cn("h-full rounded-full", variantClasses[variant])}
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showValue && (
        <div className="text-right text-sm text-zinc-400 mt-1">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}
