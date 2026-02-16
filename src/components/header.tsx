"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-provider";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatedLogo } from "./animated-logo";
import { components as allComponents } from "@/lib/components-data";

// Quick links for the command palette
const quickLinks = [
  { name: "GitHub", url: "https://github.com/nonaxial/nonaxial", external: true, group: "Links" },
  { name: "X (Twitter)", url: "https://x.com/AnukarOP", external: true, group: "Links" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  // Memoized filtered results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        links: quickLinks,
        components: allComponents.slice(0, 8),
      };
    }

    const query = searchQuery.toLowerCase();
    const matchedComponents = allComponents.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query)) ||
        c.category.toLowerCase().includes(query)
    ).slice(0, 10);

    const matchedLinks = quickLinks.filter(
      (l) => l.name.toLowerCase().includes(query)
    );

    return {
      links: matchedLinks,
      components: matchedComponents,
    };
  }, [searchQuery]);

  // Get all results as flat array for keyboard navigation
  const allResults = useMemo(() => {
    const results: Array<{ type: "link" | "component"; item: typeof quickLinks[0] | typeof allComponents[0]; index: number }> = [];
    
    filteredResults.links.forEach((item, idx) => {
      results.push({ type: "link", item, index: idx });
    });
    
    filteredResults.components.forEach((item, idx) => {
      results.push({ type: "component", item, index: idx });
    });
    
    return results;
  }, [filteredResults]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      
      if (e.key.toLowerCase() === "k" && !isInputFocused && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  // Handle keyboard navigation
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      e.preventDefault();
      const result = allResults[selectedIndex];
      if (result.type === "link") {
        const link = result.item as typeof quickLinks[0];
        if (link.external) {
          window.open(link.url, "_blank");
        } else {
          router.push(link.url);
        }
      } else {
        const comp = result.item as typeof allComponents[0];
        router.push(`/components/${comp.slug}`);
      }
      setSearchOpen(false);
    }
  }, [allResults, selectedIndex, router]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleResultClick = (type: "link" | "component", item: typeof quickLinks[0] | typeof allComponents[0]) => {
    if (type === "link") {
      const link = item as typeof quickLinks[0];
      if (link.external) {
        window.open(link.url, "_blank");
      } else {
        router.push(link.url);
      }
    } else {
      const comp = item as typeof allComponents[0];
      router.push(`/components/${comp.slug}`);
    }
    setSearchOpen(false);
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/70 backdrop-blur-xl backdrop-saturate-150" 
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <AnimatedLogo size={24} />
          <motion.span 
            className="text-base font-semibold tracking-tight text-foreground"
            whileTap={{ scale: 0.97 }}
          >
            nonaxial
          </motion.span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/components">
            <motion.span 
              className={`text-sm transition-colors ${
                pathname === "/components" 
                  ? "text-foreground" 
                  : "text-muted hover:text-foreground"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Components
            </motion.span>
          </Link>
          
          <a 
            href="https://github.com/AnukarOP/nonaxial" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <motion.span 
              className="text-sm text-muted hover:text-foreground transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              GitHub
            </motion.span>
          </a>

          {/* Search Button */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-background/50 text-muted hover:text-foreground hover:border-border transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-accent/20 rounded border border-border/30">
              K
            </kbd>
          </motion.button>

          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-accent/10 transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.svg 
                  key="sun"
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </motion.svg>
              ) : (
                <motion.svg 
                  key="moon"
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl z-50 px-4"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Type a command or search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted outline-none text-sm"
                  />
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-muted bg-accent/20 rounded border border-border/30">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div ref={resultsRef} className="max-h-80 overflow-y-auto py-2">
                  {/* Quick Links */}
                  {filteredResults.links.length > 0 && (
                    <div className="px-2 pb-2">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wider">
                        Links
                      </div>
                      {filteredResults.links.map((link, idx) => {
                        const globalIdx = idx;
                        return (
                          <motion.button
                            key={link.name}
                            data-index={globalIdx}
                            onClick={() => handleResultClick("link", link)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              selectedIndex === globalIdx
                                ? "bg-violet-500/10 text-foreground"
                                : "text-muted hover:bg-accent/10 hover:text-foreground"
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            <svg className="w-4 h-4 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className="text-sm font-medium">{link.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Components */}
                  {filteredResults.components.length > 0 && (
                    <div className="px-2">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wider">
                        Components
                      </div>
                      {filteredResults.components.map((comp, idx) => {
                        const globalIdx = filteredResults.links.length + idx;
                        return (
                          <motion.button
                            key={comp.slug}
                            data-index={globalIdx}
                            onClick={() => handleResultClick("component", comp)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              selectedIndex === globalIdx
                                ? "bg-violet-500/10 text-foreground"
                                : "text-muted hover:bg-accent/10 hover:text-foreground"
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{comp.name}</div>
                              <div className="text-xs text-muted truncate">{comp.description}</div>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-muted capitalize">
                              {comp.category}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* No Results */}
                  {filteredResults.links.length === 0 && filteredResults.components.length === 0 && (
                    <div className="px-4 py-8 text-center text-muted text-sm">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-accent/20 rounded border border-border/30">↑</kbd>
                      <kbd className="px-1 py-0.5 bg-accent/20 rounded border border-border/30">↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-accent/20 rounded border border-border/30">↵</kbd>
                      <span>Open</span>
                    </span>
                  </div>
                  <span>{allComponents.length} components</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
