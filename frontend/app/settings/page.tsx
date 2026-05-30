'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { User, Palette, Code2, Eye, EyeOff, Copy, RefreshCw, Edit, Key, Shield, Check, Server } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const spring = { type: 'spring' as const, stiffness: 340, damping: 32 };

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`apple-toggle ${on ? 'on' : ''}`}
      role="switch" aria-checked={on} aria-label={label}
      whileTap={{ scale: .94 }}
    >
      <div className="apple-toggle-thumb" />
    </motion.button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 style={{
      fontSize: 21, fontWeight: 600, letterSpacing: '-.016em',
      color: 'inherit', marginBottom: 10,
    }}>
      {title}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="apple-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
      {children}
    </div>
  );
}

function RowDivider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '0 20px' }} />;
}

function SettingRow({ icon: Icon, title, desc, control }: {
  icon: React.ElementType; title: string; desc: string; control: React.ReactNode;
}) {
  return (
    <div className="setting-row">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.09)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(245,245,247,.62)',
        }}>
          <Icon size={15} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: 'inherit', marginBottom: 2, letterSpacing: '-.016em' }}>{title}</p>
          <p className="text-caption text-tertiary" style={{ lineHeight: 1.4 }}>{desc}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

const MODELS = [
  { id: 'llama3.1', label: 'Llama 3.1', desc: '4.9 GB · Best quality · Recommended' },
  { id: 'phi3.5',   label: 'Phi 3.5 Mini', desc: '2.2 GB · 4× faster · Good quality' },
];

export default function SettingsPage() {
  const { theme, toggleTheme, devMode, toggleDevMode, selectedModel, setSelectedModel, user } = useStore();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modelSaved, setModelSaved] = useState(false);
  const key = 'sk-promptos-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleModelSelect = (id: string) => {
    setSelectedModel(id);
    setModelSaved(true);
    setTimeout(() => setModelSaved(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      style={{ minHeight: 'calc(100vh - 48px)', padding: '56px 32px' }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Page header */}
        <div>
          <h1 className="text-display" style={{ marginBottom: 10 }}>Settings</h1>
          <p className="text-body text-muted">
            Manage your workspace, preferences, and integrations.
          </p>
        </div>

        {/* Account */}
        <div>
          <SectionHeader title="Account" />
          <Card>
            <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.displayName}
                    style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,.1)' }} />
                ) : (
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: '#0071e3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-.016em',
                  }}>
                    {user?.displayName?.charAt(0)?.toUpperCase() ?? 'J'}
                  </div>
                )}
                <div>
                  <p style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.022em', marginBottom: 3 }}>
                    {user?.displayName ?? 'John Wick'}
                  </p>
                  <p className="text-caption text-tertiary">{user?.email ?? 'john.wick@promptos.io'}</p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} className="btn btn-ghost" style={{ height: 38, fontSize: 14 }}>
                <Edit size={13} /> Edit
              </motion.button>
            </div>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <SectionHeader title="Preferences" />
          <Card>
            <SettingRow
              icon={Palette} title="Appearance"
              desc="Switch between Dark and Light workspace environments."
              control={<Toggle on={theme === 'dark'} onToggle={toggleTheme} label="Toggle theme" />}
            />
            <RowDivider />
            <SettingRow
              icon={Code2} title="Developer Mode"
              desc="Enables pipeline visualization, per-agent ms timing, API logs, and debugging tools."
              control={<Toggle on={devMode} onToggle={toggleDevMode} label="Toggle developer mode" />}
            />
          </Card>
        </div>

        {/* AI Model */}
        <div>
          <SectionHeader title="AI Model" />
          <Card>
            <div style={{ padding: '20px 20px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Server size={14} style={{ color: 'rgba(245,245,247,.45)', flexShrink: 0 }} />
                <p className="text-caption text-tertiary">
                  Ollama models running locally on your machine. Switch to change which model powers all 4 pipeline agents.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MODELS.map(m => (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: .99 }}
                    onClick={() => handleModelSelect(m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: 12, cursor: 'pointer', width: '100%',
                      border: selectedModel === m.id ? '1.5px solid #0071e3' : '1.5px solid rgba(255,255,255,.08)',
                      background: selectedModel === m.id ? 'rgba(0,113,227,.12)' : 'rgba(255,255,255,.03)',
                      transition: 'all .18s', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <div>
                      <p style={{
                        fontSize: 15, fontWeight: 500, letterSpacing: '-.016em', marginBottom: 2,
                        color: selectedModel === m.id ? '#2997ff' : 'rgba(245,245,247,.88)',
                      }}>
                        {m.label}
                      </p>
                      <p className="text-micro text-tertiary">{m.desc}</p>
                    </div>
                    <AnimatePresence>
                      {selectedModel === m.id && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={spring}
                        >
                          <Check size={16} style={{ color: '#0071e3', flexShrink: 0 }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {modelSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '10px 14px', marginTop: 10,
                      background: 'rgba(52,199,89,.08)', border: '1px solid rgba(52,199,89,.2)',
                      borderRadius: 10,
                    }}
                  >
                    <Check size={13} style={{ color: '#30d158' }} />
                    <span style={{ fontSize: 13, color: '#30d158', letterSpacing: '-.01em' }}>
                      Model updated — takes effect on next optimization.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 14px', marginTop: 12, marginBottom: 4,
                background: 'rgba(52,199,89,.06)', border: '1px solid rgba(52,199,89,.15)',
                borderRadius: 10,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 6px rgba(48,209,88,.7)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#30d158', letterSpacing: '-.01em' }}>
                  Ollama is running locally — {selectedModel}:latest active
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* API Credentials */}
        <div>
          <SectionHeader title="API Credentials" />
          <Card>
            <div style={{ padding: '20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(245,245,247,.62)',
                }}>
                  <Key size={15} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.016em', marginBottom: 2 }}>Primary API Key</p>
                  <p className="text-caption text-tertiary">Authenticate external scripts and CI/CD pipelines.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 11,
                  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(245,245,247,.5)',
                }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {showKey ? key : '•'.repeat(40)}
                  </span>
                  <button onClick={() => setShowKey(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,247,.4)', display: 'flex', padding: 2 }}>
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} onClick={handleCopy} className="btn btn-ghost" style={{ height: 42, gap: 5, fontSize: 14 }}>
                  {copied ? <Check size={13} style={{ color: '#30d158' }} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>

              <button style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, color: '#2997ff',
                display: 'flex', alignItems: 'center', gap: 5,
                letterSpacing: '-.016em', fontFamily: 'inherit',
              }}>
                <RefreshCw size={12} /> Regenerate Key
              </button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
