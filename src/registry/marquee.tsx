"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  vertical?: boolean;
}

export function Marquee({
  children,
  className,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  gap = 24,
  vertical = false,
}: MarqueeProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(
        vertical
          ? contentRef.current.scrollHeight
          : contentRef.current.scrollWidth
      );
    }
  }, [children, vertical]);

  const duration = contentWidth / speed;
  const isReverse = direction === "right";

  return (
    <div
      className={cn(
        "overflow-hidden",
        vertical ? "h-full" : "w-full",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className={cn(
          "flex",
          vertical ? "flex-col" : "flex-row"
        )}
        animate={{
          [vertical ? "y" : "x"]: isReverse
            ? [0, contentWidth + gap]
            : [0, -(contentWidth + gap)],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        <div
          ref={contentRef}
          className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")}
          style={{ gap }}
        >
          {children}
        </div>
        <div
          className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")}
          style={{ gap, [vertical ? "marginTop" : "marginLeft"]: gap }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Example usage component
interface MarqueeItemProps {
  children: React.ReactNode;
  className?: string;
}

export function MarqueeItem({ children, className }: MarqueeItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-6 py-3 bg-zinc-800/50 rounded-lg border border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
