"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  layers?: React.ReactNode[];
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number;
  shape: "circle" | "square" | "triangle";
  color: string;
  rotateSpeed: number;
}

export function ParallaxCard({ children, className, layers = [] }: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for smooth parallax
  const mouseXSpring = useSpring(0.5, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(0.5, { stiffness: 100, damping: 20 });
  const rotateXSpring = useSpring(0, { stiffness: 80, damping: 15 });
  const rotateYSpring = useSpring(0, { stiffness: 80, damping: 15 });

  // Floating elements for depth
  const floatingElements = useMemo((): FloatingElement[] => {
    const shapes = ["circle", "square", "triangle"] as const;
    const colors = [
      "rgba(139, 92, 246, 0.3)",
      "rgba(236, 72, 153, 0.25)",
      "rgba(6, 182, 212, 0.3)",
      "rgba(34, 197, 94, 0.25)",
    ];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 10 + ((Math.sin(i * 3.7) + 1) / 2) * 80,
      y: 10 + ((Math.cos(i * 3.7) + 1) / 2) * 80,
      size: 10 + ((Math.sin(i * 5.3) + 1) / 2) * 30,
      depth: 0.3 + ((Math.sin(i * 7.1) + 1) / 2) * 0.7,
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
      rotateSpeed: 0.5 + ((Math.sin(i * 2.9) + 1) / 2) * 1.5,
    }));
  }, []);

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setRotation(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
    mouseXSpring.set(x);
    mouseYSpring.set(y);
    rotateXSpring.set((y - 0.5) * -20);
    rotateYSpring.set((x - 0.5) * 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXSpring.set(0);
    rotateYSpring.set(0);
    mouseXSpring.set(0.5);
    mouseYSpring.set(0.5);
  };

  // Transform for parallax depth effect
  const parallaxX = useTransform(mouseXSpring, [0, 1], [-20, 20]);
  const parallaxY = useTransform(mouseYSpring, [0, 1], [-20, 20]);

  // Render shapes
  const renderShape = (element: FloatingElement) => {
    switch (element.shape) {
      case "circle":
        return (
          <div
            className="rounded-full"
            style={{
              width: element.size,
              height: element.size,
              background: element.color,
            }}
          />
        );
      case "square":
        return (
          <div
            className="rounded-sm"
            style={{
              width: element.size,
              height: element.size,
              background: element.color,
              transform: `rotate(${rotation * element.rotateSpeed}deg)`,
            }}
          />
        );
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color.replace("0.3", "0.4").replace("0.25", "0.35")}`,
              transform: `rotate(${rotation * element.rotateSpeed}deg)`,
            }}
          />
        );
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-zinc-900/80 border border-white/10 overflow-hidden cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 100% 80% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(139, 92, 246, 0.3) 0%,
              rgba(236, 72, 153, 0.2) 30%,
              transparent 60%
            )
          `,
          x: useTransform(parallaxX, v => v * -1.5),
          y: useTransform(parallaxY, v => v * -1.5),
          scale: isHovered ? 1.2 : 1,
          transition: "scale 0.4s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          x: useTransform(parallaxX, v => v * -0.5),
          y: useTransform(parallaxY, v => v * -0.5),
          opacity: isHovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute pointer-events-none"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            x: useTransform(parallaxX, v => v * element.depth * 2),
            y: useTransform(parallaxY, v => v * element.depth * 2),
            opacity: isHovered ? 1 : 0.3,
            filter: `blur(${(1 - element.depth) * 2}px)`,
            transition: "opacity 0.4s ease",
            transform: `translateZ(${element.depth * 50}px)`,
          }}
        >
          {renderShape(element)}
        </motion.div>
      ))}
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            x: useTransform(parallaxX, v => v * (index + 1) * 0.8),
            y: useTransform(parallaxY, v => v * (index + 1) * 0.8),
            transform: `translateZ(${(index + 1) * 30}px)`,
          }}
        >
          {layer}
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0, 0, 0, ${isHovered ? 0.3 : 0.5}) 100%
          )`,
          transition: "background 0.4s ease",
        }}
      />
      <motion.div
        className="relative z-10"
        style={{
          x: useTransform(parallaxX, v => v * 0.3),
          y: useTransform(parallaxY, v => v * 0.3),
          transform: "translateZ(60px)",
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            ${135 + (mousePos.x - 0.5) * 60}deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 40%,
            transparent 60%,
            rgba(255, 255, 255, 0.05) 100%
          )`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `conic-gradient(
            from ${(mousePos.x + mousePos.y) * 180}deg at 50% 50%,
            rgba(139, 92, 246, ${isHovered ? 0.5 : 0.2}),
            rgba(236, 72, 153, ${isHovered ? 0.4 : 0.15}),
            rgba(6, 182, 212, ${isHovered ? 0.5 : 0.2}),
            rgba(139, 92, 246, ${isHovered ? 0.5 : 0.2})
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
