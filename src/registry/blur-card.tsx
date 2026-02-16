"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurCardProps {
  children: React.ReactNode;
  className?: string;
  blurContent?: React.ReactNode;
}

interface DepthLayer {
  id: number;
  blur: number;
  opacity: number;
  scale: number;
  zOffset: number;
}

export function BlurCard({ children, className, blurContent }: BlurCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [focusPoint, setFocusPoint] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for smooth blur transitions
  const blurProgress = useSpring(0, { stiffness: 80, damping: 15 });
  const focusXSpring = useSpring(0.5, { stiffness: 100, damping: 20 });
  const focusYSpring = useSpring(0.5, { stiffness: 100, damping: 20 });
  const dofIntensity = useSpring(0, { stiffness: 120, damping: 18 });

  // Depth of field layers
  const depthLayers = useMemo((): DepthLayer[] => [
    { id: 0, blur: 0, opacity: 1, scale: 1, zOffset: 0 },
    { id: 1, blur: 2, opacity: 0.8, scale: 1.02, zOffset: 10 },
    { id: 2, blur: 5, opacity: 0.6, scale: 1.05, zOffset: 20 },
    { id: 3, blur: 10, opacity: 0.4, scale: 1.08, zOffset: 30 },
  ], []);

  // Bokeh particles for depth of field effect
  const bokehParticles = useMemo(() => {
    const colors = [
      "rgba(139, 92, 246, 0.3)",
      "rgba(236, 72, 153, 0.25)",
      "rgba(6, 182, 212, 0.3)",
      "rgba(255, 255, 255, 0.2)",
    ];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      size: 10 + ((Math.sin(i * 5.3) + 1) / 2) * 30,
      depth: ((Math.sin(i * 7.1) + 1) / 2),
      color: colors[i % colors.length],
    }));
  }, []);

  useEffect(() => {
    blurProgress.set(isHovered ? 1 : 0);
    dofIntensity.set(isHovered ? 1 : 0);
  }, [isHovered, blurProgress, dofIntensity]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
    setFocusPoint({ x, y });
    focusXSpring.set(x);
    focusYSpring.set(y);
  };

  // Calculate blur based on distance from focus point
  const getBlurForPosition = (posX: number, posY: number, maxBlur: number) => {
    const dx = posX - focusPoint.x;
    const dy = posY - focusPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance * maxBlur * 2;
  };

  // Transform for main content blur
  const contentBlur = useTransform(blurProgress, [0, 1], [0, 12]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-zinc-900/80 border border-white/10 overflow-hidden cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ perspective: 1000 }}
    >
      {depthLayers.slice(1).map((layer, index) => (
        <motion.div
          key={layer.id}
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `scale(${layer.scale}) translateZ(${-layer.zOffset}px)`,
            filter: `blur(${isHovered ? layer.blur : 0}px)`,
            opacity: isHovered ? layer.opacity : 0,
            background: `radial-gradient(
              ellipse 60% 60% at ${50 + (index - 1) * 15}% ${50 + (index - 1) * 10}%,
              rgba(139, 92, 246, 0.1) 0%,
              transparent 70%
            )`,
            transition: "all 0.4s ease",
          }}
        />
      ))}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bokehParticles.map((particle) => {
          // Calculate blur based on depth difference from focus
          const depthDiff = Math.abs(particle.depth - 0.5);
          const particleBlur = isHovered ? depthDiff * 12 : 0;
          
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                background: particle.color,
                filter: `blur(${particleBlur}px)`,
                transform: `translate(-50%, -50%) scale(${isHovered ? 1 + (1 - particle.depth) * 0.5 : 0.5})`,
                opacity: isHovered ? 0.8 - depthDiff * 0.5 : 0,
                transition: "all 0.5s ease",
              }}
            />
          );
        })}
      </div>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${focusPoint.x * 100}%`,
          top: `${focusPoint.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          className="rounded-full border-2 border-white/30"
          style={{
            width: 60,
            height: 60,
            opacity: isHovered ? 0.5 : 0,
            scale: useTransform(dofIntensity, [0, 1], [0.5, 1]),
            transition: "opacity 0.3s ease",
          }}
        />
        <motion.div
          className="absolute inset-0 m-auto rounded-full border border-white/50"
          style={{
            width: 20,
            height: 20,
            opacity: isHovered ? 0.7 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </motion.div>
      <motion.div
        className="relative z-10"
        style={{
          filter: useTransform(contentBlur, blur => `blur(${blur}px)`),
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          WebkitMaskImage: `radial-gradient(
            ellipse 30% 30% at ${focusPoint.x * 100}% ${focusPoint.y * 100}%,
            black 0%,
            black 30%,
            transparent 70%
          )`,
          maskImage: `radial-gradient(
            ellipse 30% 30% at ${focusPoint.x * 100}% ${focusPoint.y * 100}%,
            black 0%,
            black 30%,
            transparent 70%
          )`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="w-full h-full">
          {children}
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-30"
        style={{
          background: `radial-gradient(
            ellipse 50% 50% at ${focusPoint.x * 100}% ${focusPoint.y * 100}%,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.1) 100%
          )`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <motion.div
          style={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
            transition: "all 0.4s ease",
          }}
        >
          {blurContent || (
            <div className="text-white text-center p-6">
              <p className="font-semibold text-lg">Focus Here</p>
              <p className="text-white/70 text-sm mt-2">Move cursor to shift focus</p>
            </div>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 80% 80% at ${focusPoint.x * 100}% ${focusPoint.y * 100}%,
            transparent 20%,
            rgba(0, 0, 0, ${isHovered ? 0.4 : 0}) 100%
          )`,
          transition: "background 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: isHovered
            ? "inset 0 0 60px rgba(0, 0, 0, 0.4)"
            : "inset 0 0 30px rgba(0, 0, 0, 0.2)",
          borderRadius: "inherit",
          transition: "box-shadow 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 0.3 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-20%",
            width: "60%",
            height: "60%",
            background: `radial-gradient(
              circle,
              rgba(139, 92, 246, 0.3) 0%,
              rgba(236, 72, 153, 0.2) 50%,
              transparent 70%
            )`,
            filter: "blur(30px)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `conic-gradient(
            from ${mousePos.x * 360}deg at 50% 50%,
            rgba(139, 92, 246, ${isHovered ? 0.4 : 0.2}),
            rgba(236, 72, 153, ${isHovered ? 0.3 : 0.1}),
            rgba(6, 182, 212, ${isHovered ? 0.4 : 0.2}),
            rgba(139, 92, 246, ${isHovered ? 0.4 : 0.2})
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "all 0.3s ease",
        }}
      />
    </motion.div>
  );
}
