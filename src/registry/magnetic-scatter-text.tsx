"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticScatterTextProps {
  text?: string;
  className?: string;
  trigger?: boolean;
}

export function MagneticScatterText({
  text = "Magnetic Text",
  className,
  trigger = true,
}: MagneticScatterTextProps) {
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    // Delay setting mounted to ensure animation controls are ready
    const timeoutId = setTimeout(() => {
      isMounted.current = true;
    }, 0);
    return () => { 
      clearTimeout(timeoutId);
      isMounted.current = false; 
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    const timeoutId = setTimeout(() => {
      if (trigger) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [trigger, controls]);

  useEffect(() => {
    if (!isMounted.current) return;
    const timeoutId = setTimeout(() => {
      if (isHovering) {
        controls.start("scatter");
      } else {
        controls.start("visible");
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isHovering, controls]);

  const letters = text.split("");

  // Deterministic random for consistent scattering based on index
  const getRandom = (index: number) => {
    const seed = index * 42;
    const x = Math.sin(seed) * 100;
    const y = Math.cos(seed) * 100;
    const rotate = Math.sin(seed * 2) * 180;
    return { x, y, rotate };
  };

  return (
    <motion.div
      className={cn("flex cursor-default select-none", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {letters.map((letter, index) => {
        const randoms = getRandom(index);
        return (
          <motion.span
            key={index}
            className="inline-block font-bold text-4xl text-white"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {
                x: randoms.x * 5,
                y: randoms.y * 5,
                rotate: randoms.rotate,
                opacity: 0,
                scale: 0.5,
              },
              visible: {
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  damping: 12,
                  stiffness: 80,
                  mass: 0.8,
                  delay: index * 0.02,
                },
              },
              scatter: {
                x: randoms.x * 0.5,
                y: randoms.y * 0.5,
                rotate: randoms.rotate * 0.2,
                scale: 1.1,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                },
              },
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
