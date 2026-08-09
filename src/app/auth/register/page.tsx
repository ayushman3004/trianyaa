// src/app/auth/register/page.tsx
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

export default function RegisterPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed.'); return; }
      router.push('/');
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

        <h1 className="auth-title serif">Join the family 🧶</h1>
        <p className="auth-sub">Create your TRIANYAA account</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
            <input
              id="reg-confirm"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button
            id="register-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link href="/auth/login">Sign in →</Link>
        </div>
        <div className="auth-switch" style={{ marginTop: 8 }}>
          <Link href="/" style={{ color: 'var(--warm-gray)', fontSize: 13 }}>← Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}
