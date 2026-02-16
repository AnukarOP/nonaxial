"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface VaporSmokeTextProps {
  text?: string;
  className?: string;
  trigger?: boolean;
}

export function VaporSmokeText({
  text = "Vapor Smoke",
  className,
  trigger = true,
}: VaporSmokeTextProps) {
  const letters = text.split("");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 1.5,
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(20px)",
      y: 20,
      scale: 1.5,
      rotate: 5,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap overflow-hidden text-white text-4xl font-serif italic", className)}
      variants={container}
      initial="hidden"
      animate={trigger ? "visible" : "hidden"}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block origin-bottom"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
