// src/components/NewsletterFooter.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Express Delivery',
    subtitle: 'Fast shipping across India',
    detail: '24–72h dispatch available',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    ),
    title: 'Easy Returns',
    subtitle: 'Try them with confidence',
    detail: '7-day hassle-free returns',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Secure Payment',
    subtitle: 'UPI, Cards & NetBanking',
    detail: '100% safe & encrypted checkout',
  },
];

const mainFooterLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Story', href: '/#story' },
  { label: 'Contact', href: '/contact' },
];

const policyLinks = [
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

const socialLinks = [
  { label: 'Instagram', icon: '📸', href: 'https://www.instagram.com/tri_anyaa/' },
  // { label: 'Pinterest', icon: '📌', href: 'https://pinterest.com' },
  // { label: 'WhatsApp', icon: '💬', href: 'https://wa.me' },
  // { label: 'YouTube', icon: '▶️', href: 'https://youtube.com' },
];

export default function NewsletterFooter() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setEmail('');
    }
  }

  return (
    <footer className="newsletter-footer">
      {/* 1. POLICY / BENEFITS COMPONENT ABOVE MAIN FOOTER */}
      <div className="footer-benefits-bar">
        <div className="container">
          <div className="benefits-grid">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                className="benefit-item"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-text">
                  <h4 className="serif">{b.title}</h4>
                  <p className="benefit-subtitle">{b.subtitle}</p>
                  <span className="benefit-detail">{b.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. EXISTING TRIANYAA NEWSLETTER & BRAND FOOTER */}
      <div className="newsletter-inner">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="footer-brand-header">
            <span className="serif footer-brand-title">TRIANYAA</span>
            <span className="footer-brand-tagline">HANDMADE WITH LOVE</span>
          </div>

          <h2 className="serif">Let's Stay in Touch 🌿</h2>
          <p>
            Join our growing community of yarn lovers. Get exclusive patterns, early access to new drops, and a little crafty inspiration in your inbox.
          </p>

          {joined ? (
            <div style={{
              background: 'rgba(255,255,255,.12)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 24px',
              color: 'rgba(255,255,255,.9)',
              fontSize: '15px',
              marginBottom: '24px',
            }}>
               Welcome to the TRIANYAA family! Check your inbox for a little surprise.
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="newsletter-email"
              />
              <button type="submit">Join </button>
            </form>
          )}

          <div className="social-links">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="footer-divider" />

      {/* 3. FOOTER NAVIGATION & POLICIES */}
      <div className="container footer-bottom">
        <div className="footer-links-group">
          <div className="footer-nav-links">
            {mainFooterLinks.map((l) => (
              <Link key={l.label} href={l.href}>{l.label}</Link>
            ))}
          </div>
          <div className="footer-policy-links">
            <span className="policy-label">Policies:</span>
            {policyLinks.map((p) => (
              <Link key={p.label} href={p.href}>{p.label}</Link>
            ))}
          </div>
        </div>

        {/* 4. COPYRIGHT */}
        <div className="footer-copy">
          © {new Date().getFullYear()} TRIANYAA. Handmade with ♥ in India.
        </div>
      </div>
    </footer>
  );
}
