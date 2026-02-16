"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageCompareProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  className?: string;
  variant?: "default" | "minimal" | "hover";
}

export function ImageCompare({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  className,
  variant = "default",
}: ImageCompareProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (variant === "hover" || isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none overflow-hidden rounded-xl cursor-ew-resize",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseDown={() => variant !== "hover" && setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchStart={() => variant !== "hover" && setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
    >
      <img
        src={afterImage}
        alt="After"
        className="w-full h-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        animate={{ opacity: isHovered || isDragging ? 1 : 0.7 }}
      >
        {variant !== "minimal" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
            animate={{ scale: isDragging ? 1.2 : 1 }}
          >
            <svg
              className="w-5 h-5 text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
      {variant === "default" && (
        <>
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm backdrop-blur-sm">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm backdrop-blur-sm">
            {afterLabel}
          </div>
        </>
      )}
    </div>
  );
}

interface ImageRevealProps {
  image: string;
  overlayColor?: string;
  direction?: "left" | "right" | "top" | "bottom" | "center";
  className?: string;
  children?: React.ReactNode;
}

export function ImageReveal({
  image,
  overlayColor = "from-violet-600/80 to-fuchsia-600/80",
  direction = "left",
  className,
  children,
}: ImageRevealProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getClipPath = () => {
    if (!isHovered) return "inset(0 0 0 0)";
    
    switch (direction) {
      case "left":
        return "inset(0 100% 0 0)";
      case "right":
        return "inset(0 0 0 100%)";
      case "top":
        return "inset(0 0 100% 0)";
      case "bottom":
        return "inset(100% 0 0 0)";
      case "center":
        return "inset(50% 50% 50% 50%)";
      default:
        return "inset(0 100% 0 0)";
    }
  };

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover"
      />
      
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
          overlayColor
        )}
        animate={{ clipPath: getClipPath() }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
