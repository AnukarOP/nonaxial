"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-center gap-2">
          <Link href="/">
            <motion.span 
              className="text-sm font-medium text-foreground"
              whileTap={{ scale: 0.97 }}
            >
              nonaxial
            </motion.span>
          </Link>
          <span className="text-border">·</span>
          <span className="text-sm text-muted">
            © {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
}
