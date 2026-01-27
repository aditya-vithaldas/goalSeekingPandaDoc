"use client";

import { Competitor } from "@/types";
import { Card, Badge, RiskBadge, Progress, CircularProgress } from "@/components/ui";
import { competitors as mockCompetitors } from "@/data/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Zap,
} from "lucide-react";

interface CompetitorAnalysisProps {
  estimatedValue?: number;
}

export function CompetitorAnalysis({ estimatedValue = 500000 }: CompetitorAnalysisProps) {
  const competitors = mockCompetitors;

  // Calculate win probability based on competitors
  const avgCompetitorWinRate =
    competitors.reduce((sum, c) => sum + c.winHistory, 0) / competitors.length;
  const ourWinProbability = Math.round(100 - avgCompetitorWinRate + 15); // Add slight advantage

  // Sort by threat level
  const sortedCompetitors = [...competitors].sort((a, b) => {
    const threatOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return threatOrder[a.threatLevel] - threatOrder[b.threatLevel];
  });

  const getThreatColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-accent-red bg-accent-red/10";
      case "medium":
        return "text-amber-600 bg-accent-yellow/10";
      case "low":
        return "text-accent-green bg-accent-green/10";
      default:
        return "text-slate-500 bg-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Win Probability Header */}
      <Card className="bg-gradient-to-br from-brand-50 to-accent-purple/5 border-brand-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-brand-600" />
              <h3 className="text-xl font-bold text-slate-900">Competition Analysis</h3>
            </div>
            <p className="text-slate-600">
              Analyzing {competitors.length} known competitors for this opportunity
            </p>
          </div>
          <div className="text-center">
            <CircularProgress
              value={ourWinProbability}
              size={100}
              strokeWidth={8}
              variant={ourWinProbability >= 60 ? "success" : ourWinProbability >= 40 ? "warning" : "danger"}
            />
            <p className="text-sm font-medium text-slate-600 mt-2">Win Probability</p>
          </div>
        </div>
      </Card>

      {/* Market Position */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg">
              <Target className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Market Position</p>
              <p className="text-xl font-bold text-slate-900">Top 3</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-green/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Our Bid Range</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(estimatedValue * 0.95)} - {formatCurrency(estimatedValue * 1.05)}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-purple/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-accent-purple" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Price Position</p>
              <p className="text-xl font-bold text-slate-900">Competitive</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Competitor Cards */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900">Known Competitors</h4>
        {sortedCompetitors.map((competitor, index) => (
          <Card key={competitor.id} className="relative overflow-hidden">
            {/* Rank badge */}
            <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 transform rotate-45 translate-x-4 -translate-y-8" />
              <span className="absolute top-2 right-3 text-lg font-bold text-slate-400">
                #{index + 1}
              </span>
            </div>

            <div className="flex items-start gap-6">
              {/* Company info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center text-slate-600 font-bold">
                    {competitor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{competitor.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          getThreatColor(competitor.threatLevel)
                        )}
                      >
                        {competitor.threatLevel.charAt(0).toUpperCase() + competitor.threatLevel.slice(1)} Threat
                      </span>
                      {competitor.bidAmount && (
                        <span className="text-sm text-slate-500">
                          Est. bid: {formatCurrency(competitor.bidAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Win history bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500">Historical Win Rate</span>
                    <span className="font-semibold text-slate-700">{competitor.winHistory}%</span>
                  </div>
                  <Progress
                    value={competitor.winHistory}
                    variant={competitor.winHistory > 40 ? "danger" : competitor.winHistory > 25 ? "warning" : "success"}
                    size="sm"
                  />
                </div>

                {/* Strengths and weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-accent-red" />
                      Their Strengths
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {competitor.strengthAreas.map((strength, i) => (
                        <Badge key={i} variant="danger" size="sm">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-accent-green" />
                      Their Weaknesses
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {competitor.weaknessAreas.map((weakness, i) => (
                        <Badge key={i} variant="success" size="sm">
                          {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Strategic Recommendations */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold text-slate-900">Competitive Strategy Recommendations</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-brand-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Emphasize Quality & Reliability</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Competitors show weakness in quality. Highlight your track record and case studies.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-accent-green/5 rounded-xl">
            <Target className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Competitive Pricing Opportunity</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Your bid is within range. Consider value-add services to differentiate at similar price point.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-accent-yellow/5 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Watch for TrueNorth Consulting</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Strong executive relationships. Consider engaging senior stakeholders early in the process.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
