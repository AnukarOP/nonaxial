"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: "pills" | "underline" | "enclosed" | "floating";
  size?: "sm" | "md" | "lg";
  onChange?: (tabId: string) => void;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  className,
  variant = "pills",
  size = "md",
  onChange,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex",
          variant === "enclosed" && "bg-zinc-900/50 rounded-xl p-1 border border-white/10",
          variant === "floating" && "gap-2"
        )}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative flex items-center justify-center gap-2 font-medium transition-colors z-10",
              sizeClasses[size],
              activeTab === tab.id
                ? "text-white"
                : "text-zinc-400 hover:text-zinc-200",
              variant === "underline" && "border-b-2 border-transparent",
              variant === "floating" && "rounded-full"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            
            {activeTab === tab.id && variant === "pills" && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {activeTab === tab.id && variant === "underline" && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {activeTab === tab.id && variant === "enclosed" && (
              <motion.div
                layoutId="tab-enclosed"
                className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-lg border border-violet-500/30 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {activeTab === tab.id && variant === "floating" && (
              <motion.div
                layoutId="tab-floating"
                className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 -z-10 shadow-lg shadow-violet-500/20"
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeTabContent && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {activeTabContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
