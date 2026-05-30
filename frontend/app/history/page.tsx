'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Play, Eye, AlertTriangle, Clock, Zap, DollarSign, X } from 'lucide-react';
import { getScoreColor, timeAgo, formatTime } from '@/lib/utils';
import type { HistoryItem } from '@/types';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ── Mini score ring ─────────────────────────────────── */
function MiniScore({ score }: { score: number }) {
  const color = getScoreColor(score);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const sz = (r + 5) * 2;
  return (
    <div style={{ position: 'relative', width: sz, height: sz, flexShrink: 0 }}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="score-ring-svg">
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={3} />
        <motion.circle
          cx={sz / 2} cy={sz / 2} r={r}
          fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{score}</span>
      </div>
    </div>
  );
}

/* ── Full-screen output modal ────────────────────────── */
function OutputModal({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720, maxHeight: '85vh',
          background: '#1c1c1e', borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
              Optimized Output
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.016em' }}>{item.title}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.08)', color: 'rgba(245,245,247,0.7)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} />
          </motion.button>
        </div>

        {/* Modal body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Scores */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Score', value: item.score, suffix: '/100', color: getScoreColor(item.score) },
              { label: 'Tokens', value: item.tokenCount, suffix: '', color: '#2997ff' },
              { label: 'Latency', value: Math.round(item.latency / 1000), suffix: 's', color: '#30d158' },
              { label: 'Model', value: item.model, suffix: '', color: '#a78bfa' },
            ].map(({ label, value, suffix, color }) => (
              <div key={label} style={{
                flex: '1 1 120px', padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.4)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: 17, fontWeight: 700, color, letterSpacing: '-0.022em' }}>{value}{suffix}</p>
              </div>
            ))}
          </div>

          {/* Original */}
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,245,247,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
            Original Prompt
          </p>
          <div style={{
            padding: '14px 16px', borderRadius: 12, marginBottom: 20,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgba(245,245,247,0.55)',
            lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {item.originalPrompt}
          </div>

          {/* Optimized */}
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,245,247,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
            Optimized Output
          </p>
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: 'rgba(0,113,227,0.06)', border: '1px solid rgba(0,113,227,0.2)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#f5f5f7',
            lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {item.optimizedPrompt || '(Result not cached in session — re-run to view)'}
          </div>
        </div>

        {/* Modal footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose} className="btn btn-ghost" style={{ height: 40, fontSize: 14 }}>
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── History card ────────────────────────────────────── */
function HistoryCard({ item, index }: { item: HistoryItem; index: number }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { setPrompt, setWorkspaceState, devMode } = useStore();
  const router = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, type: 'spring', stiffness: 340, damping: 30 }}
        className="history-card"
      >
        {/* Card header — clickable to expand */}
        <motion.div
          onClick={() => setOpen(o => !o)}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'pointer' }}
        >
          <MiniScore score={item.score} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
              {item.hasHallucinationRisk && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 10, fontWeight: 700, color: '#ff9f0a',
                  background: 'rgba(255,159,10,0.1)', border: '1px solid rgba(255,159,10,0.25)',
                  padding: '2px 8px', borderRadius: 6,
                }}>
                  <AlertTriangle size={9} /> High Risk
                </span>
              )}
              <span style={{
                fontSize: 11, fontWeight: 500, padding: '2px 9px', borderRadius: 6,
                background: 'rgba(0,113,227,0.12)', color: '#2997ff', border: '1px solid rgba(0,113,227,0.2)',
              }}>
                {item.model}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.38)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Clock size={10} /> {timeAgo(item.createdAt)}
              </span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', marginBottom: 2, letterSpacing: '-0.016em' }}>
              {item.title}
            </p>
            {!open && (
              <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.38)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.originalPrompt}
              </p>
            )}
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease }}>
            <ChevronDown size={14} style={{ color: 'rgba(245,245,247,0.3)' }} />
          </motion.div>
        </motion.div>

        {/* Expanded body */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Original Input
                </p>
                <div style={{
                  padding: '12px 14px', borderRadius: 10, marginBottom: 14,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgba(245,245,247,0.55)',
                  lineHeight: 1.65, whiteSpace: 'pre-wrap',
                }}>
                  {item.originalPrompt}
                </div>

                {devMode && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                    {[
                      { icon: Zap, label: 'Latency', val: formatTime(item.latency) },
                      { label: 'Tokens', val: String(item.tokenCount) },
                      { icon: DollarSign, label: 'Est. Cost', val: item.estimatedCost ? `$${item.estimatedCost.toFixed(4)}` : 'N/A' },
                    ].map(({ label, val }) => (
                      <div key={label} className="metric-card" style={{ textAlign: 'center', padding: 12 }}>
                        <p style={{ fontSize: 10, color: 'rgba(245,245,247,0.38)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#f5f5f7', fontFamily: 'JetBrains Mono, monospace' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    className="btn btn-secondary"
                    style={{ flex: 1, height: 40, fontSize: 14, borderRadius: 10 }}
                    onClick={() => setShowModal(true)}
                  >
                    <Eye size={13} /> View Output
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    onClick={() => { setPrompt(item.originalPrompt); setWorkspaceState('typing'); router.push('/'); }}
                    className="btn btn-primary"
                    style={{ flex: 1, height: 40, fontSize: 14, borderRadius: 100 }}
                  >
                    <Play size={13} /> Re-run
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Output modal */}
      <AnimatePresence>
        {showModal && <OutputModal item={item} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ── Demo data ───────────────────────────────────────── */
const DEMO: HistoryItem[] = [
  { id: 'd1', title: 'React Component Refactoring Master', originalPrompt: 'Refactor this React component. Make it use hooks and functional components. It currently uses class components. Add types for typescript. Make sure it handles error states better and shows a loading spinner while fetching data.', optimizedPrompt: 'You are a senior React engineer specializing in TypeScript migrations.\n\nTask: Refactor the provided class component into a modern functional component.\n\nRequirements:\n- Convert class lifecycle methods to React hooks (useEffect, useState, useReducer)\n- Add comprehensive TypeScript interfaces for all props and state\n- Implement error boundary logic with graceful error states\n- Add a loading spinner component during async data fetching\n- Maintain identical external API surface\n\nFormat: Provide the complete refactored component with inline comments explaining each migration decision.', score: 92, tokenCount: 4200, model: 'llama3.1', format: 'gpt', latency: 842000, estimatedCost: 0.0012, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'd2', title: 'Write a Python script to parse CSV...', originalPrompt: 'Write a python script to parse a CSV file and upload the contents to an AWS S3 bucket using boto3.', optimizedPrompt: 'You are a Python developer with expertise in AWS services.\n\nTask: Write a robust Python script that reads a CSV file and uploads its contents to an AWS S3 bucket using the boto3 library.\n\nRequirements:\n- Accept file path and S3 bucket/key as command-line arguments\n- Handle CSV parsing with proper encoding detection\n- Implement multipart upload for large files\n- Include error handling and retry logic\n- Log progress with timestamps\n\nFormat: Complete, runnable Python script with argparse, docstrings, and example usage in comments.', score: 82, tokenCount: 1200, model: 'llama3.1', format: 'claude', latency: 650000, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'd3', title: 'Explain ML to a 10-year-old', originalPrompt: 'Explain machine learning to a 10-year-old in a fun way.', optimizedPrompt: 'You are an enthusiastic science educator who specializes in making complex topics fun and accessible for children.\n\nTask: Explain machine learning to a 10-year-old using relatable analogies and interactive examples.\n\nRequirements:\n- Use analogies from everyday life (games, animals, food)\n- Include a simple activity the child can try\n- Keep sentences short and vocabulary age-appropriate\n- Build excitement about technology\n\nFormat: 3-4 short paragraphs with an emoji for each section and one hands-on activity at the end.', score: 88, tokenCount: 890, model: 'llama3.1', format: 'gpt', latency: 520000, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
];

/* ── Page ────────────────────────────────────────────── */
export default function HistoryPage() {
  const { history, devMode } = useStore();
  const [search, setSearch] = useState('');

  const allItems = history.length > 0 ? history : DEMO;
  const items = allItems.filter(h =>
    h.title.toLowerCase().includes(search.toLowerCase()) ||
    h.originalPrompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
      style={{ minHeight: 'calc(100vh - 48px)', padding: '60px 32px' }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <h1 className="text-display" style={{ marginBottom: 8 }}>
              {devMode ? 'Execution History' : 'History'}
            </h1>
            <p className="text-caption text-muted">
              Every optimization, saved and ready.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,245,247,0.35)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search history…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 36, paddingRight: 14, height: 40, borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
                color: '#f5f5f7', fontSize: 14, outline: 'none', fontFamily: 'inherit',
                width: 220, transition: 'border-color 0.2s, box-shadow 0.2s', letterSpacing: '-0.016em',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,113,227,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 17, color: 'rgba(245,245,247,0.35)' }}>No results for "{search}"</p>
            </motion.div>
          ) : (
            items.map((item, i) => <HistoryCard key={item.id} item={item} index={i} />)
          )}
        </div>
      </div>
    </motion.div>
  );
}
