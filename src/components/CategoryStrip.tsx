// src/components/CategoryStrip.tsx
import Link from 'next/link';

const categories = [
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
  {
    name: 'Flowers',
    href: '/shop?category=flowers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Flower icon */}
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
        <path d="M12 22a3 3 0 0 0 3-3v-4a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z"/>
        <path d="M2 12a3 3 0 0 0 3 3h4a3 3 0 0 0 0-6H5a3 3 0 0 0-3 3z"/>
        <path d="M22 12a3 3 0 0 0-3-3h-4a3 3 0 0 0 0 6h4a3 3 0 0 0 3-3z"/>
      </svg>
    ),
  },
  {
    name: 'Bouquets',
    href: '/shop?category=bouquet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Bouquet icon */}
        <path d="M12 22L7 10h10z" />
        <circle cx="12" cy="6" r="3.5" />
        <circle cx="7.5" cy="8" r="2.5" />
        <circle cx="16.5" cy="8" r="2.5" />
        <path d="M10.5 13.5c1-1.5 2-1.5 3 0" />
        <circle cx="12" cy="14" r="1" />
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
