"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ios" | "android" | "neon";
  disabled?: boolean;
  label?: string;
}

export function ToggleSwitch({
  checked = false,
  onChange,
  className,
  size = "md",
  variant = "default",
  disabled = false,
  label,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const sizeConfig = {
    sm: { width: 36, height: 20, knob: 14 },
    md: { width: 48, height: 26, knob: 20 },
    lg: { width: 64, height: 34, knob: 28 },
  };

  const config = sizeConfig[size];

  const variants = {
    default: {
      track: isChecked
        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
        : "bg-zinc-700",
      knob: "bg-white",
      glow: isChecked ? "shadow-violet-500/50" : "",
    },
    ios: {
      track: isChecked ? "bg-green-500" : "bg-zinc-600",
      knob: "bg-white shadow-lg",
      glow: "",
    },
    android: {
      track: isChecked ? "bg-violet-500/50" : "bg-zinc-700/50",
      knob: isChecked
        ? "bg-violet-500 shadow-lg shadow-violet-500/50"
        : "bg-zinc-400",
      glow: "",
    },
    neon: {
      track: isChecked
        ? "bg-violet-900 border-2 border-violet-500"
        : "bg-zinc-900 border-2 border-zinc-700",
      knob: isChecked
        ? "bg-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
        : "bg-zinc-500",
      glow: isChecked ? "shadow-[0_0_20px_rgba(139,92,246,0.5)]" : "",
    },
  };

  const style = variants[variant];

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <motion.button
        onClick={handleToggle}
        className={cn(
          "relative rounded-full cursor-pointer transition-all duration-200",
          style.track,
          style.glow,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          width: config.width,
          height: config.height,
        }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
      >
        <motion.div
          className={cn("absolute rounded-full", style.knob)}
          style={{
            width: config.knob,
            height: config.knob,
            top: (config.height - config.knob) / 2,
          }}
          animate={{
            left: isChecked
              ? config.width - config.knob - (config.height - config.knob) / 2
              : (config.height - config.knob) / 2,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        {variant === "android" && isChecked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-500/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </motion.button>

      {label && (
        <span className={cn("text-sm", disabled ? "text-zinc-500" : "text-zinc-300")}>
          {label}
        </span>
      )}
    </div>
  );
}
