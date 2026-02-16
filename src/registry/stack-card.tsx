"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface StackCardProps {
  children?: React.ReactNode;
  className?: string;
  cards?: React.ReactNode[];
}

interface CardData {
  id: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  color1: string;
  color2: string;
}

export function StackCard({ children, className, cards = [] }: StackCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Spring physics for smooth animations
  const spreadProgress = useSpring(0, { stiffness: 100, damping: 15 });
  const rotationSpring = useSpring(0, { stiffness: 80, damping: 12 });

  // Generate card stack data
  const defaultCards = cards.length > 0 ? cards : [
    <div key={0} className="w-full h-full flex items-center justify-center text-white font-semibold">Card 1</div>,
    <div key={1} className="w-full h-full flex items-center justify-center text-white font-semibold">Card 2</div>,
    <div key={2} className="w-full h-full flex items-center justify-center text-white font-semibold">Card 3</div>,
    <div key={3} className="w-full h-full flex items-center justify-center text-white font-semibold">Card 4</div>,
  ];

  const cardData = useMemo((): CardData[] => {
    const colors = [
      ["#8b5cf6", "#7c3aed"],
      ["#ec4899", "#db2777"],
      ["#06b6d4", "#0891b2"],
      ["#10b981", "#059669"],
      ["#f59e0b", "#d97706"],
    ];
    
    return defaultCards.map((_, i) => ({
      id: i,
      rotation: (i - 1) * 3,
      offsetX: i * 4,
      offsetY: i * -2,
      color1: colors[i % colors.length][0],
      color2: colors[i % colors.length][1],
    }));
  }, [defaultCards]);

  useEffect(() => {
    spreadProgress.set(isHovered ? 1 : 0);
    rotationSpring.set(isHovered ? 1 : 0);
  }, [isHovered, spreadProgress, rotationSpring]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative w-64 h-40 cursor-pointer",
        className
      )}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveIndex(null);
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(
            ellipse 80% 40% at 50% 120%,
            rgba(0, 0, 0, ${isHovered ? 0.3 : 0.2}) 0%,
            transparent 70%
          )`,
          filter: `blur(${isHovered ? 20 : 10}px)`,
          transform: `scale(${isHovered ? 1.3 : 1})`,
          transition: "all 0.4s ease",
        }}
      />

      {cardData.map((card, index) => {
        const isActive = activeIndex === index;
        const totalCards = cardData.length;
        const spreadAngle = (index - (totalCards - 1) / 2) * 15;
        const spreadX = (index - (totalCards - 1) / 2) * 60;
        const liftY = isActive ? -20 : 0;
        
        return (
          <motion.div
            key={card.id}
            className="absolute inset-0 rounded-2xl border border-white/20 shadow-xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${card.color1}, ${card.color2})`,
              zIndex: totalCards - index + (isActive ? 10 : 0),
              transformStyle: "preserve-3d",
            }}
            initial={{
              rotate: card.rotation,
              x: card.offsetX,
              y: card.offsetY,
              scale: 1 - index * 0.03,
            }}
            animate={{
              rotate: useTransform(spreadProgress, [0, 1], [card.rotation, spreadAngle]).get(),
              x: useTransform(spreadProgress, [0, 1], [card.offsetX, spreadX]).get(),
              y: useTransform(spreadProgress, [0, 1], [card.offsetY, liftY]).get(),
              scale: isActive ? 1.05 : 1 - (isHovered ? 0 : index * 0.03),
              rotateY: isHovered ? (mousePos.x - 0.5) * 15 : 0,
              rotateX: isHovered ? -(mousePos.y - 0.5) * 10 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              delay: index * 0.03,
            }}
            onHoverStart={() => setActiveIndex(index)}
            onHoverEnd={() => setActiveIndex(null)}
          >
            <div className="relative z-10 w-full h-full">
              {defaultCards[index]}
            </div>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  ${135 + (mousePos.x - 0.5) * 60}deg,
                  rgba(255, 255, 255, 0.2) 0%,
                  transparent 50%,
                  rgba(0, 0, 0, 0.1) 100%
                )`,
                opacity: isHovered ? 1 : 0.5,
                transition: "opacity 0.3s ease",
              }}
            />
            <motion.div
              className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
              style={{
                background: `linear-gradient(
                  ${45 + mousePos.x * 90}deg,
                  rgba(255, 255, 255, ${isActive ? 0.5 : 0.2}) 0%,
                  transparent 50%,
                  rgba(255, 255, 255, ${isActive ? 0.3 : 0.1}) 100%
                )`,
                padding: "1px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            <motion.div
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </motion.div>
            {!isHovered && index < totalCards - 1 && (
              <div
                className="absolute inset-x-2 -bottom-2 h-4 rounded-b-2xl -z-10"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    ${card.color2}80,
                    transparent
                  )`,
                  filter: "blur(4px)",
                }}
              />
            )}
          </motion.div>
        );
      })}

      <motion.div
        className="absolute -inset-8 rounded-3xl -z-20 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(139, 92, 246, 0.2) 0%,
            rgba(236, 72, 153, 0.1) 30%,
            transparent 60%
          )`,
          filter: "blur(30px)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
}
