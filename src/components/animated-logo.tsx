"use client";

import { motion } from "framer-motion";

export function AnimatedLogo({ size = 24 }: { size?: number }) {
  return (
    <motion.div 
      className="relative"
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.circle
          cx="16"
          cy="16"
          r="14"
          stroke="url(#gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
        
        <motion.ellipse
          cx="16"
          cy="16"
          rx="9"
          ry="5"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="none"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
        
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "16px 16px" }}
        >
          <circle
            cx="25"
            cy="16"
            r="2.5"
            fill="url(#gradient)"
          />
        </motion.g>
        
        <motion.text
          x="16"
          y="20"
          textAnchor="middle"
          className="fill-current font-bold"
          style={{ fontSize: "12px" }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          n
        </motion.text>
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
