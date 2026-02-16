"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  presets?: string[];
  className?: string;
  variant?: "default" | "compact" | "inline";
}

const defaultPresets = [
  "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#ef4444",
  "#f97316", "#eab308", "#84cc16", "#22c55e", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#a855f7",
];

export function ColorPicker({
  value = "#8b5cf6",
  onChange,
  presets = defaultPresets,
  className,
  variant = "default",
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(value);
  const [hue, setHue] = useState(260);
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(60);
  const pickerRef = useRef<HTMLDivElement>(null);

  const updateColor = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    const newColor = hslToHex(h, s, l);
    setColor(newColor);
    onChange?.(newColor);
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  if (variant === "compact") {
    return (
      <div className={cn("relative", className)}>
        <motion.button
          className="w-8 h-8 rounded-lg border-2 border-white/20"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full mt-2 left-0 p-3 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-5 gap-2">
                {presets.map((preset) => (
                  <motion.button
                    key={preset}
                    className={cn(
                      "w-6 h-6 rounded-md",
                      color === preset && "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                    )}
                    style={{ backgroundColor: preset }}
                    onClick={() => {
                      setColor(preset);
                      onChange?.(preset);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {presets.map((preset) => (
          <motion.button
            key={preset}
            className={cn(
              "w-8 h-8 rounded-lg",
              color === preset && "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
            )}
            style={{ backgroundColor: preset }}
            onClick={() => {
              setColor(preset);
              onChange?.(preset);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={pickerRef} className={cn("w-64 rounded-xl bg-zinc-900/50 border border-white/10 p-4", className)}>
      <div
        className="relative w-full h-40 rounded-lg mb-4 cursor-crosshair"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const s = Math.round(x * 100);
          const l = Math.round((1 - y) * 50);
          updateColor(hue, s, l);
        }}
      >
        <motion.div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${saturation}%`,
            top: `${100 - lightness * 2}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="relative mb-4">
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => updateColor(Number(e.target.value), saturation, lightness)}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border border-white/10"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
              setColor(val);
              onChange?.(val);
            }
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono uppercase"
        />
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-zinc-500 mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {presets.slice(0, 10).map((preset) => (
            <motion.button
              key={preset}
              className={cn(
                "w-6 h-6 rounded-md",
                color === preset && "ring-2 ring-white"
              )}
              style={{ backgroundColor: preset }}
              onClick={() => {
                setColor(preset);
                onChange?.(preset);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface GradientPickerProps {
  value?: string;
  onChange?: (gradient: string) => void;
  className?: string;
}

export function GradientPicker({ value, onChange, className }: GradientPickerProps) {
  const [color1, setColor1] = useState("#8b5cf6");
  const [color2, setColor2] = useState("#d946ef");
  const [angle, setAngle] = useState(135);

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const handleChange = (c1: string, c2: string, a: number) => {
    const newGradient = `linear-gradient(${a}deg, ${c1}, ${c2})`;
    onChange?.(newGradient);
  };

  return (
    <div className={cn("w-64 rounded-xl bg-zinc-900/50 border border-white/10 p-4", className)}>
      <div
        className="w-full h-24 rounded-lg mb-4"
        style={{ background: gradient }}
      />
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-zinc-500 mb-1 block">Start</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => {
                setColor1(e.target.value);
                handleChange(e.target.value, color2, angle);
              }}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => {
                setColor1(e.target.value);
                handleChange(e.target.value, color2, angle);
              }}
              className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs font-mono uppercase"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-zinc-500 mb-1 block">End</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => {
                setColor2(e.target.value);
                handleChange(color1, e.target.value, angle);
              }}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => {
                setColor2(e.target.value);
                handleChange(color1, e.target.value, angle);
              }}
              className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs font-mono uppercase"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Angle: {angle}°</label>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => {
            setAngle(Number(e.target.value));
            handleChange(color1, color2, Number(e.target.value));
          }}
          className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
