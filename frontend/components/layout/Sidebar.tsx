'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  BarChart2, Wand2, Wrench, Zap, Code2,
  Variable, Terminal, Settings2, Bug, Rocket,
  ChevronRight, Star, Check, Loader2, Clock,
} from 'lucide-react';

const STEPS = [
  { id: 'analyzer',  label: 'Analyzer',  icon: BarChart2, desc: 'Parses intent' },
  { id: 'cleaner',   label: 'Cleaner',   icon: Wand2,     desc: 'Removes noise' },
  { id: 'builder',   label: 'Builder',   icon: Wrench,    desc: 'Structures prompt' },
  { id: 'optimizer', label: 'Optimizer', icon: Zap,       desc: 'Fine-tunes' },
] as const;

const DEV_ITEMS = [
  { id: 'devmode',    label: 'Dev Mode',      icon: Code2 },
  { id: 'variables',  label: 'Variables',     icon: Variable },
  { id: 'apilogs',    label: 'API Logs',      icon: Terminal },
  { id: 'modelconfig',label: 'Model Config',  icon: Settings2 },
  { id: 'debug',      label: 'Debug',         icon: Bug },
];

export default function Sidebar() {
  const { sidebarMode, setSidebarMode, pipelineStatus, activeSidebarStep, setActiveSidebarStep } = useStore();
  const steps = pipelineStatus.steps;

  return (
    <motion.aside
      key="sidebar"
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -240, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
      className="apple-sidebar"
      style={{ pointerEvents: 'auto' }}
    >
      {sidebarMode === 'pipeline' ? (
        <>
          {/* Header */}
          <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              Dev Pipeline
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 6px rgba(48,209,88,0.7)', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.12px' }}>Active Session</span>
            </div>
          </div>

          {/* Steps */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
            {STEPS.map((step, i) => {
              const st = steps[i];
              const status = st?.status ?? 'idle';
              const isActive = activeSidebarStep === step.id;
              const Icon = step.icon;

              const iconColor =
                status === 'running'  ? '#2997ff' :
                status === 'complete' ? '#30d158' :
                'rgba(255,255,255,0.25)';

              return (
                <motion.button
                  key={step.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSidebarStep(isActive ? null : step.id)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    opacity: status === 'idle' && !isActive ? 0.5 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {status === 'running' ? (
                      <Loader2 size={14} style={{ color: '#2997ff', animation: 'spin 1s linear infinite' }} />
                    ) : status === 'complete' ? (
                      <Check size={14} style={{ color: '#30d158' }} />
                    ) : (
                      <Icon size={14} style={{ color: iconColor }} />
                    )}
                  </div>
                  <span style={{ flex: 1 }}>{step.label}</span>
                  {st?.duration ? (
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.25)' }}>
                      {st.duration}ms
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '-0.1px' }}>
                      {status === 'running' ? '...' : status === 'complete' ? '✓' : '—'}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSidebarMode('devtools')}
              className="sidebar-item"
              style={{ marginBottom: 8, cursor: 'pointer' }}
            >
              <Code2 size={14} />
              <span>Dev Tools</span>
              <ChevronRight size={12} style={{ marginLeft: 'auto' }} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              style={{ width: '100%', height: 34, fontSize: 13, borderRadius: 8, justifyContent: 'center', cursor: 'pointer' }}
            >
              <Star size={11} /> Pro
            </motion.button>
          </div>
        </>
      ) : (
        <>
          {/* Dev Tools header */}
          <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              Dev Tools
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#30d158', display: 'inline-block', boxShadow: '0 0 6px rgba(48,209,88,0.7)' }} />
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.35)' }}>v1.0.4 — ACTIVE</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '10px 8px' }}>
            {DEV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                  className={`sidebar-item ${item.id === 'devmode' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
          <div style={{ padding: '10px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              style={{ width: '100%', height: 36, fontSize: 13, borderRadius: 8, justifyContent: 'center', cursor: 'pointer', marginBottom: 6 }}
            >
              <Rocket size={12} /> Deploy
              <ChevronRight size={11} />
            </motion.button>
            <motion.button
              onClick={() => setSidebarMode('pipeline')}
              className="sidebar-item"
              style={{ justifyContent: 'center', fontSize: 12, cursor: 'pointer' }}
              whileHover={{ x: 0 }}
            >
              ← Pipeline View
            </motion.button>
          </div>
        </>
      )}
    </motion.aside>
  );
}
