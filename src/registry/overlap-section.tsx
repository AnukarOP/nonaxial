"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface OverlapSectionProps {
  children: React.ReactNode;
  className?: string;
  overlap?: number;
}

export function OverlapSection({ children, className, overlap = 100 }: OverlapSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Multi-layer parallax depths
  const layer1Y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [15, -15]);
  
  // 3D rotation based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  
  // Spring physics for smooth transitions
  const springConfig = { stiffness: 100, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springScale = useSpring(scale, springConfig);

  // Dynamic shadow based on depth
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]);
  const shadowBlur = useTransform(scrollYProgress, [0, 0.5, 1], [20, 40, 20]);
  const shadowY = useTransform(scrollYProgress, [0, 0.5, 1], [10, 25, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: x - 0.5, y: y - 0.5 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)} 
      style={{ marginTop: -overlap, perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0 -z-30"
        style={{ y: layer1Y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
      </motion.div>
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ y: layer2Y }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-violet-400/30"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, 
              rgba(139, 92, 246, 0.15) 0%, 
              transparent 50%
            )
          `,
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-px -z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5), transparent)",
          boxShadow: "0 0 20px 2px rgba(139, 92, 246, 0.3)",
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="relative z-10"
        style={{
          rotateX: springRotateX,
          scale: springScale,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            filter: `blur(${shadowBlur}px)`,
            opacity: shadowOpacity,
            y: shadowY,
            background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), transparent 70%)",
          }}
        />
        <motion.div
          style={{ y: layer3Y }}
          className="relative"
        >
          {children}
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.5), transparent)",
          boxShadow: "0 0 20px 2px rgba(236, 72, 153, 0.3)",
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
}
