// Core Types for Goal-Seeking Contract Design System

export type ContractType =
  | 'nda'
  | 'service_agreement'
  | 'sow'
  | 'master_service_agreement'
  | 'partnership'
  | 'licensing'
  | 'employment'
  | 'consulting'
  | 'vendor'
  | 'custom';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type LoyaltyTier = 'new' | 'bronze' | 'silver' | 'gold' | 'platinum';

export type ContractStatus = 'draft' | 'pending' | 'review' | 'approved' | 'rejected' | 'signed' | 'expired';

export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'enterprise';
  location: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
  loyaltyTier: LoyaltyTier;
  riskScore: number; // 0-100
  totalContracts: number;
  activeContracts: number;
  totalRevenue: number;
  paymentHistory: PaymentHistory;
  performanceHistory: PerformanceRecord[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentHistory {
  onTimePayments: number;
  latePayments: number;
  averagePaymentDays: number;
  totalPaid: number;
  outstanding: number;
}

export interface PerformanceRecord {
  contractId: string;
  contractName: string;
  startDate: Date;
  endDate?: Date;
  performanceScore: number; // 0-100
  deliverablesMet: number;
  deliverablesTotal: number;
  notes?: string;
}

export interface Goal {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  contractType: ContractType;
  proposalUrl?: string;
  proposalText?: string;
  estimatedValue?: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'defining' | 'analyzing' | 'drafting' | 'reviewing' | 'completed';
  actionItems: ActionItem[];
  analysis?: GoalAnalysis;
  selectedTemplate?: ContractTemplate;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItem {
  id: string;
  goalId: string;
  title: string;
  description: string;
  type: 'question' | 'analysis' | 'review' | 'decision' | 'document';
  status: ActionItemStatus;
  priority: number;
  response?: string | Record<string, unknown>;
  options?: ActionItemOption[];
  dependencies?: string[];
  estimatedTime?: string;
  completedAt?: Date;
}

export interface ActionItemOption {
  id: string;
  label: string;
  description?: string;
  value: string | number | boolean;
  recommended?: boolean;
}

export interface GoalAnalysis {
  riskProfile: RiskProfile;
  competitorAnalysis?: CompetitorAnalysis;
  historicalInsights: HistoricalInsight[];
  recommendations: Recommendation[];
  suggestedClauses: SuggestedClause[];
}

export interface RiskProfile {
  overallScore: number; // 0-100
  financialRisk: RiskLevel;
  operationalRisk: RiskLevel;
  legalRisk: RiskLevel;
  reputationalRisk: RiskLevel;
  factors: RiskFactor[];
}

export interface RiskFactor {
  category: string;
  description: string;
  impact: RiskLevel;
  likelihood: RiskLevel;
  mitigations: string[];
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketPosition: number; // 1-100 percentile
  priceComparison: 'below' | 'at' | 'above';
  winProbability: number; // 0-100
}

export interface Competitor {
  id: string;
  name: string;
  bidAmount?: number;
  winHistory: number; // percentage
  strengthAreas: string[];
  weaknessAreas: string[];
  threatLevel: RiskLevel;
}

export interface HistoricalInsight {
  id: string;
  type: 'similar_contract' | 'company_history' | 'industry_trend' | 'regulatory';
  title: string;
  description: string;
  relevance: number; // 0-100
  source: string;
  date: Date;
}

export interface Recommendation {
  id: string;
  category: 'pricing' | 'terms' | 'risk' | 'structure' | 'timeline';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: string;
}

export interface SuggestedClause {
  id: string;
  name: string;
  category: string;
  content: string;
  reason: string;
  isRequired: boolean;
  sensitivity: 'standard' | 'moderate' | 'high' | 'confidential';
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  source: 'system' | 'company' | 'ai_generated' | 'industry';
  tags: string[];
  sections: TemplateSection[];
  variables: TemplateVariable[];
  usageCount: number;
  successRate: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateSection {
  id: string;
  name: string;
  content: string;
  order: number;
  isRequired: boolean;
  isEditable: boolean;
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  defaultValue?: string | number | boolean;
  options?: string[];
  description?: string;
}

export interface ContractDocument {
  id: string;
  goalId: string;
  templateId?: string;
  title: string;
  version: number;
  content: DocumentSection[];
  status: ContractStatus;
  reviewers: Reviewer[];
  comments: DocumentComment[];
  history: DocumentVersion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentSection {
  id: string;
  name: string;
  content: string;
  order: number;
  isLocked: boolean;
  lastEditedBy?: string;
  lastEditedAt?: Date;
}

export interface Reviewer {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'legal' | 'finance' | 'executive' | 'operations' | 'compliance';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'requested_changes';
  reason: string; // Why they should review
  priority: number;
  assignedAt: Date;
  reviewedAt?: Date;
  comments?: string;
}

export interface DocumentComment {
  id: string;
  sectionId: string;
  userId: string;
  userName: string;
  content: string;
  type: 'comment' | 'suggestion' | 'question' | 'approval' | 'rejection';
  resolved: boolean;
  createdAt: Date;
}

export interface DocumentVersion {
  id: string;
  version: number;
  createdBy: string;
  createdAt: Date;
  changes: string;
  snapshot: string; // JSON snapshot of document
}

// UI State Types
export interface ContractFlowState {
  currentStep: FlowStep;
  company: Company | null;
  goal: Goal | null;
  analysis: GoalAnalysis | null;
  template: ContractTemplate | null;
  document: ContractDocument | null;
  isLoading: boolean;
  error: string | null;
}

export type FlowStep =
  | 'company_selection'
  | 'goal_creation'
  | 'action_items'
  | 'analysis'
  | 'template_selection'
  | 'document_editing'
  | 'review_assignment'
  | 'final_review';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
}

// Analytics Types
export interface ContractMetrics {
  totalContracts: number;
  activeContracts: number;
  averageValue: number;
  averageCompletionTime: number; // days
  successRate: number;
  byType: Record<ContractType, number>;
  byStatus: Record<ContractStatus, number>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
