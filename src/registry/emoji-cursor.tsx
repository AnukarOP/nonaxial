"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmojiCursorProps {
  children: React.ReactNode;
  className?: string;
  emojis?: string[];
  hoverEmoji?: string;
}

interface BouncingEmoji {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  bounceCount: number;
}

export function EmojiCursor({ 
  children, 
  className, 
  emojis = ["✨", "🌟", "⭐", "💫", "🎉", "🎊", "💖", "🔥"],
  hoverEmoji = "👆"
}: EmojiCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bouncingEmojis, setBouncingEmojis] = useState<BouncingEmoji[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const idRef = useRef(0);
  const timeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Cursor bobbing animation
  const cursorBob = useMotionValue(0);
  const cursorRotate = useMotionValue(0);

  // Physics simulation for bouncing emojis
  useAnimationFrame((t) => {
    timeRef.current = t * 0.001;
    
    // Cursor bobbing
    cursorBob.set(Math.sin(timeRef.current * 4) * 3);
    cursorRotate.set(Math.sin(timeRef.current * 2) * 10);
    
    // Update physics for each emoji
    setBouncingEmojis(prev => {
      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 400;
      
      return prev
        .map(emoji => {
          let { x, y, vx, vy, rotation, rotationSpeed, bounceCount } = emoji;
          
          // Apply gravity
          vy += 0.5;
          
          // Apply velocity
          x += vx;
          y += vy;
          rotation += rotationSpeed;
          
          // Bounce off bottom
          if (y > containerHeight - 20) {
            y = containerHeight - 20;
            vy = -vy * 0.7; // Energy loss on bounce
            vx *= 0.9; // Friction
            bounceCount++;
          }
          
          // Bounce off sides
          if (x < 20 || x > containerWidth - 20) {
            vx = -vx * 0.8;
            x = Math.max(20, Math.min(containerWidth - 20, x));
          }
          
          // Air resistance
          vx *= 0.99;
          vy *= 0.99;
          
          return { ...emoji, x, y, vx, vy, rotation, bounceCount };
        })
        .filter(emoji => emoji.bounceCount < 5 && emoji.y < containerHeight + 50);
    });
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Throttle emoji spawning
    if (timeRef.current - lastSpawnRef.current > 0.1 && Math.random() > 0.6) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const newEmoji: BouncingEmoji = {
        id: idRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 10 - 5,
        emoji: randomEmoji,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        scale: 0.8 + Math.random() * 0.5,
        bounceCount: 0,
      };
      setBouncingEmojis(prev => [...prev.slice(-20), newEmoji]);
      lastSpawnRef.current = timeRef.current;
    }
  }, [mouseX, mouseY, emojis]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Explosion of emojis on click
    const explosionEmojis: BouncingEmoji[] = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 8 + Math.random() * 5;
      return {
        id: idRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        scale: 1 + Math.random() * 0.5,
        bounceCount: 0,
      };
    });
    setBouncingEmojis(prev => [...prev, ...explosionEmojis]);
  }, [emojis]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      {bouncingEmojis.map((emoji) => (
        <motion.div
          key={emoji.id}
          className="pointer-events-none absolute text-2xl"
          style={{
            left: emoji.x,
            top: emoji.y,
            transform: `translate(-50%, -50%) rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            filter: `brightness(${1.2 - emoji.bounceCount * 0.15})`,
            opacity: 1 - emoji.bounceCount * 0.15,
          }}
        >
          {emoji.emoji}
        </motion.div>
      ))}
      <motion.div
        className="pointer-events-none absolute z-30"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 40,
            height: 40,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </motion.div>
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-50 text-3xl"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            rotate: cursorRotate,
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
          }}
          exit={{ scale: 0 }}
        >
          <motion.span
            style={{
              display: "block",
              textShadow: "0 4px 15px rgba(0,0,0,0.3), 0 0 30px rgba(255, 200, 100, 0.5)",
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {hoverEmoji}
          </motion.span>
        </motion.div>
      )}
      {isHovering && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-40 text-sm"
          style={{
            x: springX,
            y: springY,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.span
            style={{
              display: "block",
              transform: `translateX(${25 + i * 10}px)`,
              opacity: 0.7,
            }}
          >
            {emojis[i % emojis.length]}
          </motion.span>
        </motion.div>
      ))}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute z-35 rounded-full border-2 border-dashed"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: 60,
            height: 60,
            borderColor: "rgba(255, 200, 100, 0.4)",
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
