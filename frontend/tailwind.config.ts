import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        'bg-primary': '#08080f',
        'bg-secondary': '#0f0f1a',
        'bg-tertiary': '#141425',
        'bg-card': '#111122',
        'bg-card-hover': '#161630',
        // Purple accent system
        'accent': '#7c3aed',
        'accent-light': '#a78bfa',
        'accent-dim': '#4c1d95',
        'accent-glow': 'rgba(124, 58, 237, 0.3)',
        // Text
        'text-primary': '#f0f0ff',
        'text-secondary': '#9898b8',
        'text-muted': '#555575',
        // Status
        'success': '#22c55e',
        'warning': '#f59e0b',
        'error': '#ef4444',
        // Glass
        'glass': 'rgba(255,255,255,0.04)',
        'glass-border': 'rgba(255,255,255,0.08)',
        // Light mode equivalents
        'light-bg': '#f4f4f8',
        'light-card': '#ffffff',
        'light-border': 'rgba(0,0,0,0.08)',
        'light-text': '#1a1a2e',
        'light-text-secondary': '#555577',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        'glass': '16px',
        'heavy': '32px',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(124, 58, 237, 0.25)',
        'glow-sm': '0 0 15px rgba(124, 58, 237, 0.2)',
        'glow-lg': '0 0 60px rgba(124, 58, 237, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'score-fill': 'scoreFill 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'progress-fill': 'progressFill 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'orbit': 'orbit 4s linear infinite',
        'typing-dots': 'typingDots 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scoreFill: {
          '0%': { strokeDashoffset: '251' },
          '100%': { strokeDashoffset: 'var(--score-offset)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.1) rotate(10deg)', opacity: '0.85' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' },
        },
        typingDots: {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
