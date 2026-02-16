"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export function MacOSDockPreview() {
  const items: DockItem[] = [
    { id: "1", icon: <span className="text-2xl">📱</span>, label: "Finder", isActive: true },
    { id: "2", icon: <span className="text-2xl">🌐</span>, label: "Safari" },
    { id: "3", icon: <span className="text-2xl">💬</span>, label: "Messages", isActive: true },
    { id: "4", icon: <span className="text-2xl">🎵</span>, label: "Music" },
    { id: "5", icon: <span className="text-2xl">⚙️</span>, label: "Settings" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingIndex, setBouncingIndex] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);

  const handleClick = (index: number) => {
    setBouncingIndex(index);
    setTimeout(() => setBouncingIndex(null), 600);
  };

  return (
    <motion.div
      ref={dockRef}
      className={cn(
        "flex items-end gap-1 p-2 rounded-2xl",
        "bg-white/10 dark:bg-black/30 backdrop-blur-2xl",
        "border border-white/20 dark:border-white/10",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_8px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]"
      )}
      onMouseMove={(e) => {
        if (dockRef.current) {
          const rect = dockRef.current.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left);
        }
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        setHoveredIndex(null);
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {items.map((item, index) => (
        <DockIcon
          key={item.id}
          item={item}
          index={index}
          mouseX={mouseX}
          isHovered={hoveredIndex === index}
          isBouncing={bouncingIndex === index}
          onHover={() => setHoveredIndex(index)}
          onClick={() => handleClick(index)}
        />
      ))}
    </motion.div>
  );
}

interface DockIconProps {
  item: DockItem;
  index: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  isHovered: boolean;
  isBouncing: boolean;
  onHover: () => void;
  onClick: () => void;
}

function DockIcon({
  item,
  mouseX,
  isHovered,
  isBouncing,
  onHover,
  onClick,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const baseSize = 50;
  const magnification = 1.8;
  const distance = 140;

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const center = bounds.x + bounds.width / 2 - (ref.current?.parentElement?.getBoundingClientRect().x ?? 0);
    return val - center;
  });

  const sizeSync = useTransform(distanceCalc, [-distance, 0, distance], [
    baseSize,
    baseSize * magnification,
    baseSize,
  ]);

  const size = useSpring(sizeSync, {
    mass: 0.1,
    stiffness: 200,
    damping: 15,
  });

  const translateY = useTransform(size, [baseSize, baseSize * magnification], [0, -10]);
  const springY = useSpring(translateY, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center"
      onMouseEnter={onHover}
      style={{ y: springY }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-10 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none z-50 bg-zinc-800/95 text-white backdrop-blur-sm shadow-lg border border-white/10"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {item.label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800/95 border-white/10 rotate-45 border-r border-b" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center rounded-[12px] cursor-pointer",
          "bg-gradient-to-b from-white/20 to-white/5",
          "shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)]",
          "border border-white/20"
        )}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.9 }}
        animate={isBouncing ? {
          y: [0, -25, 0, -15, 0, -5, 0],
          transition: { duration: 0.6, ease: "easeOut" }
        } : {}}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[12px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        <motion.div
          className="text-white drop-shadow-lg"
          style={{
            scale: useTransform(size, [baseSize, baseSize * magnification], [1, 1.15]),
          }}
        >
          {item.icon}
        </motion.div>
      </motion.button>

      {item.isActive && (
        <motion.div
          className="w-1 h-1 rounded-full bg-white/80 mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.div>
  );
}
