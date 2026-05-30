'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import type { TokenUsageData } from '@/types';
import { formatTime, formatNumber } from '@/lib/utils';

export default function TokenUsage({ data }: { data: TokenUsageData }) {
  const pct = Math.min(100, (data.inputTokens / data.maxTokens) * 100);
  const hc = data.contextWindow === 'healthy' ? '#22c55e' : data.contextWindow === 'warning' ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="glass metric-card"
      style={{ display: 'flex', flexDirection: 'column', gap: 14, borderRadius: 16, padding: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Activity size={14} style={{ color: '#a78bfa' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#eeeeff' }}>Token Utilization</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#44445a' }}>
          <span>Input Tokens</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {formatNumber(data.inputTokens)} / {formatNumber(data.maxTokens)}
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span style={{ color: '#44445a' }}>Context Window</span>
        <span style={{ fontWeight: 600, color: hc, textTransform: 'capitalize' }}>{data.contextWindow}</span>
      </div>
      {data.estimatedTime > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: '#44445a' }}>Est. Time</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#a78bfa' }}>{formatTime(data.estimatedTime)}</span>
        </div>
      )}
    </motion.div>
  );
}
