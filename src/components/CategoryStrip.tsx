// src/components/CategoryStrip.tsx
'use client';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const collections = [
  {
    name: 'Crochet Flowers',
    tagline: 'Everlasting floral beauty',
    href: '/shop?category=flowers',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786208942/trianyaa/products/ufvas8tikwejg0i3t4t8.png',
    gridClass: 'col-card-large',
  },
  {
    name: 'Handmade Keychains',
    tagline: 'Little charms for everyday bags',
    href: '/shop?category=keychain',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786189707/trianyaa/products/secyqfwrjknx3zbkihgj.png',
    gridClass: 'col-card-medium',
  },
  {
    name: 'Crochet Kits',
    tagline: 'Everything you need to create',
    href: '/shop?tier=standard',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786190028/trianyaa/products/htufxkg6p4bx2s8nejpv.png',
    gridClass: 'col-card-medium',
  },
  {
    name: 'Handmade Gifts',
    tagline: 'Thoughtfully wrapped with love',
    href: '/shop?category=bouquet',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786277733/trianyaa/products/larfaoyc7yembyzvsrg7.png',
    gridClass: 'col-card-large',
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

export default function CategoryStrip() {
  return (
    <section className="collection-section" id="collections">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">HANDMADE CATEGORIES</span>
          <h2 className="section-title serif">SHOP BY COLLECTION</h2>
          <p className="section-sub">
            Little handmade things, made to make you smile.
          </p>
        </motion.div>

        <motion.div
          className="collection-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {collections.map((item) => (
            <motion.div
              key={item.name}
              className={`collection-card ${item.gridClass}`}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={item.href} style={{ display: 'block', width: '100%', height: '100%' }}>
                <div className="collection-img-wrap">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="collection-overlay" />
                </div>
                <div className="collection-content">
                  <span className="collection-tagline script">{item.tagline}</span>
                  <h3 className="collection-name serif">{item.name}</h3>
                  <div className="collection-cta">
                    Explore Collection
                    <span className="arrow-icon">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
