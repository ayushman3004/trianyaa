// src/components/WishlistDrawer.tsx
'use client';
import { useEffect } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const TIER_COLOR: Record<string, string> = {
  basic: 'var(--sage)',
  standard: 'var(--terracotta)',
  premium: 'var(--gold)',
};

export default function WishlistDrawer() {
  const { items, isOpen, removeFromWishlist, closeWishlist } = useWishlist();
  const { addItem } = useCart();

  // Prevent body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function handleMoveToCart(item: any) {
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      tier: item.tier,
      image: item.image,
    });
    // Remove from wishlist after adding to cart
    removeFromWishlist(item._id);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop${isOpen ? ' visible' : ''}`}
        onClick={closeWishlist}
        aria-hidden="true"
        style={{ zIndex: 200 }}
      />

      {/* Drawer panel */}
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Wishlist" style={{ zIndex: 201 }}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>❤️</span>
            <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--charcoal)' }}>
              Your Wishlist
            </span>
            {items.length > 0 && (
              <span className="cart-drawer-count" style={{ background: 'var(--terracotta)' }}>{items.length}</span>
            )}
          </div>
          <button className="cart-close-btn" onClick={closeWishlist} aria-label="Close wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">❤️</div>
              <p className="serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
                Your wishlist is empty
              </p>
              <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 24 }}>
                Tap the heart on any product to save it here!
              </p>
              <button className="cart-shop-btn" onClick={closeWishlist}>
                Explore Products →
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item._id} className="cart-item">
                  {/* Product image */}
                  <div className="cart-item-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span style={{ fontSize: 28 }}>🧶</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span
                        className="cart-item-tier"
                        style={{ color: TIER_COLOR[item.tier.toLowerCase()] }}
                      >
                        {item.tier}
                      </span>
                    </div>
                    <div className="cart-item-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Move to Cart + Remove */}
                  <div className="cart-item-controls" style={{ minWidth: 100, gap: 12 }}>
                    <button
                      className="btn-primary"
                      onClick={() => handleMoveToCart(item)}
                      style={{ fontSize: 11, padding: '6px 12px', whiteSpace: 'nowrap', width: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}
                      title="Add to Cart"
                    >
                      🛒 Add
                    </button>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromWishlist(item._id)}
                      aria-label="Remove item"
                      title="Remove"
                      style={{ marginTop: 0 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
