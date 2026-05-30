'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { signIn, useSession } from 'next-auth/react';
import { Eye, EyeOff, Zap } from 'lucide-react';

const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 } as const;

// Google SVG logo
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useStore();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Handle Google session
  useEffect(() => {
    if (session?.user) {
      login({
        username: session.user.name || 'Google User',
        displayName: session.user.name || 'Google User',
        email: session.user.email || '',
        avatar: session.user.image || undefined,
      });
    }
  }, [session, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 480));
    const ok = login({ username, password });
    if (!ok) {
      setError('Invalid credentials. Try JohnWick / JohnWick');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Google sign-in failed. Check GOOGLE_CLIENT_ID configuration.');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle radial gradient background — like Apple product pages */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,113,227,0.12) 0%, transparent 60%)',
      }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}
      >
        <motion.img
          src="/logo.png"
          alt="PromptOS Logo"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 72, height: 72, borderRadius: 18,
            border: '1.5px solid rgba(41,151,255,0.4)',
            boxShadow: '0 0 24px rgba(41,151,255,0.4)',
            objectFit: 'cover',
            marginBottom: 16
          }}
        />
        <span style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.025em' }}>PromptOS</span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...spring, delay: 0.12 }}
        style={{
          width: '100%', maxWidth: 420,
          background: '#1c1c1e',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.06)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <h1 style={{ fontSize: '1.7rem', fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 8, color: '#f5f5f7' }}>
            Sign in
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(245,245,247,0.5)', marginBottom: 28, letterSpacing: '-0.016em' }}>
            to PromptOS
          </p>
        </motion.div>

        {/* Google Sign In */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ marginBottom: 20 }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 13, color: 'rgba(245,245,247,0.35)', letterSpacing: '-0.01em' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </motion.div>

        {/* Demo Login Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              autoComplete="username"
              autoCapitalize="none"
            />

            <div style={{ position: 'relative' }}>
              <input
                className="login-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{ paddingRight: 50 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,247,0.4)', padding: 4,
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ fontSize: 13, color: '#ff453a', letterSpacing: '-0.01em' }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              whileHover={!loading ? { scale: 1.03, boxShadow: '0 8px 28px rgba(0,113,227,0.45)' } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              style={{ width: '100%', marginTop: 4, height: 50, fontSize: 17, letterSpacing: '-0.022em' }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }}
                />
              ) : 'Sign in'}
            </motion.button>
          </motion.div>
        </form>

        {/* Demo hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            marginTop: 24, padding: '14px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Demo access
          </p>
          <p style={{ fontSize: 14, color: 'rgba(245,245,247,0.55)', letterSpacing: '-0.016em' }}>
            Username: <strong style={{ color: '#2997ff' }}>JohnWick</strong>
            {'  ·  '}
            Password: <strong style={{ color: '#2997ff' }}>JohnWick</strong>
          </p>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: 32, fontSize: 12, color: 'rgba(245,245,247,0.5)', letterSpacing: '-0.01em' }}
      >
        Copyright © 2026 PromptOS Inc. All rights reserved.
      </motion.p>
    </div>
  );
}
