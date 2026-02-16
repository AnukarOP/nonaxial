"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useSpring, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollSnapProps {
  children: React.ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
}

export function ScrollSnap({ children, className, direction = "vertical" }: ScrollSnapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const velocity = useMotionValue(0);
  const lastScrollTime = useRef(Date.now());
  const lastScrollTop = useRef(0);
  
  const isVertical = direction === "vertical";

  // Track scroll velocity for momentum effects
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const now = Date.now();
      const dt = now - lastScrollTime.current;
      const scrollPos = isVertical ? container.scrollTop : container.scrollLeft;
      const dScroll = scrollPos - lastScrollTop.current;
      
      if (dt > 0) {
        velocity.set(dScroll / dt);
      }
      
      lastScrollTime.current = now;
      lastScrollTop.current = scrollPos;

      // Determine active section
      const sectionSize = isVertical ? container.clientHeight : container.clientWidth;
      const newIndex = Math.round(scrollPos / sectionSize);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isVertical, activeIndex, velocity]);

  // Count sections
  useEffect(() => {
    if (containerRef.current) {
      setTotalSections(containerRef.current.children.length - 1); // Subtract indicator particles container
    }
  }, [children]);

  const springVelocity = useSpring(velocity, { stiffness: 100, damping: 30 });

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          "overflow-auto scroll-smooth",
          isVertical ? "snap-y snap-mandatory h-screen" : "snap-x snap-mandatory flex overflow-x-auto",
          className
        )}
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {children}
      </div>
      <div 
        className={cn(
          "fixed z-50 flex gap-3",
          isVertical 
            ? "right-6 top-1/2 -translate-y-1/2 flex-col" 
            : "bottom-6 left-1/2 -translate-x-1/2 flex-row"
        )}
      >
        {[...Array(totalSections > 0 ? totalSections : React.Children.count(children))].map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              const container = containerRef.current;
              if (!container) return;
              const sectionSize = isVertical ? container.clientHeight : container.clientWidth;
              container.scrollTo({
                [isVertical ? "top" : "left"]: i * sectionSize,
                behavior: "smooth",
              });
            }}
            className="relative w-3 h-3 rounded-full cursor-pointer"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/30"
              animate={{
                scale: activeIndex === i ? 0 : 1,
                opacity: activeIndex === i ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
              }}
              animate={{
                scale: activeIndex === i ? 1 : 0,
                opacity: activeIndex === i ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            {activeIndex === i && (
              <>
                {[...Array(3)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-1 h-1 rounded-full bg-violet-400"
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                    animate={{
                      x: [
                        Math.cos((j * 2 * Math.PI) / 3) * 10,
                        Math.cos((j * 2 * Math.PI) / 3 + Math.PI) * 10,
                        Math.cos((j * 2 * Math.PI) / 3) * 10,
                      ],
                      y: [
                        Math.sin((j * 2 * Math.PI) / 3) * 10,
                        Math.sin((j * 2 * Math.PI) / 3 + Math.PI) * 10,
                        Math.sin((j * 2 * Math.PI) / 3) * 10,
                      ],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: j * 0.3,
                    }}
                  />
                ))}
              </>
            )}
          </motion.button>
        ))}
      </div>
      <motion.div
        className={cn(
          "fixed pointer-events-none",
          isVertical 
            ? "right-4 top-1/2 w-0.5 h-20 -translate-y-1/2"
            : "bottom-4 left-1/2 w-20 h-0.5 -translate-x-1/2"
        )}
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.5), transparent)",
          scaleY: springVelocity,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

interface ScrollSnapItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollSnapItem({ children, className }: ScrollSnapItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.intersectionRatio > 0.5);
      },
      { threshold: [0, 0.5, 1] }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      ref={itemRef}
      className={cn("snap-start snap-always flex-shrink-0 relative", className)}
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{
        opacity: isActive ? 1 : 0.7,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1), transparent 70%)",
        }}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5), transparent)",
        }}
        animate={{
          opacity: isActive ? 1 : 0,
          scaleX: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.5), transparent)",
        }}
        animate={{
          opacity: isActive ? 1 : 0,
          scaleX: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
      {isActive && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-violet-400/50"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1.5, 0],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
