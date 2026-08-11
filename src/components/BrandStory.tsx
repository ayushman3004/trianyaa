// src/components/BrandStory.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="brand-story-section" id="story">
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
                alt="Trianyaa Three Sisters Handmade Craft"
              />
              <div className="story-badge script">Handmade with Love 💕</div>
            </div>
            <div className="story-accent-card">
              <span className="story-stat-number serif">3 Sisters</span>
              <span className="story-stat-label">One dream, building memories one stitch at a time</span>
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
            <span className="section-eyebrow">OUR STORY 🌸</span>
            <h2 className="story-title serif" style={{ fontSize: '32px', marginBottom: '20px' }}>
              Three sisters. One dream. Handmade with love.
            </h2>

            <p className="story-text">
              What started as a simple idea between three sisters slowly grew into something very close to our hearts.
            </p>

            <p className="story-text">
              We’ve always believed that the most meaningful gifts aren’t necessarily the most expensive ones—they’re the ones that carry a little piece of your heart. A thoughtful gesture, a beautiful handmade creation, or a small surprise can make someone feel truly special.
            </p>

            <p className="story-text">
              That belief inspired us to start our own little journey of creating handmade gifts for your loved ones.
            </p>

            <p className="story-text">
              Every piece we make is thoughtfully designed, carefully handcrafted, and made with love. From choosing the colors and materials to adding the smallest finishing touch, we put our hearts into every creation because we know that our gifts become a part of someone else’s special moments.
            </p>

            <p className="story-text">
              Our aim is simple: to make gifting more personal, meaningful, and memorable.
            </p>

            <p className="story-text">
              Whether it’s a birthday, anniversary, wedding, celebration, or simply a “thinking of you” moment, we want our creations to help you express the feelings that words sometimes cannot.
            </p>

            <p className="story-text" style={{ fontWeight: 600, color: 'var(--terracotta)' }}>
              We are three sisters building something together, one handmade gift at a time—and we’re so happy to have you be a part of our story. 💕
            </p>

            <div className="story-cta-wrap" style={{ marginTop: '24px' }}>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/contact" className="story-cta">
                  GET IN TOUCH →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
