"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NotificationProps {
  id: string;
  type?: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  timestamp?: string;
  avatar?: string;
  onDismiss?: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export function Notification({
  id,
  type = "info",
  title,
  message,
  timestamp,
  avatar,
  onDismiss,
  onAction,
  actionLabel,
  className,
}: NotificationProps) {
  const typeStyles = {
    info: "border-l-blue-500",
    success: "border-l-green-500",
    warning: "border-l-yellow-500",
    error: "border-l-red-500",
  };

  const typeIcons = {
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-white/10 border-l-4 p-4",
        typeStyles[type],
        className
      )}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex gap-3">
        {avatar ? (
          <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            {typeIcons[type]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-white truncate">{title}</h4>
            {onDismiss && (
              <motion.button
                onClick={() => onDismiss(id)}
                className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
          {message && <p className="text-sm text-zinc-400 mt-1">{message}</p>}
          <div className="flex items-center gap-3 mt-2">
            {timestamp && <span className="text-xs text-zinc-500">{timestamp}</span>}
            {onAction && actionLabel && (
              <motion.button
                onClick={onAction}
                className="text-xs font-medium text-violet-400 hover:text-violet-300"
                whileHover={{ scale: 1.05 }}
              >
                {actionLabel}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface NotificationStackProps {
  notifications: Omit<NotificationProps, "onDismiss">[];
  onDismiss?: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function NotificationStack({
  notifications,
  onDismiss,
  position = "top-right",
  className,
}: NotificationStackProps) {
  const positionStyles = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={cn("fixed z-50 w-96 space-y-3", positionStyles[position], className)}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

interface ActivityItemProps {
  avatar?: string;
  name: string;
  action: string;
  target?: string;
  timestamp: string;
  className?: string;
}

export function ActivityItem({
  avatar,
  name,
  action,
  target,
  timestamp,
  className,
}: ActivityItemProps) {
  return (
    <motion.div
      className={cn("flex items-start gap-3 p-3", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", damping: 25 }}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
          {name.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300">
          <span className="font-medium text-white">{name}</span>
          {" "}{action}{" "}
          {target && <span className="font-medium text-violet-400">{target}</span>}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{timestamp}</p>
      </div>
    </motion.div>
  );
}

interface ActivityFeedProps {
  activities: ActivityItemProps[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn("divide-y divide-white/5", className)}>
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </div>
  );
}
