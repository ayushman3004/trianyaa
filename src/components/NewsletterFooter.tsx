// src/components/NewsletterFooter.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const mainFooterLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Story', href: '/contact' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { label: 'Instagram', icon: '📸', href: 'https://instagram.com' },
  { label: 'Pinterest', icon: '📌', href: 'https://pinterest.com' },
  { label: 'WhatsApp', icon: '💬', href: 'https://wa.me' },
  { label: 'YouTube', icon: '▶️', href: 'https://youtube.com' },
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
              🎉 Welcome to the TRIANYAA family! Check your inbox for a little surprise.
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
              <button type="submit">Join ✨</button>
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
      <div className="container footer-bottom">
        <div className="footer-links">
          {mainFooterLinks.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} TRIANYAA. Handmade with ♥ in India.
        </div>
      </div>
    </footer>
  );
}
