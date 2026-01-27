"use client";

import { useState } from "react";
import { Reviewer } from "@/types";
import { suggestedReviewers } from "@/data/mock-data";
import { Card, Button, Badge, Avatar, SearchInput } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Users,
  Plus,
  GripVertical,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Send,
  Mail,
  Shield,
  Scale,
  DollarSign,
  Settings,
  Briefcase,
  UserCheck,
  Info,
  Sparkles,
} from "lucide-react";

const roleIcons: Record<string, React.ReactNode> = {
  legal: <Scale className="w-4 h-4" />,
  finance: <DollarSign className="w-4 h-4" />,
  executive: <Briefcase className="w-4 h-4" />,
  operations: <Settings className="w-4 h-4" />,
  compliance: <Shield className="w-4 h-4" />,
};

const roleColors: Record<string, string> = {
  legal: "bg-accent-purple/10 text-accent-purple",
  finance: "bg-accent-green/10 text-accent-green",
  executive: "bg-brand-100 text-brand-700",
  operations: "bg-accent-orange/10 text-accent-orange",
  compliance: "bg-accent-yellow/10 text-amber-600",
};

interface ReviewWorkflowProps {
  onSubmit: (reviewers: Reviewer[]) => void;
}

export function ReviewWorkflow({ onSubmit }: ReviewWorkflowProps) {
  const [selectedReviewers, setSelectedReviewers] = useState<Reviewer[]>(
    suggestedReviewers.slice(0, 3)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddReviewer, setShowAddReviewer] = useState(false);

  const availableReviewers = suggestedReviewers.filter(
    (r) => !selectedReviewers.find((sr) => sr.id === r.id)
  );

  const filteredReviewers = availableReviewers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddReviewer = (reviewer: Reviewer) => {
    setSelectedReviewers([
      ...selectedReviewers,
      { ...reviewer, priority: selectedReviewers.length + 1 },
    ]);
    setShowAddReviewer(false);
    setSearchQuery("");
  };

  const handleRemoveReviewer = (reviewerId: string) => {
    setSelectedReviewers((prev) =>
      prev
        .filter((r) => r.id !== reviewerId)
        .map((r, index) => ({ ...r, priority: index + 1 }))
    );
  };

  const handleReorderReviewers = (fromIndex: number, toIndex: number) => {
    const newReviewers = [...selectedReviewers];
    const [removed] = newReviewers.splice(fromIndex, 1);
    newReviewers.splice(toIndex, 0, removed);
    setSelectedReviewers(
      newReviewers.map((r, index) => ({ ...r, priority: index + 1 }))
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-display-sm font-bold text-slate-900 mb-2">
          Review Workflow
        </h2>
        <p className="text-lg text-slate-500">
          Assign reviewers and set up the approval workflow for this contract
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Selected Reviewers */}
        <div className="col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Assigned Reviewers</h3>
                <p className="text-sm text-slate-500">
                  Drag to reorder review priority
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowAddReviewer(true)}>
                <Plus className="w-4 h-4" />
                Add Reviewer
              </Button>
            </div>

            {selectedReviewers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No reviewers assigned yet</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setShowAddReviewer(true)}
                >
                  Add Reviewer
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedReviewers.map((reviewer, index) => (
                  <div
                    key={reviewer.id}
                    className="group flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 cursor-grab">
                      <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                      <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <Avatar name={reviewer.name} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">
                          {reviewer.name}
                        </h4>
                        <Badge
                          className={cn("capitalize", roleColors[reviewer.role])}
                          size="sm"
                        >
                          {roleIcons[reviewer.role]}
                          {reviewer.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{reviewer.email}</p>
                      <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200">
                        <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-600">{reviewer.reason}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveReviewer(reviewer.id)}
                    >
                      <X className="w-4 h-4 text-slate-400 hover:text-accent-red" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Workflow Timeline */}
          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Review Timeline</h3>
            <div className="relative">
              {selectedReviewers.map((reviewer, index) => (
                <div key={reviewer.id} className="flex items-start gap-4 pb-6 last:pb-0">
                  {/* Timeline line */}
                  {index < selectedReviewers.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-16 bg-slate-200" />
                  )}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                      index === 0
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {index === 0 ? (
                      <Send className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {index === 0 ? "Send for review" : `Awaiting ${reviewer.name}`}
                    </p>
                    <p className="text-sm text-slate-500">
                      {index === 0
                        ? `${reviewer.name} will receive the document first`
                        : `Will receive after Step ${index} approval`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Suggestions */}
          <Card className="bg-gradient-to-br from-accent-purple/5 to-brand-50 border-accent-purple/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent-purple" />
              <h3 className="font-bold text-slate-900">AI Recommendations</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Based on the contract type and company profile, we recommend the
              following reviewers:
            </p>
            <div className="space-y-2">
              {suggestedReviewers.slice(0, 3).map((reviewer) => {
                const isAdded = selectedReviewers.find((r) => r.id === reviewer.id);
                return (
                  <div
                    key={reviewer.id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={reviewer.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {reviewer.name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {reviewer.role}
                        </p>
                      </div>
                    </div>
                    {isAdded ? (
                      <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddReviewer(reviewer)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Review Stats */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Review Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total reviewers</span>
                <span className="font-semibold text-slate-900">
                  {selectedReviewers.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Review stages</span>
                <span className="font-semibold text-slate-900">
                  {selectedReviewers.length} sequential
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Est. completion</span>
                <span className="font-semibold text-slate-900">
                  {selectedReviewers.length * 2} - {selectedReviewers.length * 3} days
                </span>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-600" />
                <span className="text-sm text-slate-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-600" />
                <span className="text-sm text-slate-700">Slack notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-600" />
                <span className="text-sm text-slate-700">Daily digest</span>
              </label>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Reviewer Modal */}
      {showAddReviewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAddReviewer(false)}
          />
          <Card className="relative w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Add Reviewer</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddReviewer(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SearchInput
              placeholder="Search by name or role..."
              value={searchQuery}
              onSearch={setSearchQuery}
              className="mb-4"
            />
            <div className="space-y-2 max-h-64 overflow-auto">
              {filteredReviewers.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No available reviewers found
                </p>
              ) : (
                filteredReviewers.map((reviewer) => (
                  <button
                    key={reviewer.id}
                    onClick={() => handleAddReviewer(reviewer)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                  >
                    <Avatar name={reviewer.name} />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{reviewer.name}</p>
                      <p className="text-sm text-slate-500">{reviewer.email}</p>
                    </div>
                    <Badge className={cn("capitalize", roleColors[reviewer.role])} size="sm">
                      {reviewer.role}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Submit button */}
      <div className="flex justify-end mt-8">
        <Button onClick={() => onSubmit(selectedReviewers)} disabled={selectedReviewers.length === 0}>
          Send for Review
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
