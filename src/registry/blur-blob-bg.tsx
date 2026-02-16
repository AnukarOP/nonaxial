"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurBlobBgProps {
  children?: React.ReactNode;
  className?: string;
  blobCount?: number;
}

interface Blob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  noiseOffset: number;
  morphPhase: number;
  morphSpeed: number;
  rotationSpeed: number;
}

interface LightReflection {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  angle: number;
}

// Simple noise function for organic movement
function noise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.12) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

export function BlurBlobBg({ children, className, blobCount = 5 }: BlurBlobBgProps) {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [reflections, setReflections] = useState<LightReflection[]>([]);
  const timeRef = useRef(0);

  const colors = [
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#22c55e", // Green
    "#f59e0b", // Amber
    "#6366f1", // Indigo
  ];

  // Initialize blobs
  useEffect(() => {
    const newBlobs: Blob[] = Array.from({ length: blobCount }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 25 + Math.random() * 25,
      color: colors[i % colors.length],
      noiseOffset: Math.random() * 1000,
      morphPhase: Math.random() * Math.PI * 2,
      morphSpeed: 0.3 + Math.random() * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 20,
    }));
    setBlobs(newBlobs);

    // Initialize light reflections
    const newReflections: LightReflection[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 5 + Math.random() * 15,
      opacity: 0.1 + Math.random() * 0.2,
      angle: Math.random() * 360,
    }));
    setReflections(newReflections);
  }, [blobCount]);

  // Physics and animation loop
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;

    setBlobs((prev) =>
      prev.map((blob) => {
        // Noise-based organic movement
        const noiseX = noise(timeRef.current * 0.2, blob.noiseOffset, blob.id);
        const noiseY = noise(blob.noiseOffset, timeRef.current * 0.2, blob.id + 50);

        let newVx = blob.vx + noiseX * 0.01;
        let newVy = blob.vy + noiseY * 0.01;

        // Damping
        newVx *= 0.98;
        newVy *= 0.98;

        // Speed limit
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > 0.3) {
          newVx = (newVx / speed) * 0.3;
          newVy = (newVy / speed) * 0.3;
        }

        // Soft boundary forces
        let newX = blob.x + newVx;
        let newY = blob.y + newVy;

        if (newX < 10) newVx += 0.02;
        if (newX > 90) newVx -= 0.02;
        if (newY < 10) newVy += 0.02;
        if (newY > 90) newVy -= 0.02;

        return {
          ...blob,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          morphPhase: blob.morphPhase + blob.morphSpeed * 0.02,
        };
      })
    );

    // Animate reflections
    setReflections((prev) =>
      prev.map((ref) => ({
        ...ref,
        opacity: 0.1 + Math.sin(timeRef.current * 0.5 + ref.id) * 0.1,
        angle: ref.angle + 0.2,
      }))
    );
  });

  // Generate blob path for morphing shape
  const generateBlobPath = (blob: Blob): string => {
    const points = 8;
    const angleStep = (Math.PI * 2) / points;
    const time = timeRef.current;

    let path = "";
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      const noiseVal = noise(
        Math.cos(angle) * 2 + time * blob.morphSpeed,
        Math.sin(angle) * 2 + time * blob.morphSpeed,
        blob.id
      );
      const radius = 35 + noiseVal * 15;
      const x = 50 + Math.cos(angle + blob.morphPhase) * radius;
      const y = 50 + Math.sin(angle + blob.morphPhase) * radius;

      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        // Use quadratic curves for smoother shape
        const prevAngle = (i - 1) * angleStep;
        const cpAngle = prevAngle + angleStep / 2;
        const cpRadius = 35 + noise(Math.cos(cpAngle) * 2, Math.sin(cpAngle) * 2, blob.id + 25) * 15;
        const cpX = 50 + Math.cos(cpAngle + blob.morphPhase) * cpRadius * 1.1;
        const cpY = 50 + Math.sin(cpAngle + blob.morphPhase) * cpRadius * 1.1;
        path += ` Q ${cpX} ${cpY} ${x} ${y}`;
      }
    }
    return path + " Z";
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="blobGoo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          <filter id="blobNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {blobs.map((blob) => {
        const time = timeRef.current;
        const breathScale = 1 + Math.sin(time * blob.morphSpeed + blob.morphPhase) * 0.1;

        return (
          <div
            key={blob.id}
            className="absolute pointer-events-none"
            style={{
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              width: `${blob.size * breathScale}%`,
              height: `${blob.size * breathScale}%`,
              transform: `translate(-50%, -50%) rotate(${time * blob.rotationSpeed}deg)`,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{
                filter: "blur(40px)",
              }}
            >
              <motion.path
                d={generateBlobPath(blob)}
                fill={blob.color}
                fillOpacity={0.35}
                style={{
                  mixBlendMode: "screen",
                }}
              />
            </svg>
          </div>
        );
      })}
      {blobs.map((blob) => (
        <motion.div
          key={`glow-${blob.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size * 0.5}%`,
            height: `${blob.size * 0.5}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${blob.color}40 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3 + blob.id * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {reflections.map((ref) => (
        <motion.div
          key={`ref-${ref.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${ref.x}%`,
            top: `${ref.y}%`,
            width: ref.size,
            height: ref.size,
            transform: `translate(-50%, -50%) rotate(${ref.angle}deg)`,
            background: `linear-gradient(${ref.angle}deg, rgba(255,255,255,${ref.opacity}) 0%, transparent 50%)`,
            filter: "blur(2px)",
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      {[0, 1].map((i) => (
        <motion.div
          key={`shimmer-${i}`}
          className="absolute h-px pointer-events-none"
          style={{
            left: 0,
            right: 0,
            top: `${30 + i * 40}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
