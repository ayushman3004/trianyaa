// src/app/auth/login/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function TrianyaaLogoSmall() {
  return (
    <svg width="44" height="44" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" stroke="#2D5016" strokeWidth="1.5" fill="#FDFAF5"/>
      <circle cx="60" cy="60" r="52" stroke="#2D5016" strokeWidth="0.8" fill="none"/>
      <text x="60" y="62" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="700" fill="#2D5016" fontFamily="serif">त्री</text>
      <text x="60" y="83" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2D5016" fontFamily="serif" letterSpacing="2">Anya</text>
      <text x="60" y="96" textAnchor="middle" fontSize="6" fill="#7B9E87" fontFamily="sans-serif" letterSpacing="3.5" fontWeight="600">CREATION</text>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }
      router.push(data.user.role === 'admin' ? '/admin' : '/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-link">
          <TrianyaaLogoSmall />
          <span className="logo-brand serif" style={{ fontSize: 20, color: 'var(--forest)' }}>TRIANYAA</span>
        </div>

        <h1 className="auth-title serif">Welcome back 🌿</h1>
        <p className="auth-sub">Sign in to your TRIANYAA account</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link href="/auth/register">Create one →</Link>
        </div>
        <div className="auth-switch" style={{ marginTop: 8 }}>
          <Link href="/" style={{ color: 'var(--warm-gray)', fontSize: 13 }}>← Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}
