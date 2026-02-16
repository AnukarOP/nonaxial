"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  variant?: "default" | "alternating" | "centered";
  animated?: boolean;
}

export function Timeline({
  items,
  className,
  variant = "default",
  animated = true,
}: TimelineProps) {
  if (variant === "centered") {
    return (
      <div className={cn("relative", className)}>
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800 -translate-x-1/2" />

        {items.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={item.id}
              className={cn(
                "relative flex items-center mb-8 last:mb-0",
                isLeft ? "justify-end pr-[50%]" : "justify-start pl-[50%]"
              )}
              initial={animated ? { opacity: 0, x: isLeft ? 50 : -50 } : false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-zinc-900 z-10"
                style={{ backgroundColor: item.color || "#8b5cf6" }}
              />
              <div
                className={cn(
                  "w-[calc(100%-40px)] p-4 bg-zinc-900/50 rounded-xl border border-white/10",
                  isLeft ? "mr-5 text-right" : "ml-5"
                )}
              >
                {item.date && (
                  <span className="text-xs text-violet-400 font-medium">{item.date}</span>
                )}
                <h3 className="text-white font-medium mt-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-zinc-400 mt-2">{item.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default and alternating variant
  return (
    <div className={cn("relative pl-8", className)}>
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-zinc-800" />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="relative mb-8 last:mb-0"
          initial={animated ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div
            className={cn(
              "absolute -left-5 flex items-center justify-center rounded-full border-4 border-zinc-900",
              item.icon ? "w-10 h-10 bg-zinc-800" : "w-4 h-4"
            )}
            style={{ backgroundColor: item.icon ? undefined : item.color || "#8b5cf6" }}
          >
            {item.icon && <span className="text-violet-400">{item.icon}</span>}
          </div>
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/10 ml-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-white font-medium">{item.title}</h3>
              {item.date && (
                <span className="text-xs text-zinc-400 whitespace-nowrap">{item.date}</span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-zinc-400 mt-2">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
