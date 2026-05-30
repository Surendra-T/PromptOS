'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { XCircle, Sparkles, RefreshCw, AlignLeft } from 'lucide-react';

const METRICS = [
  { label: 'Semantic Clarity', icon: Sparkles },
  { label: 'Token Efficiency', icon: RefreshCw },
  { label: 'Structure',        icon: AlignLeft },
];

export default function ProcessingState({ onCancel }: { onCancel: () => void }) {
  const { prompt, processingProgress, eta } = useStore();
  const lines = prompt.split('\n').filter(Boolean).slice(0, 8);
  if (lines.length === 0) lines.push(prompt.slice(0, 120));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 10px rgba(167,139,250,0.8)' }}
            />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#eeeeff', letterSpacing: '-0.01em' }}>
              Prompt Optimization
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#555570', marginLeft: 16 }}>
            AI is analyzing and rebuilding your prompt...
          </p>
        </div>
        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#44445a', marginTop: 2 }}>
          ETA: {eta}
        </span>
      </div>

      {/* Code editor card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass"
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#33334a','#33334a','#33334a'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#44445a' }}>
            input_prompt.txt
          </span>
        </div>
        <div className="code-block" style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.2)' }}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`code-line ${i === 2 ? 'active' : ''}`}
            >
              <span className="line-num">{i + 1}</span>
              <span style={{ color: i === 2 ? '#a78bfa' : '#8888aa', fontSize: 13 }}>{line}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {METRICS.map(({ label, icon: Icon }, i) => {
          const p = processingProgress;
          const started = p > i * 28;
          const done = p > (i + 1) * 28 + 10;
          const statusText = !started ? 'Waiting...' : done ? 'Complete ✓' :
            i === 0 ? 'Analyzing...' : i === 1 ? 'Optimizing...' : 'Rebuilding...';

          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="metric-card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <p style={{ fontSize: 11, color: '#44445a', marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: started ? '#a78bfa' : '#555570' }}>
                  {statusText}
                </p>
              </div>
              <Icon size={15} style={{ color: started ? '#a78bfa' : '#33334a' }} />
            </motion.div>
          );
        })}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#44445a', fontWeight: 600 }}>
            Processing
          </span>
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#a78bfa', fontWeight: 600 }}>
            {Math.round(processingProgress)}%
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${processingProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Cancel */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ borderRadius: 100 }}
        >
          <XCircle size={14} />
          Cancel Optimization
        </motion.button>
      </div>
    </motion.div>
  );
}
