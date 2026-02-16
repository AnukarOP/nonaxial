"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  variant?: "default" | "card" | "minimal" | "gradient";
}

export function StatsCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
  variant = "default",
}: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.floor(current));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [display]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (variant === "card") {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl bg-zinc-900/50 border border-white/10 p-6 text-center",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
      >
        <div className="text-4xl font-bold text-white mb-2">
          {prefix}
          {formatNumber(displayValue)}
          {suffix}
        </div>
        {label && <div className="text-sm text-zinc-400">{label}</div>}
      </motion.div>
    );
  }

  if (variant === "gradient") {
    return (
      <motion.div
        ref={ref}
        className={cn("text-center", className)}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          {prefix}
          {formatNumber(displayValue)}
          {suffix}
        </div>
        {label && <div className="text-lg text-zinc-400 mt-2">{label}</div>}
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <div ref={ref} className={cn("flex items-baseline gap-1", className)}>
        <span className="text-2xl font-bold text-white">
          {prefix}
          {formatNumber(displayValue)}
          {suffix}
        </span>
        {label && <span className="text-sm text-zinc-500">{label}</span>}
      </div>
    );
  }

  // Default variant
  return (
    <motion.div
      ref={ref}
      className={cn("text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl font-bold text-white">
        {prefix}
        {formatNumber(displayValue)}
        {suffix}
      </div>
      {label && <div className="text-sm text-zinc-400 mt-1">{label}</div>}
    </motion.div>
  );
}

interface StatsGridProps {
  stats: {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
  }[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, className, columns = 4 }: StatsGridProps) {
  const columnClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={cn(`grid ${columnClass[columns]} gap-4`, className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="rounded-xl bg-zinc-900/50 border border-white/10 p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-3">
            {stat.icon && (
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                {stat.icon}
              </div>
            )}
            {stat.trend && (
              <div
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  stat.trend.isPositive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                )}
              >
                {stat.trend.isPositive ? "+" : "-"}{Math.abs(stat.trend.value)}%
              </div>
            )}
          </div>
          <StatsCounter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            variant="minimal"
          />
          <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  className?: string;
  color?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  showValue = true,
  label,
  className,
  color = "#8b5cf6",
}: CircularProgressProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg
        ref={ref}
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
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
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isInView ? offset : circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(progress * 100)}%</span>
          {label && <span className="text-xs text-zinc-400">{label}</span>}
        </div>
      )}
    </div>
  );
}

interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  segments?: { color: string; threshold: number }[];
}

export function Gauge({
  value,
  max = 100,
  label,
  className,
  segments = [
    { color: "#22c55e", threshold: 33 },
    { color: "#eab308", threshold: 66 },
    { color: "#ef4444", threshold: 100 },
  ],
}: GaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const progress = Math.min(value / max, 1);
  const angle = progress * 180 - 90;

  const getCurrentColor = () => {
    const percentage = progress * 100;
    for (const segment of segments) {
      if (percentage <= segment.threshold) return segment.color;
    }
    return segments[segments.length - 1].color;
  };

  return (
    <div ref={ref} className={cn("relative w-48", className)}>
      <svg viewBox="0 0 100 60" className="w-full">
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <motion.path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke={getCurrentColor()}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="126"
          initial={{ strokeDashoffset: 126 }}
          animate={{ strokeDashoffset: isInView ? 126 - progress * 126 : 126 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.line
          x1="50"
          y1="55"
          x2="50"
          y2="25"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: isInView ? angle : -90 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: "50px 55px" }}
        />
        <circle cx="50" cy="55" r="4" fill="white" />
      </svg>
      <div className="text-center -mt-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {label && <p className="text-xs text-zinc-400">{label}</p>}
      </div>
    </div>
  );
}
