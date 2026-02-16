"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  children: string;
  className?: string;
  scrambleSpeed?: number;
  characters?: string;
}

interface MatrixDrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  chars: string[];
}

interface GlitchEffect {
  id: number;
  charIndex: number;
  offsetX: number;
  offsetY: number;
}

export function ScrambleText({
  children,
  className,
  scrambleSpeed = 30,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}|",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isHovering, setIsHovering] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [glitchEffects, setGlitchEffects] = useState<GlitchEffect[]>([]);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Matrix rain drops
  const matrixDrops: MatrixDrop[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (i / 12) * 100,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random(),
      chars: Array.from({ length: 8 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      ),
    }));
  }, [characters]);

  // Generate cyber glitch effects
  const triggerGlitch = useCallback(() => {
    const effects: GlitchEffect[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      charIndex: Math.floor(Math.random() * children.length),
      offsetX: (Math.random() - 0.5) * 10,
      offsetY: (Math.random() - 0.5) * 5,
    }));
    setGlitchEffects(effects);
    setTimeout(() => setGlitchEffects([]), 150);
  }, [children.length]);

  const scramble = useCallback(() => {
    let iteration = 0;
    const newRevealed = new Set<number>();
    
    const interval = setInterval(() => {
      setDisplayText(
        children
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              newRevealed.add(index);
              return children[index];
            }
            if (char === " ") return " ";
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );
      setRevealedIndices(new Set(newRevealed));

      // Random glitch trigger
      if (Math.random() > 0.7) {
        triggerGlitch();
      }

      if (iteration >= children.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [children, characters, scrambleSpeed, triggerGlitch]);

  useEffect(() => {
    if (isHovering) {
      return scramble();
    } else {
      setDisplayText(children);
      setRevealedIndices(new Set());
    }
  }, [isHovering, scramble, children]);

  return (
    <motion.span
      ref={containerRef}
      className={cn("relative inline-block font-mono overflow-visible", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence>
        {isHovering && matrixDrops.map((drop) => (
          <motion.span
            key={drop.id}
            className="absolute top-0 pointer-events-none text-xs"
            style={{ 
              left: `${drop.x}%`,
              color: "#22c55e",
              textShadow: "0 0 8px #22c55e",
              writingMode: "vertical-rl",
              opacity: 0.6,
            }}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "200%", opacity: [0, 0.6, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: "linear",
            }}
          >
            {drop.chars.map((char, i) => (
              <motion.span
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </AnimatePresence>
      <span className="relative z-10 inline-flex">
        {displayText.split("").map((char, index) => {
          const isRevealed = revealedIndices.has(index);
          const glitch = glitchEffects.find(g => g.charIndex === index);
          
          return (
            <motion.span
              key={index}
              className="inline-block relative"
              animate={{
                color: isHovering 
                  ? (isRevealed ? "#22c55e" : "#a855f7")
                  : "inherit",
                textShadow: isHovering
                  ? (isRevealed 
                    ? "0 0 10px #22c55e, 0 0 20px #22c55e40" 
                    : "0 0 8px #a855f7")
                  : "none",
                x: glitch ? glitch.offsetX : 0,
                y: glitch ? glitch.offsetY : 0,
              }}
              transition={{ duration: 0.05 }}
            >
              <motion.span
                className="inline-block"
                animate={isHovering && !isRevealed ? {
                  scaleX: [1, 1.2, 0.9, 1],
                  scaleY: [1, 0.9, 1.1, 1],
                } : {}}
                transition={{
                  duration: 0.15,
                  repeat: isHovering && !isRevealed ? Infinity : 0,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
              {isRevealed && isHovering && (
                <motion.span
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="absolute left-0 right-0 h-[2px] bg-green-400"
                    initial={{ top: "100%" }}
                    animate={{ top: "-10%" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.span>
              )}
            </motion.span>
          );
        })}
      </span>
      {isHovering && (
        <motion.span
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "8px 8px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <AnimatePresence>
        {glitchEffects.length > 0 && (
          <>
            <motion.span
              className="absolute top-0 left-0 text-red-500 opacity-50 pointer-events-none mix-blend-screen"
              initial={{ x: -2 }}
              animate={{ x: [-2, 2, -1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {displayText}
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 text-cyan-500 opacity-50 pointer-events-none mix-blend-screen"
              initial={{ x: 2 }}
              animate={{ x: [2, -2, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {displayText}
            </motion.span>
          </>
        )}
      </AnimatePresence>
      {isHovering && (
        <motion.span
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent pointer-events-none"
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </motion.span>
  );
}
