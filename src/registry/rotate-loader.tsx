"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface RotateLoaderProps {
  className?: string;
  size?: number;
}

export function RotateLoader({ className, size = 80 }: RotateLoaderProps) {
  const gearTeeth = 12;
  const segments = 8;
  
  // Generate spark particles
  const sparks = useMemo(() => 
    Array.from({ length: 8 }).map((_, i) => ({
      angle: (i * 45) + Math.random() * 20,
      distance: size * 0.4 + Math.random() * size * 0.2,
      delay: i * 0.1,
    })), [size]);

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-[-10%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: gearTeeth }).map((_, i) => {
          const angle = (i * 360) / gearTeeth;
          return (
            <motion.div
              key={`tooth-${i}`}
              className="absolute"
              style={{
                width: size * 0.12,
                height: size * 0.08,
                left: "50%",
                top: 0,
                x: "-50%",
                y: "-50%",
                background: "linear-gradient(to bottom, #8b5cf6, #7c3aed)",
                borderRadius: "2px",
                transformOrigin: `50% ${size / 2}px`,
                transform: `rotate(${angle}deg)`,
                boxShadow: "0 0 5px #8b5cf680",
              }}
            />
          );
        })}
        <div
          className="absolute rounded-full"
          style={{
            inset: size * 0.08,
            border: `${size * 0.04}px solid transparent`,
            borderImage: "linear-gradient(135deg, #8b5cf6, #d946ef, #8b5cf6) 1",
            background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #8b5cf6 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute"
        style={{
          inset: size * 0.15,
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const angle = (i * 360) / segments;
          const colors = ["#8b5cf6", "#a855f7", "#d946ef", "#f472b6"];
          const color = colors[i % colors.length];
          
          return (
            <div key={`segment-${i}`}>
              {[...Array(3)].map((_, trailIndex) => (
                <motion.div
                  key={`trail-${trailIndex}`}
                  className="absolute rounded-full"
                  style={{
                    width: size * 0.08 * (1 - trailIndex * 0.2),
                    height: size * 0.08 * (1 - trailIndex * 0.2),
                    left: "50%",
                    top: 0,
                    x: "-50%",
                    y: "-50%",
                    background: color,
                    opacity: 0.3 - trailIndex * 0.1,
                    transformOrigin: `50% ${(size * 0.7) / 2}px`,
                    transform: `rotate(${angle - trailIndex * 8}deg)`,
                  }}
                />
              ))}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: size * 0.1,
                  height: size * 0.1,
                  left: "50%",
                  top: 0,
                  x: "-50%",
                  y: "-50%",
                  background: `radial-gradient(circle at 30% 30%, white, ${color})`,
                  transformOrigin: `50% ${(size * 0.7) / 2}px`,
                  transform: `rotate(${angle}deg)`,
                  boxShadow: `0 0 ${size * 0.1}px ${color}, 0 0 ${size * 0.2}px ${color}80`,
                }}
              />
            </div>
          );
        })}
      </motion.div>
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: size * 0.3,
          border: `${size * 0.02}px solid #06b6d4`,
          boxShadow: "0 0 10px #06b6d480",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[0, 90, 180, 270].map((angle) => (
          <div
            key={`notch-${angle}`}
            className="absolute"
            style={{
              width: size * 0.04,
              height: size * 0.08,
              background: "#06b6d4",
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              transformOrigin: "center",
              transform: `rotate(${angle}deg) translateY(${-size * 0.18}px)`,
              borderRadius: "2px",
              boxShadow: "0 0 8px #06b6d4",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: size * 0.38,
          background: "radial-gradient(circle at 30% 30%, #fff, #8b5cf6, #7c3aed)",
          boxShadow: `0 0 ${size * 0.15}px #8b5cf6, inset 0 0 ${size * 0.1}px rgba(255,255,255,0.3)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
      {sparks.map((spark, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute"
          style={{
            width: 3,
            height: 3,
            background: i % 2 === 0 ? "#fbbf24" : "#f97316",
            left: "50%",
            top: "50%",
            borderRadius: "50%",
            boxShadow: `0 0 6px ${i % 2 === 0 ? "#fbbf24" : "#f97316"}`,
          }}
          animate={{
            x: [
              Math.cos(spark.angle * Math.PI / 180) * size * 0.2,
              Math.cos(spark.angle * Math.PI / 180) * spark.distance,
            ],
            y: [
              Math.sin(spark.angle * Math.PI / 180) * size * 0.2,
              Math.sin(spark.angle * Math.PI / 180) * spark.distance,
            ],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: spark.delay,
            repeatDelay: 0.5,
          }}
        />
      ))}
    </div>
  );
}
