export type QuestionCategory = 
  | 'GREETING'
  | 'A_FEASIBILITY'
  | 'B_EQUITY'
  | 'C_SIDE_EFFECTS'
  | 'SUPPORTED';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  category?: QuestionCategory;
  isSupported?: boolean;
}

export interface PolicyPreset {
  id: string;
  title: string;
  category: string;
  summary: string;
  initialPitch: string;
  budgetEstimate: string;
  targetGroup: string;
}

export interface AuditReportData {
  policyTitle: string;
  verdict: 'APPROVED' | 'PENDING' | 'REJECTED';
  verdictLabel: string;
  overallScore: number;
  scores: {
    feasibility: number;
    equity: number;
    sideEffectControl: number;
    logicDefense: number;
  };
  scoreComment: {
    feasibility: string;
    equity: string;
    sideEffectControl: string;
  };
  strengths: string[];
  criticalFlaws: string[];
  sharpestQuestion: string;
  voterVerdictText: string;
}
