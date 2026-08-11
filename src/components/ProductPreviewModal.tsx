// src/components/ProductPreviewModal.tsx
'use client';
import { useEffect, useState } from 'react';
import { ProductCardData } from './ProductCard';
import { useCart } from '@/context/CartContext';

interface ProductPreviewModalProps {
  product: ProductCardData;
  onClose: () => void;
  wished: boolean;
  toggleWishlist: (item: any) => void;
}

const TIER_COLOR: Record<string, string> = {
  basic: 'var(--sage)',
  standard: 'var(--terracotta)',
  premium: 'var(--gold)',
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div style={{ color: 'var(--gold)', fontSize: '18px', display: 'flex', gap: '2px' }} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </div>
  );
}

export default function ProductPreviewModal({ product, onClose, wished, toggleWishlist }: ProductPreviewModalProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleAddToCart() {
    if (!product.inStock) return;
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      tier: product.tier,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const pct = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const tierKey = product.tier.toLowerCase() as 'basic' | 'standard' | 'premium';

  return (
    <div className="cart-backdrop visible" style={{ zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div
        className="modal-content"
        style={{
          background: 'var(--ivory)',
          borderRadius: 'var(--r-xl)',
          width: 'min(780px, 95vw)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'fadeUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--charcoal)',
            zIndex: 10,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Close preview"
        >
          ✕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', flex: 1, overflowY: 'auto' }}>
          {/* Left Side: Image */}
          <div style={{ position: 'relative', background: 'linear-gradient(135deg, var(--blush-soft), var(--oat))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <span style={{ fontSize: '72px' }}>🧶</span>
            )}
            
            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!product.inStock && (
                <div style={{ background: 'rgba(44, 44, 44, 0.85)', color: '#fff', fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--r-md)', fontWeight: 600 }}>Out of Stock</div>
              )}
              {hasDiscount && (
                <div style={{ background: 'var(--terracotta)', color: '#fff', fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--r-md)', fontWeight: 600 }}>-{pct}% OFF</div>
              )}
            </div>
          </div>

          {/* Right Side: Details */}
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Category and Tier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--warm-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.category}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--r-full)',
                  background: 'rgba(0, 0, 0, 0.05)',
                  color: TIER_COLOR[tierKey] || 'var(--charcoal)',
                }}
              >
                {product.tier} Tier
              </span>
            </div>

            {/* Name */}
            <h2 className="serif" style={{ fontSize: '26px', color: 'var(--charcoal)', margin: 0, lineHeight: 1.2 }}>
              {product.name}
            </h2>

            {/* Rating Row */}
            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StarRating rating={product.rating} />
                <span style={{ fontSize: '13px', color: 'var(--warm-gray)', fontWeight: 500 }}>
                  {product.rating} ({product.reviewsCount} {product.reviewsCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--charcoal)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '16px', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice!.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div style={{ borderBottom: '1px solid rgba(44,44,44,.08)', margin: '4px 0' }} />

            {/* Description */}
            {product.description && (
              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--charcoal)', marginBottom: '6px', fontWeight: 600 }}>Description</h4>
                <p style={{ fontSize: '14px', color: 'var(--warm-gray)', lineHeight: 1.5, margin: 0 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Included Items */}
            {product.includedItems && product.includedItems.length > 0 && (
              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--charcoal)', marginBottom: '6px', fontWeight: 600 }}>What's Included</h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--warm-gray)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {product.includedItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--charcoal)', marginBottom: '6px', fontWeight: 600 }}>Available Colors</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.colors.map((hex, i) => (
                    <div
                      key={i}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: hex,
                        border: '1px solid rgba(0,0,0,.15)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,.06)',
                      }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ borderBottom: '1px solid rgba(44,44,44,.08)', margin: '4px 0' }} />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1,
                  background: product.inStock ? (added ? 'var(--sage)' : 'var(--forest)') : 'var(--warm-gray)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--r-md)',
                  padding: '14px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                }}
              >
                {!product.inStock ? (
                  'Out of Stock'
                ) : added ? (
                  <>✓ Added to Cart!</>
                ) : (
                  <>🛒 Add to Cart</>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  background: wished ? 'var(--blush)' : '#fff',
                  color: wished ? 'var(--terracotta)' : 'var(--warm-gray)',
                  border: '1px solid rgba(44, 44, 44, 0.12)',
                  borderRadius: 'var(--r-md)',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'background 0.2s, color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wished ? '♥' : '♡'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
