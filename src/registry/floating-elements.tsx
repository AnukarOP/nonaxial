"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingElementsProps {
  children: React.ReactNode;
  className?: string;
}

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  trail: { x: number; y: number }[];
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitAngle?: number;
}

export function FloatingElements({ children, className }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [orbs, setOrbs] = useState<FloatingOrb[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const frameRef = useRef(0);

  // Initialize orbs with physics properties
  useEffect(() => {
    const colors = [
      "rgba(139, 92, 246, 0.6)",
      "rgba(236, 72, 153, 0.6)", 
      "rgba(59, 130, 246, 0.6)",
      "rgba(16, 185, 129, 0.6)",
      "rgba(245, 158, 11, 0.5)",
    ];

    const newOrbs: FloatingOrb[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 20 + Math.random() * 40,
      color: colors[i % colors.length],
      trail: [],
      orbitRadius: i < 3 ? 30 + Math.random() * 50 : undefined,
      orbitSpeed: 0.001 + Math.random() * 0.002,
      orbitAngle: Math.random() * Math.PI * 2,
    }));

    setOrbs(newOrbs);
  }, []);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Physics simulation with collision detection
  useAnimationFrame((time) => {
    frameRef.current++;
    if (frameRef.current % 2 !== 0) return; // Throttle updates

    setOrbs(prev => prev.map((orb, i) => {
      let newX = orb.x;
      let newY = orb.y;
      let newVx = orb.vx;
      let newVy = orb.vy;
      let newOrbitAngle = orb.orbitAngle;

      // Orbit path movement for some orbs
      if (orb.orbitRadius && orb.orbitSpeed) {
        newOrbitAngle = (orb.orbitAngle || 0) + orb.orbitSpeed;
        const centerX = 50;
        const centerY = 50;
        newX = centerX + Math.cos(newOrbitAngle) * (orb.orbitRadius / 2);
        newY = centerY + Math.sin(newOrbitAngle) * (orb.orbitRadius / 2);
      } else {
        // Zero-gravity floating with slight attraction to center
        const centerPullX = (50 - orb.x) * 0.0001;
        const centerPullY = (50 - orb.y) * 0.0001;
        
        // Mouse repulsion
        const dx = orb.x - mousePos.x;
        const dy = orb.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          const force = (20 - dist) * 0.01;
          newVx += (dx / dist) * force;
          newVy += (dy / dist) * force;
        }

        newVx = (orb.vx + centerPullX) * 0.99; // Damping
        newVy = (orb.vy + centerPullY) * 0.99;
        newX = orb.x + newVx;
        newY = orb.y + newVy;

        // Collision detection with other orbs
        prev.forEach((other, j) => {
          if (i === j) return;
          const odx = newX - other.x;
          const ody = newY - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          const minDist = (orb.size + other.size) / dimensions.width * 50;
          
          if (odist < minDist && odist > 0) {
            // Elastic collision response
            const overlap = minDist - odist;
            const nx = odx / odist;
            const ny = ody / odist;
            newX += nx * overlap * 0.5;
            newY += ny * overlap * 0.5;
            newVx += nx * 0.1;
            newVy += ny * 0.1;
          }
        });

        // Boundary bounce
        if (newX < 5 || newX > 95) newVx = -newVx * 0.8;
        if (newY < 5 || newY > 95) newVy = -newVy * 0.8;
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));
      }

      // Update trail
      const newTrail = [...orb.trail, { x: newX, y: newY }].slice(-15);

      return {
        ...orb,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        orbitAngle: newOrbitAngle,
        trail: newTrail,
      };
    }));
  });

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="orbGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="orbGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        {orbs.filter(o => o.orbitRadius).map((orb) => (
          <motion.ellipse
            key={`orbit-${orb.id}`}
            cx="50%"
            cy="50%"
            rx={`${orb.orbitRadius! / 2}%`}
            ry={`${orb.orbitRadius! / 2}%`}
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="1"
            strokeDasharray="5 5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
        ))}
        {orbs.map((orb) => (
          <motion.path
            key={`trail-${orb.id}`}
            d={orb.trail.length > 1 
              ? `M ${orb.trail.map(p => `${p.x}% ${p.y}%`).join(" L ")}`
              : ""
            }
            fill="none"
            stroke={orb.color.replace("0.6", "0.3")}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#orbGlow)"
          />
        ))}
      </svg>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle at 30% 30%, ${orb.color}, transparent)`,
            boxShadow: `0 0 ${orb.size}px ${orb.color}, 0 0 ${orb.size * 2}px ${orb.color.replace("0.6", "0.2")}`,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2 + orb.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 50%)",
            }}
          />
        </motion.div>
      ))}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {orbs.map((orb1, i) => 
          orbs.slice(i + 1).map((orb2) => {
            const dx = orb1.x - orb2.x;
            const dy = orb1.y - orb2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              const opacity = (30 - dist) / 30 * 0.5;
              return (
                <motion.line
                  key={`connect-${orb1.id}-${orb2.id}`}
                  x1={`${orb1.x}%`}
                  y1={`${orb1.y}%`}
                  x2={`${orb2.x}%`}
                  y2={`${orb2.y}%`}
                  stroke={`rgba(139, 92, 246, ${opacity})`}
                  strokeWidth="1"
                  filter="url(#orbGlow)"
                />
              );
            }
            return null;
          })
        )}
      </svg>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.1), transparent 50%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
