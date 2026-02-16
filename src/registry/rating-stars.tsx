"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "hearts" | "emoji";
  readonly?: boolean;
  className?: string;
  showValue?: boolean;
}

export function RatingStars({
  value = 0,
  max = 5,
  onChange,
  size = "md",
  variant = "default",
  readonly = false,
  className,
  showValue = false,
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [rating, setRating] = useState(value);

  const displayValue = hoverValue ?? rating;

  const handleClick = (newValue: number) => {
    if (readonly) return;
    setRating(newValue);
    onChange?.(newValue);
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const emojis = ["😢", "😕", "😐", "😊", "😍"];

  const renderIcon = (index: number, filled: boolean) => {
    const isFilled = filled || index < displayValue;

    if (variant === "hearts") {
      return (
        <svg
          className={cn(
            sizeClasses[size],
            isFilled ? "text-red-500" : "text-zinc-600"
          )}
          fill={isFilled ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      );
    }

    if (variant === "emoji") {
      return (
        <span
          className={cn(
            "transition-transform",
            sizeClasses[size],
            index === Math.ceil(displayValue) - 1 ? "scale-125" : "scale-100 opacity-50"
          )}
        >
          {emojis[index]}
        </span>
      );
    }

    // Default stars
    return (
      <svg
        className={cn(
          sizeClasses[size],
          isFilled
            ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
            : "text-zinc-600"
        )}
        fill={isFilled ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    );
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => handleClick(index + 1)}
          onMouseEnter={() => !readonly && setHoverValue(index + 1)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          disabled={readonly}
          className={cn(
            "p-0.5 transition-colors",
            !readonly && "cursor-pointer hover:scale-110"
          )}
          whileTap={readonly ? undefined : { scale: 0.9 }}
          animate={
            index < displayValue
              ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
              : {}
          }
          transition={{ duration: 0.3 }}
        >
          {renderIcon(index, index < displayValue)}
        </motion.button>
      ))}

      {showValue && (
        <motion.span
          key={displayValue}
          className="ml-2 text-sm font-medium text-zinc-400"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {displayValue.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
}
