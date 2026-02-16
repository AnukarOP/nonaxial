"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "icon" | "minimal";
  onCopy?: () => void;
}

export function CopyButton({
  text,
  className,
  variant = "default",
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleCopy}
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10",
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.svg
              key="check"
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </motion.svg>
          ) : (
            <motion.svg
              key="copy"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        onClick={handleCopy}
        className={cn("text-sm text-violet-400 hover:text-violet-300 underline", className)}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleCopy}
      className={cn(
        "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium",
        copied
          ? "bg-green-500/20 text-green-400"
          : "bg-white/10 text-white hover:bg-white/20",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </motion.button>
  );
}

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-zinc-500 ml-2">{language}</span>
        </div>
        <CopyButton text={code} variant="icon" />
      </div>
      <div className="p-4 bg-zinc-900 overflow-x-auto">
        <pre className="text-sm font-mono">
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                highlightLines.includes(index + 1) && "bg-violet-500/10 -mx-4 px-4"
              )}
            >
              {showLineNumbers && (
                <span className="select-none text-zinc-600 w-8 flex-shrink-0 text-right pr-4">
                  {index + 1}
                </span>
              )}
              <code className="text-zinc-300">{line || " "}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

interface ShareButtonsProps {
  url: string;
  title?: string;
  className?: string;
}

export function ShareButtons({ url, title = "", className }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:text-sky-400",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: "hover:text-blue-400",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-blue-500",
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 transition-colors",
            link.color
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </motion.a>
      ))}
      <CopyButton text={url} variant="icon" />
    </div>
  );
}

interface LikeButtonProps {
  initialCount?: number;
  liked?: boolean;
  onLike?: (liked: boolean) => void;
  className?: string;
}

export function LikeButton({
  initialCount = 0,
  liked = false,
  onLike,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(!isLiked);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full",
        isLiked
          ? "bg-red-500/20 text-red-400"
          : "bg-white/5 text-zinc-400 hover:bg-white/10",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        className="w-5 h-5"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </motion.svg>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: isLiked ? -10 : 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: isLiked ? 10 : -10, opacity: 0 }}
          className="text-sm font-medium"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
