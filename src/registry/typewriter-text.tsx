"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

interface KeyStrikeParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface SoundBar {
  id: number;
  height: number;
  delay: number;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyStrikeParticles, setKeyStrikeParticles] = useState<KeyStrikeParticle[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);

  // Sound visualization bars
  const soundBars: SoundBar[] = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      height: ((Math.sin(i * 7.3) + 1) / 2) * 15 + 5,
      delay: i * 0.05,
    }));
  }, []);

  // Generate key strike particles
  const generateParticles = useCallback(() => {
    const particles: KeyStrikeParticle[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * -20 - 10,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setKeyStrikeParticles(particles);
    setTimeout(() => setKeyStrikeParticles([]), 300);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      setIsTyping(true);
      setCursorBlink(false);
      
      const type = () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          setCurrentIndex(index);
          generateParticles();
          index++;
          
          // Variable typing speed for realism
          const variation = Math.random() * 40 - 20;
          const nextSpeed = Math.max(20, speed + variation);
          
          timeout = setTimeout(type, nextSpeed);
        } else {
          setIsComplete(true);
          setIsTyping(false);
          setCursorBlink(true);
          onComplete?.();
        }
      };
      type();
    };

    timeout = setTimeout(startTyping, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete, generateParticles]);

  // Realistic cursor blink
  useEffect(() => {
    if (!cursor || isTyping) return;
    
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [cursor, isTyping]);

  return (
    <span className={cn("relative inline-block", className)}>
      <AnimatePresence>
        {isTyping && (
          <motion.span
            className="absolute -top-6 right-0 flex items-end gap-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {soundBars.map((bar) => (
              <motion.span
                key={bar.id}
                className="w-1 bg-gradient-to-t from-violet-500 to-fuchsia-400 rounded-t"
                animate={{
                  height: [bar.height * 0.3, bar.height, bar.height * 0.5, bar.height * 0.8, bar.height * 0.3],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  delay: bar.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>

      <span className="relative">
        {displayText.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
            style={{
              textShadow: index === currentIndex && isTyping 
                ? "0 0 10px rgba(139, 92, 246, 0.5)" 
                : "none",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>

      <AnimatePresence>
        {keyStrikeParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `calc(${(currentIndex / text.length) * 100}% + 0.5em)`,
              top: "50%",
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1, 
              scale: particle.scale,
              rotate: 0,
            }}
            animate={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: 0, 
              scale: 0,
              rotate: particle.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <span className="block w-1 h-1 bg-violet-400 rounded-full" />
          </motion.span>
        ))}
      </AnimatePresence>
      {cursor && (
        <motion.span
          className="relative inline-block ml-[2px] align-middle"
          animate={{
            opacity: cursorBlink || isTyping ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
        >
          <motion.span
            className="absolute inset-0 blur-sm"
            style={{
              background: "linear-gradient(180deg, #8b5cf6, #ec4899)",
              width: "3px",
              height: "1.1em",
            }}
            animate={{
              opacity: isTyping ? [0.5, 1, 0.5] : 0.3,
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.span
            className="inline-block"
            style={{
              width: "3px",
              height: "1.1em",
              background: "linear-gradient(180deg, #a78bfa, #f472b6)",
              borderRadius: "1px",
            }}
            animate={isTyping ? {
              scaleY: [1, 0.9, 1],
              scaleX: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 0.1,
              repeat: isTyping ? Infinity : 0,
            }}
          />
        </motion.span>
      )}
      <motion.span
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-transparent"
        animate={{
          width: `${(displayText.length / text.length) * 100}%`,
        }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </span>
  );
}
