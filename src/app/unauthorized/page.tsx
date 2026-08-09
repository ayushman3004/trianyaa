// src/app/unauthorized/page.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <div className="unauthorized-page">
      <div>
        <div className="unauthorized-icon">🔒</div>
        <h1 className="serif">Access Denied</h1>
        <p>You don't have permission to view this page. Please sign in with an admin account.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link href="/auth/login" className="hero-cta" style={{ margin: 0 }}>
            Go to Login
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '14px 28px',
              borderRadius: 'var(--r-full)',
              background: 'var(--oat)',
              color: 'var(--charcoal-soft)',
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

