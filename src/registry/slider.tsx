"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
  variant?: "default" | "gradient" | "neon" | "minimal";
}

export function Slider({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true,
  className,
  variant = "default",
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPercentage = x / rect.width;
    const newValue = Math.round((min + newPercentage * (max - min)) / step) * step;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    if (controlledValue === undefined) {
      setInternalValue(clampedValue);
    }
    onChange?.(clampedValue);
  };

  const trackStyles = {
    default: "bg-white/10",
    gradient: "bg-white/10",
    neon: "bg-zinc-800",
    minimal: "bg-white/5",
  };

  const fillStyles = {
    default: "bg-violet-500",
    gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    neon: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]",
    minimal: "bg-white",
  };

  const thumbStyles = {
    default: "bg-white shadow-lg",
    gradient: "bg-white shadow-lg shadow-violet-500/50",
    neon: "bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,1)]",
    minimal: "bg-white",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-zinc-400">{label}</span>}
          {showValue && <span className="text-sm font-medium text-white">{value}</span>}
        </div>
      )}
      <div
        ref={sliderRef}
        className={cn("relative h-2 rounded-full cursor-pointer", trackStyles[variant])}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleChange(e.clientX);
        }}
        onMouseMove={(e) => isDragging && handleChange(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleChange(e.touches[0].clientX);
        }}
        onTouchMove={(e) => isDragging && handleChange(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", fillStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
        <motion.div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full",
            thumbStyles[variant]
          )}
          style={{ left: `calc(${percentage}% - 10px)` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          whileHover={{ scale: 1.1 }}
        />
      </div>
    </div>
  );
}

interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: [number, number]) => void;
  label?: string;
  className?: string;
}

export function RangeSlider({
  value: controlledValue,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  className,
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const value = controlledValue ?? internalValue;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | null>(null);

  const startPercentage = ((value[0] - min) / (max - min)) * 100;
  const endPercentage = ((value[1] - min) / (max - min)) * 100;

  const handleChange = (clientX: number) => {
    if (!sliderRef.current || !activeThumb) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPercentage = x / rect.width;
    const newValue = Math.round((min + newPercentage * (max - min)) / step) * step;
    const clampedValue = Math.max(min, Math.min(max, newValue));

    let newRange: [number, number];
    if (activeThumb === "start") {
      newRange = [Math.min(clampedValue, value[1] - step), value[1]];
    } else {
      newRange = [value[0], Math.max(clampedValue, value[0] + step)];
    }

    if (controlledValue === undefined) {
      setInternalValue(newRange);
    }
    onChange?.(newRange);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">{label}</span>
          <span className="text-sm font-medium text-white">
            {value[0]} - {value[1]}
          </span>
        </div>
      )}
      <div
        ref={sliderRef}
        className="relative h-2 rounded-full bg-white/10 cursor-pointer"
        onMouseMove={(e) => activeThumb && handleChange(e.clientX)}
        onMouseUp={() => setActiveThumb(null)}
        onMouseLeave={() => setActiveThumb(null)}
        onTouchMove={(e) => activeThumb && handleChange(e.touches[0].clientX)}
        onTouchEnd={() => setActiveThumb(null)}
      >
        <div
          className="absolute inset-y-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
          style={{
            left: `${startPercentage}%`,
            width: `${endPercentage - startPercentage}%`,
          }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${startPercentage}% - 10px)` }}
          onMouseDown={() => setActiveThumb("start")}
          onTouchStart={() => setActiveThumb("start")}
          animate={{ scale: activeThumb === "start" ? 1.2 : 1 }}
          whileHover={{ scale: 1.1 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${endPercentage}% - 10px)` }}
          onMouseDown={() => setActiveThumb("end")}
          onTouchStart={() => setActiveThumb("end")}
          animate={{ scale: activeThumb === "end" ? 1.2 : 1 }}
          whileHover={{ scale: 1.1 }}
        />
      </div>
    </div>
  );
}

interface VolumeSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
}

export function VolumeSlider({
  value = 70,
  onChange,
  muted = false,
  onMuteToggle,
  className,
}: VolumeSliderProps) {
  const getVolumeIcon = () => {
    if (muted || value === 0) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      );
    }
    if (value < 50) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    );
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <motion.button
        onClick={onMuteToggle}
        className="text-zinc-400 hover:text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {getVolumeIcon()}
      </motion.button>
      <Slider
        value={muted ? 0 : value}
        onChange={onChange}
        showValue={false}
        variant="minimal"
        className="w-24"
      />
    </div>
  );
}
