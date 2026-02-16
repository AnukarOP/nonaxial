"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Word {
  text: string;
  particles: { x: number; y: number; vx: number; vy: number; life: number }[];
}

interface TextExplosionProps {
  text: string;
  className?: string;
}

export function TextExplosion({ text, className }: TextExplosionProps) {
  const [exploded, setExploded] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; rotation: number; char: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const explode = () => {
    const chars = text.split("");
    const newParticles = chars.map((char, i) => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      rotation: (Math.random() - 0.5) * 720,
      char,
    }));
    setParticles(newParticles);
    setExploded(true);
  };

  const reassemble = () => {
    setExploded(false);
    setTimeout(() => setParticles([]), 500);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative cursor-pointer inline-block", className)}
      onClick={exploded ? reassemble : explode}
    >
      <span className={cn("text-4xl font-bold", exploded && "opacity-0")}>
        {text}
      </span>
      <AnimatePresence>
        {exploded && particles.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {text.split("").map((char, i) => (
              <motion.span
                key={i}
                className="absolute text-4xl font-bold text-violet-400"
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: particles[i]?.x || 0,
                  y: particles[i]?.y || 0,
                  rotate: particles[i]?.rotation || 0,
                  opacity: 0.8,
                }}
                exit={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TextFlipProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function TextFlip({ words, interval = 2000, className }: TextFlipProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={cn("relative h-[1.2em] overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", rotateX: -90 }}
          animate={{ y: 0, rotateX: 0 }}
          exit={{ y: "-100%", rotateX: 90 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="block text-4xl font-bold text-white"
          style={{ transformOrigin: "center top" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

interface TextSplitRevealProps {
  text: string;
  className?: string;
}

export function TextSplitReveal({ text, className }: TextSplitRevealProps) {
  const [hovered, setHovered] = useState(false);
  const chars = text.split("");
  const midpoint = Math.ceil(chars.length / 2);

  return (
    <div
      className={cn("relative cursor-pointer overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex text-4xl font-bold">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="text-white"
            animate={{
              y: hovered ? (i < midpoint ? -10 : 10) : 0,
              opacity: hovered ? 0.5 : 1,
            }}
            transition={{ delay: Math.abs(i - midpoint) * 0.02 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

interface TextCircularProps {
  text: string;
  radius?: number;
  className?: string;
  spin?: boolean;
}

export function TextCircular({
  text,
  radius = 80,
  className,
  spin = true,
}: TextCircularProps) {
  const chars = text.split("");
  const angleStep = 360 / chars.length;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: radius * 2, height: radius * 2 }}
      animate={spin ? { rotate: 360 } : {}}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {chars.map((char, i) => {
        const angle = i * angleStep;
        return (
          <span
            key={i}
            className="absolute text-white font-bold"
            style={{
              left: "50%",
              top: "50%",
              transform: `
                rotate(${angle}deg) 
                translateY(-${radius}px) 
                rotate(${-angle + 90}deg)
              `,
              transformOrigin: "center",
            }}
          >
            {char}
          </span>
        );
      })}
    </motion.div>
  );
}

interface TextHighlightHoverProps {
  text: string;
  highlightColor?: string;
  className?: string;
}

export function TextHighlightHover({
  text,
  highlightColor = "#8b5cf6",
  className,
}: TextHighlightHoverProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={cn("relative cursor-pointer", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-4xl font-bold text-white relative z-10">{text}</span>
      <motion.span
        className="absolute inset-0 rounded-lg -z-0"
        style={{ backgroundColor: highlightColor }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </span>
  );
}

interface TextDebuggerProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TextDebugger({ text, speed = 50, className }: TextDebuggerProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursor, setCursor] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);

    const cursorInterval = setInterval(() => {
      setCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, [text, speed, started]);

  return (
    <div
      className={cn("font-mono", className)}
      onClick={() => setStarted(true)}
    >
      <span className="text-green-400">$</span>{" "}
      <span className="text-white">{displayText}</span>
      {cursor && <span className="text-white">|</span>}
      {!started && (
        <span className="text-zinc-500 ml-2 text-sm">(click to start)</span>
      )}
    </div>
  );
}

interface TextStackProps {
  words: string[];
  className?: string;
}

export function TextStack({ words, className }: TextStackProps) {
  return (
    <div className={cn("relative", className)}>
      {words.map((word, i) => (
        <motion.p
          key={i}
          className="text-4xl font-bold text-white absolute"
          style={{
            top: 0,
            left: 0,
            opacity: 0.8 - i * 0.2,
            filter: `blur(${i * 0.5}px)`,
          }}
          animate={{
            y: [0, -5, 0],
            x: [0, -2, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {word}
        </motion.p>
      ))}
      <p className="text-4xl font-bold text-white">{words[0]}</p>
    </div>
  );
}

interface Text3DExtrudeProps {
  text: string;
  depth?: number;
  color?: string;
  className?: string;
}

export function Text3DExtrude({
  text,
  depth = 8,
  color = "#8b5cf6",
  className,
}: Text3DExtrudeProps) {
  const layers = Array.from({ length: depth }, (_, i) => i);

  return (
    <div className={cn("relative cursor-pointer group", className)}>
      {layers.map((i) => (
        <span
          key={i}
          className="absolute text-4xl font-bold transition-all duration-300"
          style={{
            color: i === 0 ? color : `rgba(139, 92, 246, ${0.1 + (depth - i) / depth * 0.3})`,
            transform: `translate(${i * 1}px, ${i * 1}px)`,
            zIndex: depth - i,
          }}
        >
          {text}
        </span>
      ))}
      <motion.span
        className="text-4xl font-bold relative"
        style={{ color }}
        whileHover={{ x: -depth, y: -depth }}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
    </div>
  );
}

interface TextShadowPulseProps {
  text: string;
  className?: string;
}

export function TextShadowPulse({ text, className }: TextShadowPulseProps) {
  return (
    <motion.span
      className={cn("text-4xl font-bold text-white", className)}
      animate={{
        textShadow: [
          "0 0 10px rgba(139, 92, 246, 0.5)",
          "0 0 30px rgba(139, 92, 246, 0.8)",
          "0 0 10px rgba(139, 92, 246, 0.5)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {text}
    </motion.span>
  );
}
