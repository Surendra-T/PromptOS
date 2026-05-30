'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import type { Template, TemplateCategory } from '@/types';

const CATS = ['all','coding','writing','analysis','marketing'] as const;

const BADGE: Record<string, { bg: string; color: string; border: string }> = {
  coding:    { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  writing:   { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  analysis:  { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  marketing: { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.2)' },
};

const TEMPLATES: Template[] = [
  { id:'1', title:'Refactoring Agent', category:'coding', description:'Analyzes legacy code and suggests modern alternatives with concrete examples.', promptText:'Act as a Senior Software Engineer. Review the following code block. Identify areas of technical debt, suggest modern refactoring approaches, and provide concrete code examples.', icon:'🔧', previewText:'Act as a Senior Software Engineer. Review the following code block...' },
  { id:'2', title:'SEO Blog Post',     category:'writing', description:'Generates a highly structured, SEO-optimized blog article with hooks and CTAs.', promptText:'Write a comprehensive blog post about [TOPIC]. Target audience is [AUDIENCE]. Include SEO keywords naturally. Structure: Hook → Problem → Solution → Examples → CTA.', icon:'✍️', previewText:'Write a comprehensive blog post about [TOPIC]. Target audience is [AUDIENCE]...' },
  { id:'3', title:'Data Insights',     category:'analysis', description:'Processes raw data to extract key metrics, trends, and actionable recommendations.', promptText:'Analyze the provided dataset. Summarize the top 3 trends over the last quarter. Identify anomalies, correlations, and actionable recommendations.', icon:'📊', previewText:'Analyze the provided dataset. Summarize the top 3 trends...' },
  { id:'4', title:'Social Campaign',   category:'marketing', description:'Creates a week-long social media content calendar across platforms.', promptText:'Develop a 7-day social media content calendar for [PRODUCT LAUNCH]. Platforms: Twitter, LinkedIn, Instagram. Include captions, hashtags, and optimal posting times.', icon:'📢', previewText:'Develop a 7-day social media content calendar for [PRODUCT LAUNCH]...' },
  { id:'5', title:'React Component',   category:'coding', description:'Generates accessible, strongly-typed React functional components with hooks.', promptText:'system: You are an expert frontend engineer.\nuser: Create a {component_type} React component that takes {props}.\nRules:\n- Use TypeScript\n- Add ARIA accessibility\n- Include error boundaries\n- Export as default', icon:'⚛️', previewText:'system: You are an expert frontend engineer.\nuser: Create a {component_type}...' },
  { id:'6', title:'Technical Outline', category:'writing', description:'Structures comprehensive technical articles with clear sections and subheadings.', promptText:'system: You are a technical writer.\nuser: Outline a post about {topic}. Include intro, 5 sections, conclusion.\nFormat: Markdown with H2/H3 headings.', icon:'📝', previewText:'system: You are a technical writer.\nuser: Outline a post about {topic}...' },
];

function TemplateCard({ t, onUse, i }: { t: Template; onUse: (t: Template) => void; i: number }) {
  const badge = BADGE[t.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(0,0,0,.45)' }}
      className="template-card"
      style={{ display: 'flex', flexDirection: 'column', cursor: 'default' }}
    >
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>{t.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
            padding: '4px 10px', borderRadius: 100,
            background: badge?.bg, color: badge?.color, border: `1px solid ${badge?.border}`,
          }}>
            {t.category}
          </span>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f5f5f7', marginBottom: 6, lineHeight: 1.3, letterSpacing: '-.016em' }}>{t.title}</h3>
        <p className="text-caption text-muted" style={{ lineHeight: 1.55, marginBottom: 14 }}>{t.description}</p>
      </div>

      <div style={{ margin: '0 20px 14px', flex: 1 }}>
        <div style={{
          background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '12px 14px',
          border: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          color: 'rgba(245,245,247,.45)', lineHeight: 1.65,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {t.promptText.split('\n').map((line, j) => (
            <div key={j}>
              {line.startsWith('system:') ? <span><span style={{ color: '#a78bfa' }}>system:</span>{line.slice(7)}</span>
                : line.startsWith('user:') ? <span><span style={{ color: '#60a5fa' }}>user:</span>{line.slice(5)}</span>
                : <span>{line}</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => onUse(t)}
          style={{
            width: '100%', height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,.05)', color: 'rgba(245,245,247,.65)',
            fontSize: 14, fontWeight: 400, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'all .18s',
            fontFamily: 'inherit', letterSpacing: '-.016em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(41,151,255,.14)';
            e.currentTarget.style.borderColor = 'rgba(41,151,255,.35)';
            e.currentTarget.style.color = '#2997ff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)';
            e.currentTarget.style.color = 'rgba(245,245,247,.65)';
          }}
        >
          <Rocket size={13} />
          Use Template
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [cat, setCat] = useState<TemplateCategory>('all');
  const { setPrompt, setWorkspaceState } = useStore();
  const router = useRouter();

  const filtered = cat === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === cat);

  const handleUse = (t: Template) => {
    setPrompt(t.promptText);
    setWorkspaceState('typing');
    router.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: 'calc(100vh - 56px)', padding: '60px 40px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 className="text-display" style={{ marginBottom: 10 }}>Templates</h1>
          <p className="text-body text-muted" style={{ maxWidth: 520, lineHeight: 1.65 }}>
            Accelerate your workflow with production-ready prompt architectures engineered for clarity and performance.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}
        >
          {CATS.map(c => (
            <motion.button
              key={c} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setCat(c)}
              className={`cat-pill ${cat === c ? 'active' : ''}`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={cat}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}
          >
            {filtered.map((t, i) => (
              <TemplateCard key={t.id} t={t} onUse={handleUse} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
