"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

function OpenSourceBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  
  useEffect(() => {
    fetch("https://api.github.com/repos/Anukarop/nonaxial")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => setStarCount(null));
  }, []);

  const formatStars = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };
  
  return (
    <a
      href="https://github.com/Anukarop/nonaxial"
      target="_blank"
      rel="noopener noreferrer"
    >
      <motion.div
        className="relative inline-block mb-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden rounded-full cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_100%]"
            animate={{
              backgroundPosition: isHovered ? ["0% 0%", "100% 0%"] : "0% 0%",
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ 
              backgroundPosition: { duration: 1, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.3 }
            }}
          />
          
          <motion.div
            className="relative flex items-center gap-2.5 px-5 py-2.5 m-[1px] rounded-full bg-zinc-950 backdrop-blur-sm"
          >
            <motion.svg 
              className="w-4 h-4"
              viewBox="0 0 24 24" 
              fill="currentColor"
              animate={{
                color: isHovered ? "#a855f7" : "#71717a",
              }}
              transition={{ duration: 0.3 }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </motion.svg>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={isHovered ? "hover" : "default"}
                className="text-sm font-medium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {isHovered ? (
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Star us on GitHub
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    100% open source
                  </span>
                )}
              </motion.span>
            </AnimatePresence>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs">
              <span>⭐</span>
              <span className="text-zinc-400">
                {starCount !== null ? formatStars(starCount) : "—"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </a>
  );
}

function useMagnetic(strength: number = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { springX, springY, handleMouseMove, handleMouseLeave };
}

function BrowseButton() {
  const { springX, springY, handleMouseMove, handleMouseLeave } = useMagnetic(0.4);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeave();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      className="relative"
    >
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-violet-600/40 via-fuchsia-500/40 to-violet-600/40 rounded-full blur-2xl"
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
      />
      
      <Link href="/components" ref={buttonRef}>
        <motion.div
          className="relative overflow-hidden px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_100%] cursor-pointer"
          animate={{
            backgroundPosition: isHovered ? "100% 0%" : "0% 0%",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{
              x: isHovered ? ["-100%", "200%"] : "-100%",
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
          
          <span className="relative flex items-center gap-3 text-foreground font-semibold text-lg tracking-wide">
            Browse Components
            <motion.span
              className="relative flex items-center"
              animate={{
                x: isHovered ? 6 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.svg 
                className="w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path 
                  d="M5 12h14"
                  initial={{ pathLength: 0.6 }}
                  animate={{ pathLength: isHovered ? 1 : 0.6 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path 
                  d="M13 6l6 6-6 6"
                  animate={{ 
                    opacity: isHovered ? 1 : 0.7,
                  }}
                />
              </motion.svg>
            </motion.span>
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function FloatingParticle({ delay, duration, x, y, size }: { 
  delay: number; 
  duration: number; 
  x: number; 
  y: number; 
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-violet-500/30"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px]" />
        <FloatingParticle delay={0} duration={4} x={15} y={20} size={4} />
        <FloatingParticle delay={0.5} duration={5} x={85} y={30} size={3} />
        <FloatingParticle delay={1} duration={4.5} x={25} y={70} size={5} />
        <FloatingParticle delay={1.5} duration={6} x={75} y={60} size={4} />
        <FloatingParticle delay={2} duration={5} x={50} y={15} size={3} />
        <FloatingParticle delay={0.8} duration={4} x={60} y={80} size={4} />
        <FloatingParticle delay={1.2} duration={5.5} x={10} y={50} size={3} />
        <FloatingParticle delay={2.5} duration={4} x={90} y={75} size={5} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <OpenSourceBadge />
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-black dark:text-white text-3xl sm:text-4xl md:text-5xl mb-2 font-medium">static components feel dead</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              make them alive
            </span>
          </motion.h1>

          <motion.div 
            className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-14 leading-relaxed space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p>a collection of smooth, high-quality animated react components.</p>
            <p className="text-zinc-400">copy-paste & ship!</p>
            <div className="flex items-center justify-center gap-6 pt-2 text-sm">
              <span className="flex items-center gap-2 text-zinc-500">
                <span className="text-zinc-400">works with</span>
                <span className="font-mono text-zinc-300 bg-white/5 px-2 py-0.5 rounded">shadcn/ui</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-2 text-zinc-500">
                <span className="text-zinc-400">crafted with</span>
                <motion.span 
                  className="text-fuchsia-400 font-la"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Motion
                </motion.span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <BrowseButton />
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-8">
          <motion.a
            href="https://github.com/Anukarop/nonaxial"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            whileHover={{ y: -2 }}
          >
            <motion.svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </motion.svg>
            <span>GitHub</span>
            <motion.svg 
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ x: -4 }}
              animate={{ x: 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </motion.svg>
          </motion.a>
          <span className="text-zinc-700">·</span>
          <motion.a
            href="https://twitter.com/anukarop"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            whileHover={{ y: -2 }}
          >
            <motion.svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </motion.svg>
            <span>Twitter</span>
            <motion.svg 
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ x: -4 }}
              animate={{ x: 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </motion.svg>
          </motion.a>
        </div>
      </footer>
    </div>
  );
}
