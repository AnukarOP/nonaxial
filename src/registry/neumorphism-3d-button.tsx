"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Neumorphism3DButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Neumorphism3DButton({
  children = "Click Me",
  onClick,
  disabled,
}: Neumorphism3DButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      className={cn(
        "relative rounded-full cursor-pointer outline-none transition-all duration-300",
        // Dark mode base
        "bg-neutral-900",
        "shadow-[-0.15em_-0.15em_0.1em_-0.075em_rgba(255,255,255,0.05),0.0375em_0.0375em_0.0675em_0_rgba(0,0,0,0.5)]"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full pointer-events-none",
          "top-[-0.15em] left-[-0.15em] w-[calc(100%+0.3em)] h-[calc(100%+0.3em)]",
          "opacity-25 blur-[0.0125em] mix-blend-overlay",
          "bg-[linear-gradient(-135deg,rgba(255,255,255,0.1),transparent_20%,transparent_100%)]"
        )}
      />
      <div
        className={cn(
          "relative rounded-full transition-all duration-300",
          isActive
            ? "shadow-[0_0_0_0_rgba(0,0,0,0.5)]"
            : "shadow-[0_0.05em_0.05em_-0.01em_rgba(0,0,0,0.5),0_0.01em_0.01em_-0.01em_rgba(0,0,0,0.3),0.15em_0.3em_0.1em_-0.01em_rgba(0,0,0,0.2)]"
        )}
      >
        <div
          className={cn(
            "relative rounded-full px-6 py-4 transition-all duration-250 overflow-hidden",
            // Gradient
            "bg-[linear-gradient(135deg,rgba(40,40,40,1),rgba(20,20,20,1))]",
            isActive ? "scale-[0.975]" : "scale-100",
            // Shadows
            isActive
              ? "shadow-[inset_0.1em_0.15em_0.05em_0_rgba(0,0,0,0.5),inset_-0.025em_-0.03em_0.05em_0.025em_rgba(255,255,255,0.1)]"
              : "shadow-[inset_-0.05em_-0.05em_0.05em_0_rgba(0,0,0,0.5),inset_0.025em_0.05em_0.1em_0_rgba(255,255,255,0.1)]"
          )}
        >
          <span
            className={cn(
              "relative block font-medium text-sm tracking-tight select-none transition-transform duration-250",
              isActive ? "scale-[0.975]" : "scale-100",
              "text-transparent bg-clip-text",
              "bg-gradient-to-br from-neutral-100 to-neutral-300",
              "drop-shadow-sm"
            )}
          >
            {children}
          </span>
        </div>
      </div>
    </button>
  );
}
