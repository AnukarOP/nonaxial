"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface FoldCardProps {
  children: React.ReactNode;
  className?: string;
  foldContent?: React.ReactNode;
}

interface CreaseShadow {
  id: number;
  position: number;
  intensity: number;
  width: number;
}

export function FoldCard({ children, className, foldContent }: FoldCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for realistic paper folding
  const foldAngle = useSpring(0, { stiffness: 60, damping: 12, mass: 1.2 });
  const shadowIntensity = useSpring(0, { stiffness: 100, damping: 20 });

  // Crease shadows along the fold line
  const creaseShadows = useMemo((): CreaseShadow[] => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: (i + 1) / 9 * 100,
      intensity: 0.1 + ((Math.sin(i * 5.3) + 1) / 2) * 0.15,
      width: 2 + ((Math.sin(i * 7.1) + 1) / 2) * 4,
    }));
  }, []);

  useEffect(() => {
    if (isHovered) {
      foldAngle.set(-160);
      shadowIntensity.set(1);
    } else {
      foldAngle.set(0);
      shadowIntensity.set(0);
    }
  }, [isHovered, foldAngle, shadowIntensity]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  // Transform for crease depth based on fold angle
  const creaseDepth = useTransform(foldAngle, [-160, 0], [1, 0]);
  const flapShadow = useTransform(shadowIntensity, [0, 1], [0, 30]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative cursor-pointer",
        className
      )}
      style={{ perspective: 1500 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-zinc-900/90 border border-white/10 rounded-2xl overflow-hidden">
        <div className="relative z-10">
          {children}
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: "overlay",
          }}
        />
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{
            top: "50%",
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 0, 0, 0.3) 10%,
              rgba(0, 0, 0, 0.5) 50%,
              rgba(0, 0, 0, 0.3) 90%,
              transparent 100%
            )`,
            opacity: creaseDepth,
          }}
        />
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: "50%",
            height: "50%",
            background: `linear-gradient(
              to bottom,
              rgba(0, 0, 0, ${isHovered ? 0.3 : 0}) 0%,
              transparent 30%
            )`,
            transition: "background 0.3s ease",
          }}
        />
      </div>
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl origin-bottom overflow-hidden"
        style={{
          rotateX: foldAngle,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-violet-600 via-violet-500 to-fuchsia-500"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {foldContent || (
              <div className="text-white text-center p-4">
                <p className="font-semibold text-lg">Hover to unfold</p>
                <p className="text-white/70 text-sm">Paper folding physics</p>
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper2)'/%3E%3C/svg%3E")`,
              opacity: 0.08,
              mixBlendMode: "overlay",
            }}
          />
          {creaseShadows.map((crease) => (
            <motion.div
              key={crease.id}
              className="absolute h-full pointer-events-none"
              style={{
                left: `${crease.position}%`,
                width: crease.width,
                background: `linear-gradient(
                  to bottom,
                  transparent 0%,
                  rgba(0, 0, 0, ${crease.intensity}) 80%,
                  rgba(0, 0, 0, ${crease.intensity * 1.5}) 100%
                )`,
                opacity: creaseDepth,
              }}
            />
          ))}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{
              background: `linear-gradient(
                to bottom,
                transparent 0%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(0, 0, 0, 0.4) 100%
              )`,
              opacity: creaseDepth,
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                ${180 + mousePos.x * 30}deg,
                transparent 40%,
                rgba(255, 255, 255, 0.15) 50%,
                transparent 60%
              )`,
              opacity: useTransform(foldAngle, [-160, -80, 0], [0.3, 1, 0]),
            }}
          />
        </div>
        <motion.div
          className="absolute inset-0 bg-zinc-800"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper3)'/%3E%3C/svg%3E")`,
              opacity: 0.1,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to top,
                rgba(0, 0, 0, 0.5) 0%,
                transparent 50%
              )`,
            }}
          />
        </motion.div>
        <motion.div
          className="absolute -bottom-8 left-2 right-2 h-8 pointer-events-none -z-10"
          style={{
            background: `radial-gradient(
              ellipse 80% 100% at 50% 0%,
              rgba(0, 0, 0, 0.4) 0%,
              transparent 70%
            )`,
            opacity: useTransform(foldAngle, [-160, -60, 0], [0.8, 0.4, 0]),
            filter: `blur(${useTransform(foldAngle, [-160, 0], [8, 0]).get()}px)`,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none"
        style={{
          background: `conic-gradient(
            from ${mousePos.x * 360}deg at 50% 50%,
            rgba(139, 92, 246, ${isHovered ? 0.5 : 0.2}),
            rgba(236, 72, 153, ${isHovered ? 0.4 : 0.15}),
            rgba(139, 92, 246, ${isHovered ? 0.5 : 0.2})
          )`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "all 0.3s ease",
        }}
      />
      <motion.div
        className="absolute -inset-4 rounded-2xl -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at 50% 30%,
            rgba(139, 92, 246, 0.2) 0%,
            transparent 60%
          )`,
          filter: "blur(20px)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
}
