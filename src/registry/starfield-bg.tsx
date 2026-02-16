"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
  length: number;
  progress: number;
  opacity: number;
}

interface NebulaCloud {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface StarfieldBgProps {
  children?: React.ReactNode;
  className?: string;
  starCount?: number;
  speed?: number;
}

export function StarfieldBg({
  children,
  className,
  starCount = 200,
  speed = 1,
}: StarfieldBgProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [nebulae, setNebulae] = useState<NebulaCloud[]>([]);
  const timeRef = useRef(0);
  const lastShootingStarRef = useRef(0);
  const centerRef = useRef({ x: 50, y: 50 });

  const starColors = [
    "#ffffff", // White
    "#ffd700", // Yellow
    "#87ceeb", // Light blue
    "#ff6b6b", // Red
    "#98d8c8", // Teal
  ];

  const nebulaColors = [
    "rgba(139, 92, 246, 0.15)", // Violet
    "rgba(236, 72, 153, 0.12)", // Pink
    "rgba(6, 182, 212, 0.1)", // Cyan
    "rgba(34, 197, 94, 0.08)", // Green
  ];

  // Initialize stars with 3D positions
  useEffect(() => {
    const newStars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 50, // Extended range for parallax
      y: Math.random() * 200 - 50,
      z: Math.random() * 3 + 0.5, // Depth layer (0.5 to 3.5)
      size: 0.5 + Math.random() * 2,
      twinkleSpeed: 1 + Math.random() * 4,
      twinklePhase: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));
    setStars(newStars);

    // Initialize nebula clouds
    const newNebulae: NebulaCloud[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 30 + Math.random() * 40,
      color: nebulaColors[i],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
    }));
    setNebulae(newNebulae);
  }, [starCount]);

  // Animation loop
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;

    // Spawn shooting stars occasionally
    if (t - lastShootingStarRef.current > 2000 + Math.random() * 4000) {
      lastShootingStarRef.current = t;
      setShootingStars((prev) => [
        ...prev.slice(-3),
        {
          id: t,
          startX: Math.random() * 80 + 10,
          startY: Math.random() * 30,
          angle: Math.PI * 0.25 + Math.random() * 0.3, // ~45 degrees
          speed: 2 + Math.random() * 2,
          length: 10 + Math.random() * 15,
          progress: 0,
          opacity: 1,
        },
      ]);
    }

    // Update shooting stars
    setShootingStars((prev) =>
      prev
        .map((s) => ({
          ...s,
          progress: s.progress + s.speed,
          opacity: Math.max(0, 1 - s.progress / 100),
        }))
        .filter((s) => s.opacity > 0)
    );

    // Update 3D star positions (parallax effect)
    setStars((prev) =>
      prev.map((star) => {
        // Move stars towards center based on depth (closer = faster)
        let newX = star.x;
        let newY = star.y;

        // Subtle drift based on depth
        newX += (centerRef.current.x - 50) * 0.001 * star.z * speed;
        newY += (centerRef.current.y - 50) * 0.001 * star.z * speed;

        // Wrap around
        if (newX < -50) newX = 150;
        if (newX > 150) newX = -50;
        if (newY < -50) newY = 150;
        if (newY > 150) newY = -50;

        return { ...star, x: newX, y: newY };
      })
    );

    // Rotate nebulae
    setNebulae((prev) =>
      prev.map((n) => ({
        ...n,
        rotation: n.rotation + n.rotationSpeed,
      }))
    );
  });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      centerRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #0a0a1a 0%, #000000 50%, #000000 100%)",
        }}
      />

      {nebulae.map((nebula) => (
        <motion.div
          key={nebula.id}
          className="absolute pointer-events-none"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}%`,
            height: `${nebula.size}%`,
            transform: `translate(-50%, -50%) rotate(${nebula.rotation}deg)`,
            background: `radial-gradient(ellipse at center, ${nebula.color} 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8 + nebula.id * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {stars.map((star) => {
        const time = timeRef.current;
        const twinkle = 0.5 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5;
        const perspectiveScale = 1 / star.z;
        const screenX = 50 + (star.x - 50) * perspectiveScale;
        const screenY = 50 + (star.y - 50) * perspectiveScale;

        // Only render if on screen
        if (screenX < -5 || screenX > 105 || screenY < -5 || screenY > 105) {
          return null;
        }

        return (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${screenX}%`,
              top: `${screenY}%`,
              width: star.size * perspectiveScale,
              height: star.size * perspectiveScale,
              backgroundColor: star.color,
              opacity: twinkle * (0.5 + perspectiveScale * 0.5),
              boxShadow: `0 0 ${star.size * 2 * perspectiveScale}px ${star.color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
      {shootingStars.map((s) => {
        const endX = s.startX + Math.cos(s.angle) * s.progress;
        const endY = s.startY + Math.sin(s.angle) * s.progress;
        const tailX = endX - Math.cos(s.angle) * s.length;
        const tailY = endY - Math.sin(s.angle) * s.length;

        return (
          <svg
            key={s.id}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <linearGradient id={`shootingGrad-${s.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor={`rgba(255, 255, 255, ${s.opacity})`} />
              </linearGradient>
              <filter id="shootingGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1={`${tailX}%`}
              y1={`${tailY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke={`url(#shootingGrad-${s.id})`}
              strokeWidth="2"
              filter="url(#shootingGlow)"
            />
            <circle
              cx={`${endX}%`}
              cy={`${endY}%`}
              r="2"
              fill="white"
              opacity={s.opacity}
              filter="url(#shootingGlow)"
            />
          </svg>
        );
      })}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`galaxy-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 15}%`,
            width: 3,
            height: 3,
            background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)`,
            filter: "blur(1px)",
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
