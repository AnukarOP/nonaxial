"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyStackProps {
  children: React.ReactNode[];
  className?: string;
}

function StackCard({ 
  child, 
  index, 
  total,
  scrollProgress,
}: { 
  child: React.ReactNode; 
  index: number;
  total: number;
  scrollProgress: any;
}) {
  const [isClose, setIsClose] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 25 };
  
  // Calculate stacking animation based on scroll
  const yOffset = useTransform(
    scrollProgress,
    [index / total, (index + 1) / total],
    [100, 0]
  );
  
  const scale = useTransform(
    scrollProgress,
    [(index - 1) / total, index / total, (index + 1) / total],
    [0.9, 1, 0.95]
  );
  
  const rotateX = useTransform(
    scrollProgress,
    [(index - 1) / total, index / total],
    [10, 0]
  );
  
  // Spring physics for smooth motion
  const springY = useSpring(yOffset, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springRotateX = useSpring(rotateX, springConfig);
  
  // Parallax depth based on card position
  const parallaxY = useTransform(
    scrollProgress,
    [0, 1],
    [index * 20, -index * 20]
  );
  
  // Shadow depth varies with stacking
  const shadowOpacity = useTransform(
    scrollProgress,
    [index / total, (index + 0.5) / total, (index + 1) / total],
    [0.1, 0.4, 0.2]
  );
  
  const shadowBlur = useTransform(
    scrollProgress,
    [index / total, (index + 0.5) / total],
    [10, 40]
  );

  // Detect when cards are close together for glow effect
  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (value: number) => {
      const cardProgress = value * total;
      const distanceToIndex = Math.abs(cardProgress - index);
      setIsClose(distanceToIndex < 0.3);
    });
    return () => unsubscribe();
  }, [scrollProgress, index, total]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 10);
    mouseY.set(y * 10);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springMouseX = useSpring(mouseX, springConfig);
  const springMouseY = useSpring(mouseY, springConfig);

  return (
    <div
      className="sticky top-20"
      style={{ 
        zIndex: index + 1,
        paddingTop: index * 20,
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 100, rotateX: 15 }}
        whileInView={{ opacity: 1. }}
        viewport={{ once: true, margin: "-100px" }}
        style={{
          y: springY,
          scale: springScale,
          rotateX: springRotateX,
          rotateY: springMouseX,
          transformStyle: "preserve-3d",
          transformPerspective: "1200px",
        }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, 
              rgba(139, 92, 246, ${isClose ? 0.3 : 0}) 0%, 
              transparent 70%
            )`,
            filter: "blur(20px)",
          }}
          animate={{
            opacity: isClose ? 1 : 0,
            scale: isClose ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            opacity: shadowOpacity,
            filter: `blur(${shadowBlur}px)`,
            background: "linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5))",
            transform: "translateY(20px) scale(0.95)",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: isClose 
              ? "0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.05)"
              : "none",
          }}
          animate={{
            borderColor: isClose 
              ? "rgba(139, 92, 246, 0.5)" 
              : "rgba(139, 92, 246, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden"
          style={{
            y: parallaxY,
          }}
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.03) 45%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.03) 55%,
                transparent 60%
              )`,
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.5,
            }}
          />
          
          {child}
        </motion.div>

        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-400/50"
            style={{
              left: `${20 + i * 20}%`,
              top: i % 2 === 0 ? "-10px" : "auto",
              bottom: i % 2 === 1 ? "-10px" : "auto",
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function StickyStack({ children, className }: StickyStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div 
      ref={containerRef} 
      className={cn("relative", className)}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.05), transparent 50%)",
        }}
      />
      
      {children.map((child, i) => (
        <StackCard 
          key={i} 
          child={child} 
          index={i} 
          total={children.length}
          scrollProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
