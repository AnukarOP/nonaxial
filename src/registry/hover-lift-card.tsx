"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverLiftCardProps {
  children: React.ReactNode;
  className?: string;
  liftAmount?: number;
  shadowIntensity?: "low" | "medium" | "high";
}

interface RisingParticle {
  id: number;
  x: number;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
  drift: number;
}

export function HoverLiftCard({
  children,
  className,
  liftAmount = -15,
  shadowIntensity = "medium",
}: HoverLiftCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for lift
  const liftSpring = useSpring(0, { stiffness: 200, damping: 20, mass: 1 });
  const scaleSpring = useSpring(1, { stiffness: 300, damping: 25 });
  const shadowBlurSpring = useSpring(0, { stiffness: 150, damping: 20 });

  // Rising particles
  const particles = useMemo((): RisingParticle[] => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: 5 + ((Math.sin(i * 3.7) + 1) / 2) * 90,
      size: 2 + ((Math.sin(i * 5.3) + 1) / 2) * 4,
      speed: 1.5 + ((Math.sin(i * 7.1) + 1) / 2) * 2,
      delay: ((Math.sin(i * 2.9) + 1) / 2) * 2,
      opacity: 0.3 + ((Math.sin(i * 4.3) + 1) / 2) * 0.5,
      drift: (Math.sin(i * 6.1) * 0.5) * 30,
    }));
  }, []);

  // Sparkle positions for shine effect
  const [sparkleOpacities, setSparkleOpacities] = useState<number[]>(
    Array(8).fill(0)
  );

  useEffect(() => {
    if (!isHovered) {
      setSparkleOpacities(Array(8).fill(0));
      return;
    }
    const interval = setInterval(() => {
      setSparkleOpacities(prev =>
        prev.map(() => Math.random() > 0.7 ? 0.8 + Math.random() * 0.2 : Math.max(0, prev[0] - 0.1))
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isHovered]);

  const shadowIntensities = {
    low: { blur: 15, spread: 5, opacity: 0.15 },
    medium: { blur: 30, spread: 10, opacity: 0.25 },
    high: { blur: 50, spread: 15, opacity: 0.35 },
  };

  const shadow = shadowIntensities[shadowIntensity];

  useEffect(() => {
    if (isHovered) {
      liftSpring.set(liftAmount);
      scaleSpring.set(1.03);
      shadowBlurSpring.set(1);
    } else {
      liftSpring.set(0);
      scaleSpring.set(1);
      shadowBlurSpring.set(0);
    }
  }, [isHovered, liftAmount, liftSpring, scaleSpring, shadowBlurSpring]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  // Dynamic shadow based on lift
  const shadowOpacity = useTransform(shadowBlurSpring, [0, 1], [0.1, shadow.opacity]);
  const shadowBlur = useTransform(shadowBlurSpring, [0, 1], [5, shadow.blur]);
  const shadowSpread = useTransform(shadowBlurSpring, [0, 1], [0, shadow.spread]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouse}
      style={{
        y: liftSpring,
        scale: scaleSpring,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] -z-10"
        style={{
          boxShadow: useTransform(
            [shadowBlur, shadowSpread, shadowOpacity],
            ([blur, spread, opacity]) =>
              `0 ${10 + Math.abs(liftAmount) / 2}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`
          ),
          transform: `translateY(${isHovered ? Math.abs(liftAmount) / 2 : 0}px) scale(${isHovered ? 0.95 : 1})`,
          background: "transparent",
          transition: "transform 0.3s ease",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-[inherit] -z-10"
        style={{
          background: `radial-gradient(
            ellipse 80% 50% at 50% 120%,
            rgba(139, 92, 246, ${isHovered ? 0.3 : 0}) 0%,
            rgba(236, 72, 153, ${isHovered ? 0.2 : 0}) 30%,
            transparent 70%
          )`,
          filter: `blur(${isHovered ? 30 : 0}px)`,
          transform: `translateY(${isHovered ? 30 : 0}px) scaleX(${isHovered ? 1.2 : 1})`,
          transition: "all 0.4s ease",
        }}
      />
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              bottom: 0,
              background: `radial-gradient(circle, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.6))`,
            }}
            animate={isHovered ? {
              y: [-10, -80 - Math.random() * 40],
              x: [0, particle.drift],
              opacity: [0, particle.opacity, 0],
              scale: [0.5, 1, 0.3],
            } : {
              y: 0,
              opacity: 0,
            }}
            transition={{
              duration: particle.speed,
              delay: particle.delay,
              repeat: isHovered ? Infinity : 0,
              ease: "easeOut",
            }}
          />
        ))}
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
            background: `linear-gradient(
              ${180 - mousePos.x * 60}deg,
              transparent 30%,
              rgba(255, 255, 255, 0.15) 50%,
              transparent 70%
            )`,
            transform: `translateX(${(mousePos.x - 0.5) * 20}px)`,
          }}
        />
      </motion.div>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 30 + (i % 2) * 20;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 4,
              height: 4,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z"
                fill={`rgba(255, 255, 255, ${sparkleOpacities[i]})`}
              />
            </svg>
          </motion.div>
        );
      })}
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `linear-gradient(
            ${135 + mousePos.x * 90}deg,
            rgba(255, 255, 255, ${isHovered ? 0.3 : 0}) 0%,
            transparent 40%,
            transparent 60%,
            rgba(139, 92, 246, ${isHovered ? 0.3 : 0}) 100%
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "all 0.3s ease",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
