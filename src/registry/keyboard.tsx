"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
  highlightedKeys?: string[];
  pressedKeys?: string[];
  className?: string;
  variant?: "default" | "minimal" | "neon";
  listenToKeyboard?: boolean;
}

const keyboardLayout = [
  ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Ctrl"],
];

const getKeyWidth = (key: string) => {
  switch (key) {
    case "⌫":
    case "Tab":
    case "Caps":
    case "Enter":
      return "w-16";
    case "Shift":
      return "w-20";
    case "Space":
      return "w-48";
    case "Ctrl":
    case "Alt":
      return "w-12";
    default:
      return "w-10";
  }
};

export function Keyboard({
  onKeyPress,
  highlightedKeys = [],
  pressedKeys = [],
  className,
  variant = "default",
  listenToKeyboard = false,
}: KeyboardProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [liveKeys, setLiveKeys] = useState<Set<string>>(new Set());

  // Map physical key codes to display keys
  const mapKeyToDisplay = useCallback((e: KeyboardEvent): string | null => {
    const key = e.key.toUpperCase();
    const code = e.code;

    // Special keys mapping
    const keyMap: Record<string, string> = {
      "BACKSPACE": "⌫",
      "TAB": "Tab",
      "CAPSLOCK": "Caps",
      "ENTER": "Enter",
      "SHIFTLEFT": "Shift",
      "SHIFTRIGHT": "Shift",
      "CONTROLLEFT": "Ctrl",
      "CONTROLRIGHT": "Ctrl",
      "ALTLEFT": "Alt",
      "ALTRIGHT": "Alt",
      "METALEFT": "Win",
      "METARIGHT": "Win",
      "SPACE": "Space",
      "ESCAPE": "Esc",
      "MINUS": "-",
      "EQUAL": "=",
      "BRACKETLEFT": "[",
      "BRACKETRIGHT": "]",
      "BACKSLASH": "\\",
      "SEMICOLON": ";",
      "QUOTE": "'",
      "COMMA": ",",
      "PERIOD": ".",
      "SLASH": "/",
    };

    if (keyMap[code.toUpperCase()]) {
      return keyMap[code.toUpperCase()];
    }

    // Regular letter/number keys
    if (/^[A-Z0-9]$/.test(key)) {
      return key;
    }

    return null;
  }, []);

  useEffect(() => {
    if (!listenToKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const displayKey = mapKeyToDisplay(e);
      if (displayKey) {
        setLiveKeys(prev => new Set(prev).add(displayKey));
        onKeyPress?.(displayKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const displayKey = mapKeyToDisplay(e);
      if (displayKey) {
        setLiveKeys(prev => {
          const next = new Set(prev);
          next.delete(displayKey);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [listenToKeyboard, mapKeyToDisplay, onKeyPress]);

  const handleKeyClick = (key: string) => {
    setActiveKey(key);
    onKeyPress?.(key);
    setTimeout(() => setActiveKey(null), 100);
  };

  // Combine pressed keys from props and live keyboard input
  const allPressedKeys = [...pressedKeys, ...Array.from(liveKeys)];

  const keyStyles = {
    default: {
      base: "bg-zinc-800 border border-zinc-700 text-zinc-300 shadow-[0_4px_0_0_#27272a]",
      pressed: "bg-zinc-700 shadow-[0_1px_0_0_#27272a] translate-y-[3px]",
      highlighted: "bg-violet-600 border-violet-500 text-white shadow-[0_4px_0_0_#7c3aed]",
    },
    minimal: {
      base: "bg-white/5 border border-white/10 text-zinc-400",
      pressed: "bg-white/10",
      highlighted: "bg-violet-500/20 border-violet-500/30 text-violet-400",
    },
    neon: {
      base: "bg-black border border-violet-500/30 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]",
      pressed: "bg-violet-900/50 shadow-[0_0_20px_rgba(139,92,246,0.5)]",
      highlighted: "bg-violet-600 border-violet-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.8),0_4px_0_0_#7c3aed]",
    },
  };

  const styles = keyStyles[variant];

  return (
    <div className={cn("p-4 rounded-xl bg-zinc-900/50 border border-white/10 inline-block", className)}>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center mb-1.5 last:mb-0">
          {row.map((key, keyIndex) => {
            const isPressed = allPressedKeys.includes(key) || activeKey === key;
            const isHighlighted = highlightedKeys.includes(key);

            return (
              <motion.button
                key={`${rowIndex}-${keyIndex}`}
                className={cn(
                  "h-10 rounded-md flex items-center justify-center text-xs font-medium transition-all",
                  getKeyWidth(key),
                  styles.base,
                  isPressed && styles.pressed,
                  isHighlighted && styles.highlighted
                )}
                onClick={() => handleKeyClick(key)}
                whileTap={{ scale: 0.95 }}
              >
                {key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface KeyCapProps {
  keyLabel: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "ghost";
  className?: string;
}

export function KeyCap({ keyLabel, size = "md", variant = "default", className }: KeyCapProps) {
  const sizeStyles = {
    sm: "min-w-[24px] h-6 px-1.5 text-xs",
    md: "min-w-[32px] h-8 px-2 text-sm",
    lg: "min-w-[40px] h-10 px-3 text-base",
  };

  const variantStyles = {
    default: "bg-zinc-800 border border-zinc-600 text-zinc-300 shadow-[0_2px_0_0_#27272a]",
    primary: "bg-violet-600 border border-violet-500 text-white shadow-[0_2px_0_0_#5b21b6]",
    ghost: "bg-transparent border border-zinc-700 text-zinc-400",
  };

  return (
    <motion.kbd
      className={cn(
        "inline-flex items-center justify-center rounded font-mono",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      whileHover={{ y: -2 }}
      whileTap={{ y: 2, boxShadow: "none" }}
    >
      {keyLabel}
    </motion.kbd>
  );
}

interface ShortcutDisplayProps {
  keys: string[];
  className?: string;
}

export function ShortcutDisplay({ keys, className }: ShortcutDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {keys.map((key, index) => (
        <span key={index} className="flex items-center gap-1">
          <KeyCap keyLabel={key} size="sm" />
          {index < keys.length - 1 && <span className="text-zinc-500 text-xs">+</span>}
        </span>
      ))}
    </div>
  );
}
