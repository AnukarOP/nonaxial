"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  variant?: "default" | "vertical" | "minimal";
  onStepClick?: (step: number) => void;
}

export function Stepper({
  steps,
  currentStep,
  className,
  variant = "default",
  onStepClick,
}: StepperProps) {
  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col", className)}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.button
                  onClick={() => onStepClick?.(index)}
                  disabled={!onStepClick}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all z-10",
                    isCompleted
                      ? "bg-violet-500 border-violet-500 text-white"
                      : isCurrent
                        ? "bg-transparent border-violet-500 text-violet-400"
                        : "bg-transparent border-zinc-700 text-zinc-500"
                  )}
                  whileHover={onStepClick ? { scale: 1.1 } : undefined}
                  whileTap={onStepClick ? { scale: 0.95 } : undefined}
                >
                  {isCompleted ? (
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    step.icon || index + 1
                  )}
                </motion.button>

                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 min-h-[40px] bg-zinc-700 relative">
                    <motion.div
                      className="absolute inset-x-0 top-0 bg-violet-500"
                      initial={{ height: "0%" }}
                      animate={{ height: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
              <div className="pb-8">
                <motion.p
                  className={cn(
                    "font-medium",
                    isCurrent ? "text-white" : isCompleted ? "text-zinc-300" : "text-zinc-500"
                  )}
                  animate={{ opacity: isCurrent ? 1 : 0.7 }}
                >
                  {step.title}
                </motion.p>
                {step.description && (
                  <p className="text-sm text-zinc-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal stepper (default and minimal)
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.button
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={cn(
                  "rounded-full flex items-center justify-center font-medium border-2 transition-all",
                  variant === "minimal" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm",
                  isCompleted
                    ? "bg-violet-500 border-violet-500 text-white"
                    : isCurrent
                      ? "bg-transparent border-violet-500 text-violet-400"
                      : "bg-transparent border-zinc-700 text-zinc-500"
                )}
                whileHover={onStepClick ? { scale: 1.1 } : undefined}
                whileTap={onStepClick ? { scale: 0.95 } : undefined}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon || index + 1
                )}
              </motion.button>

              {variant !== "minimal" && (
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-white" : isCompleted ? "text-zinc-300" : "text-zinc-500"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-zinc-700 relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-violet-500"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
