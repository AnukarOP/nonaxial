"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnable?: boolean;
  scale?: number;
}

interface DepthLayer {
  id: number;
  depth: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  opacity: number;
}

export function TiltCard({
  children,
  className,
  tiltAmount = 15,
  glareEnable = true,
  scale = 1.05,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateXSpring = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateYSpring = useSpring(0, { stiffness: 150, damping: 20 });
  const scaleSpring = useSpring(1, { stiffness: 200, damping: 25 });
  
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const [reflectionOffset, setReflectionOffset] = useState(0);
  
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setReflectionOffset(prev => (prev + 0.5) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered]);
  
  const depthLayers = useMemo((): DepthLayer[] => [
    { id: 0, depth: 10, offsetX: 0, offsetY: 0, blur: 0, opacity: 0.1 },
    { id: 1, depth: 25, offsetX: 0, offsetY: 0, blur: 1, opacity: 0.08 },
    { id: 2, depth: 40, offsetX: 0, offsetY: 0, blur: 2, opacity: 0.06 },
    { id: 3, depth: 60, offsetX: 0, offsetY: 0, blur: 3, opacity: 0.04 },
  ], []);
  
  const layerTransforms = useTransform(
    [rotateXSpring, rotateYSpring],
    ([rx, ry]) => depthLayers.map(layer => ({
      ...layer,
      offsetX: (ry as number) * layer.depth * 0.02,
      offsetY: -(rx as number) * layer.depth * 0.02,
    }))
  );

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -tiltAmount;
    const rotateY = ((x - centerX) / centerX) * tiltAmount;
    
    rotateXSpring.set(rotateX);
    rotateYSpring.set(rotateY);
    scaleSpring.set(scale);
    
    setMousePos({ x: x / width, y: y / height });
  };

  const reset = () => {
    rotateXSpring.set(0);
    rotateYSpring.set(0);
    scaleSpring.set(1);
    setIsHovered(false);
  };

  const glowIntensity = Math.abs(rotateXSpring.get()) + Math.abs(rotateYSpring.get());

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
      }}
      className={cn("relative cursor-pointer", className)}
    >
      {depthLayers.map((layer) => (
        <motion.div
          key={layer.id}
          className="absolute inset-0 rounded-[inherit] bg-black/50 pointer-events-none"
          style={{
            transform: `translateZ(-${layer.depth}px) translateX(${mousePos.x * layer.depth * 0.1 - layer.depth * 0.05}px) translateY(${mousePos.y * layer.depth * 0.1 - layer.depth * 0.05}px)`,
            filter: `blur(${layer.blur}px)`,
            opacity: isHovered ? layer.opacity : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      ))}

      <motion.div
        className="relative z-10"
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(0px)",
        }}
      >
        {children}
      </motion.div>

      {glareEnable && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
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
                    ellipse 80% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
                    rgba(255,255,255,0.25) 0%,
                    rgba(255,255,255,0.1) 30%,
                    transparent 70%
                  )
                `,
              }}
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
            style={{
              opacity: isHovered ? 0.5 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: `linear-gradient(
                  ${reflectionOffset}deg,
                  transparent 0%,
                  transparent 40%,
                  rgba(255,255,255,0.1) 45%,
                  rgba(255,255,255,0.2) 50%,
                  rgba(255,255,255,0.1) 55%,
                  transparent 60%,
                  transparent 100%
                )`,
                transform: `rotate(${reflectionOffset * 0.5}deg)`,
              }}
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background: `linear-gradient(
                ${135 + mousePos.x * 30}deg,
                transparent 0%,
                rgba(139,92,246,0.1) ${30 + mousePos.x * 20}%,
                transparent ${60 + mousePos.y * 20}%
              )`,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              transform: `translateZ(5px)`,
            }}
          />
        </>
      )}

      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit]"
        style={{
          background: `linear-gradient(
            ${90 + mousePos.x * 180}deg,
            rgba(139,92,246,${isHovered ? 0.6 : 0}) 0%,
            rgba(236,72,153,${isHovered ? 0.4 : 0}) 50%,
            rgba(6,182,212,${isHovered ? 0.6 : 0}) 100%
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "all 0.3s ease",
          filter: `blur(${isHovered ? 1 : 0}px)`,
        }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-4 rounded-[inherit] -z-10"
        style={{
          background: `radial-gradient(
            ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(139,92,246,${isHovered ? 0.15 : 0}) 0%,
            transparent 70%
          )`,
          filter: "blur(20px)",
          transition: "all 0.3s ease",
        }}
      />
    </motion.div>
  );
}
