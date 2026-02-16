"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Meteor {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

interface MeteorShowerProps {
  className?: string;
  meteorCount?: number;
  color?: string;
}

export function MeteorShower({
  className,
  meteorCount = 20,
  color = "white",
}: MeteorShowerProps) {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const generateMeteors = () => {
      const newMeteors: Meteor[] = [];
      for (let i = 0; i < meteorCount; i++) {
        newMeteors.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 1 + Math.random() * 2,
          size: 1 + Math.random() * 2,
        });
      }
      setMeteors(newMeteors);
    };

    generateMeteors();
  }, [meteorCount]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute"
          style={{
            left: `${meteor.x}%`,
            top: "-10%",
            width: meteor.size,
            height: meteor.size * 100,
          }}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{
            y: "200vh",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 3,
            ease: "linear",
          }}
        >
          <div
            className="absolute top-0 rounded-full"
            style={{
              width: meteor.size * 2,
              height: meteor.size * 2,
              background: color,
              boxShadow: `0 0 ${meteor.size * 4}px ${color}, 0 0 ${meteor.size * 8}px ${color}`,
            }}
          />
          <div
            className="absolute top-0"
            style={{
              width: meteor.size,
              height: meteor.size * 80,
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              transform: "translateX(25%)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
