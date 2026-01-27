"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { companies } from "@/data/mock-data";
import { useContractFlow } from "@/lib/store";
import { Company, ContractTemplate, FlowStep } from "@/types";
import { GoalCreator } from "@/components/goal/goal-creator";
import { ActionItems } from "@/components/contract/action-items";
import { RiskAnalysis } from "@/components/analysis/risk-analysis";
import { CompetitorAnalysis } from "@/components/analysis/competitor-analysis";
import { TemplateSelection } from "@/components/contract/template-selection";
import { DocumentEditor } from "@/components/document/document-editor";
import { ReviewWorkflow } from "@/components/review/review-workflow";
import { Card, Button, Badge, Avatar, StepProgress, Tabs, TabList, Tab, TabPanel } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Target,
  ListChecks,
  BarChart3,
  FileText,
  Users,
  CheckCircle2,
  Zap,
  Home,
} from "lucide-react";

const flowSteps: { key: FlowStep; label: string; icon: React.ReactNode }[] = [
  { key: "goal_creation", label: "Define Goal", icon: <Target className="w-5 h-5" /> },
  { key: "action_items", label: "Action Items", icon: <ListChecks className="w-5 h-5" /> },
  { key: "analysis", label: "Analysis", icon: <BarChart3 className="w-5 h-5" /> },
  { key: "template_selection", label: "Template", icon: <FileText className="w-5 h-5" /> },
  { key: "document_editing", label: "Document", icon: <FileText className="w-5 h-5" /> },
  { key: "review_assignment", label: "Review", icon: <Users className="w-5 h-5" /> },
];

function ContractFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");

  const {
    currentStep,
    setCurrentStep,
    selectedCompany,
    setSelectedCompany,
    goal,
    createGoal,
    actionItems,
    completeActionItem,
    selectedTemplate,
    setSelectedTemplate,
    goToNextStep,
  } = useContractFlow();

  const [company, setCompany] = useState<Company | null>(null);
  const [templateMode, setTemplateMode] = useState<"blank" | "template" | "ai">("template");

  useEffect(() => {
    if (companyId) {
      const foundCompany = companies.find((c) => c.id === companyId);
      if (foundCompany) {
        setCompany(foundCompany);
        setSelectedCompany(foundCompany);
      }
    }
  }, [companyId, setSelectedCompany]);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-12">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Company Selected</h2>
          <p className="text-slate-500 mb-6">Please select a company to start creating a contract.</p>
          <Button onClick={() => router.push("/")}>
            <Home className="w-5 h-5" />
            Go to Company Selection
          </Button>
        </Card>
      </div>
    );
  }

  const currentStepIndex = flowSteps.findIndex((s) => s.key === currentStep);

  const handleGoalCreate = (title: string, contractType: Parameters<typeof createGoal>[1], proposalText?: string) => {
    createGoal(title, contractType, proposalText);
  };

  const handleActionItemComplete = (id: string, response?: string | Record<string, unknown>) => {
    completeActionItem(id, response);
  };

  const handleActionItemsFinish = () => {
    setCurrentStep("analysis");
  };

  const handleTemplateSelect = (template: ContractTemplate | null, mode: "blank" | "template" | "ai") => {
    setSelectedTemplate(template);
    setTemplateMode(mode);
    setCurrentStep("document_editing");
  };

  const handleDocumentContinue = () => {
    setCurrentStep("review_assignment");
  };

  const handleReviewSubmit = () => {
    // In a real app, this would submit the review workflow
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-accent-purple rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900">New Contract</h1>
                  <p className="text-sm text-slate-500">for {company.name}</p>
                </div>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {flowSteps.map((step, index) => (
                <button
                  key={step.key}
                  onClick={() => index <= currentStepIndex && setCurrentStep(step.key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    currentStep === step.key && "bg-brand-50 text-brand-700",
                    index < currentStepIndex && "text-accent-green hover:bg-accent-green/5",
                    index > currentStepIndex && "text-slate-400 cursor-not-allowed"
                  )}
                  disabled={index > currentStepIndex}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                      currentStep === step.key && "bg-brand-600 text-white",
                      index < currentStepIndex && "bg-accent-green text-white",
                      index > currentStepIndex && "bg-slate-100 text-slate-400"
                    )}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{step.label}</span>
                </button>
              ))}
            </div>

            {/* Company info */}
            <div className="flex items-center gap-3">
              <Avatar name={company.name} size="md" variant="rounded" />
              <div className="text-right">
                <p className="font-medium text-slate-900 text-sm">{company.name}</p>
                <p className="text-xs text-slate-500">{company.industry}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentStep === "goal_creation" && (
          <GoalCreator companyName={company.name} onCreateGoal={handleGoalCreate} />
        )}

        {currentStep === "action_items" && (
          <ActionItems
            items={actionItems}
            onComplete={handleActionItemComplete}
            onFinish={handleActionItemsFinish}
          />
        )}

        {currentStep === "analysis" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-display-sm font-bold text-slate-900 mb-2">
                Analysis Dashboard
              </h2>
              <p className="text-lg text-slate-500">
                Review risk profile and competitive landscape
              </p>
            </div>

            <Tabs defaultValue="risk">
              <TabList className="mb-6 justify-center">
                <Tab value="risk" icon={<BarChart3 className="w-4 h-4" />}>
                  Risk Profile
                </Tab>
                <Tab value="competition" icon={<Users className="w-4 h-4" />}>
                  Competition Analysis
                </Tab>
              </TabList>

              <TabPanel value="risk">
                <RiskAnalysis company={company} />
              </TabPanel>

              <TabPanel value="competition">
                <CompetitorAnalysis estimatedValue={goal?.estimatedValue} />
              </TabPanel>
            </Tabs>

            <div className="flex justify-end mt-8">
              <Button onClick={() => setCurrentStep("template_selection")}>
                Continue to Template Selection
              </Button>
            </div>
          </div>
        )}

        {currentStep === "template_selection" && goal && (
          <TemplateSelection
            contractType={goal.contractType}
            onSelectTemplate={handleTemplateSelect}
          />
        )}

        {currentStep === "document_editing" && (
          <DocumentEditor
            template={selectedTemplate}
            mode={templateMode}
            onContinue={handleDocumentContinue}
          />
        )}

        {currentStep === "review_assignment" && (
          <ReviewWorkflow onSubmit={handleReviewSubmit} />
        )}
      </div>
    </div>
  );
}

export default function ContractFlowPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    }>
      <ContractFlowContent />
    </Suspense>
  );
}
