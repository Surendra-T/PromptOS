'use client';

import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface PromptScoreProps {
  score: number;
  clarityScore?: number;
  contextScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PromptScore({ score, clarityScore, contextScore, size = 'md' }: PromptScoreProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const r = size === 'lg' ? 52 : size === 'sm' ? 28 : 40;
  const sw = size === 'sm' ? 3 : 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const sz = (r + sw + 6) * 2;
  const fontSize = size === 'lg' ? 32 : size === 'sm' ? 16 : 26;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: sz, height: sz }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="score-ring-svg">
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
          <motion.circle
            cx={sz/2} cy={sz/2} r={r}
            fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 280, damping: 20 }}
            style={{ fontSize, fontWeight: 800, color, lineHeight: 1 }}
          >
            {score}
          </motion.span>
          <span style={{ fontSize: 10, color: '#33334a' }}>/100</span>
        </div>
      </div>

      {size !== 'sm' && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ fontSize: 12, fontWeight: 600, color }}
        >
          {label}
        </motion.p>
      )}

      {(clarityScore !== undefined || contextScore !== undefined) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 10 }}
        >
          {[{ label: 'Clarity', val: clarityScore }, { label: 'Context', val: contextScore }]
            .filter(x => x.val !== undefined)
            .map(({ label: l, val }) => (
              <div key={l} style={{
                textAlign: 'center', padding: '8px 14px', borderRadius: 10,
                background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ fontSize: 10, color: '#33334a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#eeeeff', marginTop: 2 }}>{val}%</p>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
}
