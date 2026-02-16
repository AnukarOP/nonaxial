"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  variant?: "default" | "underline" | "filled" | "neon";
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      label,
      error,
      success,
      variant = "default",
      icon,
      rightIcon,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const variantStyles = {
      default: {
        container: "bg-zinc-900/50 border border-white/10 rounded-xl",
        focusContainer: "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]",
        label: "text-zinc-400",
        input: "bg-transparent text-white",
      },
      underline: {
        container: "border-b-2 border-zinc-700 rounded-none bg-transparent",
        focusContainer: "border-violet-500",
        label: "text-zinc-400",
        input: "bg-transparent text-white px-0",
      },
      filled: {
        container: "bg-zinc-800 border-2 border-transparent rounded-xl",
        focusContainer: "border-violet-500 bg-zinc-800/80",
        label: "text-zinc-400",
        input: "bg-transparent text-white",
      },
      neon: {
        container: "bg-black border-2 border-zinc-700 rounded-xl",
        focusContainer: "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]",
        label: "text-zinc-400",
        input: "bg-transparent text-violet-400",
      },
    };

    const styles = variantStyles[variant];
    const showFloatingLabel = isFocused || hasValue;

    return (
      <div className={cn("relative", className)}>
        <motion.div
          className={cn(
            "relative flex items-center px-4 py-3 transition-all duration-200",
            styles.container,
            isFocused && styles.focusContainer,
            error && "border-red-500",
            success && "border-green-500"
          )}
          animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        >
          {icon && (
            <motion.div
              className={cn(
                "mr-3 text-zinc-500 transition-colors",
                isFocused && "text-violet-400"
              )}
              animate={{ scale: isFocused ? 1.1 : 1 }}
            >
              {icon}
            </motion.div>
          )}
          <div className="relative flex-1">
            {label && (
              <motion.label
                className={cn(
                  "absolute left-0 pointer-events-none transition-colors",
                  styles.label,
                  isFocused && "text-violet-400"
                )}
                animate={{
                  y: showFloatingLabel ? -20 : 0,
                  scale: showFloatingLabel ? 0.85 : 1,
                  x: showFloatingLabel ? -8 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.label>
            )}
            <input
              ref={ref}
              {...props}
              className={cn(
                "w-full outline-none placeholder-transparent",
                styles.input,
                label && "pt-2"
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={showFloatingLabel ? props.placeholder : label}
            />
          </div>
          {rightIcon && (
            <div className="ml-3 text-zinc-500">{rightIcon}</div>
          )}
        </motion.div>
        <AnimatePresence>
          {(error || success) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn(
                "text-xs mt-1 ml-1",
                error && "text-red-400",
                success && "text-green-400"
              )}
            >
              {error || success}
            </motion.p>
          )}
        </AnimatePresence>
        {variant === "underline" && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-violet-500"
            initial={{ width: "0%", left: "50%" }}
            animate={{
              width: isFocused ? "100%" : "0%",
              left: isFocused ? "0%" : "50%",
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";
