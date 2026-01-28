"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { companies } from "@/data/mock-data";
import { useContractFlow } from "@/lib/store";
import { Company, ContractType } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Newspaper,
  DollarSign,
  Clock,
  X,
  Users,
  Mail,
  Send,
  UserCheck,
  Scale,
  Briefcase,
  Building,
  Check,
  Pencil,
  ChevronRight,
  Eye,
} from "lucide-react";

function detectContractType(goal: string): ContractType {
  const lower = goal.toLowerCase();
  if (lower.includes("nda") || lower.includes("confidential") || lower.includes("secret")) return "nda";
  if (lower.includes("partner") || lower.includes("collaboration")) return "partnership";
  if (lower.includes("consult") || lower.includes("advisor")) return "consulting";
  if (lower.includes("license") || lower.includes("ip")) return "licensing";
  if (lower.includes("vendor") || lower.includes("supplier")) return "vendor";
  if (lower.includes("sow") || lower.includes("project") || lower.includes("deliverable")) return "sow";
  if (lower.includes("master") || lower.includes("msa")) return "master_service_agreement";
  return "service_agreement";
}

function getContractTypeLabel(type: ContractType): string {
  const labels: Record<ContractType, string> = {
    nda: "NDA", service_agreement: "Service Agreement", sow: "Statement of Work",
    master_service_agreement: "MSA", partnership: "Partnership", licensing: "Licensing",
    employment: "Employment", consulting: "Consulting", vendor: "Vendor", custom: "Custom",
  };
  return labels[type];
}

interface AnalysisResult {
  contractType: ContractType;
  history: { summary: string; contracts: number; successRate: number };
  risk: { level: "low" | "medium" | "high"; score: number; reason: string };
  clauses: { title: string; recommendation: string }[];
  news: { headline: string; sentiment: "positive" | "neutral" | "negative"; date: string }[];
  totalNewsCount: number;
  solvency: { status: "strong" | "stable" | "watch"; reason: string };
}

interface RecommendedReviewer {
  id: string;
  name: string;
  email: string;
  role: "legal" | "finance" | "executive" | "compliance" | "operations";
  avatar?: string;
  reason: string;
  priority: number;
  required: boolean;
}

interface InformedPerson {
  id: string;
  name: string;
  email: string;
  role: string;
}

function getInformedPeople(company: Company): InformedPerson[] {
  return [
    { id: "inf-1", name: "Alex Rivera", email: "alex.rivera@company.com", role: "Account Manager" },
    { id: "inf-2", name: "Sam Johnson", email: "sam.johnson@company.com", role: "Sales Lead" },
    { id: "inf-3", name: "Taylor Lee", email: "taylor.lee@company.com", role: "Customer Success" },
  ];
}

function getRecommendedReviewers(
  analysis: AnalysisResult,
  company: Company,
  estimatedValue?: number
): RecommendedReviewer[] {
  const reviewers: RecommendedReviewer[] = [];
  const value = estimatedValue || company.totalRevenue / company.totalContracts || 50000;

  // Legal review - always needed for contracts
  reviewers.push({
    id: "rev-legal",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "legal",
    reason: `Legal counsel for ${getContractTypeLabel(analysis.contractType)} contracts. Reviews all agreements before execution.`,
    priority: 1,
    required: true,
  });

  // Compliance review - needed for regulated industries or high-risk
  if (
    company.industry === "Healthcare" ||
    company.industry === "Financial Services" ||
    analysis.risk.level === "high"
  ) {
    reviewers.push({
      id: "rev-compliance",
      name: "Michael Torres",
      email: "michael.torres@company.com",
      role: "compliance",
      reason: `Required for ${company.industry} sector. Ensures regulatory compliance and data protection standards.`,
      priority: 2,
      required: true,
    });
  }

  // Finance review - for high value contracts or payment-sensitive
  if (value > 100000 || company.paymentHistory.latePayments > 2) {
    reviewers.push({
      id: "rev-finance",
      name: "David Kim",
      email: "david.kim@company.com",
      role: "finance",
      reason: value > 100000
        ? `Finance review required for contracts exceeding $100K. Validates payment terms and financial exposure.`
        : `Payment history shows ${company.paymentHistory.latePayments} late payments. Finance review recommended.`,
      priority: 3,
      required: value > 250000,
    });
  }

  // Executive review - for enterprise clients or very high value
  if (company.size === "enterprise" || value > 500000) {
    reviewers.push({
      id: "rev-exec",
      name: "Jennifer Walsh",
      email: "jennifer.walsh@company.com",
      role: "executive",
      reason: company.size === "enterprise"
        ? `VP approval required for enterprise client agreements with ${company.name}.`
        : `Executive sign-off needed for contracts exceeding $500K.`,
      priority: 4,
      required: value > 500000,
    });
  }

  // Operations review - for SOW or service agreements
  if (
    analysis.contractType === "sow" ||
    analysis.contractType === "service_agreement" ||
    analysis.contractType === "master_service_agreement"
  ) {
    reviewers.push({
      id: "rev-ops",
      name: "Robert Martinez",
      email: "robert.martinez@company.com",
      role: "operations",
      reason: `Operations review for ${getContractTypeLabel(analysis.contractType)}. Validates delivery timelines and resource allocation.`,
      priority: 5,
      required: false,
    });
  }

  return reviewers.sort((a, b) => a.priority - b.priority);
}

function generateEmailSummary(
  analysis: AnalysisResult,
  company: Company,
  contract: string,
  goal: string
): { subject: string; body: string } {
  const subject = `${getContractTypeLabel(analysis.contractType)} for Review - ${company.name}`;

  const body = `Dear ${company.name} Team,

Please find attached the ${getContractTypeLabel(analysis.contractType)} for your review and consideration.

CONTRACT SUMMARY
────────────────
Purpose: ${goal}

Key Terms:
${analysis.clauses.map(c => `• ${c.title}: ${c.recommendation}`).join("\n")}

NEXT STEPS
────────────────
1. Review the attached agreement
2. Provide any feedback or requested changes
3. Sign and return at your earliest convenience

We look forward to continuing our partnership with ${company.name}.

Best regards,
[Your Name]
[Your Title]
[Your Company]

---
This contract was generated using our goal-based contract system.
`;

  return { subject, body };
}

function generateAnalysis(goal: string, company: Company): AnalysisResult {
  const contractType = detectContractType(goal);
  const riskLevel = company.riskScore < 30 ? "low" : company.riskScore < 60 ? "medium" : "high";

  const clausesByType: Record<ContractType, { title: string; recommendation: string }[]> = {
    nda: [
      { title: "Confidentiality scope", recommendation: "Mutual, 2-year term" },
      { title: "Permitted disclosures", recommendation: "Standard carve-outs" },
    ],
    service_agreement: [
      { title: "Payment terms", recommendation: `Net ${company.paymentHistory.averagePaymentDays} based on history` },
      { title: "Liability cap", recommendation: "1x contract value" },
    ],
    sow: [
      { title: "Milestones", recommendation: "4 phases, payment on completion" },
      { title: "Change orders", recommendation: "Written approval required" },
    ],
    master_service_agreement: [
      { title: "Term", recommendation: "2 years with auto-renewal" },
      { title: "SLA", recommendation: "99.5% uptime, 24hr response" },
    ],
    partnership: [
      { title: "Revenue share", recommendation: "50/50 split standard" },
      { title: "IP ownership", recommendation: "Joint ownership of derivatives" },
    ],
    licensing: [
      { title: "License scope", recommendation: "Non-exclusive, territory-limited" },
      { title: "Royalties", recommendation: "5% of net revenue" },
    ],
    consulting: [
      { title: "Rate", recommendation: "Hourly with monthly cap" },
      { title: "IP assignment", recommendation: "Work product transfers to client" },
    ],
    vendor: [
      { title: "Warranty", recommendation: "12 months standard" },
      { title: "Indemnification", recommendation: "Mutual, capped" },
    ],
    employment: [
      { title: "Non-compete", recommendation: "12 months, limited scope" },
      { title: "Benefits", recommendation: "Standard package" },
    ],
    custom: [
      { title: "Terms", recommendation: "To be defined" },
      { title: "Conditions", recommendation: "To be defined" },
    ],
  };

  const newsItems = [
    { headline: `${company.name} expands operations in Q4`, sentiment: "positive" as const, date: "2 weeks ago" },
    { headline: `${company.name} announces new leadership team`, sentiment: "neutral" as const, date: "3 weeks ago" },
    { headline: `${company.name} reports strong quarterly earnings`, sentiment: "positive" as const, date: "3 weeks ago" },
    { headline: `Industry analysis: ${company.industry} sector outlook`, sentiment: "neutral" as const, date: "1 month ago" },
    { headline: `${company.name} launches sustainability initiative`, sentiment: "positive" as const, date: "1 month ago" },
  ];

  return {
    contractType,
    history: {
      summary: company.totalContracts > 10
        ? `Long-standing relationship. ${company.performanceHistory[0]?.notes || "Reliable partner."}`
        : `Newer relationship. ${company.totalContracts} contracts to date.`,
      contracts: company.totalContracts,
      successRate: company.performanceHistory[0]?.performanceScore || 85,
    },
    risk: {
      level: riskLevel,
      score: company.riskScore,
      reason: riskLevel === "low"
        ? `${company.paymentHistory.onTimePayments}/${company.paymentHistory.onTimePayments + company.paymentHistory.latePayments} on-time payments`
        : riskLevel === "medium"
        ? `Some payment delays (avg ${company.paymentHistory.averagePaymentDays} days)`
        : `Payment history needs attention`,
    },
    clauses: clausesByType[contractType] || clausesByType.service_agreement,
    news: newsItems.slice(0, 2),
    totalNewsCount: newsItems.length,
    solvency: {
      status: company.totalRevenue > 1000000 ? "strong" : company.totalRevenue > 500000 ? "stable" : "watch",
      reason: company.totalRevenue > 1000000
        ? `$${(company.totalRevenue / 1000000).toFixed(1)}M lifetime value`
        : `$${(company.totalRevenue / 1000).toFixed(0)}K lifetime value`,
    },
  };
}

function generateContractContent(analysis: AnalysisResult, company: Company, goal: string): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (analysis.contractType === "nda") {
    return `MUTUAL NON-DISCLOSURE AGREEMENT

Effective Date: ${today}

PARTIES:
- Disclosing Party: [Your Company Name]
- Receiving Party: ${company.name}

1. PURPOSE
${goal}

2. CONFIDENTIAL INFORMATION
All non-public business, technical, and financial information disclosed by either party.

3. OBLIGATIONS
Each party agrees to:
• Hold confidential information in strict confidence
• Use information only for the stated purpose
• Limit disclosure to employees with need-to-know

4. EXCLUSIONS
This agreement does not apply to information that:
• Is publicly available
• Was known prior to disclosure
• Is independently developed

5. TERM
This agreement remains in effect for 2 years from the Effective Date.

6. GOVERNING LAW
This agreement shall be governed by the laws of Delaware.

SIGNATURES:

_______________________          _______________________
[Your Company Name]              ${company.name}
Date: _______________           Date: _______________`;
  }

  return `${getContractTypeLabel(analysis.contractType).toUpperCase()} AGREEMENT

Effective Date: ${today}

PARTIES:
- Provider: [Your Company Name]
- Client: ${company.name}

1. PURPOSE
${goal}

2. SCOPE OF SERVICES
Services to be provided as outlined in this agreement and any attached exhibits.

3. PAYMENT TERMS
${analysis.clauses[0]?.recommendation || "Net 30"}

4. TERM
Initial term of 12 months, with automatic renewal unless terminated with 30 days notice.

5. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

6. LIABILITY
${analysis.clauses[1]?.recommendation || "Limited to contract value"}

7. GOVERNING LAW
This agreement shall be governed by the laws of Delaware.

SIGNATURES:

_______________________          _______________________
[Your Company Name]              ${company.name}
Date: _______________           Date: _______________`;
}

function ContractFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { setSelectedCompany } = useContractFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [company, setCompany] = useState<Company | null>(null);
  const [goal, setGoal] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [phase, setPhase] = useState<"input" | "analyzing" | "analysis" | "contract">("input");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [contract, setContract] = useState<string>("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [selectedInformed, setSelectedInformed] = useState<string[]>([]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [emailData, setEmailData] = useState<{ subject: string; body: string; to: string }>({
    subject: "",
    body: "",
    to: "",
  });
  const [sendingReview, setSendingReview] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editableAnalysis, setEditableAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (companyId) {
      const foundCompany = companies.find((c) => c.id === companyId);
      if (foundCompany) {
        setCompany(foundCompany);
        setSelectedCompany(foundCompany);
      }
    }
  }, [companyId, setSelectedCompany]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setGoal(`Review and create contract based on proposal: ${file.name}`);
    }
  };

  const handleRunAnalysis = () => {
    if ((!goal.trim() && !uploadedFile) || !company) return;
    setPhase("analyzing");
    setTimeout(() => {
      const result = generateAnalysis(goal, company);
      setAnalysis(result);
      setEditableAnalysis(result);
      setPhase("analysis");
    }, 1500);
  };

  const handleGenerate = () => {
    if (!analysis || !company) return;
    const content = generateContractContent(analysis, company, goal);
    setContract(content);
    setPhase("contract");
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No company selected</p>
          <button onClick={() => router.push("/")} className="text-slate-700 hover:text-slate-900 font-medium">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push("/")} className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{company.name}</h1>
            <p className="text-sm text-slate-500">{company.industry}</p>
          </div>
        </div>

        {/* Input Phase */}
        {phase === "input" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What do you want to accomplish?
            </label>

            {/* Quick Goal Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "NDA", goal: "Create a mutual NDA to protect confidential information", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" },
                { label: "Service Agreement", goal: "Draft a service agreement for professional services delivery", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
                { label: "Statement of Work", goal: "Create a detailed SOW with milestones and deliverables", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
                { label: "Partnership", goal: "Establish a partnership agreement for collaboration", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
                { label: "Consulting", goal: "Draft a consulting agreement for advisory services", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
                { label: "MSA", goal: "Create a master service agreement for ongoing relationship", color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100" },
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setGoal(option.goal)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full border transition-all",
                    option.color,
                    goal === option.goal && "ring-2 ring-offset-1 ring-slate-400"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Or describe your goal in detail..."
              className="w-full h-24 px-4 py-3 text-base bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
              autoFocus
            />

            {/* Upload option */}
            <div className="flex items-center gap-3 mb-4">
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload proposal
              </button>
              {uploadedFile && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <FileText className="w-4 h-4" />
                  {uploadedFile}
                  <button onClick={() => { setUploadedFile(null); setGoal(""); }}>
                    <X className="w-4 h-4 text-emerald-400 hover:text-emerald-600" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={!goal.trim() && !uploadedFile}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                (goal.trim() || uploadedFile)
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              Run Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Analyzing Phase */}
        {phase === "analyzing" && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Analyzing...</p>
          </div>
        )}

        {/* Analysis Phase */}
        {phase === "analysis" && editableAnalysis && (
          <div className="space-y-4">
            {/* Contract Type */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 overflow-hidden">
              <div className="px-4 py-2 bg-indigo-100/50 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Contract Type</span>
                </div>
                <button
                  onClick={() => setEditingField(editingField === "contractType" ? null : "contractType")}
                  className="p-1 hover:bg-indigo-200/50 rounded transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-indigo-500" />
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-900">{getContractTypeLabel(editableAnalysis.contractType)}</p>
                <p className="text-sm text-slate-500 mt-1">{goal}</p>
              </div>
            </div>

            {/* History TLDR */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden">
              <div className="px-4 py-2 bg-blue-100/50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">History</span>
                </div>
                <button
                  onClick={() => setEditingField(editingField === "history" ? null : "history")}
                  className="p-1 hover:bg-blue-200/50 rounded transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-blue-500" />
                </button>
              </div>
              <div className="p-4">
                {editingField === "history" ? (
                  <textarea
                    value={editableAnalysis.history.summary}
                    onChange={(e) => setEditableAnalysis({
                      ...editableAnalysis,
                      history: { ...editableAnalysis.history, summary: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-sm bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm text-slate-600">{editableAnalysis.history.summary}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 bg-white/70 text-blue-700 text-xs font-medium rounded-full">{editableAnalysis.history.contracts} contracts</span>
                  <span className="px-2 py-0.5 bg-white/70 text-blue-700 text-xs font-medium rounded-full">{editableAnalysis.history.successRate}% success</span>
                </div>
              </div>
            </div>

            {/* Risk */}
            <div className={cn(
              "rounded-xl border overflow-hidden",
              editableAnalysis.risk.level === "low"
                ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100"
                : editableAnalysis.risk.level === "medium"
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-red-100"
            )}>
              <div className={cn(
                "px-4 py-2 border-b flex items-center justify-between",
                editableAnalysis.risk.level === "low" ? "bg-emerald-100/50 border-emerald-100" :
                editableAnalysis.risk.level === "medium" ? "bg-amber-100/50 border-amber-100" : "bg-red-100/50 border-red-100"
              )}>
                <div className="flex items-center gap-2">
                  {editableAnalysis.risk.level === "low" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className={cn("w-4 h-4", editableAnalysis.risk.level === "medium" ? "text-amber-600" : "text-red-600")} />
                  )}
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wide",
                    editableAnalysis.risk.level === "low" ? "text-emerald-700" :
                    editableAnalysis.risk.level === "medium" ? "text-amber-700" : "text-red-700"
                  )}>
                    {editableAnalysis.risk.level} Risk
                  </span>
                </div>
                <button
                  onClick={() => setEditingField(editingField === "risk" ? null : "risk")}
                  className={cn(
                    "p-1 rounded transition-colors",
                    editableAnalysis.risk.level === "low" ? "hover:bg-emerald-200/50" :
                    editableAnalysis.risk.level === "medium" ? "hover:bg-amber-200/50" : "hover:bg-red-200/50"
                  )}
                >
                  <Pencil className={cn(
                    "w-3.5 h-3.5",
                    editableAnalysis.risk.level === "low" ? "text-emerald-500" :
                    editableAnalysis.risk.level === "medium" ? "text-amber-500" : "text-red-500"
                  )} />
                </button>
              </div>
              <div className="p-4">
                {editingField === "risk" ? (
                  <textarea
                    value={editableAnalysis.risk.reason}
                    onChange={(e) => setEditableAnalysis({
                      ...editableAnalysis,
                      risk: { ...editableAnalysis.risk, reason: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm text-slate-600">{editableAnalysis.risk.reason}</p>
                )}
              </div>
            </div>

            {/* Key Clauses */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Key Clauses</span>
                </div>
                <button
                  onClick={() => setEditingField(editingField === "clauses" ? null : "clauses")}
                  className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {editableAnalysis.clauses.map((clause, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 px-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">{clause.title}</span>
                    {editingField === "clauses" ? (
                      <input
                        type="text"
                        value={clause.recommendation}
                        onChange={(e) => {
                          const newClauses = [...editableAnalysis.clauses];
                          newClauses[i] = { ...newClauses[i], recommendation: e.target.value };
                          setEditableAnalysis({ ...editableAnalysis, clauses: newClauses });
                        }}
                        className="px-2 py-1 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-40"
                      />
                    ) : (
                      <span className="text-slate-900 font-medium">{clause.recommendation}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* News & Solvency row */}
            <div className="grid grid-cols-2 gap-3">
              {/* News - now shows 2 articles */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">In the News</span>
                  </div>
                  <span className="text-xs text-slate-400">+{editableAnalysis.totalNewsCount - 2} more</span>
                </div>
                <div className="p-3 space-y-2">
                  {editableAnalysis.news.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-2 rounded-lg text-xs",
                        item.sentiment === "positive" ? "bg-green-50" :
                        item.sentiment === "negative" ? "bg-red-50" : "bg-slate-50"
                      )}
                    >
                      <p className={cn(
                        "font-medium line-clamp-1",
                        item.sentiment === "positive" ? "text-green-700" :
                        item.sentiment === "negative" ? "text-red-700" : "text-slate-700"
                      )}>
                        {item.headline}
                      </p>
                      <p className="text-slate-400 mt-0.5">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solvency */}
              <div className={cn(
                "rounded-xl border overflow-hidden",
                editableAnalysis.solvency.status === "strong"
                  ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100"
                  : editableAnalysis.solvency.status === "stable"
                  ? "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100"
                  : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100"
              )}>
                <div className={cn(
                  "px-3 py-2 border-b flex items-center gap-2",
                  editableAnalysis.solvency.status === "strong" ? "bg-emerald-100/50 border-emerald-100" :
                  editableAnalysis.solvency.status === "stable" ? "bg-blue-100/50 border-blue-100" : "bg-amber-100/50 border-amber-100"
                )}>
                  <DollarSign className={cn(
                    "w-4 h-4",
                    editableAnalysis.solvency.status === "strong" ? "text-emerald-600" :
                    editableAnalysis.solvency.status === "stable" ? "text-blue-600" : "text-amber-600"
                  )} />
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wide",
                    editableAnalysis.solvency.status === "strong" ? "text-emerald-700" :
                    editableAnalysis.solvency.status === "stable" ? "text-blue-700" : "text-amber-700"
                  )}>Solvency</span>
                </div>
                <div className="p-3">
                  <p className={cn("text-lg font-bold capitalize",
                    editableAnalysis.solvency.status === "strong" ? "text-emerald-600" :
                    editableAnalysis.solvency.status === "stable" ? "text-blue-600" : "text-amber-600"
                  )}>
                    {editableAnalysis.solvency.status}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{editableAnalysis.solvency.reason}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setPhase("input"); setAnalysis(null); setEditableAnalysis(null); }}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={() => {
                  setAnalysis(editableAnalysis);
                  handleGenerate();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
              >
                Generate Contract
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Contract Phase */}
        {phase === "contract" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Contract Ready</h2>
                  <p className="text-xs text-slate-500">Review and send for approval</p>
                </div>
              </div>
              <button
                onClick={() => setPhase("analysis")}
                className="text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Back to analysis
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 shadow-sm">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {contract}
              </pre>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                Download PDF
              </button>
              <button
                onClick={() => {
                  if (analysis) {
                    const reviewers = getRecommendedReviewers(analysis, company!);
                    setSelectedReviewers(reviewers.filter(r => r.required).map(r => r.id));
                  }
                  setShowReviewModal(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200 rounded-xl font-medium hover:from-purple-100 hover:to-violet-100 transition-colors"
              >
                <Users className="w-4 h-4" />
                Send for Review
              </button>
              <button
                onClick={() => {
                  if (analysis && company) {
                    const email = generateEmailSummary(analysis, company, contract, goal);
                    setEmailData({
                      subject: email.subject,
                      body: email.body,
                      to: company.contactEmail,
                    });
                  }
                  setShowEmailModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Mail className="w-4 h-4" />
                Send to Customer
              </button>
            </div>
          </div>
        )}

        {/* Send for Review Modal */}
        {showReviewModal && analysis && company && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Send for Review</h3>
                    <p className="text-sm text-purple-100">Select reviewers for this contract</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewSent(false);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {reviewSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Review Requests Sent</h4>
                  <p className="text-sm text-slate-500 mb-2">
                    {selectedReviewers.length} reviewer{selectedReviewers.length !== 1 ? "s" : ""} will receive the contract for review.
                  </p>
                  {selectedInformed.length > 0 && (
                    <p className="text-sm text-slate-400 mb-4">
                      {selectedInformed.length} person{selectedInformed.length !== 1 ? "s" : ""} will be informed (CC).
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewSent(false);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/25"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                        Recommended Reviewers
                      </p>
                      <div className="space-y-2">
                        {getRecommendedReviewers(analysis, company).map((reviewer) => {
                          const isSelected = selectedReviewers.includes(reviewer.id);
                          const roleIcons: Record<string, React.ReactNode> = {
                            legal: <Scale className="w-4 h-4" />,
                            finance: <DollarSign className="w-4 h-4" />,
                            executive: <Briefcase className="w-4 h-4" />,
                            compliance: <Shield className="w-4 h-4" />,
                            operations: <Building className="w-4 h-4" />,
                          };
                          const roleColors: Record<string, string> = {
                            legal: "bg-purple-100 text-purple-600",
                            finance: "bg-green-100 text-green-600",
                            executive: "bg-blue-100 text-blue-600",
                            compliance: "bg-orange-100 text-orange-600",
                            operations: "bg-slate-100 text-slate-600",
                          };

                          return (
                            <div
                              key={reviewer.id}
                              onClick={() => {
                                if (reviewer.required) return;
                                setSelectedReviewers((prev) =>
                                  isSelected
                                    ? prev.filter((id) => id !== reviewer.id)
                                    : [...prev, reviewer.id]
                                );
                              }}
                              className={cn(
                                "p-3 rounded-xl border-2 transition-all",
                                isSelected
                                  ? "border-slate-900 bg-slate-50"
                                  : "border-slate-200 hover:border-slate-300",
                                reviewer.required ? "cursor-default" : "cursor-pointer"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                    roleColors[reviewer.role]
                                  )}
                                >
                                  {roleIcons[reviewer.role]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-900">{reviewer.name}</span>
                                    {reviewer.required && (
                                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 capitalize">{reviewer.role}</p>
                                  <p className="text-xs text-slate-500 mt-1">{reviewer.reason}</p>
                                </div>
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                                    isSelected
                                      ? "bg-slate-900 border-slate-900"
                                      : "border-slate-300"
                                  )}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Informed People - Compact */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Also Inform (CC)
                        </p>
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getInformedPeople(company).map((person) => {
                          const isSelected = selectedInformed.includes(person.id);
                          return (
                            <button
                              key={person.id}
                              onClick={() => {
                                setSelectedInformed((prev) =>
                                  isSelected
                                    ? prev.filter((id) => id !== person.id)
                                    : [...prev, person.id]
                                );
                              }}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                isSelected
                                  ? "bg-slate-100 border-slate-300 text-slate-700"
                                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                                isSelected ? "bg-slate-600 text-white" : "bg-slate-200 text-slate-500"
                              )}>
                                {person.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              {person.name}
                              {isSelected && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                        Message (Optional)
                      </label>
                      <textarea
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        placeholder="Add a note for the reviewers..."
                        className="w-full h-20 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-200 flex gap-3">
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setSendingReview(true);
                        setTimeout(() => {
                          setSendingReview(false);
                          setReviewSent(true);
                        }, 1500);
                      }}
                      disabled={selectedReviewers.length === 0 || sendingReview}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                        selectedReviewers.length > 0
                          ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/25"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {sendingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send to {selectedReviewers.length} Reviewer{selectedReviewers.length !== 1 ? "s" : ""}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Send to Customer Email Modal */}
        {showEmailModal && company && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Send to Customer</h3>
                    <p className="text-sm text-blue-100">Email the contract to {company.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailSent(false);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {emailSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Email Sent Successfully</h4>
                  <p className="text-sm text-slate-500 mb-6">
                    The contract has been sent to {emailData.to}
                  </p>
                  <button
                    onClick={() => {
                      setShowEmailModal(false);
                      setEmailSent(false);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 overflow-y-auto flex-1 space-y-4">
                    {/* To field */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                        To
                      </label>
                      <input
                        type="email"
                        value={emailData.to}
                        onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    {/* Subject field */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    {/* Body field */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                        Message
                      </label>
                      <textarea
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        className="w-full h-64 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 resize-none font-mono"
                      />
                    </div>

                    {/* Attachment preview */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">
                            {analysis ? getContractTypeLabel(analysis.contractType) : "Contract"} - {company.name}.pdf
                          </p>
                          <p className="text-xs text-slate-500">Contract document attached</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-200 flex gap-3">
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setSendingEmail(true);
                        setTimeout(() => {
                          setSendingEmail(false);
                          setEmailSent(true);
                        }, 1500);
                      }}
                      disabled={!emailData.to || !emailData.subject || sendingEmail}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                        emailData.to && emailData.subject
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {sendingEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContractFlowPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    }>
      <ContractFlowContent />
    </Suspense>
  );
}
