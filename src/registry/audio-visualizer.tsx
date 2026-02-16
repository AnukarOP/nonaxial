"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  audioSrc?: string;
  barCount?: number;
  barColor?: string;
  barGap?: number;
  className?: string;
  variant?: "bars" | "wave" | "circular";
  isPlaying?: boolean;
}

export function AudioVisualizer({
  barCount = 32,
  barColor,
  barGap = 2,
  className,
  variant = "bars",
  isPlaying = true,
}: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0.3));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(0.3));
      return;
    }

    const interval = setInterval(() => {
      setBars(
        Array(barCount)
          .fill(0)
          .map(() => 0.2 + Math.random() * 0.8)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [barCount, isPlaying]);

  if (variant === "circular") {
    return (
      <div className={cn("relative w-48 h-48", className)}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {bars.map((height, index) => {
            const angle = (index / barCount) * 360;
            const radians = (angle * Math.PI) / 180;
            const innerRadius = 25;
            const outerRadius = innerRadius + height * 20;
            const x1 = 50 + innerRadius * Math.cos(radians);
            const y1 = 50 + innerRadius * Math.sin(radians);
            const x2 = 50 + outerRadius * Math.cos(radians);
            const y2 = 50 + outerRadius * Math.sin(radians);

            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={barColor || `hsl(${(index / barCount) * 60 + 260}, 80%, 60%)`}
                strokeWidth={2}
                strokeLinecap="round"
                animate={{ x2, y2 }}
                transition={{ duration: 0.1 }}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (variant === "wave") {
    const points = bars
      .map((height, index) => {
        const x = (index / (barCount - 1)) * 100;
        const y = 50 - height * 30;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className={cn("w-full h-24", className)}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <motion.polyline
            points={points}
            fill="none"
            stroke={barColor || "url(#waveGradient)"}
            strokeWidth={2}
            animate={{ points }}
            transition={{ duration: 0.1 }}
          />
        </svg>
      </div>
    );
  }

  // Default bars variant
  return (
    <div
      className={cn("flex items-end justify-center h-24", className)}
      style={{ gap: barGap }}
    >
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            width: `calc((100% - ${(barCount - 1) * barGap}px) / ${barCount})`,
            background:
              barColor ||
              `linear-gradient(to top, #8b5cf6, #d946ef)`,
          }}
          animate={{ height: `${height * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );
}

interface MusicPlayerProps {
  title: string;
  artist?: string;
  coverImage?: string;
  className?: string;
}

export function MusicPlayer({ title, artist, coverImage, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.div
      className={cn(
        "rounded-2xl bg-zinc-900/50 border border-white/10 p-6 w-80",
        className
      )}
      whileHover={{ y: -4 }}
    >
      <motion.div
        className="relative w-full aspect-square rounded-xl overflow-hidden mb-4"
        animate={{ scale: isPlaying ? 1 : 0.95 }}
      >
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <AudioVisualizer barCount={16} isPlaying={isPlaying} className="h-12" />
        </div>
      </motion.div>
      <div className="text-center mb-4">
        <h3 className="font-semibold text-white truncate">{title}</h3>
        {artist && <p className="text-sm text-zinc-400">{artist}</p>}
      </div>
      <div className="mb-4">
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-zinc-500">
          <span>{Math.floor(progress * 3 / 100)}:{String(Math.floor((progress * 3 / 100) * 60 % 60)).padStart(2, "0")}</span>
          <span>3:00</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <motion.button
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </motion.button>
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
        <motion.button
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
