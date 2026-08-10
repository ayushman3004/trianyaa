// src/components/BrandStory.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="brand-story-section">
      <div className="container">
        <div className="brand-story-grid">
          {/* Image Side */}
          <motion.div
            className="brand-story-visual"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="story-image-card">
              <img
                src="https://res.cloudinary.com/bt7qlmas/image/upload/v1786277733/trianyaa/products/larfaoyc7yembyzvsrg7.png"
                alt="Trianyaa Handmade Crochet Craft"
              />
              <div className="story-badge script">100% Handcrafted</div>
            </div>
            <div className="story-accent-card">
              <span className="story-stat-number serif">100+</span>
              <span className="story-stat-label">Hours of careful stitching every week</span>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            className="brand-story-content"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <span className="section-eyebrow">THE TRIANYAA STORY</span>
            <h2 className="story-title serif">
              Every Loop Has a Little Love in It.
            </h2>

            <p className="story-text">
              Trianyaa is about turning simple threads into something meaningful. Every piece is thoughtfully handmade, with patience, care and attention to the tiny details that make handmade creations special.
            </p>

            <p className="story-text">
              Whether you are gifting an everlasting bouquet to someone dear or choosing a kit to start your own handmade journey, each Trianyaa piece carries a little magic made to make everyday life cozy and bright.
            </p>

            <div className="story-cta-wrap">
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/contact" className="story-cta">
                  OUR STORY →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
