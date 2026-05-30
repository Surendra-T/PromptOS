'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Zap, Moon, Sun, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',           label: 'Workspace' },
  { href: '/history',   label: 'History'   },
  { href: '/templates', label: 'Templates' },
  { href: '/settings',  label: 'Settings'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, theme, toggleTheme, devMode } = useStore();

  const initial = user?.displayName?.charAt(0).toUpperCase() ?? 'J';

  return (
    <nav className="apple-nav">
      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => router.push('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="PromptOS Logo"
            style={{
              width: 38, height: 38, borderRadius: 10,
              border: '1px solid rgba(41,151,255,0.4)',
              boxShadow: '0 0 14px rgba(41,151,255,0.35)',
              objectFit: 'cover'
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#f5f5f7' }}>
            PromptOS
          </span>
        </motion.button>

        {/* Center nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <motion.button
                key={href}
                onClick={() => router.push(href)}
                whileTap={{ scale: 0.95 }}
                className={`nav-link ${active ? 'active' : ''}`}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 0', display: 'block',
                  fontFamily: 'inherit',
                }}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Dev badge */}
          <AnimatePresence>
            {devMode && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                className="dev-badge"
                style={{ fontSize: 10 }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2997ff', display: 'inline-block' }} />
                DEV
              </motion.span>
            )}
          </AnimatePresence>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              width: 34, height: 34, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.07)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(245,245,247,0.7)', transition: 'background 0.15s',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* User pill + logout */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {user.avatar ? (
                <motion.img
                  whileHover={{ scale: 1.06 }}
                  src={user.avatar}
                  alt={user.displayName}
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.15)' }}
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#0071e3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#fff',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {initial}
                </motion.div>
              )}
              <span style={{ fontSize: 13, color: 'rgba(245,245,247,0.75)', letterSpacing: '-0.01em' }}>
                {user.displayName?.split(' ')[0]}
              </span>
              <motion.button
                whileHover={{ scale: 1.1, color: '#ff453a' }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(245,245,247,0.35)', display: 'flex', alignItems: 'center',
                  padding: 4, transition: 'color 0.15s',
                }}
                title="Sign out"
              >
                <LogOut size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
