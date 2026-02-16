"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipCounterProps {
  value: number;
  className?: string;
  digitClassName?: string;
  duration?: number;
  formatValue?: (value: number) => string;
}

export function FlipCounter({
  value,
  className,
  digitClassName,
  duration = 0.5,
  formatValue = (v) => v.toLocaleString(),
}: FlipCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [digits, setDigits] = useState<string[]>([]);
  const prevDigits = useRef<string[]>([]);

  useEffect(() => {
    const formatted = formatValue(value);
    const newDigits = formatted.split("");
    prevDigits.current = digits;
    setDigits(newDigits);
    setDisplayValue(value);
  }, [value, formatValue, digits]);

  return (
    <div className={cn("flex items-center font-mono", className)}>
      {digits.map((digit, index) => {
        const prevDigit = prevDigits.current[index];
        const hasChanged = prevDigit !== digit;
        const isNumber = !isNaN(parseInt(digit));

        if (!isNumber) {
          return (
            <span key={`sep-${index}`} className="text-zinc-400 mx-0.5">
              {digit}
            </span>
          );
        }

        return (
          <div
            key={index}
            className={cn(
              "relative w-8 h-12 sm:w-12 sm:h-16 overflow-hidden",
              digitClassName
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${digit}-${index}`}
                initial={
                  hasChanged
                    ? { y: "-100%", rotateX: 90, opacity: 0 }
                    : false
                }
                animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                exit={{ y: "100%", rotateX: -90, opacity: 0 }}
                transition={{
                  duration,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg border border-white/10 text-2xl sm:text-3xl font-bold text-white"
                style={{ transformStyle: "preserve-3d" }}
              >
                {digit}
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-lg" />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// Animated counter that counts up/down
interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
  onComplete?: () => void;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className,
  formatter = (v) => v.toLocaleString(),
  onComplete,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const countRef = useRef(from);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    countRef.current = from;
    setCount(from);
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(from + (to - from) * easeOut);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration, onComplete]);

  return (
    <motion.span
      className={cn("tabular-nums", className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {formatter(count)}
    </motion.span>
  );
}
