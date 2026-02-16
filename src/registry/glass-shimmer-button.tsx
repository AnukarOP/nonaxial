"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassShimmerButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function GlassShimmerButton({
  children = "Shimmer",
  onClick,
  className,
}: GlassShimmerButtonProps) {
  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
      <button
        onClick={onClick}
        className={cn(
          "relative group px-8 py-4 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300",
          // Glass effect
          "bg-white/10 backdrop-blur-md",
          "border border-white/20",
          // Hover
          "hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20",
          // Active
          "active:scale-95",
          className
        )}
      >
        <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <span className="relative z-10 text-white font-semibold tracking-wide">{children}</span>
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </>
  );
}
