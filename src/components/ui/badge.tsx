"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";
  size?: "sm" | "md" | "lg";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-700",
      success: "bg-accent-green/10 text-accent-green",
      warning: "bg-accent-yellow/10 text-amber-600",
      danger: "bg-accent-red/10 text-accent-red",
      info: "bg-brand-100 text-brand-700",
      purple: "bg-accent-purple/10 text-accent-purple",
      outline: "bg-transparent border-2 border-slate-200 text-slate-600",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-xs",
      lg: "px-4 py-1.5 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-semibold rounded-full",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export interface RiskBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  level: "low" | "medium" | "high" | "critical";
}

const RiskBadge = forwardRef<HTMLSpanElement, RiskBadgeProps>(
  ({ className, level, ...props }, ref) => {
    const colors = {
      low: "bg-risk-low/10 text-risk-low",
      medium: "bg-risk-medium/10 text-amber-600",
      high: "bg-risk-high/10 text-risk-high",
      critical: "bg-risk-critical/10 text-risk-critical",
    };

    const labels = {
      low: "Low Risk",
      medium: "Medium Risk",
      high: "High Risk",
      critical: "Critical Risk",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold",
          colors[level],
          className
        )}
        {...props}
      >
        <span className={cn("w-2 h-2 rounded-full", {
          "bg-risk-low": level === "low",
          "bg-risk-medium": level === "medium",
          "bg-risk-high": level === "high",
          "bg-risk-critical": level === "critical",
        })} />
        {labels[level]}
      </span>
    );
  }
);

RiskBadge.displayName = "RiskBadge";

export interface LoyaltyBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tier: "new" | "bronze" | "silver" | "gold" | "platinum";
}

const LoyaltyBadge = forwardRef<HTMLSpanElement, LoyaltyBadgeProps>(
  ({ className, tier, ...props }, ref) => {
    const colors = {
      new: "bg-slate-100 text-slate-600",
      bronze: "bg-gradient-to-r from-orange-600/10 to-orange-700/10 text-orange-700",
      silver: "bg-gradient-to-r from-slate-400/10 to-slate-500/10 text-slate-600",
      gold: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600",
      platinum: "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600",
    };

    const icons = {
      new: "🆕",
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "💎",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold capitalize",
          colors[tier],
          className
        )}
        {...props}
      >
        <span>{icons[tier]}</span>
        {tier}
      </span>
    );
  }
);

LoyaltyBadge.displayName = "LoyaltyBadge";

export { Badge, RiskBadge, LoyaltyBadge };
