"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect?: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
  items,
  placeholder = "Type a command or search...",
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: CommandItem[] } = {};
    filteredItems.forEach((item) => {
      const group = item.group || "Commands";
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filteredItems]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].onSelect?.();
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "relative w-full max-w-xl rounded-xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden",
              className
            )}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 px-4 border-b border-white/10">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={placeholder}
                className="flex-1 py-4 bg-transparent text-white placeholder-zinc-500 outline-none"
              />
              <kbd className="px-2 py-1 text-xs text-zinc-500 bg-zinc-800 rounded">Esc</kbd>
            </div>
            <div className="max-h-80 overflow-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-zinc-500">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group}>
                    <div className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {group}
                    </div>
                    {groupItems.map((item, index) => {
                      const globalIndex = filteredItems.indexOf(item);
                      return (
                        <motion.button
                          key={item.id}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-left transition-colors",
                            globalIndex === selectedIndex
                              ? "bg-violet-500/20 text-white"
                              : "text-zinc-300 hover:bg-white/5"
                          )}
                          onClick={() => {
                            item.onSelect?.();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          {item.icon && (
                            <span className="w-5 h-5 text-zinc-400">{item.icon}</span>
                          )}
                          <span className="flex-1">{item.label}</span>
                          {item.shortcut && (
                            <div className="flex gap-1">
                              {item.shortcut.split("+").map((key, i) => (
                                <kbd
                                  key={i}
                                  className="px-1.5 py-0.5 text-xs text-zinc-400 bg-zinc-800 rounded"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-4 px-4 py-3 border-t border-white/10 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↓</kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd>
                <span className="ml-1">Select</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "default" | "minimal" | "bordered";
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className,
  variant = "default",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localValue);
  };

  const variantStyles = {
    default: "bg-zinc-900/50 border border-white/10",
    minimal: "bg-white/5",
    bordered: "bg-transparent border-2 border-violet-500/30",
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <motion.div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
          variantStyles[variant]
        )}
        animate={{
          borderColor: isFocused
            ? "rgba(139,92,246,0.5)"
            : variant === "bordered"
            ? "rgba(139,92,246,0.3)"
            : "rgba(255,255,255,0.1)",
        }}
      >
        <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            onChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
        />
        {localValue && (
          <motion.button
            type="button"
            onClick={() => {
              setLocalValue("");
              onChange?.("");
            }}
            className="text-zinc-500 hover:text-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </form>
  );
}
