'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { BarChart2, Wand2, Wrench, Zap, Check, Loader2, Clock } from 'lucide-react';
import type { PipelineStep } from '@/types';

const META: Record<string, { icon: React.ElementType; color: string }> = {
  analyzer:  { icon: BarChart2, color: '#a78bfa' },
  cleaner:   { icon: Wand2,     color: '#60a5fa' },
  builder:   { icon: Wrench,    color: '#34d399' },
  optimizer: { icon: Zap,       color: '#fbbf24' },
};

function PipeCard({ step, index }: { step: PipelineStep; index: number }) {
  const { icon: Icon, color } = META[step.id] ?? META.analyzer;
  const isActive = step.status === 'running';
  const isDone = step.status === 'complete';
  const isPending = step.status === 'idle';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`pipe-card ${isActive ? 'active' : isDone ? 'done' : isPending ? 'pending' : ''}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#33334a' }}>0{index + 1}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isDone && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ fontSize: 10, fontWeight: 600, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 3 }}
            >
              <Check size={10} /> Done
            </motion.span>
          )}
          {isActive && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ fontSize: 10, fontWeight: 600, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 3 }}
            >
              <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> Active
            </motion.span>
          )}
          {isPending && (
            <span style={{ fontSize: 10, color: '#33334a', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} /> Pending
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} style={{ color }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#eeeeff' }}>{step.label}</p>
          <p style={{ fontSize: 11, color: '#33334a' }}>{step.description}</p>
        </div>
      </div>

      {step.preview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: 10, padding: '8px 12px', borderRadius: 8,
            background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#22c55e',
            lineHeight: 1.5, overflow: 'hidden',
          }}
        >
          {step.preview.slice(0, 100)}
        </motion.div>
      )}

      {step.duration && (
        <p style={{ marginTop: 6, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#33334a', textAlign: 'right' }}>
          {step.duration}ms
        </p>
      )}
    </motion.div>
  );
}

export default function PipelineView() {
  const { pipelineStatus } = useStore();
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#33334a', marginBottom: 14 }}>
        Execution Pipeline
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        {pipelineStatus.steps.map((step, i) => (
          <PipeCard key={step.id} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}
