"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "compact" | "large";
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, changeLabel, icon, variant = "default", ...props }, ref) => {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    const variants = {
      default: "p-6",
      compact: "p-4",
      large: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-2xl shadow-card border border-slate-100",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className={cn(
              "font-bold text-slate-900 mt-1",
              variant === "large" ? "text-4xl" : variant === "compact" ? "text-2xl" : "text-3xl"
            )}>
              {value}
            </p>
            {(change !== undefined || changeLabel) && (
              <div className="flex items-center gap-1.5 mt-2">
                {change !== undefined && (
                  <>
                    {isPositive && <TrendingUp className="w-4 h-4 text-accent-green" />}
                    {isNegative && <TrendingDown className="w-4 h-4 text-accent-red" />}
                    {!isPositive && !isNegative && <Minus className="w-4 h-4 text-slate-400" />}
                    <span className={cn(
                      "text-sm font-semibold",
                      isPositive && "text-accent-green",
                      isNegative && "text-accent-red",
                      !isPositive && !isNegative && "text-slate-500"
                    )}>
                      {isPositive && "+"}{change}%
                    </span>
                  </>
                )}
                {changeLabel && (
                  <span className="text-sm text-slate-500">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export interface StatGridProps extends HTMLAttributes<HTMLDivElement> {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
}

const StatGrid = forwardRef<HTMLDivElement, StatGridProps>(
  ({ className, stats, columns = 4, ...props }, ref) => {
    const columnClasses = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
      <div
        ref={ref}
        className={cn("grid gap-4", columnClasses[columns], className)}
        {...props}
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    );
  }
);

StatGrid.displayName = "StatGrid";

export interface MiniStatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  color?: "default" | "success" | "warning" | "danger" | "info";
}

const MiniStat = forwardRef<HTMLDivElement, MiniStatProps>(
  ({ className, label, value, color = "default", ...props }, ref) => {
    const colors = {
      default: "bg-slate-50 text-slate-700",
      success: "bg-accent-green/5 text-accent-green",
      warning: "bg-accent-yellow/5 text-amber-600",
      danger: "bg-accent-red/5 text-accent-red",
      info: "bg-brand-50 text-brand-600",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "px-4 py-3 rounded-xl",
          colors[color],
          className
        )}
        {...props}
      >
        <p className="text-xs font-medium opacity-75">{label}</p>
        <p className="text-lg font-bold mt-0.5">{value}</p>
      </div>
    );
  }
);

MiniStat.displayName = "MiniStat";

export { StatCard, StatGrid, MiniStat };
