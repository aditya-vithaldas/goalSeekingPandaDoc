"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { Search } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 text-base text-slate-900 placeholder-slate-400 bg-white",
            "border-2 border-slate-200 rounded-xl transition-all duration-200",
            "focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
            error && "border-accent-red focus:border-accent-red focus:ring-accent-red/10",
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-accent-red">{error}</p>}
        {hint && !error && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={ref}
          type="search"
          className={cn(
            "w-full pl-12 pr-4 py-3 text-base text-slate-900 placeholder-slate-400 bg-white",
            "border-2 border-slate-200 rounded-xl transition-all duration-200",
            "focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
            className
          )}
          onChange={(e) => onSearch?.(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 text-base text-slate-900 placeholder-slate-400 bg-white",
            "border-2 border-slate-200 rounded-xl transition-all duration-200 resize-none",
            "focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
            error && "border-accent-red focus:border-accent-red focus:ring-accent-red/10",
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-accent-red">{error}</p>}
        {hint && !error && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, SearchInput, Textarea };
