"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = "default", size = "md", showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: "bg-brand-500",
      success: "bg-accent-green",
      warning: "bg-accent-yellow",
      danger: "bg-accent-red",
      gradient: "bg-gradient-to-r from-brand-500 to-accent-purple",
    };

    const sizes = {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            "w-full bg-slate-100 rounded-full overflow-hidden",
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-slate-500">{value} / {max}</span>
            <span className="font-medium text-slate-700">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ className, value, max = 100, size = 120, strokeWidth = 8, variant = "default", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
      default: "text-brand-500",
      success: "text-accent-green",
      warning: "text-accent-yellow",
      danger: "text-accent-red",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={cn("transition-all duration-500 ease-out", colors[variant])}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{Math.round(percentage)}</span>
          <span className="text-xs text-slate-500">%</span>
        </div>
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export interface StepProgressProps extends HTMLAttributes<HTMLDivElement> {
  steps: { label: string; description?: string }[];
  currentStep: number;
  variant?: "horizontal" | "vertical";
}

const StepProgress = forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, steps, currentStep, variant = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          variant === "horizontal" ? "items-center gap-4" : "flex-col gap-6",
          className
        )}
        {...props}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3",
              variant === "horizontal" && index < steps.length - 1 && "flex-1"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                index < currentStep && "bg-accent-green text-white",
                index === currentStep && "bg-brand-600 text-white shadow-lg shadow-brand-500/30",
                index > currentStep && "bg-slate-100 text-slate-400"
              )}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-shrink-0">
              <p className={cn(
                "font-medium",
                index <= currentStep ? "text-slate-900" : "text-slate-400"
              )}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-sm text-slate-500">{step.description}</p>
              )}
            </div>
            {variant === "horizontal" && index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-200 mx-4">
                <div
                  className="h-full bg-brand-500 transition-all duration-300"
                  style={{ width: index < currentStep ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

StepProgress.displayName = "StepProgress";

export { Progress, CircularProgress, StepProgress };
