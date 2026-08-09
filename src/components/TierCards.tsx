// src/components/TierCards.tsx
import Link from 'next/link';

const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    icon: '🧶',
    ribbon: 'ribbon-basic',
    cardClass: 'tier-basic',
    btnClass: 'tier-btn-basic',
    price: '₹299',
    desc: 'Perfect for beginners exploring their first handmade project. Includes essential yarn skeins and a basic pattern guide.',
    features: [
      '1 premium yarn skein (100g)',
      'Beginner-friendly pattern card',
      'Color palette guide',
      'Branded packaging',
    ],
    href: '/shop?tier=basic',
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: '🎁',
    ribbon: 'ribbon-standard',
    cardClass: 'tier-standard',
    btnClass: 'tier-btn-standard',
    price: '₹699',
    desc: 'Our most popular tier — a curated bundle for the craft enthusiast ready to level up their crochet journey.',
    features: [
      '3 yarn skeins (mixed weights)',
      '2 crochet hooks (4mm + 6mm)',
      'Intermediate pattern booklet',
      'Stitch markers & tapestry needle',
      'Gift-ready box with tissue',
    ],
    href: '/shop?tier=standard',
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: '👑',
    ribbon: 'ribbon-premium',
    cardClass: 'tier-premium-card',
    btnClass: 'tier-btn-premium',
    price: '₹1,499',
    desc: 'The full TRIANYAA experience — a luxurious kit for serious crafters who deserve the very best.',
    features: [
      '5 merino yarn skeins (signature palette)',
      'Full crochet hook set (8 sizes)',
      'Premium pattern collection (6 designs)',
      'Handmade keychain gift included',
      'Embroidered project bag',
      'Personalized "creation card"',
    ],
    href: '/shop?tier=premium',
  },
];

export default function TierCards() {
  return (
    <section className="tier-section">
      <div className="section-header">
        <div className="section-eyebrow">Choose Your Craft Journey</div>
        <h2 className="section-title serif">Shop by Tier</h2>
        <p className="section-sub">
          Whether you're just starting out or a seasoned maker, there's a kit made for you.
        </p>
      </div>
      <div className="tier-grid">
        {tiers.map((tier) => (
          <div key={tier.id} className={`tier-card ${tier.cardClass}`}>
            <div className={`tier-ribbon ${tier.ribbon}`}>{tier.name}</div>
            <div className="tier-icon">{tier.icon}</div>
            <div className="tier-name serif">{tier.name}</div>
            <p className="tier-desc">{tier.desc}</p>
            <div className="tier-price">Starting from</div>
            <div className="tier-amount serif">
              <sup>₹</sup>{tier.price.replace('₹', '')}
            </div>
            <ul className="tier-features">
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link href={tier.href} className={`tier-btn ${tier.btnClass}`}>
              Explore {tier.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
