"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface LetterProps {
  char: string;
  index: number;
  onHover: () => void;
}

function Letter({ char, index, onHover }: LetterProps) {
  const controls = useAnimationControls();
  const randomRotate = Math.sin(index * 3.7) * 5;

  return (
    <motion.span
      className="inline-block relative text-4xl font-bold"
      onMouseEnter={() => {
        onHover();
        controls.start({
          y: -10,
          scale: 1.3,
          rotate: randomRotate,
          color: "#A855F7",
          textShadow: "0px 0px 8px rgba(168, 85, 247, 0.6)",
          transition: { type: "spring", stiffness: 500, damping: 10 },
        });
      }}
      onMouseLeave={() => {
        controls.start({
          y: 0,
          scale: 1,
          rotate: 0,
          color: "inherit",
          textShadow: "none",
          transition: { type: "spring", stiffness: 300, damping: 20 },
        });
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

interface SoundTextProps {
  text?: string;
  className?: string;
  basePitch?: number;
}

// Pentatonic scale ratios
const SCALE_RATIOS = [1, 1.125, 1.25, 1.5, 1.667, 2];

export function SoundText({
  text = "Hover over me",
  className,
  basePitch = 300,
}: SoundTextProps) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, []);

  const playSound = useCallback(
    (index: number) => {
      initAudio();
      if (!audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const scaleIndex = index % SCALE_RATIOS.length;
      const octaveOffset = Math.floor(index / SCALE_RATIOS.length);
      const frequency = basePitch * SCALE_RATIOS[scaleIndex] * Math.pow(2, octaveOffset * 0.5);

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    },
    [basePitch, initAudio]
  );

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const letters = text.split("");

  return (
    <motion.div
      className={cn("flex flex-wrap cursor-default select-none text-white", className)}
      onMouseEnter={initAudio}
    >
      {letters.map((letter, index) => {
        if (letter === " ") {
          return (
            <span key={index} className="w-3">
              {" "}
            </span>
          );
        }
        return <Letter key={index} char={letter} index={index} onHover={() => playSound(index)} />;
      })}
    </motion.div>
  );
}
