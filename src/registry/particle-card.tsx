"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticleData {
  x: number;
  y: number;
  posX: number;
  posY: number;
  randX: number;
  randY: number;
  rotate: number;
  scale: number;
  delay: number;
}

interface ParticleProps {
  p: ParticleData;
  active: boolean;
  cols: number;
  rows: number;
  color: string;
}

function Particle({ p, active, cols, rows, color }: ParticleProps) {
  const finalTransform = `translate3d(${p.randX * 1.5}px, ${p.randY * 1.5}px, 0) rotate(${p.rotate * 2}deg) scale(${p.scale * 0.8})`;
  
  const style: React.CSSProperties = {
    backgroundColor: color,
    transition: `transform 800ms cubic-bezier(.2,.8,.2,1) ${p.delay}ms, opacity 600ms ease-in ${p.delay + 200}ms`,
    transform: active ? finalTransform : "translate3d(0,0,0) rotate(0deg) scale(1)",
    opacity: active ? 0 : 1,
    borderRadius: active ? 4 : 0,
    width: "100.5%",
    height: "100.5%",
    willChange: "transform, opacity",
    position: "absolute" as const,
    top: 0,
    left: 0,
  };

  return (
    <div
      style={{
        width: `${100 / cols}%`,
        height: `${100 / rows}%`,
        position: "absolute",
        left: `${(p.x / cols) * 100}%`,
        top: `${(p.y / rows) * 100}%`,
      }}
    >
      <div style={style} />
    </div>
  );
}

interface ParticleCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  cols?: number;
  rows?: number;
  className?: string;
}

export function ParticleCard({
  title = "Interactive Card",
  subtitle = "Hover to reveal",
  description = "This card explodes into particles when you hover over it, revealing the content underneath with a stunning visual effect.",
  tags = ["React", "Animation", "Interactive"],
  cols = 16,
  rows = 20,
  className,
}: ParticleCardProps) {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Precompute particle metadata
  const particles = useMemo(() => {
    const arr: ParticleData[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const posX = (x / (cols - 1)) * 100;
        const posY = (y / (rows - 1)) * 100;

        // Center-based explosion logic
        const centerX = cols / 2;
        const centerY = rows / 2;
        const dx = x - centerX;
        const dy = y - centerY;

        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Randomize slightly but keep directional momentum
        const spread = 100 + Math.random() * 200;
        const randX = Math.cos(angle) * spread * (1 + Math.random() * 0.5);
        const randY = Math.sin(angle) * spread * (1 + Math.random() * 0.5);

        const rotate = (Math.random() * 2 - 1) * 180;
        const scale = 0.5 + Math.random() * 0.5;

        // Delay based on distance from center (ripple effect)
        const delay = distance * 15 + Math.random() * 100;

        arr.push({ x, y, posX, posY, randX, randY, rotate, scale, delay });
      }
    }
    return arr;
  }, [cols, rows]);

  const particleColor = "#8b5cf6";

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <motion.div
        className="relative w-[280px] h-[360px] rounded-xl bg-zinc-800 shadow-2xl overflow-hidden cursor-pointer select-none"
        initial={false}
        animate={active ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onHoverStart={() => !isMobile && setActive(true)}
        onHoverEnd={() => !isMobile && setActive(false)}
        onClick={() => isMobile && setActive(!active)}
      >
        <div className="absolute inset-0 flex flex-col p-5 pt-4 pb-5 bg-gradient-to-br from-zinc-900 to-zinc-800 z-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3 h-full"
          >
            <div>
              <h3 className="text-xl font-bold text-white m-0">{title}</h3>
              <p className="text-zinc-400 font-medium text-sm m-0">{subtitle}</p>
            </div>

            <p className="text-zinc-400 leading-relaxed text-sm flex-1 m-0">
              {description}
            </p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-violet-500/20 rounded-md border border-violet-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button className="mt-2 w-full py-2.5 bg-violet-600 text-white rounded-lg font-semibold text-sm hover:bg-violet-500 transition-all flex items-center justify-center gap-2 cursor-pointer border-0">
              Explore
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </div>
        <div className="absolute inset-0 z-10 h-full w-full">
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-500 transform bg-gradient-to-t from-black/80 to-transparent",
              active ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
            <p className="text-white/80 font-medium text-sm">{subtitle}</p>
          </div>
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {particles.map((p, i) => (
              <Particle
                key={i}
                p={p}
                active={active}
                cols={cols}
                rows={rows}
                color={particleColor}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
