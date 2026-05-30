'use client';

import { motion } from 'framer-motion';
import { Lightbulb, SlidersHorizontal, Target, Layers } from 'lucide-react';

const hints = [
  { icon: Lightbulb, title: 'Start with Context', desc: 'Define the role and environment before the task.' },
  { icon: SlidersHorizontal, title: 'Specify Format', desc: 'Request precise output structures like JSON or Markdown.' },
  { icon: Target, title: 'Be Specific', desc: 'Vague inputs produce vague outputs — precision matters.' },
  { icon: Layers, title: 'Use Constraints', desc: 'Add limits: length, tone, audience, or technical level.' },
];

export default function HintCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 28 }}>
      {hints.map(({ icon: Icon, title, desc }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.07, ease: 'easeOut' }}
          className="hint-card"
        >
          <div style={{ marginTop: 2, color: '#44445a', flexShrink: 0 }}>
            <Icon size={16} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#8888aa', marginBottom: 3 }}>{title}</p>
            <p style={{ fontSize: 12, color: '#44445a', lineHeight: 1.55 }}>{desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
