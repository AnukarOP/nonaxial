"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SoftButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function SoftButton({ children = "Button", className, ...props }: SoftButtonProps) {
  return (
    <div
      className={cn(
        "group relative m-0 flex h-[50px] w-[160px] cursor-pointer items-center justify-center",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          "bg-transparent",
          "text-white",
          "tracking-[1px]",
          "rounded-[30px]",
          "z-10",
          "font-medium",
          "border-t border-b border-white/10",
          // Neumorphic shadow
          "shadow-[4px_4px_6px_0_rgba(255,255,255,0.05),-4px_-4px_6px_0_rgba(0,0,0,0.5),inset_-4px_-4px_6px_0_rgba(255,255,255,0.05),inset_4px_4px_6px_0_rgba(0,0,0,0.6)]",
          // Transitions
          "transition-all duration-[600ms]",
          // Hover States
          "group-hover:bg-violet-600",
          "group-hover:text-white",
          "group-hover:tracking-[2px]",
          "group-hover:scale-[1.05]",
          // Active State
          "group-active:scale-[0.98]",
          // Hover shadow
          "group-hover:shadow-[0_0_20px_rgba(139,92,246,0.6),4px_4px_8px_0_rgba(255,255,255,0.08),-4px_-4px_8px_0_rgba(0,0,0,0.6)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
