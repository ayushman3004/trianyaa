// src/components/CartDrawer.tsx
'use client';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

const TIER_COLOR: Record<string, string> = {
  basic: 'var(--sage)',
  standard: 'var(--terracotta)',
  premium: 'var(--gold)',
};

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, removeItem, updateQty, clearCart, closeCart } = useCart();

  // Prevent body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop${isOpen ? ' visible' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Shopping cart">
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🛍️</span>
            <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--charcoal)' }}>
              Your Cart
            </span>
            {totalItems > 0 && (
              <span className="cart-drawer-count">{totalItems}</span>
            )}
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🧺</div>
              <p className="serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 24 }}>
                Add some handmade goodies to get started!
              </p>
              <button className="cart-shop-btn" onClick={closeCart}>
                Continue Shopping →
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
                        style={{ color: TIER_COLOR[item.tier] }}
                      >
                        {item.tier}
                      </span>
                    </div>
                    <div className="cart-item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      {item.quantity > 1 && (
                        <span style={{ fontSize: 12, color: 'var(--warm-gray)', marginLeft: 6 }}>
                          (₹{item.price.toLocaleString('en-IN')} each)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Qty + remove */}
                  <div className="cart-item-controls">
                    <div className="cart-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeItem(item._id)}
                      aria-label="Remove item"
                      title="Remove"
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

        {/* Footer — summary & checkout */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Free shipping progress */}
            <div className="cart-shipping-bar">
              {totalPrice >= 999 ? (
                <div className="cart-shipping-msg achieved">
                  🎉 You've unlocked <strong>Free Shipping!</strong>
                </div>
              ) : (
                <>
                  <div className="cart-shipping-msg">
                    Add <strong>₹{(999 - totalPrice).toLocaleString('en-IN')}</strong> more for free shipping
                  </div>
                  <div className="cart-shipping-track">
                    <div
                      className="cart-shipping-fill"
                      style={{ width: `${Math.min((totalPrice / 999) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Order summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span style={{ color: totalPrice >= 999 ? 'var(--sage)' : 'inherit' }}>
                  {totalPrice >= 999 ? 'FREE' : '₹60'}
                </span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>₹{(totalPrice + (totalPrice >= 999 ? 0 : 60)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="cart-checkout-btn">
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <button className="cart-clear-btn" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
