// src/components/GallerySection.tsx
'use client';
import { motion, Variants } from 'framer-motion';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Crochet Keychain',
    subtitle: 'Hand-stitched with vibrant yarn',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786277733/trianyaa/products/larfaoyc7yembyzvsrg7.png',
    span: 'gallery-card-tall',
    badge: 'Best Seller ✨',
  },
  {
    id: 2,
    title: 'Minimal Flower',
    subtitle: 'Soft pastel blossom',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786208942/trianyaa/products/ufvas8tikwejg0i3t4t8.png',
    span: 'gallery-card-standard',
    badge: 'Popular ♡',
  },
  {
    id: 3,
    title: 'Red Bouquet',
    subtitle: 'For your loved one',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786189707/trianyaa/products/secyqfwrjknx3zbkihgj.png',
    span: 'gallery-card-standard',
    badge: '100% Cotton',
  },
  {
    id: 4,
    title: 'Cherry Keychains',
    subtitle: 'Everlasting desktop bloom',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786278556/trianyaa/products/bzej3mbzxqlcfhvqfb3s.png',
    span: 'gallery-card-wide',
    badge: 'Hand Crafted',
  },
  // {
  //   id: 5,
  //   title: 'Crochet Craft Kit',
  //   subtitle: 'Yarn, hooks & easy step guide',
  //   image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786189221/trianyaa/products/gzpnglxsgsdxkt8jtseq.png',
  //   span: 'gallery-card-tall',
  //   badge: 'DIY Kit 🧶',
  // },
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

export default function GallerySection() {
  return (
    <section className="gallery-section">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">CRAFTED MOMENTS</span>
          <h2 className="section-title serif">A Little Handmade Magic</h2>
          <p className="section-subtitle">
            Discover the details, textures and tiny moments behind every Trianyaa creation.
          </p>
        </motion.div>

        <motion.div
          className="gallery-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {GALLERY_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              className={`gallery-card ${item.span}`}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="gallery-image-wrap">
                <img src={item.image} alt={item.title} className="gallery-img" />
                <div className="gallery-overlay">
                  <span className="gallery-badge">{item.badge}</span>
                  <h3 className="gallery-item-title serif">{item.title}</h3>
                  <p className="gallery-item-sub">{item.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
