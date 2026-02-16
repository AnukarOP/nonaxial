"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}

export function ImageReveal({
  src,
  alt,
  direction = "left",
  className,
}: ImageRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const variants = {
    left: { x: "100%", transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] as const } },
    right: { x: "-100%", transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] as const } },
    up: { y: "100%", transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] as const } },
    down: { y: "-100%", transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] as const } },
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 bg-violet-500 z-10"
        initial={false}
        animate={revealed ? variants[direction] : { x: 0, y: 0 }}
      />
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.2 }}
        animate={{ scale: revealed ? 1 : 1.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  );
}

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className }: ImageZoomProps) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <motion.img
        src={src}
        alt={alt}
        className={cn("cursor-zoom-in object-cover", className)}
        onClick={() => setZoomed(true)}
        whileHover={{ scale: 1.02 }}
        layoutId={`image-${src}`}
      />
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              layoutId={`image-${src}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ImageParallaxProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

export function ImageParallax({
  src,
  alt,
  speed = 0.5,
  className,
}: ImageParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setOffset((scrollProgress - 0.5) * 100 * speed);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover"
        style={{ transform: `translateY(${offset}px)` }}
      />
    </div>
  );
}

interface ImageMaskProps {
  src: string;
  alt: string;
  maskType?: "circle" | "square" | "triangle" | "hexagon";
  className?: string;
}

export function ImageMask({
  src,
  alt,
  maskType = "circle",
  className,
}: ImageMaskProps) {
  const [hovered, setHovered] = useState(false);

  const masks = {
    circle: "50%",
    square: "0%",
    triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
    hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  };

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        clipPath: maskType === "circle" || maskType === "square" 
          ? `inset(0 round ${masks[maskType]})` 
          : masks[maskType],
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

interface ImageGlitchProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageGlitch({ src, alt, className }: ImageGlitchProps) {
  const [glitching, setGlitching] = useState(false);

  return (
    <div
      className={cn("relative cursor-pointer", className)}
      onMouseEnter={() => setGlitching(true)}
      onMouseLeave={() => setGlitching(false)}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {glitching && (
        <>
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
            style={{ filter: "url(#red)" }}
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50"
            style={{ filter: "url(#blue)" }}
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />
          <svg className="hidden">
            <defs>
              <filter id="red">
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                />
              </filter>
              <filter id="blue">
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                />
              </filter>
            </defs>
          </svg>
        </>
      )}
    </div>
  );
}

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  before,
  after,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-col-resize select-none", className)}
      onMouseDown={() => { isDragging.current = true; }}
      onMouseUp={() => { isDragging.current = false; }}
      onMouseLeave={() => { isDragging.current = false; }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <img src={after} alt={afterAlt} className="w-full h-full object-cover" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          alt={beforeAlt}
          className="w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth }}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/50 rounded text-white text-sm">
        Before
      </div>
      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 rounded text-white text-sm">
        After
      </div>
    </div>
  );
}

interface ImageTiltProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageTilt({ src, alt, className }: ImageTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform({
      rotateX: -y * 20,
      rotateY: x * 20,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + transform.rotateY * 2}% ${50 - transform.rotateX * 2}%, rgba(255,255,255,0.2), transparent)`,
        }}
      />
    </motion.div>
  );
}

interface ImageMasonryProps {
  images: { src: string; alt: string }[];
  columns?: number;
  gap?: number;
  className?: string;
}

export function ImageMasonry({
  images,
  columns = 3,
  gap = 16,
  className,
}: ImageMasonryProps) {
  const columnArrays: { src: string; alt: string }[][] = Array.from(
    { length: columns },
    () => []
  );

  images.forEach((image, i) => {
    columnArrays[i % columns].push(image);
  });

  return (
    <div
      className={cn("flex", className)}
      style={{ gap }}
    >
      {columnArrays.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col" style={{ gap }}>
          {column.map((image, imgIndex) => (
            <motion.img
              key={imgIndex}
              src={image.src}
              alt={image.alt}
              className="w-full object-cover rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (colIndex * column.length + imgIndex) * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
