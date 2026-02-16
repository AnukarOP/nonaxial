import React, { useState } from "react";
import { motion, useMotionValue, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface DraggableStackProps {
  children: React.ReactNode[];
  className?: string;
}

function DraggableCard({ child, index, controls }: { child: React.ReactNode; index: number; controls: any }) {
  const y = useMotionValue(0);
  return (
    <motion.div
      drag="y"
      dragControls={controls}
      style={{ y, zIndex: 10 - index }}
      className={cn(
        "relative bg-zinc-900 rounded-2xl shadow-xl overflow-hidden cursor-grab select-none mb-[-48px]",
        index === 0 ? "" : "-mt-12"
      )}
      whileTap={{ scale: 0.97 }}
    >
      {child}
    </motion.div>
  );
}

export function DraggableStack({ children, className }: DraggableStackProps) {
  const controls = useDragControls();
  return (
    <div className={cn("relative", className)}>
      {children.map((child, i) => (
        <DraggableCard key={i} child={child} index={i} controls={controls} />
      ))}
    </div>
  );
}
