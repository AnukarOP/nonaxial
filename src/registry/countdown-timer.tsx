"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  variant?: "cards" | "minimal" | "neon" | "gradient";
  showLabels?: boolean;
  onComplete?: () => void;
}

interface TimeUnit {
  value: number;
  label: string;
}

export function CountdownTimer({
  targetDate,
  className,
  variant = "cards",
  showLabels = true,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: "Days" },
    { value: 0, label: "Hours" },
    { value: 0, label: "Minutes" },
    { value: 0, label: "Seconds" },
  ]);
  const [isComplete, setIsComplete] = useState(false);
  const prevValues = useRef<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return [
          { value: 0, label: "Days" },
          { value: 0, label: "Hours" },
          { value: 0, label: "Minutes" },
          { value: 0, label: "Seconds" },
        ];
      }

      return [
        { value: Math.floor(difference / (1000 * 60 * 60 * 24)), label: "Days" },
        { value: Math.floor((difference / (1000 * 60 * 60)) % 24), label: "Hours" },
        { value: Math.floor((difference / 1000 / 60) % 60), label: "Minutes" },
        { value: Math.floor((difference / 1000) % 60), label: "Seconds" },
      ];
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      prevValues.current = timeLeft.map((t) => t.value);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, timeLeft]);

  const FlipCard = ({ value, label, index }: { value: number; label: string; index: number }) => {
    const hasChanged = prevValues.current[index] !== value;

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={hasChanged ? { rotateX: -90, opacity: 0 } : false}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "relative flex items-center justify-center font-bold tabular-nums",
                variant === "cards" &&
                  "w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl border border-white/10 text-3xl sm:text-4xl shadow-xl",
                variant === "minimal" && "text-4xl sm:text-6xl text-white",
                variant === "neon" &&
                  "w-16 h-20 sm:w-20 sm:h-24 bg-black rounded-xl border-2 border-violet-500 text-3xl sm:text-4xl text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.5)]",
                variant === "gradient" &&
                  "w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl text-3xl sm:text-4xl text-white shadow-xl"
              )}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              {String(value).padStart(2, "0")}
              
              {variant === "cards" && (
                <>
                  <div className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/5" />
                </>
              )}
              
              {variant === "neon" && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-violet-500/20"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {showLabels && (
          <span
            className={cn(
              "mt-2 text-xs sm:text-sm uppercase tracking-wider",
              variant === "neon" ? "text-violet-400" : "text-zinc-400"
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-4", className)}>
      {timeLeft.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <FlipCard value={unit.value} label={unit.label} index={index} />
          {index < timeLeft.length - 1 && (
            <motion.span
              className={cn(
                "text-2xl sm:text-4xl font-bold",
                variant === "neon" ? "text-violet-400" : "text-zinc-500"
              )}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}
