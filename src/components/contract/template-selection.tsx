"use client";

import { useState } from "react";
import { ContractTemplate, ContractType } from "@/types";
import { contractTemplates } from "@/data/mock-data";
import { Card, Button, Badge, SearchInput, Tabs, TabList, Tab, TabPanel } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  FolderOpen,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  ArrowRight,
  Wand2,
  FileQuestion,
  Building,
  Globe,
  Zap,
} from "lucide-react";

interface TemplateSelectionProps {
  contractType: ContractType;
  onSelectTemplate: (template: ContractTemplate | null, mode: "blank" | "template" | "ai") => void;
}

export function TemplateSelection({ contractType, onSelectTemplate }: TemplateSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<"blank" | "template" | "ai" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const relevantTemplates = contractTemplates.filter(
    (t) => t.type === contractType
  );
  const otherTemplates = contractTemplates.filter(
    (t) => t.type !== contractType
  );

  const filteredTemplates = [...relevantTemplates, ...otherTemplates].filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "system":
        return <Globe className="w-4 h-4" />;
      case "company":
        return <Building className="w-4 h-4" />;
      case "ai_generated":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "system":
        return "Standard";
      case "company":
        return "Company";
      case "ai_generated":
        return "AI Generated";
      default:
        return "Industry";
    }
  };

  const handleContinue = () => {
    if (selectedMode === "blank") {
      onSelectTemplate(null, "blank");
    } else if (selectedMode === "ai") {
      onSelectTemplate(null, "ai");
    } else if (selectedMode === "template" && selectedTemplate) {
      onSelectTemplate(selectedTemplate, "template");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-display-sm font-bold text-slate-900 mb-2">
          Choose Your Starting Point
        </h2>
        <p className="text-lg text-slate-500">
          Start with a blank document, use a proven template, or let AI generate one for you
        </p>
      </div>

      {/* Mode selection cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {/* Blank Slate */}
        <Card
          interactive
          onClick={() => {
            setSelectedMode("blank");
            setSelectedTemplate(null);
          }}
          className={cn(
            "relative group",
            selectedMode === "blank" && "ring-2 ring-brand-500 border-brand-500"
          )}
        >
          <div className="text-center py-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
              selectedMode === "blank"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600"
            )}>
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Blank Slate</h3>
            <p className="text-sm text-slate-500">
              Start fresh with an empty document and build from scratch
            </p>
            {selectedMode === "blank" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Use Template */}
        <Card
          interactive
          onClick={() => setSelectedMode("template")}
          className={cn(
            "relative group",
            selectedMode === "template" && "ring-2 ring-brand-500 border-brand-500"
          )}
        >
          <div className="text-center py-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
              selectedMode === "template"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600"
            )}>
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Use Template</h3>
            <p className="text-sm text-slate-500">
              Choose from {relevantTemplates.length}+ proven templates for this contract type
            </p>
            <Badge variant="success" className="mt-3">
              <Star className="w-3 h-3" />
              Recommended
            </Badge>
            {selectedMode === "template" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* AI Generated */}
        <Card
          interactive
          onClick={() => {
            setSelectedMode("ai");
            setSelectedTemplate(null);
          }}
          className={cn(
            "relative group",
            selectedMode === "ai" && "ring-2 ring-accent-purple border-accent-purple"
          )}
        >
          <div className="text-center py-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
              selectedMode === "ai"
                ? "bg-accent-purple text-white"
                : "bg-accent-purple/10 text-accent-purple group-hover:bg-accent-purple/20"
            )}>
              <Wand2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Generated</h3>
            <p className="text-sm text-slate-500">
              Let AI create a custom template based on your specific requirements
            </p>
            <Badge variant="purple" className="mt-3">
              <Sparkles className="w-3 h-3" />
              Powered by AI
            </Badge>
            {selectedMode === "ai" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-accent-purple rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Template browser (shown when template mode is selected) */}
      {selectedMode === "template" && (
        <div className="animate-fade-in">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Select a Template</h3>
              <div className="w-72">
                <SearchInput
                  placeholder="Search templates..."
                  value={searchQuery}
                  onSearch={setSearchQuery}
                />
              </div>
            </div>

            <Tabs defaultValue="recommended">
              <TabList className="mb-6">
                <Tab value="recommended" icon={<Star className="w-4 h-4" />}>
                  Recommended
                </Tab>
                <Tab value="all" icon={<FolderOpen className="w-4 h-4" />} count={filteredTemplates.length}>
                  All Templates
                </Tab>
                <Tab value="recent" icon={<Clock className="w-4 h-4" />}>
                  Recently Used
                </Tab>
              </TabList>

              <TabPanel value="recommended">
                <div className="grid grid-cols-2 gap-4">
                  {relevantTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate?.id === template.id}
                      isRecommended
                      onSelect={() => setSelectedTemplate(template)}
                      getSourceIcon={getSourceIcon}
                      getSourceLabel={getSourceLabel}
                    />
                  ))}
                </div>
              </TabPanel>

              <TabPanel value="all">
                <div className="grid grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate?.id === template.id}
                      isRecommended={template.type === contractType}
                      onSelect={() => setSelectedTemplate(template)}
                      getSourceIcon={getSourceIcon}
                      getSourceLabel={getSourceLabel}
                    />
                  ))}
                </div>
              </TabPanel>

              <TabPanel value="recent">
                <div className="grid grid-cols-2 gap-4">
                  {filteredTemplates
                    .filter((t) => t.lastUsed)
                    .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
                    .slice(0, 4)
                    .map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate?.id === template.id}
                        isRecommended={template.type === contractType}
                        onSelect={() => setSelectedTemplate(template)}
                        getSourceIcon={getSourceIcon}
                        getSourceLabel={getSourceLabel}
                      />
                    ))}
                </div>
              </TabPanel>
            </Tabs>
          </Card>
        </div>
      )}

      {/* AI Generation info (shown when AI mode is selected) */}
      {selectedMode === "ai" && (
        <Card className="animate-fade-in bg-gradient-to-br from-accent-purple/5 to-brand-50 border-accent-purple/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-purple rounded-xl text-white">
              <Wand2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Powered Template Generation</h3>
              <p className="text-slate-600 mb-4">
                Based on your goal and the analysis we&apos;ve completed, our AI will generate a custom contract template that includes:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Industry-specific clauses",
                  "Risk-appropriate terms",
                  "Historical insights integration",
                  "Compliance requirements",
                  "Competitive positioning",
                  "Custom payment terms",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent-purple" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Continue button */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleContinue}
          disabled={!selectedMode || (selectedMode === "template" && !selectedTemplate)}
        >
          Continue to Document
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: ContractTemplate;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  getSourceIcon: (source: string) => React.ReactNode;
  getSourceLabel: (source: string) => string;
}

function TemplateCard({
  template,
  isSelected,
  isRecommended,
  onSelect,
  getSourceIcon,
  getSourceLabel,
}: TemplateCardProps) {
  return (
    <Card
      interactive
      onClick={onSelect}
      padding="sm"
      className={cn(
        "relative",
        isSelected && "ring-2 ring-brand-500 border-brand-500"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl flex-shrink-0",
          isSelected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
        )}>
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-slate-900 truncate">{template.name}</h4>
            {isRecommended && (
              <Badge variant="success" size="sm">
                <Star className="w-3 h-3" />
                Match
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">
            {template.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                {getSourceIcon(template.source)}
                {getSourceLabel(template.source)}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {template.successRate}% success
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Used {template.usageCount} times
            </span>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
      )}
    </Card>
  );
}
