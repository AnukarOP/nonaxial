"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDPushButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ThreeDPushButton({ children, className, onClick }: ThreeDPushButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [hapticLines, setHapticLines] = useState<number[]>([]);
  const controls = useAnimation();

  const handlePress = async () => {
    setIsPressed(true);
    
    // Haptic visual feedback - spawn indicator lines
    setHapticLines(Array.from({ length: 8 }, (_, i) => i));

    // Deep spring press
    await controls.start({
      y: 8,
      scale: 0.98,
      transition: { type: "spring", stiffness: 600, damping: 15 },
    });
  };

  const handleRelease = async () => {
    setIsPressed(false);

    // Spring back with overshoot
    await controls.start({
      y: -4,
      scale: 1.02,
      transition: { type: "spring", stiffness: 500, damping: 10 },
    });

    // Settle
    await controls.start({
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 15 },
    });

    setTimeout(() => setHapticLines([]), 300);
    onClick?.();
  };

  return (
    <div className="relative inline-block" style={{ perspective: 800 }}>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-950 to-fuchsia-950"
        style={{
          transform: "translateY(10px) translateZ(-20px)",
          filter: "blur(2px)",
        }}
        animate={{
          y: isPressed ? 4 : 10,
          opacity: isPressed ? 0.5 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          filter: "blur(12px)",
          transform: "translateY(15px)",
        }}
        animate={{
          y: isPressed ? 6 : 15,
          scaleX: isPressed ? 0.95 : 1,
          opacity: isPressed ? 0.3 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
      {hapticLines.map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            width: 30,
            height: 2,
            background: "linear-gradient(90deg, rgba(255,255,255,0.6), transparent)",
            transformOrigin: "left center",
            rotate: i * 45,
          }}
          initial={{ scaleX: 0, x: "-50%", y: "-50%", opacity: 0 }}
          animate={{
            scaleX: [0, 1, 0],
            x: ["-50%", "50%", "100%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.02,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.button
        animate={controls}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={() => {
          if (isPressed) {
            setIsPressed(false);
            controls.start({ y: 0, scale: 1 });
          }
        }}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        className={cn(
          "relative px-10 py-5 font-bold rounded-2xl text-white overflow-hidden",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 30%, #d946ef 70%, #ec4899 100%)",
          }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
          }}
          animate={{
            opacity: isPressed ? 0.1 : 0.3,
          }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-1 rounded-l-2xl pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)",
          }}
          animate={{
            opacity: isPressed ? 0.5 : 0.2,
          }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-1 rounded-r-2xl pointer-events-none"
          style={{
            background: "linear-gradient(-90deg, rgba(0,0,0,0.2), transparent)",
          }}
          animate={{
            opacity: isPressed ? 0.5 : 0.2,
          }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
          }}
          animate={{
            height: isPressed ? 1 : 8,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: "inset 0 4px 20px rgba(0,0,0,0.3)",
          }}
          animate={{
            opacity: isPressed ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.div
          className="absolute top-2 left-4 right-4 h-3 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)",
            filter: "blur(1px)",
          }}
          animate={{
            opacity: isPressed ? 0.1 : 0.5,
            y: isPressed ? 2 : 0,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isPressed 
              ? "inset 0 0 30px rgba(255,255,255,0.3)"
              : "inset 0 0 0px rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{
            y: isPressed ? 2 : 0,
            scale: isPressed ? 0.98 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {children}
        </motion.span>
      </motion.button>
    </div>
  );
}
