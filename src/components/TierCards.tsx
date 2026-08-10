// src/components/TierCards.tsx
'use client';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const tiers = [
  {
    id: 'basic',
    name: 'Basic Kit',
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
      'Branded craft box',
    ],
    href: '/shop?tier=basic',
  },
  {
    id: 'standard',
    name: 'Standard Kit',
    icon: '🎁',
    ribbon: 'ribbon-standard',
    cardClass: 'tier-standard',
    btnClass: 'tier-btn-standard',
    price: '₹699',
    desc: 'Our most popular tier — a curated bundle for the craft enthusiast ready to level up their crochet journey.',
    features: [
      '3 yarn skeins (mixed weights)',
      '2 ergonomic crochet hooks (4mm + 6mm)',
      'Intermediate pattern booklet',
      'Stitch markers & tapestry needle',
      'Gift-ready box with tissue',
    ],
    href: '/shop?tier=standard',
  },
  {
    id: 'premium',
    name: 'Premium Kit',
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
      'Personalized creation card',
    ],
    href: '/shop?tier=premium',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function TierCards() {
  return (
    <section className="tier-section">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">CHOOSE YOUR CRAFT JOURNEY</span>
          <h2 className="section-title serif">Shop Craft Kits by Tier</h2>
          <p className="section-sub">
            Whether you're just starting out or a seasoned maker, there's a kit made for you.
          </p>
        </motion.div>

        <motion.div
          className="tier-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              className={`tier-card ${tier.cardClass}`}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
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
                Explore {tier.name} →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
