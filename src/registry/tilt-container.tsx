"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltContainer({ children, className, maxTilt = 15 }: TiltContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring config for smooth 3D feel
  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Depth layer parallax transforms
  const layer1X = useTransform(springMouseX, [0, 1], [-20, 20]);
  const layer1Y = useTransform(springMouseY, [0, 1], [-20, 20]);
  const layer2X = useTransform(springMouseX, [0, 1], [-35, 35]);
  const layer2Y = useTransform(springMouseY, [0, 1], [-35, 35]);
  const layer3X = useTransform(springMouseX, [0, 1], [-50, 50]);
  const layer3Y = useTransform(springMouseY, [0, 1], [-50, 50]);

  // Reflection position
  const reflectionX = useTransform(springMouseX, [0, 1], [0, 100]);
  const reflectionY = useTransform(springMouseY, [0, 1], [0, 100]);

  // Edge glow intensity based on tilt
  const glowIntensity = useTransform(
    [springRotateX, springRotateY],
    ([rx, ry]) => Math.min(1, (Math.abs(Number(rx)) + Math.abs(Number(ry))) / maxTilt)
  );

  // Edge glow positions
  const topGlow = useTransform(springRotateX, [-maxTilt, maxTilt], [0.8, 0]);
  const bottomGlow = useTransform(springRotateX, [-maxTilt, maxTilt], [0, 0.8]);
  const leftGlow = useTransform(springRotateY, [-maxTilt, maxTilt], [0, 0.8]);
  const rightGlow = useTransform(springRotateY, [-maxTilt, maxTilt], [0.8, 0]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    rotateX.set((y - 0.5) * -maxTilt * 2);
    rotateY.set((x - 0.5) * maxTilt * 2);
  }, [maxTilt, rotateX, rotateY, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [rotateX, rotateY, mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div 
      className={cn("relative", className)} 
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            x: layer3X,
            y: layer3Y,
            translateZ: -60,
            opacity: isHovered ? 0.3 : 0,
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))",
            filter: "blur(8px)",
            transition: "opacity 0.3s ease",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            x: layer2X,
            y: layer2Y,
            translateZ: -30,
            opacity: isHovered ? 0.4 : 0,
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
            filter: "blur(4px)",
            transition: "opacity 0.3s ease",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            x: layer1X,
            y: layer1Y,
            translateZ: -15,
            opacity: isHovered ? 0.5 : 0,
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))",
            transition: "opacity 0.3s ease",
          }}
        />

        <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <motion.div
            className="absolute w-[200%] h-[200%]"
            style={{
              x: useTransform(reflectionX, [0, 100], ["-100%", "0%"]),
              y: useTransform(reflectionY, [0, 100], ["-100%", "0%"]),
              background: `linear-gradient(
                135deg,
                transparent 0%,
                transparent 40%,
                rgba(255, 255, 255, 0.1) 45%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(255, 255, 255, 0.1) 55%,
                transparent 60%,
                transparent 100%
              )`,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
          style={{
            opacity: topGlow,
            background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8), transparent)",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)",
          }}
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] pointer-events-none"
          style={{
            opacity: bottomGlow,
            background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.8), rgba(99, 102, 241, 0.8), transparent)",
            boxShadow: "0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)",
          }}
        />

        <motion.div
          className="absolute inset-y-0 left-0 w-[2px] pointer-events-none"
          style={{
            opacity: leftGlow,
            background: "linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8), transparent)",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)",
          }}
        />

        <motion.div
          className="absolute inset-y-0 right-0 w-[2px] pointer-events-none"
          style={{
            opacity: rightGlow,
            background: "linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8), transparent)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            translateZ: -5,
            boxShadow: useTransform(
              [springRotateX, springRotateY],
              ([rx, ry]) => {
                const shadowX = Number(ry) * 0.5;
                const shadowY = Number(rx) * -0.5;
                return `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.3)`;
              }
            ),
          }}
        />

        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/40"
                initial={{
                  x: `${20 + i * 15}%`,
                  y: "100%",
                  opacity: 0,
                }}
                animate={{
                  y: "-10%",
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
                style={{
                  translateZ: 20 + i * 10,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
