"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string | number;
  period?: string;
  description?: string;
  features: PricingFeature[];
  buttonText?: string;
  onSelect?: () => void;
  popular?: boolean;
  className?: string;
  variant?: "default" | "gradient" | "bordered";
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  buttonText = "Get Started",
  onSelect,
  popular = false,
  className,
  variant = "default",
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    default: "bg-zinc-900/50 border border-white/10",
    gradient: "bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30",
    bordered: "bg-transparent border-2 border-violet-500",
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl p-6 overflow-hidden",
        variantStyles[variant],
        popular && "ring-2 ring-violet-500",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {popular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <div className="px-4 py-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-b-lg text-xs font-medium text-white">
            Most Popular
          </div>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">
            {typeof price === "number" ? `$${price}` : price}
          </span>
          {period && <span className="text-zinc-400">{period}</span>}
        </div>
        {description && (
          <p className="text-sm text-zinc-400 mt-2">{description}</p>
        )}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                feature.included ? "bg-violet-500/20 text-violet-400" : "bg-zinc-800 text-zinc-500"
              )}
            >
              {feature.included ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <span className={cn("text-sm", feature.included ? "text-zinc-300" : "text-zinc-500 line-through")}>
              {feature.text}
            </span>
          </motion.li>
        ))}
      </ul>
      <motion.button
        onClick={onSelect}
        className={cn(
          "w-full py-3 rounded-xl font-medium transition-all",
          popular || variant === "gradient"
            ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
            : "bg-white/10 text-white hover:bg-white/20"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>
      {popular && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "0 0 40px rgba(139,92,246,0.3)"
              : "0 0 0px rgba(139,92,246,0)",
          }}
        />
      )}
    </motion.div>
  );
}
