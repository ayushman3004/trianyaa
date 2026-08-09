// src/components/HeroSection.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Left: Content */}
      <div className="hero-content">
        <span className="hero-eyebrow">New Arrivals 2024</span>

        <h1 className="hero-title serif">
          Handmade with <em>Love</em>,<br />
          One Stitch<br />at a Time
        </h1>

        <p className="hero-sub">
          Curated yarns, crochet kits, and keychains to inspire your next handmade piece — crafted with care, shipped with warmth.
        </p>

        <Link href="/shop" className="hero-cta">
          Shop New Arrivals
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>

        <div className="hero-trust">
          <div className="hero-trust-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
            100% Handmade
          </div>
          <div className="hero-trust-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
            Free Shipping ₹999+
          </div>
          <div className="hero-trust-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
            Easy Returns
          </div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hero-visual">
        {/* Decorative blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="hero-visual-inner">
          {/* Floating badge */}
          <div className="hero-badge" style={{ zIndex: 10 }}>
            <div className="hero-badge-dot" />
            500+ Happy crafters
          </div>

          {/* Main flat-lay placeholder — rich illustrated */}
          <div className="hero-flatlay-placeholder">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '80px', lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.12))' }}>
                🧶
              </div>
              <div style={{
                display: 'flex', gap: '12px', justifyContent: 'center',
                marginTop: '16px', fontSize: '40px'
              }}>
                <span>🪡</span><span>🎀</span><span>☕</span>
              </div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#7B9E87',
                marginTop: '16px',
              }}>
                curated with care
              </p>
            </div>
          </div>

          {/* Floating "keep creating" card */}
          <div className="hero-card-floating" style={{ zIndex: 10 }}>
            ✨ keep creating
          </div>
        </div>
      </div>
    </section>
  );
}
