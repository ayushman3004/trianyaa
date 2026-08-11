// src/components/HeroSection.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Left: Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.span
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          HANDMADE COLLECTION FOR YOU
        </motion.span>

        <motion.h1
          className="hero-title serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          CRAFTED WITH <span className="hero-title-highlight">LOVE</span>,<br />
          ONE STITCH<br />
          AT A TIME
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Thoughtfully crafted crochet pieces made to bring warmth, color and a little handmade magic to your everyday.
        </motion.p>

        <motion.div
          className="hero-cta-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/shop" className="hero-cta">
              SHOP THE COLLECTION →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="hero-trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            100% Handmade
          </div>
          <div className="hero-trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Crafted with Care
          </div>
          <div className="hero-trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Easy Returns
          </div>
        </motion.div>
      </motion.div>

      {/* Right: Asymmetrical Editorial Collage */}
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="hero-collage-container">
          {/* Main Large Vertical Hero Image Card */}
          <motion.div
            className="collage-card collage-card-main"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/bt7qlmas/image/upload/v1786277733/trianyaa/products/larfaoyc7yembyzvsrg7.png"
              alt="Handmade Crochet Bouquet"
            />
            <div className="collage-card-tag script">crafted by hand </div>
          </motion.div>

          {/* Secondary Medium Vertical Card */}
          <motion.div
            className="collage-card collage-card-sub1"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/bt7qlmas/image/upload/v1786208942/trianyaa/products/ufvas8tikwejg0i3t4t8.png"
              alt="Crochet Flower Pot"
            />
          </motion.div>

          {/* Third Square Vertical Card */}
          <motion.div
            className="collage-card collage-card-sub2"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/bt7qlmas/image/upload/v1786189707/trianyaa/products/secyqfwrjknx3zbkihgj.png"
              alt="Crochet Keychain Charm"
            />
            <div className="collage-card-badge">New Arrival</div>
          </motion.div>

          {/* Fourth Detail Card */}
          <motion.div
            className="collage-card collage-card-sub3"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/bt7qlmas/image/upload/v1786190028/trianyaa/products/htufxkg6p4bx2s8nejpv.png"
              alt="Handcrafted Tulip Flower"
            />
          </motion.div>

          {/* Fifth Circular Product Accent */}
          <motion.div
            className="collage-card collage-card-circle"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/bt7qlmas/image/upload/v1786189221/trianyaa/products/gzpnglxsgsdxkt8jtseq.png"
              alt="Crochet Detail"
            />
          </motion.div>

          {/* Floating Craft Micro-Accents */}
          {/* <motion.div
            className="hero-floating-pill"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            🧶 100% Organic Cotton Yarn
          </motion.div> */}
          <motion.div
            className="hero-floating-note script"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            with love ♡
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
