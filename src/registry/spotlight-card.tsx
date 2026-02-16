"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

interface LensFlare {
  id: number;
  offsetX: number;
  offsetY: number;
  size: number;
  opacity: number;
  color: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(139, 92, 246, 0.4)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });
  
  // Spring-based smooth position tracking
  const posXSpring = useSpring(0, { stiffness: 150, damping: 20 });
  const posYSpring = useSpring(0, { stiffness: 150, damping: 20 });
  
  // Raw mouse position for immediate effects
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate lens flare elements
  const lensFlares = useMemo((): LensFlare[] => [
    { id: 0, offsetX: 0.2, offsetY: 0.2, size: 80, opacity: 0.3, color: "rgba(139, 92, 246, 0.4)" },
    { id: 1, offsetX: 0.4, offsetY: 0.4, size: 40, opacity: 0.2, color: "rgba(236, 72, 153, 0.3)" },
    { id: 2, offsetX: 0.6, offsetY: 0.6, size: 20, opacity: 0.4, color: "rgba(6, 182, 212, 0.3)" },
    { id: 3, offsetX: 0.8, offsetY: 0.8, size: 60, opacity: 0.15, color: "rgba(255, 255, 255, 0.2)" },
    { id: 4, offsetX: -0.3, offsetY: -0.3, size: 30, opacity: 0.25, color: "rgba(139, 92, 246, 0.3)" },
  ], []);

  // Ambient pulse animation
  const [ambientPulse, setAmbientPulse] = useState(0);
  
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setAmbientPulse(prev => (prev + 0.02) % (Math.PI * 2));
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    posXSpring.set(x);
    posYSpring.set(y);
    setMousePos({ x, y });
    setDimensions({ width, height });
  };

  // Calculate spotlight falloff intensity
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const distanceFromCenter = Math.sqrt(
    Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)
  );
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  const falloffIntensity = 1 - (distanceFromCenter / maxDistance) * 0.3;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative overflow-hidden rounded-xl cursor-pointer", className)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl"
        style={{
          background: `
            radial-gradient(
              800px circle at ${mousePos.x}px ${mousePos.y}px,
              ${spotlightColor} 0%,
              rgba(139, 92, 246, ${0.15 * falloffIntensity}) 25%,
              rgba(139, 92, 246, ${0.05 * falloffIntensity}) 45%,
              transparent 65%
            )
          `,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl"
        style={{
          background: `
            radial-gradient(
              1200px circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 40%
            )
          `,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
      {lensFlares.map((flare) => {
        // Calculate position opposite to cursor for lens flare effect
        const flareX = centerX + (centerX - mousePos.x) * flare.offsetX;
        const flareY = centerY + (centerY - mousePos.y) * flare.offsetY;
        
        return (
          <motion.div
            key={flare.id}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: flare.size,
              height: flare.size,
              left: flareX - flare.size / 2,
              top: flareY - flare.size / 2,
              background: `radial-gradient(circle, ${flare.color} 0%, transparent 70%)`,
              opacity: isHovered ? flare.opacity * falloffIntensity : 0,
              transition: "opacity 0.3s ease",
              filter: "blur(2px)",
            }}
          />
        );
      })}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: 100,
          height: 100,
          left: centerX + (centerX - mousePos.x) * 0.5 - 50,
          top: centerY + (centerY - mousePos.y) * 0.5 - 50,
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(139, 92, 246, 0.1) 30deg,
            transparent 60deg,
            rgba(236, 72, 153, 0.1) 90deg,
            transparent 120deg,
            rgba(6, 182, 212, 0.1) 150deg,
            transparent 180deg,
            rgba(139, 92, 246, 0.1) 210deg,
            transparent 240deg,
            rgba(236, 72, 153, 0.1) 270deg,
            transparent 300deg,
            rgba(6, 182, 212, 0.1) 330deg,
            transparent 360deg
          )`,
          opacity: isHovered ? 0.6 : 0,
          transition: "opacity 0.3s ease",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: isHovered
            ? `
              inset 0 0 60px rgba(139, 92, 246, ${0.1 + Math.sin(ambientPulse) * 0.05}),
              0 0 30px rgba(139, 92, 246, ${0.15 + Math.sin(ambientPulse) * 0.05})
            `
            : "none",
          transition: "box-shadow 0.3s ease",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit]"
        style={{
          background: `linear-gradient(
            ${Math.atan2(mousePos.y - centerY, mousePos.x - centerX) * 180 / Math.PI + 90}deg,
            rgba(139, 92, 246, ${isHovered ? 0.5 : 0}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(139, 92, 246, ${isHovered ? 0.3 : 0}) 100%
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "all 0.2s ease",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{
          opacity: isHovered ? 0.3 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mousePos.x,
              top: mousePos.y,
              width: "200%",
              height: "2px",
              background: `linear-gradient(90deg, rgba(255,255,255,0.3), transparent)`,
              transform: `rotate(${i * 60}deg)`,
              transformOrigin: "left center",
            }}
          />
        ))}
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
