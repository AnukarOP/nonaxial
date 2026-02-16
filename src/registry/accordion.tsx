"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated" | "ghost";
  defaultOpen?: string[];
}

export function Accordion({
  items,
  className,
  allowMultiple = false,
  variant = "default",
  defaultOpen = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const variantStyles = {
    default: {
      container: "divide-y divide-white/10",
      item: "bg-transparent",
      header: "hover:bg-white/5",
    },
    bordered: {
      container: "border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10",
      item: "bg-transparent",
      header: "hover:bg-white/5",
    },
    separated: {
      container: "space-y-2",
      item: "bg-zinc-900/50 rounded-xl border border-white/10 overflow-hidden",
      header: "hover:bg-white/5",
    },
    ghost: {
      container: "space-y-1",
      item: "bg-transparent",
      header: "hover:bg-violet-500/10 rounded-lg",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(styles.container, className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className={styles.item}>
            <motion.button
              onClick={() => toggleItem(item.id)}
              className={cn(
                "w-full flex items-center justify-between gap-4 px-4 py-4 text-left transition-colors",
                styles.header
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-violet-400">{item.icon}</span>}
                <span className="font-medium text-white">{item.title}</span>
              </div>

              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-zinc-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-zinc-400 text-sm leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
