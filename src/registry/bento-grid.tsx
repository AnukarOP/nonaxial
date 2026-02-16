"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  variant?: "default" | "gradient" | "glass" | "bordered";
  hoverEffect?: "lift" | "glow" | "scale" | "none";
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  variant = "default",
  hoverEffect = "lift",
}: BentoCardProps) {
  const colSpanClasses = {
    1: "",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };

  const rowSpanClasses = {
    1: "",
    2: "row-span-2",
  };

  const variantStyles = {
    default: "bg-zinc-900/50 border border-white/10",
    gradient: "bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    bordered: "bg-transparent border-2 border-dashed border-zinc-700",
  };

  const hoverStyles = {
    lift: { y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
    glow: { boxShadow: "0 0 30px rgba(139,92,246,0.3)" },
    scale: { scale: 1.02 },
    none: {},
  };

  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6 overflow-hidden relative",
        variantStyles[variant],
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className
      )}
      whileHover={hoverStyles[hoverEffect]}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Feature card for bento grid
interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <BentoCard className={className} hoverEffect="lift">
      <div className="h-full flex flex-col">
        {icon && (
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 flex-1">{description}</p>
      </div>
    </BentoCard>
  );
}

// Stats card for bento grid
interface StatsCardProps {
  value: string | number;
  label: string;
  change?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatsCard({
  value,
  label,
  change,
  className,
}: StatsCardProps) {
  return (
    <BentoCard className={className} hoverEffect="glow">
      <div className="h-full flex flex-col justify-center">
        <motion.p
          className="text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {value}
        </motion.p>
        <p className="text-sm text-zinc-400">{label}</p>
        {change && (
          <p
            className={cn(
              "text-sm font-medium mt-2",
              change.isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {change.isPositive ? "↑" : "↓"} {Math.abs(change.value)}%
          </p>
        )}
      </div>
    </BentoCard>
  );
}
