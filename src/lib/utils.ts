import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-risk-low bg-risk-low/10";
    case "medium":
      return "text-risk-medium bg-risk-medium/10";
    case "high":
      return "text-risk-high bg-risk-high/10";
    case "critical":
      return "text-risk-critical bg-risk-critical/10";
    default:
      return "text-gray-500 bg-gray-100";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "draft":
      return "text-status-draft bg-status-draft/10 border-status-draft/20";
    case "pending":
      return "text-status-pending bg-status-pending/10 border-status-pending/20";
    case "review":
      return "text-status-review bg-status-review/10 border-status-review/20";
    case "approved":
      return "text-status-approved bg-status-approved/10 border-status-approved/20";
    case "rejected":
      return "text-status-rejected bg-status-rejected/10 border-status-rejected/20";
    default:
      return "text-gray-500 bg-gray-100 border-gray-200";
  }
}

export function getLoyaltyTierColor(tier: string): string {
  switch (tier) {
    case "platinum":
      return "text-purple-600 bg-gradient-to-r from-purple-500/20 to-indigo-500/20";
    case "gold":
      return "text-amber-600 bg-gradient-to-r from-amber-500/20 to-yellow-500/20";
    case "silver":
      return "text-slate-600 bg-gradient-to-r from-slate-400/20 to-slate-500/20";
    case "bronze":
      return "text-orange-700 bg-gradient-to-r from-orange-600/20 to-orange-700/20";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

export function calculateRiskScore(factors: {
  paymentHistory: number;
  performanceHistory: number;
  contractValue: number;
  companySize: string;
  industryRisk: number;
}): number {
  let score = 50; // Base score

  // Payment history (0-100, higher is better)
  score -= (100 - factors.paymentHistory) * 0.25;

  // Performance history (0-100, higher is better)
  score -= (100 - factors.performanceHistory) * 0.2;

  // Contract value risk
  if (factors.contractValue > 1000000) score += 15;
  else if (factors.contractValue > 500000) score += 10;
  else if (factors.contractValue > 100000) score += 5;

  // Company size (larger tends to be more stable)
  if (factors.companySize === "enterprise") score -= 10;
  else if (factors.companySize === "medium") score -= 5;
  else if (factors.companySize === "startup") score += 10;

  // Industry risk factor
  score += factors.industryRisk * 0.15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
