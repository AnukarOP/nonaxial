"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalogClockProps {
  className?: string;
  size?: number;
  showSeconds?: boolean;
  showNumbers?: boolean;
  variant?: "minimal" | "classic" | "neon" | "gradient";
}

export function AnalogClock({
  className,
  size = 200,
  showSeconds = true,
  showNumbers = true,
  variant = "minimal",
}: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = seconds * 6;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const hourDegrees = hours * 30 + minutes * 0.5;

  const variantStyles = {
    minimal: {
      face: "bg-zinc-900 border-zinc-700",
      hourHand: "bg-white",
      minuteHand: "bg-white",
      secondHand: "bg-violet-500",
      center: "bg-violet-500",
      numbers: "text-zinc-400",
    },
    classic: {
      face: "bg-gradient-to-br from-zinc-100 to-zinc-200 border-zinc-400",
      hourHand: "bg-zinc-800",
      minuteHand: "bg-zinc-700",
      secondHand: "bg-red-500",
      center: "bg-red-500",
      numbers: "text-zinc-800",
    },
    neon: {
      face: "bg-black border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.5)]",
      hourHand: "bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]",
      minuteHand: "bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]",
      secondHand: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]",
      center: "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]",
      numbers: "text-violet-400",
    },
    gradient: {
      face: "bg-gradient-to-br from-violet-900 to-fuchsia-900 border-violet-500/50",
      hourHand: "bg-gradient-to-b from-white to-violet-200",
      minuteHand: "bg-gradient-to-b from-white to-fuchsia-200",
      secondHand: "bg-gradient-to-b from-cyan-400 to-cyan-600",
      center: "bg-white",
      numbers: "text-white/80",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn("relative rounded-full border-4", styles.face, className)}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2"
          style={{
            height: size / 2 - 10,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
          }}
        >
          <div
            className={cn(
              "w-0.5 rounded-full",
              i % 3 === 0 ? "h-4 bg-white/60" : "h-2 bg-white/30"
            )}
          />
        </div>
      ))}
      {showNumbers && (
        <div className="absolute inset-0">
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = size / 2 - 28;
            const x = size / 2 + radius * Math.cos(angle);
            const y = size / 2 + radius * Math.sin(angle);

            return (
              <span
                key={num}
                className={cn("absolute text-sm font-medium", styles.numbers)}
                style={{
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {num}
              </span>
            );
          })}
        </div>
      )}
      <motion.div
        className={cn("absolute rounded-full", styles.hourHand)}
        style={{
          width: 4,
          height: size * 0.25,
          left: "50%",
          bottom: "50%",
          transformOrigin: "bottom center",
          marginLeft: -2,
        }}
        animate={{ rotate: hourDegrees }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className={cn("absolute rounded-full", styles.minuteHand)}
        style={{
          width: 3,
          height: size * 0.35,
          left: "50%",
          bottom: "50%",
          transformOrigin: "bottom center",
          marginLeft: -1.5,
        }}
        animate={{ rotate: minuteDegrees }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      {showSeconds && (
        <motion.div
          className={cn("absolute rounded-full", styles.secondHand)}
          style={{
            width: 2,
            height: size * 0.4,
            left: "50%",
            bottom: "50%",
            transformOrigin: "bottom center",
            marginLeft: -1,
          }}
          animate={{ rotate: secondDegrees }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      )}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
          styles.center
        )}
        style={{ width: size * 0.06, height: size * 0.06 }}
      />
    </div>
  );
}

// Digital clock component
interface DigitalClockProps {
  className?: string;
  showSeconds?: boolean;
  showDate?: boolean;
  use24Hour?: boolean;
  variant?: "default" | "neon" | "minimal" | "lcd";
}

export function DigitalClock({
  className,
  showSeconds = true,
  showDate = false,
  use24Hour = false,
  variant = "default",
}: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    if (!use24Hour) {
      hours = hours % 12 || 12;
    }

    const hoursStr = hours.toString().padStart(2, "0");

    return { hours: hoursStr, minutes, seconds, ampm };
  };

  const { hours, minutes, seconds, ampm } = formatTime();

  const variantClasses = {
    default: "text-white font-mono",
    neon: "text-violet-400 font-bold [text-shadow:0_0_10px_rgba(139,92,246,0.8),0_0_20px_rgba(139,92,246,0.6),0_0_30px_rgba(139,92,246,0.4)]",
    minimal: "text-zinc-300 font-light",
    lcd: "text-lime-400 font-mono bg-zinc-900 px-4 py-2 rounded border border-lime-500/30",
  };

  return (
    <div className={cn("flex items-center gap-1", variantClasses[variant], className)}>
      <motion.span
        key={hours}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-6xl tabular-nums"
      >
        {hours}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-4xl sm:text-6xl"
      >
        :
      </motion.span>
      <motion.span
        key={minutes}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-6xl tabular-nums"
      >
        {minutes}
      </motion.span>
      {showSeconds && (
        <>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-4xl sm:text-6xl"
          >
            :
          </motion.span>
          <motion.span
            key={seconds}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl tabular-nums"
          >
            {seconds}
          </motion.span>
        </>
      )}
      {!use24Hour && (
        <span className="text-lg sm:text-2xl ml-2 text-zinc-400">{ampm}</span>
      )}
      
      {showDate && (
        <div className="ml-4 text-sm text-zinc-400">
          {time.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
