"use client";

import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
  children?: React.ReactNode;
  colors?: string[];
  speed?: number;
}

interface MeshBlob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  phase: number;
  breathSpeed: number;
}

// Simplex noise approximation for organic movement
function noise2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

export function GradientMesh({
  className,
  children,
  colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#84cc16"],
  speed = 1,
}: GradientMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<MeshBlob[]>([]);
  const blobElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  // Initialize blobs once
  const initialBlobs = useMemo(() => {
    return colors.flatMap((color, i) => [
      {
        id: i * 2,
        x: 20 + (i % 3) * 30,
        y: 20 + Math.floor(i / 3) * 40,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: 35 + Math.random() * 25,
        color,
        phase: Math.random() * Math.PI * 2,
        breathSpeed: 0.3 + Math.random() * 0.3,
      },
      {
        id: i * 2 + 1,
        x: 50 + Math.sin(i) * 30,
        y: 50 + Math.cos(i) * 30,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        size: 25 + Math.random() * 20,
        color,
        phase: Math.random() * Math.PI * 2,
        breathSpeed: 0.2 + Math.random() * 0.2,
      },
    ]);
  }, [colors]);

  useEffect(() => {
    blobsRef.current = [...initialBlobs];
    let lastTime = 0;
    const frameInterval = 50; // Update every 50ms (~20fps) instead of every frame

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      const time = currentTime * 0.0003 * speed; // Much slower time multiplier

      blobsRef.current = blobsRef.current.map((blob, index) => {
        // Simplified noise movement
        const noiseX = noise2D(blob.x * 0.01, time, blob.id) * 0.01;
        const noiseY = noise2D(time, blob.y * 0.01, blob.id + 100) * 0.01;

        let newVx = blob.vx + noiseX;
        let newVy = blob.vy + noiseY;

        // Stronger damping for slower movement
        newVx *= 0.95;
        newVy *= 0.95;

        // Boundary forces
        if (blob.x < 10) newVx += 0.02;
        if (blob.x > 90) newVx -= 0.02;
        if (blob.y < 10) newVy += 0.02;
        if (blob.y > 90) newVy -= 0.02;

        const newBlob = {
          ...blob,
          x: blob.x + newVx,
          y: blob.y + newVy,
          vx: newVx,
          vy: newVy,
        };

        // Update DOM directly
        const element = blobElementsRef.current[index];
        if (element) {
          const breathScale = 1 + Math.sin(time * blob.breathSpeed + blob.phase) * 0.1;
          const morphOffset = Math.sin(time * 0.3 + blob.phase) * 5;

          element.style.left = `${newBlob.x}%`;
          element.style.top = `${newBlob.y}%`;
          element.style.width = `${newBlob.size * breathScale}%`;
          element.style.height = `${newBlob.size * breathScale * (0.95 + Math.sin(time + blob.phase) * 0.1)}%`;
          element.style.background = `radial-gradient(ellipse at ${50 + morphOffset}% ${50 - morphOffset}%, ${blob.color}66 0%, ${blob.color}33 40%, transparent 70%)`;
          element.style.transform = `translate(-50%, -50%) rotate(${time * 5 + blob.id * 45}deg)`;
        }

        return newBlob;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialBlobs, speed]);

  // Generate SVG filter for noise texture
  const noiseFilter = useMemo(
    () => (
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="meshNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              seed="15"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="meshGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    ),
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden bg-black/5", className)}
    >
      {noiseFilter}
      
      {/* Main mesh blobs - rendered once, updated via refs */}
      {initialBlobs.map((blob, index) => (
        <div
          key={blob.id}
          ref={(el) => { blobElementsRef.current[index] = el; }}
          className="absolute pointer-events-none"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}%`,
            height: `${blob.size}%`,
            background: `radial-gradient(ellipse at 50% 50%, ${blob.color}66 0%, ${blob.color}33 40%, transparent 70%)`,
            filter: "blur(40px)",
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%)",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
