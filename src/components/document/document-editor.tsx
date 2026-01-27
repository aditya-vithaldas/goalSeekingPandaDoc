"use client";

import { useState } from "react";
import { ContractTemplate, DocumentSection } from "@/types";
import { Card, Button, Badge, Tabs, TabList, Tab, TabPanel } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  FileText,
  Save,
  Download,
  History,
  MessageSquare,
  Eye,
  Edit3,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface DocumentEditorProps {
  template?: ContractTemplate | null;
  mode: "blank" | "template" | "ai";
  onContinue: () => void;
}

export function DocumentEditor({ template, mode, onContinue }: DocumentEditorProps) {
  const [sections, setSections] = useState<DocumentSection[]>(() => {
    if (template?.sections) {
      return template.sections.map((s) => ({
        id: s.id,
        name: s.name,
        content: s.content,
        order: s.order,
        isLocked: !s.isEditable,
      }));
    }
    return [
      {
        id: "s1",
        name: "Introduction",
        content: "This Agreement is entered into as of [DATE] by and between...",
        order: 1,
        isLocked: false,
      },
      {
        id: "s2",
        name: "Definitions",
        content: "For purposes of this Agreement, the following terms shall have the meanings set forth below...",
        order: 2,
        isLocked: false,
      },
      {
        id: "s3",
        name: "Terms and Conditions",
        content: "The parties hereby agree to the following terms and conditions...",
        order: 3,
        isLocked: false,
      },
    ];
  });

  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  const handleUpdateContent = (sectionId: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content } : s))
    );
  };

  const handleAddSection = () => {
    const newSection: DocumentSection = {
      id: `s-${Date.now()}`,
      name: "New Section",
      content: "Enter section content here...",
      order: sections.length + 1,
      isLocked: false,
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
    setEditingSection(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (activeSection === sectionId && sections.length > 1) {
      setActiveSection(sections[0].id);
    }
  };

  const handleToggleLock = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isLocked: !s.isLocked } : s))
    );
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* Document structure sidebar */}
      <div className="w-72 flex-shrink-0">
        <Card className="h-full overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900">Document Structure</h3>
              <Button variant="ghost" size="sm" onClick={handleAddSection}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              {sections.length} sections
            </p>
          </div>

          <div className="flex-1 overflow-auto p-2 space-y-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
                  activeSection === section.id
                    ? "bg-brand-50 border border-brand-200"
                    : "hover:bg-slate-50"
                )}
              >
                <span className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                  activeSection === section.id
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-500"
                )}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    activeSection === section.id ? "text-brand-700" : "text-slate-700"
                  )}>
                    {section.name}
                  </p>
                </div>
                {section.isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Edit3 className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100" />
                )}
              </button>
            ))}
          </div>

          {/* AI Suggestions */}
          {mode === "ai" && (
            <div className="p-4 border-t border-slate-100 bg-accent-purple/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-medium text-slate-900">AI Suggestions</span>
              </div>
              <p className="text-xs text-slate-500">
                3 clause recommendations available based on your risk profile
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Suggestions
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor toolbar */}
        <Card padding="sm" className="mb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs defaultValue="edit" onChange={(v) => setViewMode(v as "edit" | "preview")}>
                <TabList variant="buttons">
                  <Tab value="edit" icon={<Edit3 className="w-4 h-4" />}>
                    Edit
                  </Tab>
                  <Tab value="preview" icon={<Eye className="w-4 h-4" />}>
                    Preview
                  </Tab>
                </TabList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4" />
                History
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4" />
                Comments
              </Button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="secondary" size="sm">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </div>
          </div>
        </Card>

        {/* Editor content */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          {sections.filter((s) => s.id === activeSection).map((section) => (
            <div key={section.id} className="flex-1 flex flex-col">
              {/* Section header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  {editingSection === section.id ? (
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) =>
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id ? { ...s, name: e.target.value } : s
                          )
                        )
                      }
                      onBlur={() => setEditingSection(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingSection(null)}
                      className="text-lg font-bold text-slate-900 bg-transparent border-b-2 border-brand-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <h3
                      className="text-lg font-bold text-slate-900 cursor-pointer hover:text-brand-600"
                      onClick={() => !section.isLocked && setEditingSection(section.id)}
                    >
                      {section.name}
                    </h3>
                  )}
                  {section.isLocked && (
                    <Badge variant="default" size="sm">
                      <Lock className="w-3 h-3" />
                      Locked
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleLock(section.id)}
                  >
                    {section.isLocked ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </Button>
                  {!section.isLocked && sections.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4 text-accent-red" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Section content */}
              <div className="flex-1 overflow-auto p-6">
                {viewMode === "edit" ? (
                  <textarea
                    value={section.content}
                    onChange={(e) => handleUpdateContent(section.id, e.target.value)}
                    disabled={section.isLocked}
                    className={cn(
                      "w-full h-full resize-none text-base leading-relaxed text-slate-700",
                      "focus:outline-none",
                      section.isLocked && "bg-slate-50 cursor-not-allowed"
                    )}
                    placeholder="Enter section content..."
                  />
                ) : (
                  <div className="prose prose-slate max-w-none">
                    {section.content.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card>

        {/* Continue to review */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-accent-green" />
            Auto-saved just now
          </div>
          <Button onClick={onContinue}>
            Continue to Review Assignment
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Right sidebar - Validation */}
      <div className="w-64 flex-shrink-0">
        <Card className="h-full overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Document Check</h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Validation items */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">All required sections</p>
                  <p className="text-xs text-slate-500">3/3 sections complete</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Variables filled</p>
                  <p className="text-xs text-slate-500">All placeholders resolved</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Compliance review</p>
                  <p className="text-xs text-slate-500">Recommended before finalizing</p>
                </div>
              </div>
            </div>

            {/* Word count */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">Document Statistics</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Words</span>
                  <span className="font-medium text-slate-900">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Sections</span>
                  <span className="font-medium text-slate-900">{sections.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Est. read time</span>
                  <span className="font-medium text-slate-900">5 min</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
