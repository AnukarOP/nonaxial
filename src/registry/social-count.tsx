"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SocialCountProps {
  count: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "outlined" | "minimal";
  animated?: boolean;
  incrementOnHover?: boolean;
}

export function SocialCount({
  count,
  label,
  icon,
  className,
  variant = "default",
  animated = true,
  incrementOnHover = false,
}: SocialCountProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [localCount, setLocalCount] = useState(count);

  useEffect(() => {
    if (!animated) {
      setDisplayCount(localCount);
      return;
    }

    let frame: number;
    const duration = 1500;
    const startTime = Date.now();
    const startValue = displayCount;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayCount(Math.floor(startValue + (localCount - startValue) * easeOut));
      
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [localCount, animated]);

  const handleHover = () => {
    setIsHovered(true);
    if (incrementOnHover) {
      setLocalCount((prev) => prev + 1);
    }
  };

  const formatCount = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const variantClasses = {
    default:
      "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10",
    gradient:
      "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white",
    outlined:
      "bg-transparent border-2 border-violet-500 text-violet-400",
    minimal: "bg-transparent",
  };

  return (
    <motion.div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer overflow-hidden",
        variantClasses[variant],
        className
      )}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {variant === "gradient" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ["100%", "-100%"] : "-100%",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
      {icon && (
        <motion.div
          className={cn(
            "flex-shrink-0",
            variant === "minimal" && "text-violet-500"
          )}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            rotate: isHovered ? [0, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
      )}
      <div className="relative z-10">
        <motion.div
          className={cn(
            "text-2xl font-bold tabular-nums",
            variant === "outlined" && "text-violet-400",
            variant === "minimal" && "text-white"
          )}
          key={displayCount}
        >
          {formatCount(displayCount)}
        </motion.div>
        <div
          className={cn(
            "text-xs uppercase tracking-wider",
            variant === "gradient" ? "text-white/70" : "text-zinc-400"
          )}
        >
          {label}
        </div>
      </div>
      {incrementOnHover && isHovered && (
        <motion.span
          className="absolute right-4 top-2 text-xs font-bold text-green-400"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [1, 0], y: -20 }}
          transition={{ duration: 0.5 }}
        >
          +1
        </motion.span>
      )}
    </motion.div>
  );
}

// Social stats row component
interface SocialStatsProps {
  stats: Array<{
    count: number;
    label: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function SocialStats({ stats, className }: SocialStatsProps) {
  return (
    <div className={cn("flex gap-6", className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-white">
            {stat.icon}
            <SocialCount
              count={stat.count}
              label=""
              variant="minimal"
              animated
            />
          </motion.div>
          <div className="text-xs sm:text-sm text-zinc-400 uppercase tracking-wider mt-1">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
