"use client";

import { useState, memo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { components, categories } from "@/lib/components-data";
import { cn } from "@/lib/utils";
import { getComponentDemo } from "@/lib/component-demos";

// Split categories - visible ones and "more" ones
const visibleCategories = categories.slice(0, 10); // All through Interactions
const moreCategories = categories.slice(10); // Navigation onwards

// Floating particle component
function FloatingParticle({ delay, duration, x, y, size, color }: { 
  delay: number; 
  duration: number; 
  x: number; 
  y: number; 
  size: number;
  color: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -40, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.3, 1],
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

// Package manager tabs
const packageManagers = [
  { id: "npm", label: "npm", prefix: "npx" },
  { id: "pnpm", label: "pnpm", prefix: "pnpm dlx" },
  { id: "yarn", label: "yarn", prefix: "npx" },
  { id: "bun", label: "bun", prefix: "bunx" },
];

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPm, setSelectedPm] = useState("npm");
  const [copied, setCopied] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // F key to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setShowMoreCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredComponents = components.filter((component) => {
    const matchesCategory =
      selectedCategory === "All" || component.category === selectedCategory;
    const matchesSearch =
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const pm = packageManagers.find((p) => p.id === selectedPm) || packageManagers[0];
  const installCommand = `${pm.prefix} shadcn@latest add https://nonaxial.com/r/[component].json`;

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-violet-500/8 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-fuchsia-500/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      {/* Floating particles */}
        <FloatingParticle delay={0} duration={5} x={10} y={15} size={4} color="bg-violet-400/40" />
        <FloatingParticle delay={0.5} duration={6} x={90} y={25} size={3} color="bg-fuchsia-400/40" />
        <FloatingParticle delay={1} duration={5.5} x={20} y={60} size={5} color="bg-violet-500/30" />
        <FloatingParticle delay={1.5} duration={7} x={80} y={50} size={4} color="bg-purple-400/40" />
        <FloatingParticle delay={2} duration={6} x={45} y={10} size={3} color="bg-fuchsia-500/30" />
        <FloatingParticle delay={0.8} duration={5} x={65} y={75} size={4} color="bg-violet-400/30" />
        <FloatingParticle delay={1.2} duration={6.5} x={5} y={45} size={3} color="bg-purple-500/40" />
        <FloatingParticle delay={2.5} duration={5} x={95} y={70} size={5} color="bg-fuchsia-400/30" />
        <FloatingParticle delay={3} duration={7} x={35} y={85} size={3} color="bg-violet-500/40" />
        <FloatingParticle delay={0.3} duration={6} x={75} y={5} size={4} color="bg-purple-400/30" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-black dark:text-white">static components </span>
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">feel dead</span>
          </h1>
          <p className="text-zinc-500 text-lg mb-4 max-w-lg">
            smooth, high-quality animated react components. copy. paste. ship.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            <span>integrates with</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 font-mono text-xs">shadcn/ui</span>
            <span className="text-zinc-700">•</span>
            <span>via cli</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-sm text-zinc-600">
            <span>Made with ❤️ by</span>
            <motion.a 
              href="https://github.com/AnukarOP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 font-medium text-xs flex items-center gap-1.5 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Anukar
              </motion.span>
              <motion.svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-[500px] rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/30">
            <div className="flex items-center gap-1">
              {packageManagers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPm(p.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    selectedPm === p.id
                      ? "bg-accent/20 text-accent"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
          </div>
          <div className="flex items-center px-4 py-4 font-mono text-sm">
            <span className="text-violet-500 dark:text-violet-400 mr-2">$</span>
            <span className="text-zinc-700 dark:text-zinc-300 flex-1 truncate">{installCommand}</span>
            <button
              onClick={copyCommand}
              className="ml-3 p-2 rounded-lg hover:bg-accent/10 transition-colors text-muted hover:text-foreground"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="relative max-w-2xl mx-auto">
          <motion.div 
            className={cn(
              "relative flex items-center rounded-2xl border-2 overflow-hidden transition-all duration-300",
              searchFocused 
                ? "border-violet-500/50 bg-zinc-900/80 shadow-lg shadow-violet-500/10" 
                : "border-border/50 bg-zinc-900/50 hover:border-border"
            )}
            animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg
              className={cn(
                "absolute left-5 w-5 h-5 transition-colors duration-200",
                searchFocused ? "text-violet-400" : "text-muted"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={searchFocused ? { rotate: [0, -10, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </motion.svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${components.length} components...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-14 pr-16 py-4 bg-transparent text-base text-foreground placeholder:text-zinc-500 focus:outline-none"
            />
            <AnimatePresence>
              {!searchFocused && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-4"
                >
                  <kbd className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-xs font-medium shadow-sm">
                    F
                  </kbd>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-4 p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence>
            {searchFocused && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-zinc-500 text-center mt-2"
              >
                Type to search by name or tag
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-2 mb-10"
      >
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selectedCategory === category
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/20"
                : "text-muted hover:text-foreground border border-transparent hover:bg-accent/10"
            )}
          >
            {category}
          </button>
        ))}
        <div ref={moreDropdownRef} className="relative">
          <button
            onClick={() => setShowMoreCategories(!showMoreCategories)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
              moreCategories.includes(selectedCategory)
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/20"
                : "text-muted hover:text-foreground border border-transparent hover:bg-accent/10"
            )}
          >
            <span>{moreCategories.includes(selectedCategory) ? selectedCategory : "More"}</span>
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: showMoreCategories ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {showMoreCategories && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 py-2 rounded-xl border border-border bg-zinc-900/95 backdrop-blur-xl shadow-xl shadow-black/20 z-50"
              >
                {moreCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowMoreCategories(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left transition-colors",
                      selectedCategory === category
                        ? "bg-violet-500/20 text-violet-400"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredComponents.map((component, index) => (
          <motion.div
            key={component.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.015, 0.4), duration: 0.3 }}
          >
            <ComponentCard component={component} />
          </motion.div>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-32">
          <p className="text-zinc-500 text-lg">No components found.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 text-violet-400 hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

const ComponentCard = memo(function ComponentCard({ 
  component 
}: { 
  component: { slug: string; name: string; description: string; category: string } 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const demo = isHovered ? getComponentDemo(component.slug) : null;
  
  // Check if it's a background or cursor component - these should fill the card
  const isFullBleed = component.category === "Backgrounds" || component.category === "Cursor Effects";

  return (
    <div 
      className="group relative h-48 rounded-xl border border-border bg-card hover:border-violet-500/30 hover:bg-card/80 transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/components/${component.slug}`)}
    >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {isHovered ? (
            isFullBleed ? (
              // Background/Cursor components fill the entire card
              <div className="absolute inset-0 pointer-events-none">
                {demo}
              </div>
            ) : (
              <div className="transform scale-[0.65] origin-center pointer-events-none">
                {demo}
              </div>
            )
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center border border-border">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20" />
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10">
          <h3 className="font-medium text-sm text-muted group-hover:text-foreground transition-colors truncate">
            {component.name}
          </h3>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-medium z-10"
            >
              LIVE
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
});
