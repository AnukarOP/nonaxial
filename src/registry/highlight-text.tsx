"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  children: string;
  className?: string;
  highlightColor?: string;
}

interface InkDrip {
  id: number;
  x: number;
  delay: number;
  height: number;
  duration: number;
}

export function HighlightText({ 
  children, 
  className, 
  highlightColor = "rgba(139, 92, 246, 0.4)" 
}: HighlightTextProps) {
  
  // Generate ink drip effects
  const inkDrips: InkDrip[] = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 10 + i * 20 + ((Math.sin(i * 3.7) + 1) / 2) * 10,
      delay: 0.8 + i * 0.15 + ((Math.sin(i * 5.3) + 1) / 2) * 0.1,
      height: 8 + ((Math.sin(i * 7.1) + 1) / 2) * 15,
      duration: 0.6 + ((Math.sin(i * 2.9) + 1) / 2) * 0.3,
    }));
  }, []);

  // Paper texture noise pattern
  const paperTexture = useMemo(() => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;
  }, []);

  return (
    <span className={cn("relative inline-block", className)}>
      <span
        className="absolute inset-0 rounded pointer-events-none"
        style={{
          backgroundImage: paperTexture,
          backgroundSize: "50px 50px",
          opacity: 0.5,
        }}
      />
      <motion.span
        className="absolute inset-0 -skew-x-3 rounded-sm"
        style={{ 
          backgroundColor: highlightColor,
          transformOrigin: "left center",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 2px,
              rgba(255,255,255,0.1) 2px,
              rgba(255,255,255,0.1) 4px
            )`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        <motion.span
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, 
              ${highlightColor} 0%, 
              rgba(255,255,255,0.2) 20%,
              ${highlightColor} 40%,
              rgba(255,255,255,0.15) 60%,
              ${highlightColor} 80%,
              rgba(255,255,255,0.1) 100%
            )`,
            filter: "blur(1px)",
          }}
        />
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-[4px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(0,0,0,0.1) 20%,
              transparent 40%,
              rgba(0,0,0,0.15) 70%,
              transparent 100%
            )`,
          }}
        />
      </motion.span>
      <motion.span
        className="absolute inset-0 -skew-x-3 rounded-sm pointer-events-none"
        style={{ 
          backgroundColor: highlightColor,
          opacity: 0.3,
          transformOrigin: "left center",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.15,
        }}
      />
      {inkDrips.map((drip) => (
        <motion.span
          key={drip.id}
          className="absolute rounded-b-full pointer-events-none"
          style={{
            left: `${drip.x}%`,
            bottom: 0,
            width: "3px",
            backgroundColor: highlightColor,
            transformOrigin: "top center",
          }}
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ 
            height: drip.height,
            opacity: [0, 0.8, 0.6],
          }}
          viewport={{ once: true }}
          transition={{
            duration: drip.duration,
            delay: drip.delay,
            ease: "easeOut",
          }}
        >
          <motion.span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 5,
              height: 5,
              backgroundColor: highlightColor,
            }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: drip.delay + drip.duration * 0.7,
              duration: 0.2,
            }}
          />
        </motion.span>
      ))}
      <motion.span
        className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-sm pointer-events-none"
        style={{
          background: `linear-gradient(180deg, 
            rgba(255,255,255,0.2) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.1) 100%
          )`,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      />
      <motion.span
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "15px",
          height: "60%",
          background: `linear-gradient(90deg, ${highlightColor} 0%, transparent 100%)`,
          transform: "skewX(-5deg) translateY(-50%)",
          opacity: 0.5,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.2 }}
      />
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        initial={{ backgroundPosition: "-100% 0%" }}
        whileInView={{ backgroundPosition: "200% 0%" }}
        viewport={{ once: true }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease: "easeOut",
        }}
      />
    </span>
  );
}
