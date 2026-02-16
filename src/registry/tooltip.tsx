"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delay?: number;
  className?: string;
  variant?: "default" | "dark" | "light" | "gradient";
}

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 200,
  className,
  variant = "default",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionStyles = {
    top: {
      tooltip: "bottom-full mb-2",
      arrow: "top-full -mt-1 border-t-current border-x-transparent border-b-transparent",
      initial: { y: 5, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
    bottom: {
      tooltip: "top-full mt-2",
      arrow: "bottom-full -mb-1 border-b-current border-x-transparent border-t-transparent",
      initial: { y: -5, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
    left: {
      tooltip: "right-full mr-2",
      arrow: "left-full -ml-1 border-l-current border-y-transparent border-r-transparent",
      initial: { x: 5, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
    right: {
      tooltip: "left-full ml-2",
      arrow: "right-full -mr-1 border-r-current border-y-transparent border-l-transparent",
      initial: { x: -5, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
  };

  const alignStyles = {
    start: side === "top" || side === "bottom" ? "left-0" : "top-0",
    center:
      side === "top" || side === "bottom"
        ? "left-1/2 -translate-x-1/2"
        : "top-1/2 -translate-y-1/2",
    end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
  };

  const variantStyles = {
    default: "bg-zinc-800 text-white border border-white/10",
    dark: "bg-black text-white border border-white/20",
    light: "bg-white text-zinc-900 border border-zinc-200",
    gradient: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0",
  };

  const pos = positionStyles[side];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={pos.initial}
            animate={pos.animate}
            exit={{ ...pos.initial, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap pointer-events-none shadow-xl",
              pos.tooltip,
              alignStyles[align],
              variantStyles[variant],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
