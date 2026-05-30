'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Edit3, Download, Check, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatTime, formatNumber, getScoreColor } from '@/lib/utils';
import type { DiffSegment } from '@/types';

function DiffText({ segments }: { segments: DiffSegment[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <span key={i} className={s.type === 'added' ? 'diff-add' : s.type === 'removed' ? 'diff-del' : ''}>
          {s.text}
        </span>
      ))}
    </>
  );
}

export default function OutputDisplay() {
  const { optimizedResult } = useStore();
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!optimizedResult) return null;

  const { optimizedPrompt, originalPrompt, score, tokenCount, generationTime, diffHighlights, sections } = optimizedResult;
  const scoreColor = getScoreColor(score);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([optimizedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'optimized_prompt.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Original (collapsible) */}
      <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', cursor: 'pointer', background: 'transparent', border: 'none',
            color: '#8888aa', fontSize: 13,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Edit3 size={13} />
            <span style={{ fontWeight: 500 }}>Original Prompt</span>
          </div>
          <motion.div animate={{ rotate: showOriginal ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.div>
        </button>
        <AnimatePresence>
          {showOriginal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '0 18px 16px',
                fontSize: 14, lineHeight: 1.7, color: '#8888aa',
                fontFamily: 'JetBrains Mono, monospace',
                background: 'rgba(0,0,0,0.2)', margin: '0 18px 16px',
                borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
                whiteSpace: 'pre-wrap',
              }}>
                {originalPrompt}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optimized Output */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass"
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: scoreColor, boxShadow: `0 0 8px ${scoreColor}`,
              animation: 'pulseRing 2s ease-in-out infinite',
            }} />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#eeeeff', marginBottom: 1 }}>Optimized Output</h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { icon: copied ? Check : Copy, label: copied ? 'Copied!' : 'Copy', action: handleCopy },
              { icon: Edit3, label: 'Edit', action: undefined },
              { icon: Download, label: 'Export', action: handleExport },
            ].map(({ icon: Icon, label, action }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={action}
                className="btn btn-secondary"
                style={{ height: 32, fontSize: 12, borderRadius: 8, padding: '0 12px' }}
              >
                <Icon size={12} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 18px' }}>
          {sections && sections.length > 0 ? (
            <div className="code-block" style={{
              background: 'rgba(0,0,0,0.35)', borderRadius: 12, padding: '18px',
              border: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.8,
              fontSize: 13, color: '#8888aa',
            }}>
              {sections.map((sec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  style={{ marginBottom: 8 }}
                >
                  <span className={`label-${sec.label.toLowerCase()}`}>{sec.label}: </span>
                  <span style={{ color: '#ccccee' }}>{sec.content}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#aaaacc' }}>
              {diffHighlights.length > 0
                ? <DiffText segments={diffHighlights} />
                : <p style={{ whiteSpace: 'pre-wrap' }}>{optimizedPrompt}</p>
              }
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#44445a' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
              {formatNumber(tokenCount)} Tokens
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#44445a', display: 'inline-block' }} />
              {formatTime(generationTime)} Generation
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
            <Check size={12} style={{ color: scoreColor }} />
            <span style={{ color: scoreColor }}>Quality Score: {score}/100</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
