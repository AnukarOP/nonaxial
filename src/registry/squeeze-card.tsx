"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SqueezeCardProps {
  children: React.ReactNode;
  className?: string;
}

interface BulgePoint {
  id: number;
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

export function SqueezeCard({ children, className }: SqueezeCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [pressPoint, setPressPoint] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for rubber squeeze effect
  const squeezeX = useSpring(1, { stiffness: 300, damping: 15, mass: 0.8 });
  const squeezeY = useSpring(1, { stiffness: 300, damping: 15, mass: 0.8 });
  const bulgeAmount = useSpring(0, { stiffness: 200, damping: 20 });
  const wobble = useSpring(0, { stiffness: 400, damping: 10 });

  // Bulge points for rubber deformation visual
  const bulgePoints = useMemo((): BulgePoint[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: ((Math.sin(i * 3.7) + 1) / 2) * 100,
      y: ((Math.cos(i * 3.7) + 1) / 2) * 100,
      radius: 30 + ((Math.sin(i * 5.3) + 1) / 2) * 40,
      intensity: 0.02 + ((Math.sin(i * 7.1) + 1) / 2) * 0.03,
    }));
  }, []);

  useEffect(() => {
    if (isPressed) {
      squeezeX.set(0.92);
      squeezeY.set(1.08);
      bulgeAmount.set(1);
    } else if (isHovered) {
      squeezeX.set(0.97);
      squeezeY.set(1.03);
      bulgeAmount.set(0.5);
    } else {
      squeezeX.set(1);
      squeezeY.set(1);
      bulgeAmount.set(0);
    }
  }, [isHovered, isPressed, squeezeX, squeezeY, bulgeAmount]);

  // Wobble effect on release
  useEffect(() => {
    if (!isPressed && isHovered) {
      wobble.set(1);
      const timeout = setTimeout(() => wobble.set(0), 300);
      return () => clearTimeout(timeout);
    }
  }, [isPressed, isHovered, wobble]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const pos = {
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    };
    setMousePos(pos);
    if (isPressed) {
      setPressPoint(pos);
    }
  };

  const handlePress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPressPoint({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  // Calculate bulge SVG filter
  const bulgeFilter = useMemo(() => {
    const cx = pressPoint.x;
    const cy = pressPoint.y;
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bulge'%3E%3CfeDisplacementMap in='SourceGraphic' scale='${isPressed ? 20 : 0}' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3C/svg%3E#bulge")`;
  }, [pressPoint, isPressed]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-zinc-900/80 border border-white/10 overflow-hidden cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={(e) => {
        setIsPressed(true);
        handlePress(e);
      }}
      onMouseUp={() => setIsPressed(false)}
      style={{
        scaleX: squeezeX,
        scaleY: squeezeY,
        transformOrigin: `${pressPoint.x * 100}% ${pressPoint.y * 100}%`,
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse ${isPressed ? 40 : 30}% ${isPressed ? 60 : 40}% at ${pressPoint.x * 100}% ${pressPoint.y * 100}%,
            rgba(139, 92, 246, ${isPressed ? 0.4 : isHovered ? 0.2 : 0}) 0%,
            transparent 100%
          )`,
          transition: "all 0.15s ease",
        }}
      />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{
            left: `${pressPoint.x * 100}%`,
            top: `${pressPoint.y * 100}%`,
            transform: "translate(-50%, -50%)",
            borderColor: `rgba(139, 92, 246, ${0.3 - i * 0.1})`,
            width: 0,
            height: 0,
          }}
          animate={isPressed ? {
            width: [0, 100 + i * 50],
            height: [0, 100 + i * 50],
            opacity: [0.5, 0],
          } : {}}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
      {bulgePoints.map((point) => {
        const distFromPress = Math.sqrt(
          Math.pow((point.x / 100 - pressPoint.x) * 2, 2) +
          Math.pow((point.y / 100 - pressPoint.y) * 2, 2)
        );
        const influence = Math.max(0, 1 - distFromPress);
        
        return (
          <motion.div
            key={point.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: point.radius,
              height: point.radius,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(
                circle,
                rgba(255, 255, 255, ${point.intensity * influence * (isPressed ? 3 : 1)}) 0%,
                transparent 70%
              )`,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        );
      })}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 120% 80% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 40%
            )
          `,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            ${90 + (mousePos.x - 0.5) * 30}deg,
            rgba(0, 0, 0, ${isPressed ? 0.2 : isHovered ? 0.1 : 0}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, ${isPressed ? 0.15 : isHovered ? 0.08 : 0}) 100%
          )`,
          transition: "background 0.2s ease",
        }}
      />
      <motion.div
        className="relative z-10"
        style={{
          x: useTransform(bulgeAmount, [0, 0.5, 1], [0, (mousePos.x - 0.5) * 3, (pressPoint.x - 0.5) * 8]),
          y: useTransform(bulgeAmount, [0, 0.5, 1], [0, (mousePos.y - 0.5) * 3, (pressPoint.y - 0.5) * 8]),
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: isPressed
            ? `conic-gradient(
                from ${Math.atan2(pressPoint.y - 0.5, pressPoint.x - 0.5) * 180 / Math.PI}deg at ${pressPoint.x * 100}% ${pressPoint.y * 100}%,
                rgba(139, 92, 246, 0.6) 0deg,
                rgba(236, 72, 153, 0.4) 90deg,
                rgba(6, 182, 212, 0.6) 180deg,
                rgba(139, 92, 246, 0.4) 270deg,
                rgba(139, 92, 246, 0.6) 360deg
              )`
            : `linear-gradient(
                ${45 + mousePos.x * 90}deg,
                rgba(139, 92, 246, ${isHovered ? 0.4 : 0.2}) 0%,
                rgba(236, 72, 153, ${isHovered ? 0.3 : 0.15}) 50%,
                rgba(139, 92, 246, ${isHovered ? 0.4 : 0.2}) 100%
              )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "all 0.15s ease",
        }}
      />
      <motion.div
        className="absolute -inset-4 rounded-3xl -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at ${pressPoint.x * 100}% ${pressPoint.y * 100}%,
            rgba(139, 92, 246, ${isPressed ? 0.3 : isHovered ? 0.15 : 0}) 0%,
            transparent 60%
          )`,
          filter: "blur(20px)",
          transform: `scale(${isPressed ? 1.1 : 1})`,
          transition: "all 0.2s ease",
        }}
      />
    </motion.div>
  );
}
