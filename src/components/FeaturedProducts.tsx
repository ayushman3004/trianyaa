// src/components/FeaturedProducts.tsx
'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import ProductCard, { ProductCardData } from './ProductCard';

// Shown only when MongoDB returns 0 products
const MOCK_PRODUCTS: ProductCardData[] = [
  {
    _id: 'm1',
    name: 'Blush Rose Bouquet',
    price: 349,
    originalPrice: 449,
    tier: 'Basic',
    category: 'Bouquet',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786277733/trianyaa/products/larfaoyc7yembyzvsrg7.png',
    colors: ['#EFC5B5','#F5D9CE','#FAF6EF'],
    inStock: true,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.5,
    reviewsCount: 12,
    description: 'A beautiful blushing rose bouquet handcrafted with soft cotton yarn, perfect for gifting.',
    includedItems: ['5 Hand-crocheted roses', 'Delicate wrapping paper', 'A gift card'],
  },
  {
    _id: 'm2',
    name: 'Cozy Daisy Flowers',
    price: 799,
    originalPrice: undefined,
    tier: 'Standard',
    category: 'Flowers',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786208942/trianyaa/products/ufvas8tikwejg0i3t4t8.png',
    colors: ['#7B9E87','#A8C5B0','#DFF0E4'],
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 5,
    reviewsCount: 28,
    description: 'A delightful pot of cozy daisy flowers to brighten any corner of your room.',
    includedItems: ['3 Daisy flowers in a pot', 'Gift wrap', 'Care instructions card'],
  },
  {
    _id: 'm3',
    name: 'Sunflower Crochet Keychain',
    price: 199,
    originalPrice: undefined,
    tier: 'Basic',
    category: 'Keychain',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786189707/trianyaa/products/secyqfwrjknx3zbkihgj.png',
    colors: ['#C9963C','#E8BC68','#F5EFE6'],
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 47,
    description: 'Brighten your keys or bags with this sunny, adorable handcrafted sunflower keychain.',
    includedItems: ['Sunflower keychain charm', 'Metal keyring clasp'],
  },
  {
    _id: 'm4',
    name: 'Premium Tulip Bouquet',
    price: 1199,
    originalPrice: 1499,
    tier: 'Premium',
    category: 'Bouquet',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786190028/trianyaa/products/htufxkg6p4bx2s8nejpv.png',
    colors: ['#C4624A','#D4785F','#F0E0D8'],
    inStock: true,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.7,
    reviewsCount: 9,
    description: 'An elegant premium tulip bouquet, meticulously crocheted for weddings or special occasions.',
    includedItems: ['7 Crochet tulips', 'Premium fabric wrap', 'Greeting card'],
  },
  {
    _id: 'm5',
    name: 'Sage Green Rose Bouquet',
    price: 549,
    originalPrice: undefined,
    tier: 'Standard',
    category: 'Bouquet',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786189221/trianyaa/products/gzpnglxsgsdxkt8jtseq.png',
    colors: ['#7B9E87','#2D5016','#F5EFE6'],
    inStock: true,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.6,
    reviewsCount: 15,
    description: 'A soothing sage green rose bouquet, ideal for cottage core styling and table decor.',
    includedItems: ['4 Green and white roses', 'Sage ribbon wrap'],
  },
  {
    _id: 'm6',
    name: 'Rainbow Heart Keychain Set',
    price: 299,
    originalPrice: 349,
    tier: 'Basic',
    category: 'Keychain',
    image: 'https://res.cloudinary.com/bt7qlmas/image/upload/v1786189707/trianyaa/products/secyqfwrjknx3zbkihgj.png',
    colors: ['#EFC5B5','#C9963C','#7B9E87','#C4624A'],
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 63,
    description: 'A pair of matching rainbow heart keychains to share with your favorite person.',
    includedItems: ['2 Heart keychains', '2 Metal clasps'],
  },
];

interface FeaturedProductsProps {
  products?: ProductCardData[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function checkScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  return (
    <section className="featured-products">
      <div className="container">
        <div className="featured-header-row">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">FEATURED CREATIONS</span>
            <h2 className="section-title serif">MADE TO BE LOVED</h2>
            <p className="section-sub">
              Handcrafted pieces for little moments that matter.
            </p>
          </motion.div>

          {/* Scroll Navigation Arrows */}
          <div className="scroll-controls">
            <button
              onClick={() => scroll('left')}
              className={`scroll-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
              title="Previous products"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className={`scroll-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
              aria-label="Scroll right"
              disabled={!canScrollRight}
              title="Next products"
            >
              →
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Gallery Container */}
        <motion.div
          ref={scrollRef}
          className="products-scroll-gallery"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {displayProducts.map((p) => (
            <motion.div key={p._id} className="scroll-gallery-item" variants={itemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
