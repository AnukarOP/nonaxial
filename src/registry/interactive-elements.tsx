"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

interface SegmentedControlProps {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: "default" | "pills" | "bordered" | "glass";
}

export function SegmentedControl({
  items,
  value,
  onChange,
  className,
  variant = "default",
}: SegmentedControlProps) {
  const [selected, setSelected] = useState(value || items[0]?.id);

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  const variantStyles = {
    default: {
      container: "bg-zinc-900/50 border border-white/10 p-1",
      item: "text-zinc-400 hover:text-white",
      active: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg",
    },
    pills: {
      container: "bg-transparent gap-2",
      item: "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white",
      active: "bg-violet-500 text-white",
    },
    bordered: {
      container: "bg-transparent border-2 border-white/10 p-1",
      item: "text-zinc-400 hover:text-white",
      active: "bg-white text-zinc-900",
    },
    glass: {
      container: "bg-white/5 backdrop-blur-xl border border-white/10 p-1",
      item: "text-zinc-400 hover:text-white",
      active: "bg-white/20 text-white backdrop-blur-sm",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn("inline-flex rounded-xl", styles.container, className)}>
      {items.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className={cn(
            "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            styles.item,
            selected === item.id && styles.active
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {item.icon}
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
}

export function Chip({
  label,
  icon,
  onRemove,
  onClick,
  selected = false,
  disabled = false,
  className,
  variant = "default",
  size = "md",
}: ChipProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const variantStyles = {
    default: selected
      ? "bg-violet-500 text-white"
      : "bg-white/10 text-zinc-300 hover:bg-white/20",
    outlined: selected
      ? "border-2 border-violet-500 text-violet-400"
      : "border-2 border-white/20 text-zinc-300 hover:border-white/40",
    filled: selected
      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center rounded-full",
        sizeStyles[size],
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        onClick && !disabled && "cursor-pointer",
        className
      )}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {icon}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-white"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

interface ChipGroupProps {
  chips: { id: string; label: string; icon?: React.ReactNode }[];
  selectedIds?: string[];
  onChange?: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export function ChipGroup({
  chips,
  selectedIds = [],
  onChange,
  multiSelect = false,
  className,
}: ChipGroupProps) {
  const handleSelect = (id: string) => {
    if (multiSelect) {
      const newSelected = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id];
      onChange?.(newSelected);
    } else {
      onChange?.(selectedIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          icon={chip.icon}
          selected={selectedIds.includes(chip.id)}
          onClick={() => handleSelect(chip.id)}
        />
      ))}
    </div>
  );
}

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  countryCode?: string;
  className?: string;
}

export function PhoneInput({
  value = "",
  onChange,
  placeholder = "123 456 7890",
  countryCode = "+1",
  className,
}: PhoneInputProps) {
  const formatPhone = (input: string) => {
    const numbers = input.replace(/\D/g, "").slice(0, 10);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  };

  return (
    <div className={cn("flex", className)}>
      <div className="flex items-center gap-2 px-4 py-3 rounded-l-xl bg-zinc-800 border border-r-0 border-white/10 text-zinc-400">
        <span>{countryCode}</span>
      </div>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange?.(formatPhone(e.target.value))}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-r-xl bg-zinc-900/50 border border-white/10 text-white placeholder-zinc-500 outline-none focus:border-violet-500/50"
      />
    </div>
  );
}

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  className,
}: OTPInputProps) {
  const [otp, setOtp] = useState(value.split("").slice(0, length));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange?.(otpValue);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (otpValue.length === length) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newOtp = pasted.split("");
    setOtp(newOtp);
    onChange?.(pasted);
    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  };

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-zinc-900/50 border border-white/10 text-white outline-none focus:border-violet-500"
          whileFocus={{ scale: 1.05, borderColor: "rgba(139,92,246,0.5)" }}
        />
      ))}
    </div>
  );
}
