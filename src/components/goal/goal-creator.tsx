"use client";

import { useState } from "react";
import { Card, Button, Input, Textarea, Badge } from "@/components/ui";
import { contractTypeInfo } from "@/data/mock-data";
import { ContractType } from "@/types";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  ArrowRight,
  Shield,
  Briefcase,
  Building,
  Handshake,
  Key,
  UserCheck,
  Users,
  Package,
  Edit,
  Sparkles,
  Target,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Building: <Building className="w-6 h-6" />,
  Handshake: <Handshake className="w-6 h-6" />,
  Key: <Key className="w-6 h-6" />,
  UserCheck: <UserCheck className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  Edit: <Edit className="w-6 h-6" />,
};

interface GoalCreatorProps {
  companyName: string;
  onCreateGoal: (title: string, contractType: ContractType, proposalText?: string) => void;
}

export function GoalCreator({ companyName, onCreateGoal }: GoalCreatorProps) {
  const [step, setStep] = useState<"type" | "details">("type");
  const [selectedType, setSelectedType] = useState<ContractType | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [inputMode, setInputMode] = useState<"title" | "proposal">("title");

  const contractTypes = Object.entries(contractTypeInfo) as [
    ContractType,
    (typeof contractTypeInfo)[ContractType]
  ][];

  // Common contract types to highlight
  const commonTypes: ContractType[] = ["nda", "service_agreement", "sow", "master_service_agreement"];
  const otherTypes = contractTypes.filter(([type]) => !commonTypes.includes(type));

  const handleContinue = () => {
    if (selectedType) {
      if (step === "type") {
        setStep("details");
      } else if (goalTitle || proposalText) {
        onCreateGoal(goalTitle || `New ${contractTypeInfo[selectedType].label}`, selectedType, proposalText || undefined);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className={cn(
          "flex items-center gap-2",
          step === "type" ? "text-brand-600" : "text-slate-400"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
            step === "type" ? "bg-brand-600 text-white" : "bg-slate-100"
          )}>
            1
          </div>
          <span className="font-medium">Contract Type</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-200" />
        <div className={cn(
          "flex items-center gap-2",
          step === "details" ? "text-brand-600" : "text-slate-400"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
            step === "details" ? "bg-brand-600 text-white" : "bg-slate-100"
          )}>
            2
          </div>
          <span className="font-medium">Goal Details</span>
        </div>
      </div>

      {step === "type" && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <Badge variant="info" className="mb-4">
              <Target className="w-4 h-4" />
              Creating for {companyName}
            </Badge>
            <h2 className="text-display-sm font-bold text-slate-900 mb-2">
              What type of contract do you need?
            </h2>
            <p className="text-lg text-slate-500">
              Select the contract type that best matches your goal
            </p>
          </div>

          {/* Common types - larger cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {commonTypes.map((type) => {
              const info = contractTypeInfo[type];
              const isSelected = selectedType === type;
              return (
                <Card
                  key={type}
                  interactive
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "relative overflow-hidden",
                    isSelected && "ring-2 ring-brand-500 border-brand-500 bg-brand-50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      isSelected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {iconMap[info.icon]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900">{info.label}</h3>
                      <p className="text-sm text-slate-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Other types - smaller cards */}
          <div className="grid grid-cols-3 gap-3">
            {otherTypes.map(([type, info]) => {
              const isSelected = selectedType === type;
              return (
                <Card
                  key={type}
                  interactive
                  padding="sm"
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    isSelected && "ring-2 ring-brand-500 border-brand-500 bg-brand-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {iconMap[info.icon]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{info.label}</h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {step === "details" && selectedType && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-xl mb-4">
              <div className="p-1.5 bg-brand-600 rounded-lg text-white">
                {iconMap[contractTypeInfo[selectedType].icon]}
              </div>
              <span className="font-semibold text-brand-700">
                {contractTypeInfo[selectedType].label}
              </span>
            </div>
            <h2 className="text-display-sm font-bold text-slate-900 mb-2">
              Define your goal
            </h2>
            <p className="text-lg text-slate-500">
              Tell us what you want to achieve, or upload a proposal
            </p>
          </div>

          {/* Input mode toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant={inputMode === "title" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setInputMode("title")}
            >
              <Edit className="w-4 h-4" />
              Write a goal
            </Button>
            <Button
              variant={inputMode === "proposal" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setInputMode("proposal")}
            >
              <Upload className="w-4 h-4" />
              Paste proposal
            </Button>
          </div>

          <Card className="max-w-2xl mx-auto">
            {inputMode === "title" ? (
              <div>
                <Input
                  label="Goal Statement"
                  placeholder="e.g., Establish confidentiality agreement for joint product development"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="text-lg py-4"
                />
                <p className="text-sm text-slate-500 mt-3">
                  Describe your objective in one sentence. This will guide the contract creation process.
                </p>
              </div>
            ) : (
              <div>
                <Textarea
                  label="Paste Proposal or RFP"
                  placeholder="Paste the proposal, RFP, or any relevant document text here..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  rows={8}
                />
                <div className="flex items-start gap-3 mt-4 p-4 bg-brand-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-900">
                      AI will analyze your proposal
                    </p>
                    <p className="text-sm text-brand-700 mt-1">
                      We&apos;ll extract key requirements, identify risks, and suggest appropriate contract terms based on the content.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-8">
        {step === "details" ? (
          <Button variant="secondary" onClick={() => setStep("type")}>
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button
          onClick={handleContinue}
          disabled={!selectedType || (step === "details" && !goalTitle && !proposalText)}
        >
          {step === "type" ? "Continue" : "Generate Action Items"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
