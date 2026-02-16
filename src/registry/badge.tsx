"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error" | "info" | "gradient";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  animated = false,
  dot = false,
  removable = false,
  onRemove,
}: BadgeProps) {
  const variantStyles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    error: "bg-red-500/10 text-red-400 border-red-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const dotColors = {
    default: "bg-zinc-400",
    success: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
    info: "bg-blue-400",
    gradient: "bg-white",
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      initial={animated ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={animated ? { scale: 1.05 } : undefined}
    >
      {dot && (
        <motion.span
          className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])}
          animate={animated ? { scale: [1, 1.2, 1] } : undefined}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
}

// Notification badge (for icons)
interface NotificationBadgeProps {
  count?: number;
  max?: number;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function NotificationBadge({
  count,
  max = 99,
  dot = false,
  className,
  children,
  variant = "error",
  position = "top-right",
}: NotificationBadgeProps) {
  const variantColors = {
    default: "bg-zinc-600",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const positionStyles = {
    "top-right": "-top-1 -right-1",
    "top-left": "-top-1 -left-1",
    "bottom-right": "-bottom-1 -right-1",
    "bottom-left": "-bottom-1 -left-1",
  };

  const displayCount = count && count > max ? `${max}+` : count;
  const showBadge = dot || (count !== undefined && count > 0);

  return (
    <div className={cn("relative inline-flex", className)}>
      {children}

      <AnimatePresence>
        {showBadge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              "absolute flex items-center justify-center rounded-full text-white text-xs font-bold border-2 border-zinc-900",
              variantColors[variant],
              positionStyles[position],
              dot ? "w-3 h-3" : "min-w-[20px] h-5 px-1"
            )}
          >
            {!dot && displayCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated tag list
interface TagProps {
  tags: string[];
  className?: string;
  onRemove?: (tag: string) => void;
  variant?: "default" | "gradient";
}

export function TagList({ tags, className, onRemove, variant = "default" }: TagProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
              variant === "gradient"
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
            )}
          >
            {tag}
            {onRemove && (
              <button
                onClick={() => onRemove(tag)}
                className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
