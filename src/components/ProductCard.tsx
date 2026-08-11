// src/components/ProductCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductPreviewModal from './ProductPreviewModal';

export interface ProductCardData {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  tier: string;               // "Basic" | "Standard" | "Premium"
  category: string;
  image: string;              // single Cloudinary URL
  colors: string[];
  inStock: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  rating: number;
  reviewsCount: number;
  description?: string;
  includedItems?: string[];
}

interface ProductCardProps {
  product: ProductCardData;
}

function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="pc-stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </div>
  );
}

function discountPct(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded]       = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product._id);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const tierKey = product.tier.toLowerCase() as 'basic' | 'standard' | 'premium';

  function handleAddToCart() {
    if (!product.inStock) return;
    addItem({
      _id:   product._id,
      name:  product.name,
      price: product.price,
      tier:  tierKey,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const pct         = hasDiscount ? discountPct(product.price, product.originalPrice!) : 0;

  return (
    <div className="product-card" onClick={() => setShowPreview(true)} style={{ cursor: 'pointer' }}>
      <div className="product-img-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-img-placeholder">🧶</div>
        )}

        {/* Wishlist */}
        <button
          className={`wishlist-btn${wished ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              _id: product._id,
              name: product.name,
              price: product.price,
              tier: product.tier,
              image: product.image,
            });
          }}
          aria-label="Add to wishlist"
        >
          {wished ? '♥' : '♡'}
        </button>

        {/* Badges — priority: out-of-stock > discount % > new arrival > bestseller */}
        {!product.inStock ? (
          <div className="out-of-stock-badge">Out of stock</div>
        ) : hasDiscount ? (
          <div className="tag-badge tag-sale">−{pct}% OFF</div>
        ) : product.isNewArrival ? (
          <div className="tag-badge tag-new">New</div>
        ) : product.isBestseller ? (
          <div className="tag-badge tag-bestseller">Bestseller</div>
        ) : null}
      </div>

      <div className="product-body">
        {/* Tier pill */}
        <div className={`product-tier-badge tier-${tierKey}`}>{product.tier}</div>

        <div className="product-name" title={product.name}>{product.name}</div>

        {/* Price row */}
        <div className="pc-price-row">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="pc-original-price">₹{product.originalPrice!.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Star rating */}
        {product.rating > 0 && (
          <div className="pc-rating-row">
            <StarRating rating={product.rating} />
            {product.reviewsCount > 0 && (
              <span className="pc-review-count">({product.reviewsCount})</span>
            )}
          </div>
        )}

        {/* Color dots */}
        {product.colors.length > 0 && (
          <div className="color-swatches">
            {product.colors.slice(0, 5).map((hex, i) => (
              <div key={i} className="color-dot" style={{ background: hex }} title={hex} />
            ))}
            {product.colors.length > 5 && (
              <span style={{ fontSize: 11, color: 'var(--warm-gray)', alignSelf: 'center' }}>
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <button
          className={`add-to-cart-btn${added ? ' added' : ''}${!product.inStock ? ' disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={!product.inStock}
          aria-label={product.inStock ? `Add ${product.name} to cart` : 'Out of stock'}
          id={`add-to-cart-${product._id}`}
        >
          {!product.inStock ? (
            'Out of Stock'
          ) : added ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>

      {showPreview && mounted && createPortal(
        <ProductPreviewModal
          product={product}
          onClose={() => setShowPreview(false)}
          wished={wished}
          toggleWishlist={toggleWishlist}
        />,
        document.body
      )}
    </div>
  );
}
