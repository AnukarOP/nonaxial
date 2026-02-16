"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  stats?: { label: string; value: string | number }[];
  socialLinks?: { icon: React.ReactNode; href: string }[];
  className?: string;
  variant?: "default" | "compact" | "horizontal" | "minimal";
}

export function ProfileCard({
  name,
  title,
  bio,
  avatar,
  coverImage,
  stats,
  socialLinks,
  className,
  variant = "default",
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "relative rounded-2xl bg-zinc-900/50 border border-white/10 p-4",
          className
        )}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
              {name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{name}</h3>
            {title && <p className="text-sm text-zinc-400 truncate">{title}</p>}
          </div>
          <motion.button
            className="px-4 py-1.5 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(139,92,246,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Follow
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.div
        className={cn(
          "relative rounded-2xl bg-zinc-900/50 border border-white/10 p-6 flex gap-6",
          className
        )}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-24 h-24 rounded-xl object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-3xl">
            {name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {title && <p className="text-violet-400">{title}</p>}
          {bio && <p className="text-sm text-zinc-400 mt-2">{bio}</p>}
          {stats && (
            <div className="flex gap-6 mt-4">
              {stats.map((stat, index) => (
                <div key={index}>
                  <span className="font-bold text-white">{stat.value}</span>
                  <span className="text-zinc-500 text-sm ml-1">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className={cn("text-center", className)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {name.charAt(0)}
          </div>
        )}
        <h3 className="font-semibold text-white">{name}</h3>
        {title && <p className="text-sm text-zinc-400">{title}</p>}
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl bg-zinc-900/50 border border-white/10 overflow-hidden",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-32">
        {coverImage ? (
          <motion.img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div
            className="w-full h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
            animate={{ scale: isHovered ? 1.05 : 1 }}
          />
        )}
      </div>
      <div className="relative px-6">
        <motion.div
          className="absolute -top-12 left-6"
          animate={{ y: isHovered ? -4 : 0 }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-900"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-zinc-900">
              {name.charAt(0)}
            </div>
          )}
        </motion.div>
      </div>
      <div className="pt-16 pb-6 px-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        {title && <p className="text-violet-400">{title}</p>}
        {bio && <p className="text-sm text-zinc-400 mt-3">{bio}</p>}
        {stats && (
          <div className="flex justify-around mt-6 pt-6 border-t border-white/10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}
        {socialLinks && (
          <div className="flex justify-center gap-3 mt-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-violet-500/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        )}
        <motion.button
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Follow
        </motion.button>
      </div>
    </motion.div>
  );
}
