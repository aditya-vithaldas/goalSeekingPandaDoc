"use client";

import { Company, RiskLevel } from "@/types";
import { Card, Badge, RiskBadge, Progress, CircularProgress, MiniStat } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  BarChart3,
  Target,
} from "lucide-react";

interface RiskAnalysisProps {
  company: Company;
}

export function RiskAnalysis({ company }: RiskAnalysisProps) {
  const getRiskLevel = (score: number): RiskLevel => {
    if (score <= 25) return "low";
    if (score <= 50) return "medium";
    if (score <= 75) return "high";
    return "critical";
  };

  const paymentOnTimeRate = Math.round(
    (company.paymentHistory.onTimePayments /
      (company.paymentHistory.onTimePayments + company.paymentHistory.latePayments)) *
      100
  );

  const avgPerformance =
    company.performanceHistory.length > 0
      ? Math.round(
          company.performanceHistory.reduce((sum, p) => sum + p.performanceScore, 0) /
            company.performanceHistory.length
        )
      : 0;

  const riskFactors = [
    {
      label: "Payment History",
      value: paymentOnTimeRate,
      status: paymentOnTimeRate >= 90 ? "good" : paymentOnTimeRate >= 75 ? "warning" : "danger",
      description: `${paymentOnTimeRate}% on-time payment rate`,
    },
    {
      label: "Performance Track Record",
      value: avgPerformance,
      status: avgPerformance >= 85 ? "good" : avgPerformance >= 70 ? "warning" : "danger",
      description: `${avgPerformance}% average performance score`,
    },
    {
      label: "Payment Speed",
      value: company.paymentHistory.averagePaymentDays <= 30 ? 90 : company.paymentHistory.averagePaymentDays <= 45 ? 70 : 50,
      status: company.paymentHistory.averagePaymentDays <= 30 ? "good" : company.paymentHistory.averagePaymentDays <= 45 ? "warning" : "danger",
      description: `${company.paymentHistory.averagePaymentDays} days average`,
    },
    {
      label: "Relationship Depth",
      value: Math.min(company.totalContracts * 3, 100),
      status: company.totalContracts >= 20 ? "good" : company.totalContracts >= 10 ? "warning" : "danger",
      description: `${company.totalContracts} total contracts`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Risk Profile</h3>
            <p className="text-slate-500 mt-1">
              Comprehensive risk assessment for {company.name}
            </p>
          </div>
          <RiskBadge level={getRiskLevel(company.riskScore)} />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Risk score gauge */}
          <div className="flex flex-col items-center justify-center">
            <CircularProgress
              value={100 - company.riskScore}
              size={160}
              strokeWidth={12}
              variant={getRiskLevel(company.riskScore) === "low" ? "success" : getRiskLevel(company.riskScore) === "medium" ? "warning" : "danger"}
            />
            <p className="text-sm text-slate-500 mt-4">Overall Health Score</p>
          </div>

          {/* Risk factors */}
          <div className="col-span-2 space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {factor.status === "good" && (
                      <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    )}
                    {factor.status === "warning" && (
                      <AlertTriangle className="w-4 h-4 text-accent-yellow" />
                    )}
                    {factor.status === "danger" && (
                      <XCircle className="w-4 h-4 text-accent-red" />
                    )}
                    <span className="font-medium text-slate-700">{factor.label}</span>
                  </div>
                  <span className="text-sm text-slate-500">{factor.description}</span>
                </div>
                <Progress
                  value={factor.value}
                  variant={factor.status === "good" ? "success" : factor.status === "warning" ? "warning" : "danger"}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-4 gap-4">
        <MiniStat
          label="Total Revenue"
          value={`$${(company.totalRevenue / 1000000).toFixed(2)}M`}
          color="info"
        />
        <MiniStat
          label="Outstanding"
          value={`$${(company.paymentHistory.outstanding / 1000).toFixed(0)}K`}
          color={company.paymentHistory.outstanding > 100000 ? "warning" : "success"}
        />
        <MiniStat
          label="Active Contracts"
          value={company.activeContracts}
          color="success"
        />
        <MiniStat
          label="Avg Payment"
          value={`${company.paymentHistory.averagePaymentDays} days`}
          color={company.paymentHistory.averagePaymentDays > 45 ? "warning" : "default"}
        />
      </div>

      {/* Recommendations */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold text-slate-900">Risk-Based Recommendations</h3>
        </div>
        <div className="space-y-3">
          {company.riskScore <= 30 && (
            <div className="flex items-start gap-3 p-4 bg-accent-green/5 rounded-xl border border-accent-green/20">
              <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Low Risk - Favorable Terms Recommended</p>
                <p className="text-sm text-slate-600 mt-1">
                  This company has an excellent track record. Consider offering competitive payment terms (Net 45-60) and reduced deposit requirements to strengthen the relationship.
                </p>
              </div>
            </div>
          )}
          {company.riskScore > 30 && company.riskScore <= 50 && (
            <div className="flex items-start gap-3 p-4 bg-accent-yellow/5 rounded-xl border border-accent-yellow/20">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Medium Risk - Standard Terms Recommended</p>
                <p className="text-sm text-slate-600 mt-1">
                  Maintain standard payment terms (Net 30) and include milestone-based payments for larger contracts. Consider requesting a partial deposit for new engagements.
                </p>
              </div>
            </div>
          )}
          {company.riskScore > 50 && (
            <div className="flex items-start gap-3 p-4 bg-accent-red/5 rounded-xl border border-accent-red/20">
              <Shield className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Elevated Risk - Protective Terms Recommended</p>
                <p className="text-sm text-slate-600 mt-1">
                  Consider shorter payment terms (Net 15), upfront deposits (25-50%), and stronger termination clauses. Include payment guarantees or escrow arrangements for large projects.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
