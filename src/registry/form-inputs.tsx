"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  className?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "Enter password",
  showStrength = true,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const calculateStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };

  const strength = calculateStrength(value);
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  const strengthLabels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative rounded-lg border transition-colors",
          focused ? "border-violet-500" : "border-white/10",
          "bg-white/5"
        )}
      >
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 bg-transparent text-white outline-none placeholder:text-zinc-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {showStrength && value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{
                  backgroundColor: i < strength ? strengthColors[strength - 1] : "#374151",
                  originX: 0,
                }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>
          <p
            className="text-xs"
            style={{ color: strengthColors[Math.max(0, strength - 1)] }}
          >
            {strengthLabels[Math.max(0, strength - 1)]}
          </p>
        </motion.div>
      )}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  suggestions = [],
  className,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  const handleSearch = () => {
    if (onSearch && value) {
      setLoading(true);
      onSearch(value);
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-lg border transition-colors",
          focused ? "border-violet-500" : "border-white/10",
          "bg-white/5"
        )}
      >
        <div className="pl-4">
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={placeholder}
          className="flex-1 px-3 py-3 bg-transparent text-white outline-none placeholder:text-zinc-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <AnimatePresence>
        {focused && value && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-white/10 bg-zinc-900 overflow-hidden z-50"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(suggestion);
                  handleSearch();
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/5 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add tag...",
  maxTags = 10,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      onChange([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-3 rounded-lg border transition-colors",
        focused ? "border-violet-500" : "border-white/10",
        "bg-white/5",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      {tags.length < maxTags && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(inputValue);
            } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
              removeTag(tags.length - 1);
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-w-[100px] bg-transparent text-white outline-none placeholder:text-zinc-500 text-sm"
        />
      )}
    </div>
  );
}

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function Autocomplete({
  value,
  onChange,
  options,
  placeholder = "Type to search...",
  className,
}: AutocompleteProps) {
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      onChange(filtered[highlightedIndex]);
      setFocused(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-lg border transition-colors bg-white/5 text-white outline-none placeholder:text-zinc-500",
          focused ? "border-violet-500" : "border-white/10"
        )}
      />
      <AnimatePresence>
        {focused && value && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-white/10 bg-zinc-900 overflow-hidden z-50 max-h-60 overflow-y-auto"
          >
            {filtered.map((option, index) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setFocused(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left transition-colors",
                  index === highlightedIndex
                    ? "bg-violet-500/20 text-white"
                    : "text-zinc-300 hover:bg-white/5"
                )}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export function DateInput({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: DateInputProps) {
  const [focused, setFocused] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === currentMonth.getMonth() &&
      value.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setFocused(!focused)}
        className={cn(
          "w-full px-4 py-3 rounded-lg border transition-colors bg-white/5 text-left flex items-center justify-between",
          focused ? "border-violet-500" : "border-white/10"
        )}
      >
        <span className={value ? "text-white" : "text-zinc-500"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 p-4 rounded-lg border border-white/10 bg-zinc-900 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="p-1 hover:bg-white/5 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-white font-medium">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="p-1 hover:bg-white/5 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-xs text-zinc-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    onChange(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    );
                    setFocused(false);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm transition-colors",
                    isSelected(day)
                      ? "bg-violet-500 text-white"
                      : isToday(day)
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-zinc-300 hover:bg-white/5"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
