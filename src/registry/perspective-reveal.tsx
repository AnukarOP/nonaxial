"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PerspectiveRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function PerspectiveReveal({ children, className }: PerspectiveRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered]);

  // Depth layer configurations
  const depthLayers = [
    { z: -150, opacity: 0.15, blur: 8, scale: 1.1 },
    { z: -100, opacity: 0.25, blur: 5, scale: 1.06 },
    { z: -50, opacity: 0.4, blur: 3, scale: 1.03 },
  ];

  return (
    <div 
      ref={ref} 
      className={cn("relative", className)} 
      style={{ 
        perspective: 1500,
        perspectiveOrigin: "50% 50%",
      }}
    >
      {depthLayers.map((layer, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            filter: `blur(${layer.blur}px)`,
          }}
          initial={{
            opacity: 0,
            rotateX: 45,
            rotateY: -30,
            z: layer.z - 100,
            scale: layer.scale + 0.1,
          }}
          animate={isInView ? {
            opacity: [0, layer.opacity, 0],
            rotateX: [45, 10, 0],
            rotateY: [-30, -10, 0],
            z: [layer.z - 100, layer.z, 0],
            scale: [layer.scale + 0.1, layer.scale, 1],
          } : {}}
          transition={{
            duration: 1,
            delay: i * 0.08,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div 
            className="w-full h-full rounded-lg"
            style={{
              background: `linear-gradient(135deg, rgba(139, 92, 246, ${layer.opacity}) 0%, rgba(236, 72, 153, ${layer.opacity * 0.7}) 100%)`,
            }}
          />
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
        }}
        initial={{
          opacity: 0,
          transform: "rotateX(90deg) translateY(100%) scaleX(0.5)",
        }}
        animate={isInView ? {
          opacity: [0, 0.4, 0.25],
          transform: [
            "rotateX(90deg) translateY(100%) scaleX(0.5)",
            "rotateX(80deg) translateY(80%) scaleX(1.2)",
            "rotateX(85deg) translateY(90%) scaleX(1)",
          ],
        } : {}}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute left-0 right-0 h-1 pointer-events-none z-20"
        style={{
          top: "50%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.8) 80%, transparent 100%)",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? {
          opacity: [0, 1, 0],
          scaleX: [0, 1, 1],
        } : {}}
        transition={{
          duration: 0.8,
          times: [0, 0.4, 1],
          delay: 0.2,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          border: "2px solid transparent",
          borderRadius: "inherit",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 40%, transparent 60%, rgba(139, 92, 246, 0.3) 100%) border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? {
          opacity: [0, 1, 0.3],
        } : {}}
        transition={{
          duration: 1,
          delay: 0.3,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden z-15"
      >
        <motion.div
          className="absolute w-[150%] h-[200%] -left-1/4 -top-1/2"
          style={{
            background: "conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.1) 60deg, rgba(255, 255, 255, 0.3) 90deg, rgba(255, 255, 255, 0.1) 120deg, transparent 180deg)",
            transformOrigin: "center center",
          }}
          initial={{ rotate: -45, opacity: 0 }}
          animate={isInView ? {
            rotate: [-45, 45],
            opacity: [0, 0.8, 0],
          } : {}}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <motion.div
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        initial={{ 
          opacity: 0, 
          rotateX: 50,
          rotateY: -25,
          z: -300,
          scale: 0.7,
        }}
        animate={isInView ? { 
          opacity: 1, 
          rotateX: 0,
          rotateY: 0,
          z: 0,
          scale: 1,
        } : {}}
        transition={{
          opacity: { duration: 0.4, delay: 0.1 },
          rotateX: { 
            type: "spring", 
            stiffness: 60, 
            damping: 15,
            mass: 1,
          },
          rotateY: {
            type: "spring",
            stiffness: 80,
            damping: 18,
          },
          z: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
          scale: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)",
            transformOrigin: "bottom center",
          }}
          initial={{ rotateX: -90, opacity: 0.5 }}
          animate={isInView ? { rotateX: 0, opacity: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        
        {children}
      </motion.div>
    </div>
  );
}
