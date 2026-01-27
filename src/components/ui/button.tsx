"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0",
      secondary:
        "text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200",
      danger:
        "text-white bg-accent-red hover:bg-red-600 active:bg-red-700 shadow-lg shadow-accent-red/25 hover:shadow-xl hover:shadow-accent-red/30",
      outline:
        "text-brand-600 bg-transparent border-2 border-brand-600 hover:bg-brand-50 active:bg-brand-100",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 rounded-lg",
      md: "text-sm px-5 py-2.5 rounded-xl",
      lg: "text-base px-6 py-3 rounded-xl",
      icon: "w-10 h-10 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
