'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Sparkles, Trash2 } from 'lucide-react';
import { countWords } from '@/lib/utils';
import type { Format } from '@/types';

const FORMATS: { id: Format; label: string; desc: string }[] = [
  { id: 'gpt',    label: 'GPT',    desc: 'ChatGPT / GPT-4 style' },
  { id: 'claude', label: 'Claude', desc: 'Anthropic Claude style' },
  { id: 'system', label: 'System', desc: 'System prompt format' },
];

interface PromptInputProps {
  onOptimize: () => void;
  isFocused: boolean;
  setIsFocused: (v: boolean) => void;
}

export default function PromptInput({ onOptimize, isFocused, setIsFocused }: PromptInputProps) {
  const { prompt, setPrompt, format, setFormat, isProcessing, devMode } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = countWords(prompt);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(140, ta.scrollHeight)}px`;
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (prompt.trim()) onOptimize();
    }
  };

  return (
    <div className={`prompt-card ${isFocused ? 'focused' : ''}`}>
      {/* Textarea */}
      <div style={{ padding: '18px 20px 12px' }}>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your prompt…"
          className="prompt-textarea"
          disabled={isProcessing}
          spellCheck={false}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

      {/* Controls bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px 14px',
      }}>
        {/* Format pills — these actually change the output structure */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {FORMATS.map((f) => (
            <motion.button
              key={f.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormat(f.id)}
              className={`format-pill ${format === f.id ? 'active' : ''}`}
              title={f.desc}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {devMode && wordCount > 0 && (
            <span style={{
              fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
              color: 'rgba(255,255,255,0.3)', letterSpacing: '-0.12px',
            }}>
              {wordCount}w
            </span>
          )}
          {prompt.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setPrompt('')}
              className="btn-icon btn"
              title="Clear"
            >
              <Trash2 size={12} />
            </motion.button>
          )}
          <motion.button
            whileHover={prompt.trim() && !isProcessing ? { scale: 1.04 } : {}}
            whileTap={prompt.trim() && !isProcessing ? { scale: 0.97 } : {}}
            onClick={onOptimize}
            disabled={!prompt.trim() || isProcessing}
            className="btn btn-primary"
            style={{ height: 40, gap: 7, paddingLeft: 18, paddingRight: 20 }}
          >
            <Sparkles size={13} />
            Optimize
          </motion.button>
        </div>
      </div>

      {/* Format hint (subtle) */}
      {devMode && (
        <div style={{
          padding: '0 20px 12px',
          fontSize: 11,
          color: 'rgba(255,255,255,0.22)',
          letterSpacing: '-0.1px',
        }}>
          Output format: <strong style={{ color: 'rgba(255,255,255,0.45)' }}>{FORMATS.find(f => f.id === format)?.desc}</strong>
        </div>
      )}
    </div>
  );
}
