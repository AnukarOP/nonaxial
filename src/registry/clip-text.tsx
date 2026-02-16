"use client";

import React, { useMemo, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClipTextProps {
  children: string;
  className?: string;
}

interface NoiseTransition {
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
}

export function ClipText({ children, className }: ClipTextProps) {
  const uniqueId = useId();

  // Generate noise transition blocks for the reveal
  const noiseBlocks: NoiseTransition[] = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      width: 10 + ((Math.sin(i * 5.3) + 1) / 2) * 20,
      height: 5 + ((Math.sin(i * 7.1) + 1) / 2) * 15,
      delay: ((Math.sin(i * 2.9) + 1) / 2) * 0.5,
    }));
  }, []);

  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <motion.span
        className="inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ 
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span
          className="relative"
          style={{
            display: "inline-block",
          }}
        >
          <motion.span
            className="inline-block"
            style={{
              backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%)",
              backgroundSize: "400% 400%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(45deg, rgba(34,211,238,0.4) 0%, transparent 30%, rgba(236,72,153,0.4) 60%, transparent 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mixBlendMode: "overlay",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "50% 100%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{
              backgroundPosition: ["-100% 0%", "200% 0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            {children}
          </motion.span>
        </span>
      </motion.span>
      <motion.span
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span
          className="absolute top-0 bottom-0 w-4 right-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(139,92,246,0.6))",
            filter: "blur(2px)",
          }}
        />
        <motion.span
          className="absolute top-0 bottom-0 w-1 right-2"
          style={{
            backgroundImage: "linear-gradient(180deg, #8b5cf6, #ec4899, #f59e0b, #8b5cf6)",
            backgroundSize: "100% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "0% 100%"],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.span>
      {noiseBlocks.map((block, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${block.x}%`,
            top: `${block.y}%`,
            width: `${block.width}%`,
            height: `${block.height}%`,
            background: "rgba(255,255,255,0.8)",
            mixBlendMode: "overlay",
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.2,
            delay: block.delay,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.3)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: [0, 0.3, 0, 0.2, 0, 0.1, 0],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.4,
          delay: 0.8,
          ease: "linear",
        }}
      />
      <motion.span
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: [0, 0.5, 0],
          x: [0, -3, 0],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
          delay: 0.6,
        }}
      >
        <span className="text-red-500/50">{children}</span>
      </motion.span>

      <motion.span
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: [0, 0.5, 0],
          x: [0, 3, 0],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
          delay: 0.7,
        }}
      >
        <span className="text-cyan-500/50">{children}</span>
      </motion.span>
      <motion.span
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
          boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
        }}
        initial={{ top: "0%", opacity: 0 }}
        whileInView={{
          top: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: "easeInOut",
        }}
      />
      <motion.span
        className="absolute -bottom-4 left-0 right-0 h-8 blur-xl pointer-events-none -z-10"
        style={{
          background: "linear-gradient(90deg, rgba(102, 126, 234, 0.4), rgba(240, 147, 251, 0.4), rgba(245, 87, 108, 0.4))",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.6, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          delay: 0.5,
        }}
      />
      <motion.span
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{
          opacity: [0, 0.5, 0.3],
          scale: [0.8, 1.1, 1],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.8,
        }}
      />
    </span>
  );
}
