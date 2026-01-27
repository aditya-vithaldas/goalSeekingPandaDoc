import { create } from "zustand";
import {
  Company,
  Goal,
  ContractTemplate,
  ContractDocument,
  GoalAnalysis,
  ActionItem,
  FlowStep,
  ContractType,
} from "@/types";
import { companies, contractTemplates, getActionItemsForGoal } from "@/data/mock-data";

interface ContractFlowStore {
  // Current flow state
  currentStep: FlowStep;
  setCurrentStep: (step: FlowStep) => void;

  // Selected company
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;

  // Goal
  goal: Goal | null;
  setGoal: (goal: Goal | null) => void;
  createGoal: (title: string, contractType: ContractType, proposalText?: string) => void;

  // Action items
  actionItems: ActionItem[];
  setActionItems: (items: ActionItem[]) => void;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => void;
  completeActionItem: (id: string, response?: string | Record<string, unknown>) => void;

  // Analysis
  analysis: GoalAnalysis | null;
  setAnalysis: (analysis: GoalAnalysis | null) => void;

  // Template
  selectedTemplate: ContractTemplate | null;
  setSelectedTemplate: (template: ContractTemplate | null) => void;

  // Document
  document: ContractDocument | null;
  setDocument: (document: ContractDocument | null) => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Actions
  startNewContract: (company: Company) => void;
  resetFlow: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const stepOrder: FlowStep[] = [
  "company_selection",
  "goal_creation",
  "action_items",
  "analysis",
  "template_selection",
  "document_editing",
  "review_assignment",
  "final_review",
];

export const useContractFlow = create<ContractFlowStore>((set, get) => ({
  // Initial state
  currentStep: "company_selection",
  selectedCompany: null,
  goal: null,
  actionItems: [],
  analysis: null,
  selectedTemplate: null,
  document: null,
  isLoading: false,

  // Setters
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  setGoal: (goal) => set({ goal }),
  setActionItems: (items) => set({ actionItems: items }),
  setAnalysis: (analysis) => set({ analysis }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setDocument: (document) => set({ document }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Create goal and generate action items
  createGoal: (title, contractType, proposalText) => {
    const { selectedCompany } = get();
    if (!selectedCompany) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      companyId: selectedCompany.id,
      title,
      contractType,
      proposalText,
      priority: "medium",
      status: "defining",
      actionItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Generate action items based on contract type and company
    const generatedItems = getActionItemsForGoal(contractType, selectedCompany);
    const itemsWithGoalId = generatedItems.map((item) => ({
      ...item,
      goalId: newGoal.id,
    }));

    set({
      goal: newGoal,
      actionItems: itemsWithGoalId,
      currentStep: "action_items",
    });
  },

  // Update action item
  updateActionItem: (id, updates) => {
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  // Complete action item
  completeActionItem: (id, response) => {
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id
          ? { ...item, status: "completed", response, completedAt: new Date() }
          : item
      ),
    }));
  },

  // Start new contract for a company
  startNewContract: (company) => {
    set({
      selectedCompany: company,
      currentStep: "goal_creation",
      goal: null,
      actionItems: [],
      analysis: null,
      selectedTemplate: null,
      document: null,
    });
  },

  // Reset the entire flow
  resetFlow: () => {
    set({
      currentStep: "company_selection",
      selectedCompany: null,
      goal: null,
      actionItems: [],
      analysis: null,
      selectedTemplate: null,
      document: null,
      isLoading: false,
    });
  },

  // Navigation
  goToNextStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] });
    }
  },
}));

// Selectors for derived state
export const useCompanies = () => companies;
export const useTemplates = () => contractTemplates;
export const useTemplatesByType = (type: ContractType) =>
  contractTemplates.filter((t) => t.type === type);
