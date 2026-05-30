import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Format, Theme, WorkspaceState,
  PipelineStatus, PipelineStep,
  OptimizedResult, HistoryItem, SidebarMode,
} from '@/types';

const defaultPipelineSteps: PipelineStep[] = [
  { id: 'analyzer',  label: 'Analyzer',  description: 'Parses intent and extracts core variables.',  status: 'idle' },
  { id: 'cleaner',   label: 'Cleaner',   description: 'Removes redundancy and ambiguous phrasing.',   status: 'idle' },
  { id: 'builder',   label: 'Builder',   description: 'Constructs final prompt structure.',           status: 'idle' },
  { id: 'optimizer', label: 'Optimizer', description: 'Parameter tuning for specific model.',         status: 'idle' },
];

export interface AppUser {
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
}

interface LoginPayload {
  username: string;
  password?: string;
  displayName?: string;
  email?: string;
  avatar?: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: AppUser | null;
  login: (payload: LoginPayload) => boolean;
  logout: () => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Dev Mode
  devMode: boolean;
  toggleDevMode: () => void;
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;

  // Model
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // Prompt
  prompt: string;
  setPrompt: (prompt: string) => void;
  format: Format;
  setFormat: (format: Format) => void;

  // Workspace
  workspaceState: WorkspaceState;
  setWorkspaceState: (state: WorkspaceState) => void;

  // Processing
  isProcessing: boolean;
  processingProgress: number;
  setProcessingProgress: (progress: number) => void;
  eta: string;
  setEta: (eta: string) => void;

  // Pipeline
  pipelineStatus: PipelineStatus;
  updatePipelineStep: (id: PipelineStep['id'], update: Partial<PipelineStep>) => void;
  resetPipeline: () => void;

  // Output
  optimizedResult: OptimizedResult | null;
  setOptimizedResult: (result: OptimizedResult | null) => void;

  // History
  history: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;

  // UI
  activeSidebarStep: PipelineStep['id'] | null;
  setActiveSidebarStep: (id: PipelineStep['id'] | null) => void;
}

const DEMO_USERS: Record<string, { displayName: string; email: string; password: string }> = {
  johnwick: { displayName: 'John Wick', email: 'john.wick@promptos.io', password: 'JohnWick' },
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      isAuthenticated: false,
      user: null,
      login: (payload) => {
        // Google / external login (no password needed)
        if (!payload.password) {
          set({
            isAuthenticated: true,
            user: {
              username: payload.username,
              displayName: payload.displayName ?? payload.username,
              email: payload.email ?? '',
              avatar: payload.avatar,
            },
          });
          return true;
        }
        // Demo credential login
        const key = payload.username.toLowerCase().replace(/\s+/g, '');
        const u = DEMO_USERS[key];
        if (u && u.password === payload.password) {
          set({
            isAuthenticated: true,
            user: {
              username: payload.username,
              displayName: u.displayName,
              email: u.email,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),

      // Theme
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Dev Mode
      devMode: false,
      toggleDevMode: () => set((s) => ({ devMode: !s.devMode })),
      sidebarMode: 'pipeline',
      setSidebarMode: (mode) => set({ sidebarMode: mode }),

      // Model
      selectedModel: 'llama3.1',
      setSelectedModel: (model) => set({ selectedModel: model }),

      // Prompt
      prompt: '',
      setPrompt: (prompt) =>
        set((s) => ({
          prompt,
          workspaceState:
            prompt.length > 0
              ? s.workspaceState === 'empty' ? 'typing' : s.workspaceState
              : 'empty',
        })),
      format: 'gpt',
      setFormat: (format) => set({ format }),

      // Workspace
      workspaceState: 'empty',
      setWorkspaceState: (state) => set({ workspaceState: state }),

      // Processing
      isProcessing: false,
      processingProgress: 0,
      setProcessingProgress: (progress) => set({ processingProgress: progress }),
      eta: '~12s',
      setEta: (eta) => set({ eta }),

      // Pipeline
      pipelineStatus: { steps: defaultPipelineSteps, currentStep: -1, overallProgress: 0 },
      updatePipelineStep: (id, update) =>
        set((s) => ({
          pipelineStatus: {
            ...s.pipelineStatus,
            steps: s.pipelineStatus.steps.map((step) =>
              step.id === id ? { ...step, ...update } : step
            ),
          },
        })),
      resetPipeline: () =>
        set({
          pipelineStatus: { steps: defaultPipelineSteps, currentStep: -1, overallProgress: 0 },
          processingProgress: 0,
          optimizedResult: null,
          activeSidebarStep: null,
        }),

      // Output
      optimizedResult: null,
      setOptimizedResult: (result) => set({ optimizedResult: result }),

      // History
      history: [],
      addHistoryItem: (item) => set((s) => ({ history: [item, ...s.history].slice(0, 100) })),
      clearHistory: () => set({ history: [] }),

      // UI
      activeSidebarStep: null,
      setActiveSidebarStep: (id) => set({ activeSidebarStep: id }),
    }),
    {
      name: 'promptos-storage-v3',
      partialize: (s) => ({
        theme: s.theme,
        devMode: s.devMode,
        format: s.format,
        history: s.history,
        sidebarMode: s.sidebarMode,
        selectedModel: s.selectedModel,
        isAuthenticated: s.isAuthenticated,
        user: s.user,
      }),
    }
  )
);
