'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoginPage from '@/components/auth/LoginPage';
import { AnimatePresence, motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';

function AppContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, devMode, isAuthenticated } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'light') {
      document.body.classList.add('light');
      document.body.style.background = '#f5f5f7';
    } else {
      document.body.classList.remove('light');
      document.body.style.background = '#000000';
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100dvh', background: '#000' }} />
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: theme === 'light' ? '#f5f5f7' : '#000000',
    }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        <AnimatePresence>
          {devMode && <Sidebar key="sidebar" />}
        </AnimatePresence>
        <motion.main
          animate={{ marginLeft: devMode ? 220 : 0 }}
          transition={{ type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.8 }}
          style={{ flex: 1, minWidth: 0 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppContent>{children}</AppContent>
    </SessionProvider>
  );
}
