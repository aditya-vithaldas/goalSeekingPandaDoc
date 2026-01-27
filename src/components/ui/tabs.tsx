"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, HTMLAttributes, forwardRef, ReactNode } from "react";

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within a Tabs provider");
  return context;
};

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value: controlledValue, onChange: controlledOnChange, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = controlledValue ?? uncontrolledValue;
    const onChange = controlledOnChange ?? setUncontrolledValue;

    return (
      <TabsContext.Provider value={{ value, onChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "pills" | "underline" | "buttons";
}

const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, variant = "pills", children, ...props }, ref) => {
    const variants = {
      pills: "flex items-center gap-1 p-1 bg-slate-100 rounded-xl",
      underline: "flex items-center gap-6 border-b border-slate-200",
      buttons: "flex items-center gap-2",
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        role="tablist"
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabList.displayName = "TabList";

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: ReactNode;
  count?: number;
  variant?: "pills" | "underline" | "buttons";
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ className, value, icon, count, variant = "pills", children, ...props }, ref) => {
    const { value: selectedValue, onChange } = useTabsContext();
    const isSelected = selectedValue === value;

    const baseStyles = "flex items-center gap-2 font-medium transition-all duration-200";

    const variants = {
      pills: cn(
        "px-4 py-2 text-sm rounded-lg",
        isSelected
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
      ),
      underline: cn(
        "pb-3 text-sm border-b-2 -mb-px",
        isSelected
          ? "border-brand-600 text-brand-600"
          : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
      ),
      buttons: cn(
        "px-4 py-2 text-sm rounded-xl border-2",
        isSelected
          ? "border-brand-600 bg-brand-50 text-brand-700"
          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      ),
    };

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isSelected}
        onClick={() => onChange(value)}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {icon}
        {children}
        {count !== undefined && (
          <span className={cn(
            "px-2 py-0.5 text-xs font-semibold rounded-full",
            isSelected
              ? "bg-brand-100 text-brand-700"
              : "bg-slate-200 text-slate-600"
          )}>
            {count}
          </span>
        )}
      </button>
    );
  }
);
Tab.displayName = "Tab";

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();

    if (selectedValue !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("animate-fade-in", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = "TabPanel";

export { Tabs, TabList, Tab, TabPanel };
