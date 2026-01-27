"use client";

import { useState } from "react";
import { ActionItem, ActionItemOption } from "@/types";
import { Card, Button, Badge, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  HelpCircle,
  BarChart3,
  Eye,
  Zap,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  question: <HelpCircle className="w-5 h-5" />,
  analysis: <BarChart3 className="w-5 h-5" />,
  review: <Eye className="w-5 h-5" />,
  decision: <Zap className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
};

interface ActionItemsProps {
  items: ActionItem[];
  onComplete: (id: string, response?: string | Record<string, unknown>) => void;
  onFinish: () => void;
}

export function ActionItems({ items, onComplete, onFinish }: ActionItemsProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const completedCount = items.filter((item) => item.status === "completed").length;
  const progressPercentage = (completedCount / items.length) * 100;

  const currentItem = items[currentItemIndex];
  const isCurrentCompleted = currentItem?.status === "completed";

  const handleSelectOption = (itemId: string, optionValue: string) => {
    setSelectedOptions((prev) => ({ ...prev, [itemId]: optionValue }));
  };

  const handleCompleteItem = () => {
    if (currentItem) {
      const response = selectedOptions[currentItem.id] || undefined;
      onComplete(currentItem.id, response);

      // Move to next incomplete item
      const nextIncompleteIndex = items.findIndex(
        (item, index) => index > currentItemIndex && item.status !== "completed"
      );
      if (nextIncompleteIndex !== -1) {
        setCurrentItemIndex(nextIncompleteIndex);
      } else if (currentItemIndex < items.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      }
    }
  };

  const allCompleted = completedCount === items.length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-display-sm font-bold text-slate-900">
            Action Items
          </h2>
          <p className="text-lg text-slate-500 mt-1">
            Complete these items to create an optimized contract
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 mb-2">
            {completedCount} of {items.length} completed
          </p>
          <Progress value={progressPercentage} variant="gradient" className="w-48" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Items list (left sidebar) */}
        <div className="col-span-1">
          <Card padding="sm" className="sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4 px-2">All Items</h3>
            <div className="space-y-1">
              {items.map((item, index) => {
                const isActive = index === currentItemIndex;
                const isCompleted = item.status === "completed";
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentItemIndex(index)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                      isActive && "bg-brand-50 border border-brand-200",
                      !isActive && "hover:bg-slate-50"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
                    ) : (
                      <Circle
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive ? "text-brand-500" : "text-slate-300"
                        )}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isCompleted && "text-slate-500 line-through",
                          isActive && !isCompleted && "text-brand-700",
                          !isActive && !isCompleted && "text-slate-700"
                        )}
                      >
                        {item.title}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-brand-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Current item detail (main area) */}
        <div className="col-span-2">
          {currentItem && (
            <Card className="animate-fade-in">
              {/* Item header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      isCurrentCompleted
                        ? "bg-accent-green/10 text-accent-green"
                        : "bg-brand-50 text-brand-600"
                    )}
                  >
                    {typeIcons[currentItem.type]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          currentItem.type === "question"
                            ? "info"
                            : currentItem.type === "analysis"
                            ? "purple"
                            : currentItem.type === "decision"
                            ? "warning"
                            : "default"
                        }
                      >
                        {currentItem.type}
                      </Badge>
                      {currentItem.estimatedTime && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {currentItem.estimatedTime}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {currentItem.title}
                    </h3>
                  </div>
                </div>
                {isCurrentCompleted && (
                  <Badge variant="success">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </Badge>
                )}
              </div>

              {/* Item description */}
              <p className="text-slate-600 mb-6">{currentItem.description}</p>

              {/* Options (if available) */}
              {currentItem.options && currentItem.options.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-slate-700">
                    Select an option:
                  </p>
                  <div className="grid gap-3">
                    {currentItem.options.map((option) => {
                      const isSelected =
                        selectedOptions[currentItem.id] === option.value?.toString() ||
                        (isCurrentCompleted && currentItem.response === option.value);
                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            !isCurrentCompleted &&
                            handleSelectOption(currentItem.id, option.value?.toString() || "")
                          }
                          disabled={isCurrentCompleted}
                          className={cn(
                            "w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                            isSelected
                              ? "border-brand-500 bg-brand-50"
                              : "border-slate-200 hover:border-slate-300",
                            isCurrentCompleted && "opacity-75 cursor-not-allowed"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                              isSelected
                                ? "border-brand-500 bg-brand-500"
                                : "border-slate-300"
                            )}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">
                                {option.label}
                              </span>
                              {option.recommended && (
                                <Badge variant="success" size="sm">
                                  <Sparkles className="w-3 h-3" />
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            {option.description && (
                              <p className="text-sm text-slate-500 mt-1">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Analysis result preview (for analysis type) */}
              {currentItem.type === "analysis" && !isCurrentCompleted && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-brand-600" />
                    <span className="font-medium text-slate-900">
                      Analysis Preview
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    This analysis will review historical data and generate
                    insights based on past performance and patterns.
                  </p>
                </div>
              )}

              {/* Action button */}
              {!isCurrentCompleted && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleCompleteItem}
                    disabled={
                      currentItem.options &&
                      currentItem.options.length > 0 &&
                      !selectedOptions[currentItem.id]
                    }
                  >
                    {currentItem.type === "analysis"
                      ? "Run Analysis"
                      : currentItem.type === "review"
                      ? "Mark as Reviewed"
                      : "Complete"}
                    <CheckCircle2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* All completed message */}
          {allCompleted && (
            <Card className="mt-6 bg-gradient-to-br from-accent-green/5 to-brand-50 border-accent-green/20">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent-green" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  All Action Items Completed!
                </h3>
                <p className="text-slate-600 mb-6">
                  Great job! You&apos;re ready to proceed to template selection and
                  document creation.
                </p>
                <Button onClick={onFinish}>
                  Continue to Template Selection
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
