"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface PerspectiveContainerProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
}

export function PerspectiveContainer({ 
  children, 
  className, 
  perspective = 1000 
}: PerspectiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 30 });
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { stiffness: 100, damping: 20 };
  const springMouseX = useSpring(mouseX, springConfig);
  const springMouseY = useSpring(mouseY, springConfig);
  
  const rotateY = useTransform(springMouseX, [0, 1], [-10, 10]);
  const rotateX = useTransform(springMouseY, [0, 1], [10, -10]);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Mouse tracking for 3D rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [mouseX, mouseY]);

  // Animated moving light source
  useAnimationFrame((time) => {
    const x = 50 + Math.sin(time / 2000) * 30;
    const y = 30 + Math.cos(time / 3000) * 20;
    setLightPosition({ x, y });
  });

  // Process children to add depth layers
  const processedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    const depth = index * 20;
    const depthScale = 1 - index * 0.02;
    
    return (
      <motion.div
        key={index}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${depth}px) scale(${depthScale})`,
        }}
        initial={{ opacity: 0, z: -50 }}
        animate={{ opacity: 1, z: depth }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `linear-gradient(
              ${135 + (springMouseX.get() - 0.5) * 30}deg,
              transparent 40%,
              rgba(255, 255, 255, ${0.05 - index * 0.01}) 50%,
              transparent 60%
            )`,
            transform: `translateZ(${depth + 1}px)`,
          }}
        />
        {index > 0 && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-xl"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              filter: "blur(20px)",
              transform: `translateZ(${depth - 10}px) translateY(10px)`,
            }}
          />
        )}
        
        {child}
      </motion.div>
    );
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ 
        perspective,
        perspectiveOrigin: `${springMouseX.get() * 100}% ${springMouseY.get() * 100}%`,
      }}
    >
      <motion.div
        className="absolute pointer-events-none z-50"
        style={{
          left: `${lightPosition.x}%`,
          top: `${lightPosition.y}%`,
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.8)",
          boxShadow: `
            0 0 20px 10px rgba(255, 255, 255, 0.3),
            0 0 60px 30px rgba(139, 92, 246, 0.2),
            0 0 100px 50px rgba(236, 72, 153, 0.1)
          `,
          transform: "translate(-50%, -50%)",
        }}
      />
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-40" style={{ overflow: "visible" }}>
        <defs>
          <filter id="lightRayGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + (lightPosition.x / 100) * Math.PI;
          const length = 200;
          return (
            <motion.line
              key={i}
              x1={`${lightPosition.x}%`}
              y1={`${lightPosition.y}%`}
              x2={`${lightPosition.x + Math.cos(angle) * (length / dimensions.width) * 100}%`}
              y2={`${lightPosition.y + Math.sin(angle) * (length / dimensions.height) * 100}%`}
              stroke="url(#rayGradient)"
              strokeWidth="1"
              filter="url(#lightRayGlow)"
              opacity={0.3}
            />
          );
        })}
      </svg>
      <motion.div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{
            background: `linear-gradient(to top, 
              rgba(139, 92, 246, 0.1) 0%,
              transparent 100%
            )`,
            transform: "rotateX(90deg) translateZ(-50px)",
            transformOrigin: "bottom center",
            filter: "blur(10px)",
          }}
        />
        <div style={{ transformStyle: "preserve-3d" }}>
          {processedChildren}
        </div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${lightPosition.x}% ${lightPosition.y}%, 
              transparent 20%,
              rgba(0, 0, 0, 0.02) 50%,
              rgba(0, 0, 0, 0.05) 100%
            )`,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
      />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 pointer-events-none"
          style={{
            top: i < 2 ? 0 : "auto",
            bottom: i >= 2 ? 0 : "auto",
            left: i % 2 === 0 ? 0 : "auto",
            right: i % 2 === 1 ? 0 : "auto",
            background: `radial-gradient(circle at ${i % 2 === 0 ? "0%" : "100%"} ${i < 2 ? "0%" : "100%"}, 
              rgba(255, 255, 255, 0.1), transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
