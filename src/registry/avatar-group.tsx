"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Avatar {
  src?: string;
  name: string;
  status?: "online" | "offline" | "busy" | "away";
}

interface AvatarGroupProps {
  avatars: Avatar[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

export function AvatarGroup({
  avatars,
  max = 5,
  size = "md",
  className,
  showTooltip = true,
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizeClasses = {
    sm: "w-8 h-8 text-xs -ml-2 first:ml-0",
    md: "w-10 h-10 text-sm -ml-3 first:ml-0",
    lg: "w-12 h-12 text-base -ml-4 first:ml-0",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-zinc-500",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {displayAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.name}
          className={cn(
            "relative rounded-full border-2 border-zinc-900 overflow-hidden cursor-pointer",
            sizeClasses[size]
          )}
          initial={{ opacity: 0, scale: 0, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          style={{ zIndex: displayAvatars.length - index }}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium">
              {avatar.name.charAt(0).toUpperCase()}
            </div>
          )}
          {avatar.status && (
            <div
              className={cn(
                "absolute bottom-0 right-0 rounded-full border-2 border-zinc-900",
                statusColors[avatar.status],
                size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3"
              )}
            />
          )}
          {showTooltip && (
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100"
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {avatar.name}
            </motion.div>
          )}
        </motion.div>
      ))}

      {remaining > 0 && (
        <motion.div
          className={cn(
            "rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-white font-medium cursor-pointer",
            sizeClasses[size]
          )}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: max * 0.05 }}
          whileHover={{ scale: 1.1 }}
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  );
}

// Single avatar with animation
interface AnimatedAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  ring?: boolean;
  className?: string;
}

export function AnimatedAvatar({
  src,
  name,
  size = "md",
  status,
  ring = false,
  className,
}: AnimatedAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-zinc-500",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {ring && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-violet-500"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ margin: -4 }}
        />
      )}

      <div
        className={cn(
          "rounded-full overflow-hidden border-2 border-white/20",
          sizeClasses[size]
        )}
      >
        {src ? (
          <motion.img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {status && (
        <motion.div
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-zinc-900",
            statusColors[status],
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        />
      )}
    </motion.div>
  );
}
