interface ComponentRegistryItem {
  name: string;
  description: string;
  code: string;
  dependencies?: string[];
  registryDependencies?: string[];
  tailwind?: Record<string, unknown>;
  cssVars?: Record<string, unknown>;
}

export const componentRegistry: Record<string, ComponentRegistryItem> = {
  "magnetic-button": {
    name: "Magnetic Button",
    description: "Button that follows cursor with magnetic effect",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * strength, y: y * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative rounded-full font-medium transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
}`,
  },
  "tilt-card": {
    name: "Tilt Card",
    description: "Card that tilts based on mouse position",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnable?: boolean;
  scale?: number;
}

export function TiltCard({
  children,
  className,
  tiltAmount = 10,
  glareEnable = true,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const centerX = width / 2;
    const centerY = height / 2;
    const rotateX = ((y - centerY) / centerY) * -tiltAmount;
    const rotateY = ((x - centerX) / centerX) * tiltAmount;
    setRotateX(rotateX);
    setRotateY(rotateY);
    setGlarePosition({ x: (x / width) * 100, y: (y / height) * 100 });
  };

  const reset = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ rotateX, rotateY, scale: rotateX !== 0 || rotateY !== 0 ? scale : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn("relative cursor-pointer", className)}
    >
      {children}
      {glareEnable && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity"
          style={{
            background: \`radial-gradient(circle at \${glarePosition.x}% \${glarePosition.y}%, rgba(255,255,255,0.15), transparent 60%)\`,
            opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
          }}
        />
      )}
    </motion.div>
  );
}`,
  },
  "glitch-text": {
    name: "Glitch Text",
    description: "Text with glitch distortion effect",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({
  children,
  className,
  intensity = "medium",
}: GlitchTextProps) {
  const intensityValues = {
    low: { duration1: "4s", duration2: "5s", translate: "1px" },
    medium: { duration1: "2s", duration2: "3s", translate: "2px" },
    high: { duration1: "0.5s", duration2: "0.7s", translate: "3px" },
  };

  const config = intensityValues[intensity];

  return (
    <span
      className={cn("relative inline-block", className)}
      style={{
        "--glitch-translate": config.translate,
        "--glitch-duration-1": config.duration1,
        "--glitch-duration-2": config.duration2,
      } as React.CSSProperties}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 -z-10 opacity-70 text-purple-500"
        style={{
          animation: \`glitch-1 var(--glitch-duration-1) infinite linear alternate-reverse\`,
          clipPath: "inset(40% 0 61% 0)",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 opacity-70 text-pink-500"
        style={{
          animation: \`glitch-2 var(--glitch-duration-2) infinite linear alternate-reverse\`,
          clipPath: "inset(25% 0 58% 0)",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}`,
  },
  "wave-text": {
    name: "Wave Text",
    description: "Text with wave animation",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaveTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function WaveText({
  children,
  className,
  delay = 0.05,
  duration = 0.5,
}: WaveTextProps) {
  const letters = children.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay },
    },
  };

  const child = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration,
      },
    },
  };

  return (
    <motion.span
      className={cn("inline-flex", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className={letter === " " ? "w-[0.25em]" : ""}
        >
          {letter === " " ? "\\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}`,
  },
  "ripple-button": {
    name: "Ripple Button",
    description: "Material-style ripple effect button",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function RippleButton({
  children,
  className,
  rippleColor = "rgba(255, 255, 255, 0.4)",
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      ref={buttonRef}
      onClick={createRipple}
      className={cn(
        "relative overflow-hidden px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
            }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}`,
  },
  "bounce-button": {
    name: "Bounce Button",
    description: "Button with bouncy spring animation",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BounceButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function BounceButton({ children, className }: BounceButtonProps) {
  return (
    <motion.button
      className={cn(
        "px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
    >
      {children}
    </motion.button>
  );
}`,
  },
  "neon-button": {
    name: "Neon Button",
    description: "Button with neon glow effect",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: React.ReactNode;
  className?: string;
  color?: "purple" | "pink" | "blue" | "green" | "orange";
  variant?: "solid" | "outline";
}

export function NeonButton({
  children,
  className,
  color = "purple",
  variant = "solid",
}: NeonButtonProps) {
  const colorClasses = {
    purple: {
      solid: "bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]",
      outline: "border-2 border-purple-500 text-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
    },
    pink: {
      solid: "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]",
      outline: "border-2 border-pink-500 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]",
    },
    blue: {
      solid: "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]",
      outline: "border-2 border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
    },
    green: {
      solid: "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]",
      outline: "border-2 border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    },
    orange: {
      solid: "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.7)]",
      outline: "border-2 border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]",
    },
  };

  return (
    <button className={cn("px-6 py-3 rounded-lg font-medium transition-all duration-300", colorClasses[color][variant], className)}>
      {children}
    </button>
  );
}`,
  },
  "glass-card": {
    name: "Glass Card",
    description: "Card with glassmorphism effect",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
}

export function GlassCard({
  children,
  className,
  blur = "md",
  opacity = 0.1,
}: GlassCardProps) {
  const blurValues = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  return (
    <div
      className={cn("rounded-xl border border-white/20", blurValues[blur], className)}
      style={{ backgroundColor: \`rgba(255, 255, 255, \${opacity})\` }}
    >
      {children}
    </div>
  );
}`,
  },
  "flip-card": {
    name: "Flip Card",
    description: "Card that flips to reveal back content",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipDirection?: "horizontal" | "vertical";
}

export function FlipCard({
  front,
  back,
  className,
  flipDirection = "horizontal",
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipVariants = {
    horizontal: {
      front: { rotateY: 0 },
      back: { rotateY: 180 },
      flippedFront: { rotateY: 180 },
      flippedBack: { rotateY: 0 },
    },
    vertical: {
      front: { rotateX: 0 },
      back: { rotateX: 180 },
      flippedFront: { rotateX: 180 },
      flippedBack: { rotateX: 0 },
    },
  };

  const variants = flipVariants[flipDirection];

  return (
    <div
      className={cn("relative cursor-pointer", className)}
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="absolute inset-0"
        initial={variants.front}
        animate={isFlipped ? variants.flippedFront : variants.front}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ backfaceVisibility: "hidden" }}
      >
        {front}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        initial={variants.back}
        animate={isFlipped ? variants.flippedBack : variants.back}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ backfaceVisibility: "hidden" }}
      >
        {back}
      </motion.div>
    </div>
  );
}`,
  },
  "blob-cursor": {
    name: "Blob Cursor",
    description: "Blob that follows the cursor",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlobCursorProps {
  className?: string;
  size?: number;
  color?: string;
  blur?: number;
}

export function BlobCursor({
  className,
  size = 40,
  color = "rgba(139, 92, 246, 0.5)",
  blur = 20,
}: BlobCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - size / 2);
      cursorY.set(e.clientY - size / 2);
      setIsVisible(true);
    };

    const hideCursor = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [cursorX, cursorY, size]);

  return (
    <motion.div
      className={cn("pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-difference", className)}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        width: size,
        height: size,
        backgroundColor: color,
        filter: \`blur(\${blur}px)\`,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}`,
  },
  "bounce-loader": {
    name: "Bounce Loader",
    description: "Bouncing dots loader",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BounceLoaderProps {
  className?: string;
  size?: number;
  color?: string;
  count?: number;
}

export function BounceLoader({
  className,
  size = 12,
  color = "#8b5cf6",
  count = 3,
}: BounceLoaderProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{ width: size, height: size, backgroundColor: color }}
          animate={{ y: [0, -size, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}`,
  },
  "wave-loader": {
    name: "Wave Loader",
    description: "Wave bars loader",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaveLoaderProps {
  className?: string;
  barCount?: number;
  barWidth?: number;
  barHeight?: number;
  color?: string;
}

export function WaveLoader({
  className,
  barCount = 5,
  barWidth = 4,
  barHeight = 24,
  color = "#8b5cf6",
}: WaveLoaderProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{ width: barWidth, height: barHeight, backgroundColor: color }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}`,
  },
  "fade-reveal": {
    name: "Fade Reveal",
    description: "Fade in reveal animation",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

export function FadeReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
}: FadeRevealProps) {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}`,
  },
  "gradient-text": {
    name: "Gradient Text",
    description: "Text with animated gradient fill",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: string;
  className?: string;
  colors?: string[];
  animationDuration?: number;
}

export function GradientText({
  children,
  className,
  colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#8b5cf6"],
  animationDuration = 5,
}: GradientTextProps) {
  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: \`linear-gradient(90deg, \${colors.join(", ")})\`,
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: animationDuration, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}`,
  },
  "typewriter-text": {
    name: "Typewriter Text",
    description: "Text with typewriter typing effect",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      const type = () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
          timeout = setTimeout(type, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };
      type();
    };

    timeout = setTimeout(startTyping, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      {cursor && (
        <span
          className={cn("inline-block w-[2px] h-[1em] bg-current ml-1 align-middle")}
          style={{ animation: "blink 1s step-end infinite" }}
        />
      )}
    </span>
  );
}`,
  },
  "spotlight-card": {
    name: "Spotlight Card",
    description: "Card with spotlight gradient effect",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(139, 92, 246, 0.15)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl"
        style={{
          background: \`radial-gradient(600px circle at \${position.x}px \${position.y}px, \${spotlightColor}, transparent 40%)\`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
}`,
  },
  "gradient-mesh": {
    name: "Gradient Mesh",
    description: "Animated gradient mesh background",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export function GradientMesh({
  className,
  colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  speed = 10,
}: GradientMeshProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: "40%",
            height: "40%",
            backgroundColor: color,
            opacity: 0.3,
            left: \`\${(index % 2) * 40 + 10}%\`,
            top: \`\${Math.floor(index / 2) * 40 + 10}%\`,
          }}
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 50, -30, 0],
            scale: [1, 1.1, 0.9, 1.1, 1],
          }}
          transition={{ duration: speed + index * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}`,
  },
  "pulse-button": {
    name: "Pulse Button",
    description: "Button with pulsing glow effect",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseButtonProps {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
}

export function PulseButton({
  children,
  className,
  pulseColor = "rgba(139, 92, 246, 0.5)",
}: PulseButtonProps) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{ backgroundColor: pulseColor }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <button className={cn("relative px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium z-10", className)}>
        {children}
      </button>
    </div>
  );
}`,
  },
  "stagger-reveal": {
    name: "Stagger Reveal",
    description: "Staggered children reveal",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  duration = 0.5,
}: StaggerRevealProps) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: staggerDelay } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={item}>{child}</motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  );
}`,
  },
  "tilted-section": {
    name: "Tilted Section",
    description: "Full-width tilted section",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import { cn } from "@/lib/utils";

interface TiltedSectionProps {
  children: React.ReactNode;
  className?: string;
  angle?: number;
  direction?: "left" | "right";
  bgColor?: string;
}

export function TiltedSection({
  children,
  className,
  angle = 3,
  direction = "right",
  bgColor = "var(--card)",
}: TiltedSectionProps) {
  const skewValue = direction === "right" ? -angle : angle;

  return (
    <div className={cn("relative py-20", className)}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: bgColor,
          transform: \`skewY(\${skewValue}deg)\`,
          transformOrigin: direction === "right" ? "top left" : "top right",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}`,
  },
  "parallax-section": {
    name: "Parallax Section",
    description: "Parallax scrolling section",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}`,
  },
  "skeleton-loader": {
    name: "Skeleton Loader",
    description: "Content skeleton loader",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function SkeletonLoader({
  className,
  variant = "rectangular",
  width = "100%",
  height = 20,
  animation = "pulse",
}: SkeletonLoaderProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "",
    none: "",
  };

  return (
    <div
      className={cn("bg-muted/30", variantClasses[variant], animationClasses[animation], className)}
      style={{
        width: typeof width === "number" ? \`\${width}px\` : width,
        height: typeof height === "number" ? \`\${height}px\` : height,
      }}
    />
  );
}`,
  },
  "orbit-loader": {
    name: "Orbit Loader",
    description: "Orbiting dots loader",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitLoaderProps {
  className?: string;
  size?: number;
  color?: string;
  speed?: number;
}

export function OrbitLoader({
  className,
  size = 40,
  color = "#8b5cf6",
  speed = 1.2,
}: OrbitLoaderProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: size / 5,
            height: size / 5,
            backgroundColor: color,
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: [0, Math.cos((index * 2 * Math.PI) / 3) * (size / 2.5)],
            y: [0, Math.sin((index * 2 * Math.PI) / 3) * (size / 2.5)],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: speed, repeat: Infinity, delay: (index * speed) / 3, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}`,
  },
  "particle-card": {
    name: "Particle Card",
    description: "Card that explodes into particles on hover",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticleData {
  x: number;
  y: number;
  posX: number;
  posY: number;
  randX: number;
  randY: number;
  rotate: number;
  scale: number;
  delay: number;
}

interface ParticleProps {
  p: ParticleData;
  active: boolean;
  cols: number;
  rows: number;
  color: string;
}

function Particle({ p, active, cols, rows, color }: ParticleProps) {
  const finalTransform = \`translate3d(\${p.randX * 1.5}px, \${p.randY * 1.5}px, 0) rotate(\${p.rotate * 2}deg) scale(\${p.scale * 0.8})\`;
  
  const style: React.CSSProperties = {
    backgroundColor: color,
    transition: \`transform 800ms cubic-bezier(.2,.8,.2,1) \${p.delay}ms, opacity 600ms ease-in \${p.delay + 200}ms\`,
    transform: active ? finalTransform : "translate3d(0,0,0) rotate(0deg) scale(1)",
    opacity: active ? 0 : 1,
    borderRadius: active ? 4 : 0,
    width: "100.5%",
    height: "100.5%",
    willChange: "transform, opacity",
    position: "absolute" as const,
    top: 0,
    left: 0,
  };

  return (
    <div style={{ width: \`\${100 / cols}%\`, height: \`\${100 / rows}%\`, position: "absolute", left: \`\${(p.x / cols) * 100}%\`, top: \`\${(p.y / rows) * 100}%\` }}>
      <div style={style} />
    </div>
  );
}

interface ParticleCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  cols?: number;
  rows?: number;
  className?: string;
}

export function ParticleCard({
  title = "Interactive Card",
  subtitle = "Hover to reveal",
  description = "This card explodes into particles when you hover over it.",
  tags = ["React", "Animation", "Interactive"],
  cols = 16,
  rows = 20,
  className,
}: ParticleCardProps) {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particles = useMemo(() => {
    const arr: ParticleData[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const centerX = cols / 2, centerY = rows / 2;
        const dx = x - centerX, dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const spread = 100 + Math.random() * 200;
        arr.push({
          x, y,
          posX: (x / (cols - 1)) * 100,
          posY: (y / (rows - 1)) * 100,
          randX: Math.cos(angle) * spread * (1 + Math.random() * 0.5),
          randY: Math.sin(angle) * spread * (1 + Math.random() * 0.5),
          rotate: (Math.random() * 2 - 1) * 180,
          scale: 0.5 + Math.random() * 0.5,
          delay: distance * 15 + Math.random() * 100,
        });
      }
    }
    return arr;
  }, [cols, rows]);

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <motion.div
        className="relative w-[280px] h-[360px] rounded-xl bg-zinc-800 shadow-2xl overflow-hidden cursor-pointer select-none"
        animate={active ? { scale: 1.02 } : { scale: 1 }}
        onHoverStart={() => !isMobile && setActive(true)}
        onHoverEnd={() => !isMobile && setActive(false)}
        onClick={() => isMobile && setActive(!active)}
      >
        <div className="absolute inset-0 flex flex-col p-5 bg-gradient-to-br from-zinc-900 to-zinc-800 z-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3 h-full"
          >
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-zinc-400 text-sm">{subtitle}</p>
            </div>
            <p className="text-zinc-400 text-sm flex-1">{description}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-semibold text-white bg-violet-500/20 rounded-md border border-violet-500/30">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 z-10">
          <div className={cn("absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-500 bg-gradient-to-t from-black/80 to-transparent", active ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0")}>
            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
            <p className="text-white/80 text-sm">{subtitle}</p>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p, i) => <Particle key={i} p={p} active={active} cols={cols} rows={rows} color="#8b5cf6" />)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}`,
  },
  "sound-text": {
    name: "Sound Text",
    description: "Text that plays musical notes on hover",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    code: `"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface LetterProps { char: string; index: number; onHover: () => void; }

function Letter({ char, index, onHover }: LetterProps) {
  const controls = useAnimationControls();
  const randomRotate = Math.random() * 10 - 5;

  return (
    <motion.span
      className="inline-block relative text-4xl font-bold"
      onMouseEnter={() => {
        onHover();
        controls.start({ y: -10, scale: 1.3, rotate: randomRotate, color: "#A855F7", textShadow: "0px 0px 8px rgba(168, 85, 247, 0.6)", transition: { type: "spring", stiffness: 500, damping: 10 } });
      }}
      onMouseLeave={() => {
        controls.start({ y: 0, scale: 1, rotate: 0, color: "inherit", textShadow: "none", transition: { type: "spring", stiffness: 300, damping: 20 } });
      }}
      animate={controls}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, type: "spring", stiffness: 200 }}
    >
      {char}
    </motion.span>
  );
}

const SCALE_RATIOS = [1, 1.125, 1.25, 1.5, 1.667, 2];

interface SoundTextProps { text?: string; className?: string; basePitch?: number; }

export function SoundText({ text = "Hover over me", className, basePitch = 300 }: SoundTextProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") audioContextRef.current.resume();
  }, []);

  const playSound = useCallback((index: number) => {
    initAudio();
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const frequency = basePitch * SCALE_RATIOS[index % SCALE_RATIOS.length] * Math.pow(2, Math.floor(index / SCALE_RATIOS.length) * 0.5);
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [basePitch, initAudio]);

  useEffect(() => { return () => { if (audioContextRef.current) audioContextRef.current.close(); }; }, []);

  return (
    <motion.div className={cn("flex flex-wrap cursor-default select-none text-white", className)} onMouseEnter={initAudio}>
      {text.split("").map((letter, index) => letter === " " ? <span key={index} className="w-3"> </span> : <Letter key={index} char={letter} index={index} onHover={() => playSound(index)} />)}
    </motion.div>
  );
}`,
  },
  "soft-button": {
    name: "Soft Button",
    description: "Neumorphic soft button with depth",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SoftButtonProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode; }

export function SoftButton({ children = "Button", className, ...props }: SoftButtonProps) {
  return (
    <div className={cn("group relative m-0 flex h-[50px] w-[160px] cursor-pointer items-center justify-center", className)} {...props}>
      <div className={cn(
        "flex h-full w-full items-center justify-center bg-transparent text-white tracking-[1px] rounded-[30px] z-10 font-medium border-t border-b border-white/10",
        "shadow-[4px_4px_6px_0_rgba(255,255,255,0.05),-4px_-4px_6px_0_rgba(0,0,0,0.5),inset_-4px_-4px_6px_0_rgba(255,255,255,0.05),inset_4px_4px_6px_0_rgba(0,0,0,0.6)]",
        "transition-all duration-[600ms] group-hover:bg-violet-600 group-hover:text-white group-hover:tracking-[2px] group-hover:scale-[1.05] group-active:scale-[0.98]",
        "group-hover:shadow-[0_0_20px_rgba(139,92,246,0.6),4px_4px_8px_0_rgba(255,255,255,0.08),-4px_-4px_8px_0_rgba(0,0,0,0.6)]"
      )}>{children}</div>
    </div>
  );
}`,
  },
  "glass-shimmer-button": {
    name: "Glass Shimmer Button",
    description: "Glass button with shimmer animation",
    dependencies: ["clsx", "tailwind-merge"],
    code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassShimmerButtonProps { children?: React.ReactNode; onClick?: () => void; className?: string; }

export function GlassShimmerButton({ children = "Shimmer", onClick, className }: GlassShimmerButtonProps) {
  return (
    <>
      <style jsx>{\`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-effect { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 2s infinite linear; }
      \`}</style>
      <button
        onClick={onClick}
        className={cn(
          "relative group px-8 py-4 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20 active:scale-95",
          className
        )}
      >
        <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <span className="relative z-10 text-white font-semibold tracking-wide">{children}</span>
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </>
  );
}`,
  },
};

