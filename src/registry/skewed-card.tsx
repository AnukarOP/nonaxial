"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkewedCardProps {
  children: React.ReactNode;
  className?: string;
  skewX?: number;
  skewY?: number;
}

interface DepthLayer {
  id: number;
  depth: number;
  blur: number;
  opacity: number;
  scale: number;
}

export function SkewedCard({
  children,
  className,
  skewX = -6,
  skewY = 2,
}: SkewedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for smooth perspective transforms
  const skewXSpring = useSpring(0, { stiffness: 120, damping: 20 });
  const skewYSpring = useSpring(0, { stiffness: 120, damping: 20 });
  const scaleSpring = useSpring(1, { stiffness: 200, damping: 25 });
  const rotateXSpring = useSpring(0, { stiffness: 100, damping: 18 });
  const rotateYSpring = useSpring(0, { stiffness: 100, damping: 18 });

  // Warp distortion based on mouse
  const [warpAmount, setWarpAmount] = useState(0);

  useEffect(() => {
    if (isHovered) {
      skewXSpring.set(skewX);
      skewYSpring.set(skewY);
      scaleSpring.set(1.05);
    } else {
      skewXSpring.set(0);
      skewYSpring.set(0);
      scaleSpring.set(1);
      rotateXSpring.set(0);
      rotateYSpring.set(0);
    }
  }, [isHovered, skewX, skewY, skewXSpring, skewYSpring, scaleSpring, rotateXSpring, rotateYSpring]);

  // Depth layers for 3D shadow effect
  const depthLayers = useMemo((): DepthLayer[] => [
    { id: 0, depth: 5, blur: 2, opacity: 0.15, scale: 0.98 },
    { id: 1, depth: 15, blur: 5, opacity: 0.12, scale: 0.95 },
    { id: 2, depth: 30, blur: 10, opacity: 0.08, scale: 0.92 },
    { id: 3, depth: 50, blur: 20, opacity: 0.05, scale: 0.88 },
  ], []);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
    
    // Add subtle rotation based on mouse for warp effect
    rotateXSpring.set((y - 0.5) * -8);
    rotateYSpring.set((x - 0.5) * 8);
    
    // Calculate warp amount based on cursor distance from center
    const distFromCenter = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
    setWarpAmount(distFromCenter);
  };

  // Shadow direction based on skew
  const shadowX = useTransform(skewXSpring, v => v * -3);
  const shadowY = useTransform(skewYSpring, v => v * 3 + 10);

  return (
    <motion.div
      ref={ref}
      className={cn("relative cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouse}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {depthLayers.map((layer) => (
        <motion.div
          key={layer.id}
          className="absolute inset-0 rounded-[inherit] bg-black/50 pointer-events-none -z-10"
          style={{
            transform: `
              skewX(${isHovered ? skewX * 1.2 : 0}deg) 
              skewY(${isHovered ? skewY * 1.2 : 0}deg)
              translateX(${isHovered ? layer.depth * (skewX / 10) : 0}px)
              translateY(${isHovered ? layer.depth : 0}px)
              scale(${isHovered ? layer.scale : 1})
            `,
            filter: `blur(${isHovered ? layer.blur : 0}px)`,
            opacity: isHovered ? layer.opacity : 0,
            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      ))}
      <motion.div
        className="relative"
        style={{
          skewX: skewXSpring,
          skewY: skewYSpring,
          scale: scaleSpring,
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          style={{
            transform: `translateZ(-20px) scale(1.05)`,
            opacity: isHovered ? 0.5 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                ${135 + mousePos.x * 90}deg,
                rgba(139, 92, 246, 0.3) 0%,
                rgba(236, 72, 153, 0.2) 50%,
                rgba(6, 182, 212, 0.3) 100%
              )`,
            }}
          />
        </motion.div>
        <div className="relative z-10">
          {children}
        </div>
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
                radial-gradient(
                  ellipse 60% 40% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
                  rgba(255, 255, 255, 0.15) 0%,
                  transparent 50%
                )
              `,
            }}
          />
        </motion.div>
        <motion.div
          className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
          style={{
            background: `linear-gradient(
              ${90 + skewX * 5}deg,
              rgba(139, 92, 246, ${isHovered ? 0.6 : 0}) 0%,
              rgba(236, 72, 153, ${isHovered ? 0.4 : 0}) 50%,
              rgba(6, 182, 212, ${isHovered ? 0.6 : 0}) 100%
            )`,
            padding: "1px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            filter: `blur(${isHovered ? 1 : 0}px)`,
            transition: "all 0.3s ease",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          style={{
            opacity: isHovered ? 0.4 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-100%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: `linear-gradient(
                ${180 + skewX * 3}deg,
                transparent 45%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 55%
              )`,
              transform: `rotate(${skewX}deg)`,
            }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute left-0 right-0 -bottom-2 h-8 rounded-[inherit] pointer-events-none -z-20"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(139, 92, 246, ${isHovered ? 0.1 : 0}),
            transparent
          )`,
          filter: "blur(8px)",
          transform: `scaleY(${isHovered ? 1 : 0}) skewX(${skewX}deg)`,
          transformOrigin: "top",
          transition: "all 0.4s ease",
        }}
      />
    </motion.div>
  );
}
