"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticleCursorProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
}

type ParticleShape = "circle" | "square" | "triangle" | "star" | "diamond";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: ParticleShape;
  hue: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  gravity: number;
  trail: { x: number; y: number }[];
}

export function ParticleCursor({ children, className, particleCount = 8 }: ParticleCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const idRef = useRef(0);
  const timeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const hueRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const shapes: ParticleShape[] = ["circle", "square", "triangle", "star", "diamond"];

  const getRandomShape = (): ParticleShape => {
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  // Physics simulation
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    hueRef.current = (timeRef.current * 40) % 360;
    
    setParticles(prev => {
      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 400;
      
      return prev
        .map(p => {
          // Apply gravity
          const newVy = p.vy + p.gravity;
          
          // Apply velocity
          const newX = p.x + p.vx;
          const newY = p.y + newVy;
          
          // Air resistance
          const newVx = p.vx * 0.98;
          
          // Update trail
          const newTrail = [...p.trail, { x: p.x, y: p.y }].slice(-5);
          
          // Decrease life
          const newLife = p.life - 1;
          
          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: p.rotation + p.rotationSpeed,
            life: newLife,
            trail: newTrail,
          };
        })
        .filter(p => p.life > 0 && p.y < containerHeight + 50 && p.x > -50 && p.x < containerWidth + 50);
    });
  });

  const spawnParticles = useCallback((x: number, y: number, count: number, explosive: boolean = false) => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = explosive 
        ? (i / count) * Math.PI * 2 
        : Math.random() * Math.PI * 2;
      const speed = explosive 
        ? 5 + Math.random() * 10 
        : 2 + Math.random() * 6;
      
      return {
        id: idRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (explosive ? 5 : 2),
        size: 4 + Math.random() * 8,
        shape: getRandomShape(),
        hue: hueRef.current + Math.random() * 60 - 30,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        gravity: 0.15 + Math.random() * 0.1,
        trail: [],
      };
    });
    
    setParticles(prev => [...prev.slice(-50), ...newParticles]);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Spawn particles while moving
    if (timeRef.current - lastSpawnRef.current > 0.05 && Math.random() > 0.3) {
      spawnParticles(x, y, Math.ceil(particleCount / 3), false);
      lastSpawnRef.current = timeRef.current;
    }
  }, [mouseX, mouseY, spawnParticles, particleCount]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Explosive particle burst on click
    spawnParticles(x, y, particleCount * 2, true);
  }, [spawnParticles, particleCount]);

  const renderShape = (particle: Particle) => {
    const opacity = particle.life / particle.maxLife;
    const color = `hsla(${particle.hue}, 80%, 60%, ${opacity})`;
    const glowColor = `hsla(${particle.hue}, 80%, 60%, ${opacity * 0.5})`;
    
    switch (particle.shape) {
      case "circle":
        return (
          <div
            className="rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
              boxShadow: `0 0 ${particle.size}px ${glowColor}`,
            }}
          />
        );
      
      case "square":
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
              boxShadow: `0 0 ${particle.size}px ${glowColor}`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        );
      
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${color}`,
              filter: `drop-shadow(0 0 ${particle.size / 2}px ${glowColor})`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        );
      
      case "star":
        return (
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 24 24"
            style={{
              transform: `rotate(${particle.rotation}deg)`,
              filter: `drop-shadow(0 0 ${particle.size / 2}px ${glowColor})`,
            }}
          >
            <path
              d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z"
              fill={color}
            />
          </svg>
        );
      
      case "diamond":
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
              boxShadow: `0 0 ${particle.size}px ${glowColor}`,
              transform: `rotate(45deg)`,
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      {particles.map((particle) => (
        <motion.div key={`trail-${particle.id}`} className="pointer-events-none absolute">
          {particle.trail.map((point, i) => {
            const trailOpacity = (i / particle.trail.length) * (particle.life / particle.maxLife) * 0.5;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: point.x,
                  top: point.y,
                  width: particle.size * 0.5 * ((i + 1) / particle.trail.length),
                  height: particle.size * 0.5 * ((i + 1) / particle.trail.length),
                  backgroundColor: `hsla(${particle.hue}, 80%, 60%, ${trailOpacity})`,
                  transform: "translate(-50%, -50%)",
                  filter: "blur(2px)",
                }}
              />
            );
          })}
        </motion.div>
      ))}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none absolute"
          style={{
            left: particle.x,
            top: particle.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {renderShape(particle)}
        </motion.div>
      ))}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-40 rounded-full"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: 60,
            height: 60,
            background: `radial-gradient(circle, hsla(${hueRef.current}, 70%, 50%, 0.3) 0%, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-50"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: 16,
              height: 16,
              background: `radial-gradient(circle, white 0%, hsla(${hueRef.current}, 80%, 60%, 0.9) 70%)`,
              boxShadow: `0 0 15px hsla(${hueRef.current}, 80%, 60%, 0.8), 0 0 30px hsla(${hueRef.current}, 80%, 60%, 0.4)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-45 rounded-full border-2"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: 30,
            height: 30,
            borderColor: `hsla(${hueRef.current}, 80%, 60%, 0.5)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-40"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                backgroundColor: `hsla(${hueRef.current + i * 30}, 80%, 60%, 0.8)`,
              }}
              animate={{
                x: [0, Math.cos((i / 4) * Math.PI * 2) * 25],
                y: [0, Math.sin((i / 4) * Math.PI * 2) * 25],
                opacity: [0.8, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
