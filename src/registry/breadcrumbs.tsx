"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  variant?: "default" | "pills" | "arrows" | "minimal";
}

export function Breadcrumbs({
  items,
  separator,
  className,
  variant = "default",
}: BreadcrumbsProps) {
  const defaultSeparator = (
    <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  if (variant === "pills") {
    return (
      <nav className={cn("flex items-center gap-2", className)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <motion.a
              key={index}
              href={item.href || "#"}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors",
                isLast
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
              {item.label}
            </motion.a>
          );
        })}
      </nav>
    );
  }

  if (variant === "arrows") {
    return (
      <nav className={cn("flex items-center", className)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={index} className="flex items-center">
              <motion.a
                href={item.href || "#"}
                className={cn(
                  "px-4 py-2 text-sm flex items-center gap-2 relative",
                  isLast
                    ? "bg-violet-500 text-white clip-arrow"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 clip-arrow-left",
                  index === 0 && "rounded-l-lg"
                )}
                whileHover={{ scale: 1.02 }}
                style={{
                  clipPath: isLast
                    ? "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)"
                    : "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)",
                  marginLeft: index > 0 ? "-8px" : 0,
                }}
              >
                {item.icon}
                {item.label}
              </motion.a>
            </div>
          );
        })}
      </nav>
    );
  }

  if (variant === "minimal") {
    return (
      <nav className={cn("flex items-center gap-1 text-sm", className)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={index} className="flex items-center gap-1">
              <a
                href={item.href || "#"}
                className={cn(
                  "transition-colors",
                  isLast ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {item.label}
              </a>
              {!isLast && <span className="text-zinc-600">/</span>}
            </span>
          );
        })}
      </nav>
    );
  }

  // Default variant
  return (
    <nav className={cn("flex items-center gap-2", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <motion.div
            key={index}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.a
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                isLast
                  ? "text-white font-medium"
                  : "text-zinc-400 hover:text-white"
              )}
              whileHover={{ x: 2 }}
            >
              {item.icon}
              {item.label}
            </motion.a>
            {!isLast && (separator || defaultSeparator)}
          </motion.div>
        );
      })}
    </nav>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: "default" | "minimal" | "rounded";
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  variant = "default",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const buttonStyles = {
    default: "w-10 h-10 rounded-lg",
    minimal: "w-8 h-8 rounded",
    rounded: "w-10 h-10 rounded-full",
  };

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      <motion.button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          buttonStyles[variant],
          "flex items-center justify-center",
          currentPage === 1
            ? "text-zinc-600 cursor-not-allowed"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        )}
        whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={cn(
            buttonStyles[variant],
            "flex items-center justify-center text-sm font-medium",
            page === currentPage
              ? "bg-violet-500 text-white"
              : page === "..."
              ? "text-zinc-500 cursor-default"
              : "text-zinc-400 hover:bg-white/10 hover:text-white"
          )}
          whileHover={typeof page === "number" && page !== currentPage ? { scale: 1.05 } : {}}
          whileTap={typeof page === "number" && page !== currentPage ? { scale: 0.95 } : {}}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          buttonStyles[variant],
          "flex items-center justify-center",
          currentPage === totalPages
            ? "text-zinc-600 cursor-not-allowed"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        )}
        whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </nav>
  );
}
