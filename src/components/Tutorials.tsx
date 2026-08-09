// src/components/Tutorials.tsx
import Link from 'next/link';

const tutorials = [
  {
    id: 1,
    category: 'Beginner',
    title: 'How to Knit Your First Scarf',
    read: '8 min read',
    emoji: '🧣',
    bg: 'linear-gradient(135deg, #F5D9CE 0%, #EFC5B5 100%)',
    href: '/tutorials/knit-first-scarf',
  },
  {
    id: 2,
    category: 'Keychains',
    title: '5 Cozy Keychain Patterns for Beginners',
    read: '5 min read',
    emoji: '🗝️',
    bg: 'linear-gradient(135deg, #DFF0E4 0%, #A8C5B0 100%)',
    href: '/tutorials/keychain-patterns',
  },
  {
    id: 3,
    category: 'Yarn Guide',
    title: 'Understanding Yarn Weights & When to Use Them',
    read: '6 min read',
    emoji: '🧶',
    bg: 'linear-gradient(135deg, #F5EFE6 0%, #EFC5B5 60%, #DFF0E4 100%)',
    href: '/tutorials/yarn-weights',
  },
];

export default function Tutorials() {
  return (
    <section className="tutorials">
      <div className="section-header">
        <div className="section-eyebrow">Learn & Create</div>
        <h2 className="section-title serif">Tutorials & Inspiration</h2>
        <p className="section-sub">
          Get inspired with our free guides — from your very first stitch to intricate patterns.
        </p>
      </div>
      <div className="tutorials-grid">
        {tutorials.map((t) => (
          <Link key={t.id} href={t.href} className="tutorial-card">
            <div className="tutorial-img" style={{ background: t.bg }}>
              <span>{t.emoji}</span>
              <div className="tutorial-cat">{t.category}</div>
            </div>
            <div className="tutorial-body">
              <h3 className="tutorial-title serif">{t.title}</h3>
              <div className="tutorial-meta">
                <span>📖</span>
                <span>{t.read}</span>
              </div>
              <div className="tutorial-read-link">
                Read now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
