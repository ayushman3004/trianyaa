// src/components/CategoryStrip.tsx
import Link from 'next/link';

const categories = [
  {
    name: 'Basic',
    href: '/shop?tier=basic',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Yarn ball */}
        <circle cx="12" cy="12" r="8"/>
        <path d="M4.5 9a8 8 0 0 1 15 0"/>
        <path d="M4 12.5c3-2 6-2.5 8.5-1.5"/>
        <path d="M19.5 12c-2 3-5 4-8 3"/>
        <path d="M5 15.5c3 1 6 .5 9-1.5"/>
      </svg>
    ),
  },
  {
    name: 'Standard',
    href: '/shop?tier=standard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Gift box */}
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5" rx="1"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    name: 'Premium',
    href: '/shop?tier=premium',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Crown */}
        <path d="M2 20h20"/>
        <path d="M2 20l3-10 5 5 2-8 2 8 5-5 3 10"/>
      </svg>
    ),
  },
  {
    name: 'Keychains',
    href: '/shop?category=keychain',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Keychain / key */}
        <circle cx="9" cy="9" r="5"/>
        <path d="M14 14l6 6"/>
        <path d="M14.5 14.5l1.5-1.5"/>
        <path d="M18 17l1.5-1.5"/>
      </svg>
    ),
  },
];

export default function CategoryStrip() {
  return (
    <section className="category-strip">
      <div className="category-strip-inner">
        <h2 className="serif">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="category-card">
              <div className="category-icon-wrap">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
              <span className="category-shop-link">Shop All →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
