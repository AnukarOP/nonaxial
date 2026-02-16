"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "|",
  loop = false,
  deleteSpeed = 30,
  pauseDuration = 1500,
  className,
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const textArray = Array.isArray(text) ? text : [text];

  useEffect(() => {
    const currentText = textArray[textArrayIndex];
    let timeout: NodeJS.Timeout;

    const startTyping = () => {
      if (!isDeleting) {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentText.substring(0, currentIndex + 1));
            setCurrentIndex((prev) => prev + 1);
          }, speed);
        } else if (loop || textArray.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        } else {
          onComplete?.();
        }
      } else {
        if (currentIndex > 0) {
          timeout = setTimeout(() => {
            setDisplayText(currentText.substring(0, currentIndex - 1));
            setCurrentIndex((prev) => prev - 1);
          }, deleteSpeed);
        } else {
          setIsDeleting(false);
          setTextArrayIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    };

    timeout = setTimeout(startTyping, currentIndex === 0 && !isDeleting ? delay : 0);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textArrayIndex, textArray, speed, deleteSpeed, delay, loop, pauseDuration, onComplete]);

  return (
    <span className={cn("inline", className)}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-0.5"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
}

interface TextRevealProps {
  text: string;
  direction?: "up" | "down" | "left" | "right";
  staggerDelay?: number;
  duration?: number;
  className?: string;
  splitBy?: "char" | "word" | "line";
}

export function TextReveal({
  text,
  direction = "up",
  staggerDelay = 0.03,
  duration = 0.5,
  className,
  splitBy = "char",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const items = splitBy === "char" 
    ? text.split("") 
    : splitBy === "word" 
    ? text.split(" ") 
    : text.split("\n");

  const directionVariants = {
    up: { y: 40, opacity: 0 },
    down: { y: -40, opacity: 0 },
    left: { x: 40, opacity: 0 },
    right: { x: -40, opacity: 0 },
  };

  return (
    <div ref={ref} className={cn("inline-flex flex-wrap", className)}>
      {items.map((item, index) => (
        <motion.span
          key={index}
          initial={directionVariants[direction]}
          animate={isInView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]}
          transition={{ duration, delay: index * staggerDelay }}
          className="inline-block"
        >
          {item}
          {splitBy === "word" && index < items.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
}

interface GradientTextRevealProps {
  text: string;
  gradient?: string;
  duration?: number;
  className?: string;
}

export function GradientTextReveal({
  text,
  gradient = "from-violet-400 via-fuchsia-400 to-violet-400",
  duration = 2,
  className,
}: GradientTextRevealProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-gradient-to-r bg-[length:200%_auto]",
        gradient,
        className
      )}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}

interface CountingTextProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountingText({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CountingTextProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = from + (to - from) * eased;
      
      setCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

interface WavyTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function WavyText({
  text,
  className,
  delay = 0.05,
  duration = 0.5,
}: WavyTextProps) {
  return (
    <span className={cn("inline-flex", className)}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: index * delay,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

interface ShinyTextProps {
  text: string;
  className?: string;
  shimmerColor?: string;
}

export function ShinyText({
  text,
  className,
  shimmerColor = "rgba(255, 255, 255, 0.8)",
}: ShinyTextProps) {
  return (
    <motion.span
      className={cn("relative inline-block overflow-hidden", className)}
    >
      {text}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      />
    </motion.span>
  );
}
