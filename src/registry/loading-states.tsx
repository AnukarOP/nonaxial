"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  variant?: "default" | "dots" | "ring" | "pulse" | "bars";
}

export function Spinner({
  size = "md",
  color = "#8b5cf6",
  className,
  variant = "default",
}: SpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const pixelSize = sizeMap[size];

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: pixelSize / 3,
              height: pixelSize / 3,
              backgroundColor: color,
              borderRadius: "50%",
            }}
            animate={{
              y: [0, -pixelSize / 3, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "ring") {
    return (
      <motion.div
        className={className}
        style={{
          width: pixelSize,
          height: pixelSize,
          border: `${pixelSize / 8}px solid rgba(255,255,255,0.1)`,
          borderTopColor: color,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={className}
        style={{
          width: pixelSize,
          height: pixelSize,
          backgroundColor: color,
          borderRadius: "50%",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex items-end gap-0.5", className)} style={{ height: pixelSize }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{
              width: pixelSize / 6,
              backgroundColor: color,
              borderRadius: pixelSize / 12,
            }}
            animate={{
              height: [pixelSize * 0.3, pixelSize, pixelSize * 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  // Default variant - circular spinner
  return (
    <svg
      className={cn("animate-spin", className)}
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerVariant?: SpinnerProps["variant"];
  text?: string;
  blur?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  spinnerVariant = "default",
  text,
  blur = true,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <motion.div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10",
            blur && "backdrop-blur-sm"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Spinner size="lg" variant={spinnerVariant} />
          {text && <p className="mt-3 text-sm text-zinc-300">{text}</p>}
        </motion.div>
      )}
    </div>
  );
}

interface ProgressLoaderProps {
  progress: number;
  showPercentage?: boolean;
  label?: string;
  className?: string;
  variant?: "default" | "gradient" | "striped";
}

export function ProgressLoader({
  progress,
  showPercentage = true,
  label,
  className,
  variant = "default",
}: ProgressLoaderProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const fillStyles = {
    default: "bg-violet-500",
    gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    striped: `bg-violet-500 bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]`,
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-zinc-400">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-white">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", fillStyles[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
  animated?: boolean;
}

export function Skeleton({
  width = "100%",
  height = 20,
  rounded = "md",
  className,
  animated = true,
}: SkeletonProps) {
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "bg-zinc-800",
        roundedMap[rounded],
        animated && "animate-pulse",
        className
      )}
      style={{ width, height }}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

export function SkeletonCard({ className, showImage = true, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden", className)}>
      {showImage && <Skeleton width="100%" height={200} rounded="none" />}
      <div className="p-4 space-y-3">
        <Skeleton width="60%" height={24} />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? "40%" : "100%"} height={16} />
        ))}
      </div>
    </div>
  );
}

interface InfiniteScrollLoaderProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function InfiniteScrollLoader({
  loading,
  hasMore,
  onLoadMore,
  children,
  threshold = 100,
  className,
}: InfiniteScrollLoaderProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < threshold && hasMore && !loading) {
      onLoadMore();
    }
  };

  return (
    <div className={cn("overflow-auto", className)} onScroll={handleScroll}>
      {children}
      {loading && (
        <div className="flex justify-center py-4">
          <Spinner variant="dots" />
        </div>
      )}
      {!hasMore && !loading && (
        <p className="text-center text-sm text-zinc-500 py-4">No more items</p>
      )}
    </div>
  );
}
