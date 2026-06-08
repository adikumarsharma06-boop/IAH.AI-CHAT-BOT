export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'ai';
  text: string;
  timestamp: string;
  mode?: 'chat' | 'search' | 'code';
  sources?: GroundingSource[];
  isThinking?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  dueDate: string;
  category: string;
}

export interface MVPTriagingTask {
  id: string;
  title: string;
  completed: boolean;
  phase: string;
}

export interface StartupPlan {
  idea: string;
  validation: string;
  businessModel: string;
  revenueStreams: string[];
  mvpPlan: string;
  techStack: string[];
  marketingStrategy: string;
  riskAnalysis: string;
  tasks: MVPTriagingTask[];
}

export interface CareerRoadmap {
  role: string;
  overview: string;
  steps: {
    title: string;
    description: string;
    skills: string[];
    resources: string[];
  }[];
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  feedback?: {
    score: number;
    strengths: string;
    improvements: string;
    idealAnswerExcerpt: string;
  };
}

export interface SystemUsage {
  totalCredits: number;
  creditsUsed: number;
  requestsCount: number;
  lastActive: string;
}
