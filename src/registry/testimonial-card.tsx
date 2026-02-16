"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialAuthor {
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialCardProps {
  content: string;
  author: TestimonialAuthor;
  rating?: number;
  className?: string;
  variant?: "default" | "bordered" | "gradient" | "minimal";
}

export function TestimonialCard({
  content,
  author,
  rating,
  className,
  variant = "default",
}: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    default: "bg-zinc-900/50 border border-white/10",
    bordered: "bg-transparent border-2 border-violet-500/30",
    gradient: "bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20",
    minimal: "bg-transparent",
  };

  return (
    <motion.div
      className={cn("relative rounded-2xl p-6", variantStyles[variant], className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute top-4 right-4 text-violet-500/20"
        animate={{ scale: isHovered ? 1.1 : 1 }}
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </motion.div>
      {rating !== undefined && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <motion.svg
              key={i}
              className={cn("w-5 h-5", i < rating ? "text-yellow-400" : "text-zinc-600")}
              fill="currentColor"
              viewBox="0 0 20 20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </motion.svg>
          ))}
        </div>
      )}
      <p className="text-zinc-300 text-lg leading-relaxed mb-6">&ldquo;{content}&rdquo;</p>
      <div className="flex items-center gap-4">
        {author.avatar ? (
          <motion.img
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
          />
        ) : (
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold"
            animate={{ scale: isHovered ? 1.1 : 1 }}
          >
            {author.name.charAt(0)}
          </motion.div>
        )}
        <div>
          <p className="font-semibold text-white">{author.name}</p>
          {(author.title || author.company) && (
            <p className="text-sm text-zinc-400">
              {author.title}
              {author.title && author.company && " at "}
              {author.company && <span className="text-violet-400">{author.company}</span>}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface TestimonialCarouselProps {
  testimonials: {
    content: string;
    author: TestimonialAuthor;
    rating?: number;
  }[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
  className,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);

  useState(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  });

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <TestimonialCard {...testimonials[current]} variant="gradient" />
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === current ? "bg-violet-500 w-6" : "bg-zinc-600 hover:bg-zinc-500"
            )}
          />
        ))}
      </div>
    </div>
  );
}
