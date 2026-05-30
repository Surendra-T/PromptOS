'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { optimizePrompt, type PipelineEvent } from '@/lib/api';
import PromptInput from '@/components/workspace/PromptInput';
import HintCards from '@/components/workspace/HintCards';
import ProcessingState from '@/components/workspace/ProcessingState';
import OutputDisplay from '@/components/workspace/OutputDisplay';
import PipelineView from '@/components/workspace/PipelineView';
import PromptScore from '@/components/workspace/PromptScore';
import TokenUsage from '@/components/workspace/TokenUsage';
import type { OptimizedResult } from '@/types';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function WorkspacePage() {
  const {
    prompt, format, devMode, selectedModel,
    workspaceState, setWorkspaceState,
    setProcessingProgress, setEta,
    updatePipelineStep, resetPipeline,
    setOptimizedResult, optimizedResult,
    addHistoryItem,
  } = useStore();

  const [isFocused, setIsFocused] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const isProcessing = useStore(s => s.isProcessing);

  const handleOptimize = useCallback(async () => {
    if (!prompt.trim() || isProcessing) return;
    resetPipeline();
    setWorkspaceState('processing');
    useStore.setState({ isProcessing: true });
    setProcessingProgress(0);
    setEta('~12s');
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await optimizePrompt(prompt, format, selectedModel, (ev: PipelineEvent) => {
        if (ev.type === 'step_start') {
          updatePipelineStep(ev.step, { status: 'running' });
          useStore.setState({ activeSidebarStep: ev.step });
        } else if (ev.type === 'step_complete') {
          updatePipelineStep(ev.step, { status: 'complete', result: ev.result, duration: ev.duration, preview: ev.preview });
        } else if (ev.type === 'progress') {
          setProcessingProgress(ev.progress);
          setEta(ev.eta);
        } else if (ev.type === 'complete') {
          const r = ev.result as OptimizedResult;
          setOptimizedResult(r);
          setWorkspaceState('output');
          useStore.setState({ isProcessing: false, activeSidebarStep: 'optimizer' });
          addHistoryItem({
            id: Date.now().toString(),
            title: prompt.slice(0, 60) + (prompt.length > 60 ? '…' : ''),
            originalPrompt: prompt,
            optimizedPrompt: r.optimizedPrompt,
            score: r.score,
            tokenCount: r.tokenCount,
            model: selectedModel,
            format,
            latency: r.generationTime,
            createdAt: new Date().toISOString(),
          });
        } else if (ev.type === 'error') {
          setWorkspaceState('typing');
          useStore.setState({ isProcessing: false });
        }
      }, ctrl.signal);
    } catch {
      setWorkspaceState('typing');
      useStore.setState({ isProcessing: false });
    }
  }, [prompt, format, selectedModel, isProcessing, resetPipeline, setWorkspaceState, setProcessingProgress, setEta, updatePipelineStep, setOptimizedResult, addHistoryItem]);

  const handleCancel = () => {
    abortRef.current?.abort();
    resetPipeline();
    setWorkspaceState('typing');
    useStore.setState({ isProcessing: false });
  };

  const isEmptyOrTyping = workspaceState === 'empty' || workspaceState === 'typing';
  const isProc = workspaceState === 'processing';
  const hasOutput = workspaceState === 'output';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease }}
      style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}
    >
      {/* ── HERO SECTION — pure black like iPad Pro ───────── */}
      <div style={{ background: '#000', color: '#f5f5f7', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          maxWidth: 800, margin: '0 auto', width: '100%',
          padding: '0 32px 80px',
          paddingTop: isEmptyOrTyping ? 96 : 56,
        }}>

          {/* Hero headline — Apple massive style */}
          <AnimatePresence>
            {isEmptyOrTyping && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: .97 }}
                transition={{ duration: .5, ease }}
                style={{ textAlign: 'center', marginBottom: 52 }}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .06, duration: .5, ease }}
                  className="text-hero"
                  style={{ marginBottom: 16 }}
                >
                  {devMode ? 'What are we\noptimizing?' : 'Illuminated\nPrecision.'}
                </motion.h1>
                {!devMode && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .14, duration: .5, ease }}
                    style={{
                      fontSize: 21, fontWeight: 400, lineHeight: 1.381,
                      letterSpacing: '.011em', color: 'rgba(245,245,247,.55)',
                      maxWidth: 460, margin: '0 auto',
                    }}
                  >
                    Craft, refine, and perfect your prompts with a 4-agent AI pipeline.
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <AnimatePresence mode="popLayout">
            {!isProc && (
              <motion.div
                key="input"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: .98, y: -10 }}
                transition={{ duration: .38, ease }}
              >
                <PromptInput
                  onOptimize={handleOptimize}
                  isFocused={isFocused}
                  setIsFocused={setIsFocused}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard hint */}
          <AnimatePresence>
            {isEmptyOrTyping && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: .25 }}
                style={{
                  textAlign: 'center', marginTop: 14,
                  fontSize: 13, color: 'rgba(245,245,247,.25)', letterSpacing: '-.01em',
                }}
              >
                {devMode
                  ? `${format.toUpperCase()} · ${selectedModel} · ⌘↵ optimize`
                  : '⌘ + Enter to optimize'}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Hint cards */}
          <AnimatePresence>
            {workspaceState === 'empty' && !devMode && (
              <motion.div
                key="hints"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: .3, duration: .4, ease }}
                style={{ marginTop: 48 }}
              >
                <HintCards />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing */}
          <AnimatePresence>
            {isProc && (
              <motion.div
                key="proc"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: .38, ease }}
              >
                <ProcessingState onCancel={handleCancel} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output */}
          <AnimatePresence>
            {hasOutput && (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: .06, duration: .48, ease }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}
              >
                <OutputDisplay />

                {devMode && optimizedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .2 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
                  >
                    <div className="apple-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <p className="text-label text-tertiary" style={{ marginBottom: 12 }}>Prompt Score</p>
                      <PromptScore score={optimizedResult.score} clarityScore={optimizedResult.clarityScore} contextScore={optimizedResult.contextScore} size="md" />
                    </div>
                    <TokenUsage data={{
                      inputTokens: optimizedResult.tokenCount,
                      maxTokens: 4096,
                      contextWindow: optimizedResult.tokenCount > 3000 ? 'warning' : 'healthy',
                      estimatedTime: optimizedResult.generationTime,
                    }} />
                  </motion.div>
                )}

                {devMode && <PipelineView />}

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
                  style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                    onClick={() => { resetPipeline(); setWorkspaceState('empty'); useStore.setState({ prompt: '' }); }}
                    className="btn btn-secondary"
                    style={{ fontSize: 15 }}
                  >
                    Optimize another prompt
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
