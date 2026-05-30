export type Format = 'gpt' | 'claude' | 'system';
export type Theme = 'dark' | 'light';
export type WorkspaceState = 'empty' | 'typing' | 'processing' | 'output';
export type PipelineStepStatus = 'idle' | 'running' | 'complete' | 'error';
export type SidebarMode = 'pipeline' | 'devtools';

export interface PipelineStep {
  id: 'analyzer' | 'cleaner' | 'builder' | 'optimizer';
  label: string;
  description: string;
  status: PipelineStepStatus;
  result?: string;
  duration?: number;
  preview?: string;
}

export interface PipelineStatus {
  steps: PipelineStep[];
  currentStep: number;
  overallProgress: number;
}

export interface OptimizedResult {
  optimizedPrompt: string;
  originalPrompt: string;
  score: number;
  clarityScore: number;
  contextScore: number;
  tokenCount: number;
  generationTime: number;
  diffHighlights: DiffSegment[];
  sections?: PromptSection[];
  tags?: string[];
}

export interface DiffSegment {
  text: string;
  type: 'added' | 'removed' | 'unchanged';
}

export interface PromptSection {
  label: string;
  content: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  originalPrompt: string;
  optimizedPrompt: string;
  score: number;
  tokenCount: number;
  model: string;
  format: Format;
  latency: number;
  estimatedCost?: number;
  createdAt: string;
  hasHallucinationRisk?: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  promptText: string;
  icon: string;
  previewText: string;
}

export type TemplateCategory = 'all' | 'coding' | 'writing' | 'analysis' | 'marketing';

export interface ProcessingMetric {
  label: string;
  status: 'idle' | 'analyzing' | 'optimizing' | 'rebuilding' | 'complete';
  icon: string;
}

export interface TokenUsageData {
  inputTokens: number;
  maxTokens: number;
  contextWindow: 'healthy' | 'warning' | 'critical';
  estimatedTime: number;
}
