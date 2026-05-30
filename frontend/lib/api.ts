import type { Format, OptimizedResult, HistoryItem, Template, PipelineStep } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type PipelineEvent =
  | { type: 'step_start'; step: PipelineStep['id']; timestamp: number }
  | { type: 'step_complete'; step: PipelineStep['id']; result: string; duration: number; preview: string; timestamp: number }
  | { type: 'progress'; progress: number; eta: string }
  | { type: 'complete'; result: OptimizedResult }
  | { type: 'error'; message: string };

export async function optimizePrompt(
  prompt: string,
  format: Format,
  model: string,
  onEvent: (event: PipelineEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, format, model }),
    signal,
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          onEvent(data as PipelineEvent);
        } catch { /* ignore */ }
      }
    }
  }
}

export async function getHistory(search?: string): Promise<HistoryItem[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_BASE}/api/history${params}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function getTemplates(category?: string): Promise<Template[]> {
  const params = category && category !== 'all' ? `?category=${category}` : '';
  const res = await fetch(`${API_BASE}/api/templates${params}`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
