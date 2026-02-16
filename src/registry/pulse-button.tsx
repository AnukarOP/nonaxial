"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseButtonProps {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
  onClick?: () => void;
}

interface PulseRing {
  id: number;
  delay: number;
}

export function PulseButton({
  children,
  className,
  pulseColor = "rgba(139, 92, 246, 1)",
  onClick,
}: PulseButtonProps) {
  const [pulseRings, setPulseRings] = useState<PulseRing[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [heartbeatPhase, setHeartbeatPhase] = useState(0);

  // Continuous heartbeat pulse rings
  useEffect(() => {
    const interval = setInterval(() => {
      const newRing: PulseRing = {
        id: Date.now(),
        delay: 0,
      };
      setPulseRings(prev => [...prev.slice(-4), newRing]);
      
      // Trigger heartbeat animation
      setHeartbeatPhase(p => (p + 1) % 2);

      setTimeout(() => {
        setPulseRings(prev => prev.filter(r => r.id !== newRing.id));
      }, 2000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Spawn extra rings on click
  const handleClick = () => {
    const burstRings = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      delay: i * 0.1,
    }));
    setPulseRings(prev => [...prev, ...burstRings]);
    
    setTimeout(() => {
      setPulseRings(prev => prev.filter(r => !burstRings.find(b => b.id === r.id)));
    }, 2000);

    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {pulseRings.map((ring) => (
          <motion.div
            key={ring.id}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: `2px solid ${pulseColor}`,
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: [1, 1.5, 2, 2.5],
              opacity: [0.8, 0.5, 0.2, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.8,
              delay: ring.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${pulseColor.replace('1)', '0.3)')} 0%, transparent 70%)`,
          filter: "blur(15px)",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden",
          "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600",
          className
        )}
        animate={{
          scale: heartbeatPhase === 0 
            ? [1, 1.04, 1, 1.02, 1] 
            : [1, 1.02, 1, 1.04, 1],
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.15, 0.3, 0.45, 0.6],
          ease: "easeInOut",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${pulseColor.replace('1)', '0.4)')} 0%, transparent 60%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-x-0 top-1/2 h-px pointer-events-none overflow-hidden"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.div
            className="h-full bg-white/40"
            animate={{
              scaleX: [0, 0.3, 0, 0.2, 0, 0.4, 0],
              x: ["-100%", "0%", "0%", "0%", "0%", "100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, white 0%, ${pulseColor} 100%)`,
            filter: "blur(2px)",
          }}
          animate={{
            scale: [1, 1.5, 1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{
            scale: heartbeatPhase === 0 ? [1, 1.02, 1] : [1, 1.01, 1],
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.span>
        <motion.div
          className="absolute -inset-1 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${pulseColor.replace('1)', '0.5)')}, 0 0 40px ${pulseColor.replace('1)', '0.3)')}`,
          }}
          animate={{
            opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
          }}
          transition={{
            duration: 1,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>
    </div>
  );
}
