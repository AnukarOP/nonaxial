"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RotateButtonProps {
  children: React.ReactNode;
  className?: string;
  direction?: "clockwise" | "counterclockwise";
  faces?: string[];
  onClick?: () => void;
}

export function RotateButton({ 
  children, 
  className, 
  direction = "clockwise",
  faces = ["Click Me", "Yes!", "Let's Go!", "🚀"],
  onClick,
}: RotateButtonProps) {
  const [currentFace, setCurrentFace] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rotationDirection = direction === "clockwise" ? 1 : -1;

  const handleClick = async () => {
    if (isRotating) return;
    
    setIsRotating(true);
    setCurrentFace((prev) => (prev + 1) % faces.length);
    
    setTimeout(() => {
      setIsRotating(false);
      onClick?.();
    }, 600);
  };

  const faceColors = [
    "from-violet-600 via-purple-600 to-fuchsia-600",
    "from-cyan-500 via-blue-500 to-indigo-600",
    "from-emerald-500 via-green-500 to-teal-500",
    "from-orange-500 via-red-500 to-pink-500",
  ];

  return (
    <div 
      className="relative inline-block"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-black/30"
        style={{ filter: "blur(15px)", transform: "translateY(10px)" }}
        animate={{
          scale: isRotating ? 0.9 : 1,
          opacity: isRotating ? 0.2 : 0.4,
        }}
      />

      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "relative w-40 h-14 font-bold text-white rounded-2xl overflow-visible",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        animate={{
          rotateX: isHovered && !isRotating ? -5 : 0,
          rotateY: isHovered && !isRotating ? 5 * rotationDirection : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
          animate={{
            rotateX: currentFace * -90 * rotationDirection,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.6,
          }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-2xl",
              "bg-gradient-to-br",
              faceColors[currentFace % faceColors.length]
            )}
            style={{
              transform: "translateZ(28px)",
              backfaceVisibility: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentFace}
                initial={{ opacity: 0, y: 10, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -10, rotateX: 90 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {currentFace === 0 ? children : faces[currentFace]}
              </motion.span>
            </AnimatePresence>
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
              }}
            />
          </motion.div>
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-2xl",
              "bg-gradient-to-br",
              faceColors[(currentFace + 1) % faceColors.length]
            )}
            style={{
              transform: "rotateX(90deg) translateZ(28px)",
              backfaceVisibility: "hidden",
            }}
          >
            <span>{faces[(currentFace + 1) % faces.length]}</span>
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
              }}
            />
          </motion.div>
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-2xl",
              "bg-gradient-to-br",
              faceColors[(currentFace + 3) % faceColors.length]
            )}
            style={{
              transform: "rotateX(-90deg) translateZ(28px)",
              backfaceVisibility: "hidden",
            }}
          >
            <span>{faces[(currentFace + 3) % faces.length]}</span>
          </motion.div>
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-2xl",
              "bg-gradient-to-br",
              faceColors[(currentFace + 2) % faceColors.length]
            )}
            style={{
              transform: "rotateX(180deg) translateZ(28px)",
              backfaceVisibility: "hidden",
            }}
          >
            <span>{faces[(currentFace + 2) % faces.length]}</span>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: isRotating 
              ? "0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)"
              : "0 0 20px rgba(139, 92, 246, 0.3)",
          }}
          animate={{
            opacity: isRotating ? 1 : isHovered ? 0.8 : 0.5,
          }}
        />
        <AnimatePresence>
          {isRotating && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(0deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
              }}
              initial={{ opacity: 0, rotateX: 0 }}
              animate={{ opacity: [0, 0.5, 0], rotateX: [-45, 0, 45] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {faces.map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: i === currentFace ? "#a855f7" : "rgba(255,255,255,0.3)",
              }}
              animate={{
                scale: i === currentFace ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          ))}
        </div>
      </motion.button>
    </div>
  );
}
