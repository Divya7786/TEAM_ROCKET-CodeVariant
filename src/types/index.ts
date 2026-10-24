export type ProjectStatus = 'buried' | 'risen' | 'archived';

export type AbandonmentReason =
  | 'Lost motivation'
  | 'Scope creep'
  | 'Technical roadblocks'
  | 'Time constraints'
  | 'Market changed'
  | 'Shiny object syndrome'
  | 'Solo burnout'
  | 'Other';

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ReusableAsset {
  id: string;
  title: string;
  description: string;
  category: 'component' | 'hook' | 'utility' | 'idea' | 'config';
  language: string;
  code: string;
  projectId?: string;
  projectName?: string;
  tags: string[];
  dateAdded: string;
  isSample?: boolean;
}

export interface RevivalScores {
  overall: number; // 0 - 100
  marketDemand: number;
  feasibility: number;
  effortRequired: number; // Higher means easier/less effort
  verdict: 'REVIVE' | 'REPURPOSE' | 'ARCHIVE';
  reasoning: string;
  recommendedSteps: string[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'AI Tools' | 'Dev Tools' | 'Web Apps' | 'Mobile' | 'Games' | 'CLI' | 'Utilities';
  technologies: string[];
  status: ProjectStatus;
  repoUrl?: string;
  liveUrl?: string;
  completedTasks: TaskItem[];
  remainingTasks: TaskItem[];
  abandonmentReason: AbandonmentReason | string;
  notes?: string;
  dateBuried: string; // ISO string
  dateRevived?: string;
  lastUpdated: string;
  revivalScore: number;
  revivalScores: RevivalScores;
  isSample?: boolean;
  milestones?: {
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
}

export interface ActivityItem {
  id: string;
  type: 'buried' | 'revived' | 'harvested' | 'updated' | 'archived';
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
  projectName?: string;
}

export type ThemeMode = 'dark' | 'light' | 'purple';

export interface UserSettings {
  userName: string;
  userRole: string;
  theme: ThemeMode;
  autoPlayIntro: boolean;
  hasSeenIntro: boolean;
  reducedMotion: boolean;
}
