"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "centered" | "fullscreen" | "drawer";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  variant = "default",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeOnEscape, onClose]);

  const modalVariants = {
    default: {
      initial: { opacity: 0, y: 50, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 50, scale: 0.95 },
    },
    centered: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    fullscreen: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    drawer: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
  };

  const modalStyles = {
    default: "rounded-2xl bg-zinc-900 border border-white/10 max-w-lg w-full mx-4",
    centered: "rounded-2xl bg-zinc-900 border border-white/10 max-w-lg w-full mx-4",
    fullscreen: "w-full h-full bg-zinc-900",
    drawer: "h-full w-96 max-w-full bg-zinc-900 border-l border-white/10 ml-auto",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          <motion.div
            ref={modalRef}
            className={cn(
              "relative z-10 overflow-hidden",
              modalStyles[variant],
              className
            )}
            variants={modalVariants[variant]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}
            <div className={cn("p-6", variant === "fullscreen" && "h-full overflow-auto")}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ModalTriggerProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  className?: string;
}

export function ModalTrigger({ children, modal, className }: ModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={className} onClick={() => setIsOpen(true)}>
        {children}
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {modal}
        </Modal>
      )}
    </>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="centered">
      <div className="text-center">
        <div
          className={cn(
            "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
            variant === "danger" ? "bg-red-500/20" : "bg-violet-500/20"
          )}
        >
          {variant === "danger" ? (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cancelText}
          </motion.button>
          <motion.button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "px-6 py-2.5 rounded-xl font-medium",
              variant === "danger"
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
