"use client";

import { Company } from "@/types";
import { Card, Badge, LoyaltyBadge, RiskBadge, Avatar } from "@/components/ui";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import {
  Building2,
  MapPin,
  FileText,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
  selected?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export function CompanyCard({
  company,
  onClick,
  selected = false,
  variant = "default",
}: CompanyCardProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 25) return "low";
    if (score <= 50) return "medium";
    if (score <= 75) return "high";
    return "critical";
  };

  if (variant === "compact") {
    return (
      <Card
        interactive
        onClick={onClick}
        className={cn(
          "group",
          selected && "ring-2 ring-brand-500 border-brand-500"
        )}
        padding="sm"
      >
        <div className="flex items-center gap-4">
          <Avatar name={company.name} size="lg" variant="rounded" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {company.name}
            </h3>
            <p className="text-sm text-slate-500">{company.industry}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card
        interactive
        onClick={onClick}
        className={cn(
          "group overflow-hidden",
          selected && "ring-2 ring-brand-500 border-brand-500"
        )}
        padding="none"
      >
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="absolute bottom-0 left-6 transform translate-y-1/2">
            <Avatar
              name={company.name}
              size="xl"
              variant="rounded"
              className="ring-4 ring-white shadow-lg"
            />
          </div>
        </div>

        <div className="pt-10 pb-6 px-6">
          {/* Company info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {company.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Building2 className="w-4 h-4" />
                <span>{company.industry}</span>
                <span className="text-slate-300">|</span>
                <MapPin className="w-4 h-4" />
                <span>{company.location}</span>
              </div>
            </div>
            <LoyaltyBadge tier={company.loyaltyTier} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <FileText className="w-3.5 h-3.5" />
                Contracts
              </div>
              <p className="text-lg font-bold text-slate-900">
                {company.totalContracts}
              </p>
              <p className="text-xs text-accent-green font-medium">
                {company.activeContracts} active
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                Revenue
              </div>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(company.totalRevenue / 1000)}K
              </p>
              <p className="text-xs text-slate-500">total value</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                Payment
              </div>
              <p className="text-lg font-bold text-slate-900">
                {company.paymentHistory.averagePaymentDays}d
              </p>
              <p className="text-xs text-slate-500">avg. days</p>
            </div>
          </div>

          {/* Risk and payment indicators */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <RiskBadge level={getRiskLevel(company.riskScore)} />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-medium text-slate-600">
                {Math.round(
                  (company.paymentHistory.onTimePayments /
                    (company.paymentHistory.onTimePayments +
                      company.paymentHistory.latePayments)) *
                    100
                )}
                % on-time
              </span>
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      interactive
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden",
        selected && "ring-2 ring-brand-500 border-brand-500"
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar name={company.name} size="lg" variant="rounded" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                <span>{company.industry}</span>
                <span className="text-slate-300">·</span>
                <span>{company.location}</span>
              </div>
            </div>
            <LoyaltyBadge tier={company.loyaltyTier} />
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {company.totalContracts}
                </span>{" "}
                contracts
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {formatCurrency(company.totalRevenue)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <RiskBadge level={getRiskLevel(company.riskScore)} />
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-2 bg-brand-50 rounded-full">
          <ArrowRight className="w-5 h-5 text-brand-600" />
        </div>
      </div>
    </Card>
  );
}
