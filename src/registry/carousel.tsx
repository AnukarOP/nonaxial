"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  variant?: "default" | "fade" | "slide" | "stack";
  className?: string;
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 4000,
  showArrows = true,
  showDots = true,
  variant = "default",
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const stackVariants = {
    enter: { scale: 0.8, y: 100, opacity: 0 },
    center: { scale: 1, y: 0, opacity: 1 },
    exit: { scale: 0.8, y: -100, opacity: 0 },
  };

  const variants = variant === "fade" ? fadeVariants : variant === "stack" ? stackVariants : slideVariants;

  return (
    <div className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {items[current]}
          </motion.div>
        </AnimatePresence>
      </div>
      {showArrows && items.length > 1 && (
        <>
          <motion.button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </>
      )}
      {showDots && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === current
                  ? "bg-violet-500 w-6"
                  : "bg-zinc-600 w-2 hover:bg-zinc-500"
              )}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CardCarouselProps {
  cards: {
    image?: string;
    title: string;
    description?: string;
  }[];
  className?: string;
}

export function CardCarousel({ cards, className }: CardCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="flex-shrink-0 w-72 rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-40 object-cover"
              draggable={false}
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-white">{card.title}</h3>
            {card.description && (
              <p className="text-sm text-zinc-400 mt-1">{card.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
