// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

function TrianyaaLightLogo() {
  return (
    <svg className="logo-emblem" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" stroke="#2D5016" strokeWidth="1.5" fill="#FDFAF5"/>
      <circle cx="60" cy="60" r="52" stroke="#2D5016" strokeWidth="0.8" fill="none"/>
      <g stroke="#2D5016" strokeWidth="1" fill="none" opacity="0.7">
        <line x1="60" y1="8" x2="60" y2="14"/>
        <path d="M58 10 Q60 7 62 10" fill="#7B9E87" stroke="none" opacity="0.8"/>
        <line x1="110" y1="60" x2="104" y2="60"/>
        <line x1="10" y1="60" x2="16" y2="60"/>
        <line x1="60" y1="112" x2="60" y2="106"/>
      </g>
      <circle cx="60" cy="55" r="32" fill="#2D5016" opacity="0.08"/>
      <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="700" fill="#2D5016" fontFamily="serif" letterSpacing="-1">
        त्री
      </text>
      <text x="60" y="81" textAnchor="middle" fontSize="12" fontWeight="600" fill="#2D5016" fontFamily="serif" letterSpacing="2">
        Anya
      </text>
      <text x="60" y="96" textAnchor="middle" fontSize="6.5" fill="#7B9E87" fontFamily="sans-serif" letterSpacing="3.5" fontWeight="600">
        CREATION
      </text>
    </svg>
  );
}

interface UserSession {
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { items: wishlistItems, openWishlist } = useWishlist();
  const [user, setUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    fetch('/api/settings?key=logoUrl')
      .then((res) => res.json())
      .then((data) => {
        if (data.value) setLogoUrl(data.value);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setDropdownOpen(false);
    window.location.reload();
  }

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.user-menu-container')) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  return (
    <>
      <nav className="navbar">
        {/* Mobile Hamburger Button (visible on small screens) */}
        <button
          className="navbar-toggle-btn mobile-only-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
          title="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="17" x2="21" y2="17"/>
              </>
            )}
          </svg>
        </button>

        {/* LEFT: Logo + Brand Name + Tagline */}
        <div className="navbar-left">
          <Link href="/" className="navbar-logo">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="TRIANYAA Logo"
                className="logo-emblem"
                style={{ width: '46px', height: '46px', maxWidth: '46px', maxHeight: '46px', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }}
              />
            ) : (
              <TrianyaaLightLogo />
            )}
            <div className="logo-text-group">
              <span className="logo-brand serif">TRIANYAA</span>
              <span className="logo-tagline">HANDMADE WITH LOVE</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Navigation Links */}
        <ul className="navbar-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/shop?category=flowers">Flowers</Link></li>
          <li><Link href="/shop?category=keychain">Keychains</Link></li>
          <li><Link href="/#story">Story</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        {/* RIGHT: Search, User Account, Wishlist, Cart */}
        <div className="navbar-actions">
          {/* Search Trigger / Form */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search craft items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    setTimeout(() => {
                      if (!searchQuery) setSearchOpen(false);
                    }, 200);
                  }}
                  style={{
                    border: '1px solid rgba(196, 98, 74, 0.3)',
                    borderRadius: 'var(--r-full)',
                    padding: '6px 36px 6px 14px',
                    fontSize: 13,
                    outline: 'none',
                    background: '#FFF8EF',
                    color: '#292522',
                    width: 170,
                    fontFamily: 'inherit',
                  }}
                />
                <button type="submit" aria-label="Submit search" style={{ position: 'absolute', right: 8, border: 'none', background: 'none', color: '#C9674C' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </form>
            ) : (
              <button
                className="navbar-icon-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                title="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            )}
          </div>

          {/* User Account / Profile */}
          <div className="user-menu-container" style={{ position: 'relative', display: 'inline-block' }}>
            {user ? (
              <>
                <button
                  className={`navbar-icon-btn${dropdownOpen ? ' active' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User account"
                  title="My Account"
                >
                  <div className="user-avatar-initial-green">
                    {user.email[0].toUpperCase()}
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu" style={{ position: 'absolute', right: 0, top: '48px', background: '#FFF8EF', color: '#292522', border: '1px solid rgba(86,56,32,0.15)', borderRadius: '12px', padding: '12px', minWidth: '200px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 110 }}>
                    <div className="user-dropdown-header" style={{ paddingBottom: '8px', borderBottom: '1px solid rgba(86,56,32,0.1)' }}>
                      <div className="user-email-title" style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                      <div className="user-role-badge" style={{ fontSize: '11px', color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{user.role}</div>
                    </div>
                    <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="user-dropdown-link" style={{ fontSize: '13px', padding: '4px 6px', color: '#292522' }} onClick={() => setDropdownOpen(false)}>
                          📊 Admin Panel
                        </Link>
                      )}
                      <Link href="/dashboard" className="user-dropdown-link" style={{ fontSize: '13px', padding: '4px 6px', color: '#292522' }} onClick={() => setDropdownOpen(false)}>
                        👤 My Profile
                      </Link>
                      <Link href="/shop" className="user-dropdown-link" style={{ fontSize: '13px', padding: '4px 6px', color: '#292522' }} onClick={() => setDropdownOpen(false)}>
                        🛍️ Shop All
                      </Link>
                    </div>
                    <button onClick={handleLogout} className="user-dropdown-logout-btn" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#C9674C', fontSize: '13px', fontWeight: 600, cursor: 'pointer', paddingTop: '8px', borderTop: '1px solid rgba(86,56,32,0.1)' }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/auth/login" className="navbar-icon-btn" aria-label="Account" title="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="navbar-icon-btn cart-badge"
            onClick={openWishlist}
            aria-label={`Wishlist — ${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''}`}
            id="navbar-wishlist-btn"
            title="Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistItems.length > 0 ? "#C9674C" : "none"} stroke={wishlistItems.length > 0 ? "#C9674C" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistItems.length > 0 && (
              <span className="cart-count" style={{ background: 'var(--terracotta)' }} aria-hidden="true">{wishlistItems.length}</span>
            )}
          </button>

          {/* Shopping Bag / Cart Button */}
          <button
            className="navbar-icon-btn cart-badge"
            onClick={openCart}
            aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            id="navbar-cart-btn"
            title="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="cart-count" aria-hidden="true">{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <div
          className="nav-drawer-overlay"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(41, 37, 34, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <div
            className="nav-drawer-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '85%',
              maxWidth: '320px',
              height: '100%',
              background: '#FFF8EF',
              color: '#292522',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '8px 0 30px rgba(0,0,0,0.25)',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(196,98,74,0.15)' }}>
              <div className="navbar-logo">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="TRIANYAA Logo"
                    className="logo-emblem"
                    style={{ width: '40px', height: '40px', maxWidth: '40px', maxHeight: '40px', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }}
                  />
                ) : (
                  <TrianyaaLightLogo />
                )}
                <div className="logo-text-group">
                  <span className="logo-brand serif" style={{ fontSize: '18px' }}>TRIANYAA</span>
                  <span className="logo-tagline" style={{ fontSize: '8px' }}>HANDMADE WITH LOVE</span>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  background: 'rgba(201, 103, 76, 0.1)',
                  border: 'none',
                  color: '#C9674C',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '24px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(196,98,74,0.3)',
                  background: '#fff',
                  color: '#292522',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button type="submit" style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: '#C9674C' }}>
                🔍
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', fontWeight: 600 }}>
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ borderBottom: '1px solid rgba(44,44,44,0.08)', paddingBottom: '10px', color: '#292522' }}>Home</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)} style={{ borderBottom: '1px solid rgba(44,44,44,0.08)', paddingBottom: '10px', color: '#292522' }}>Shop All Products</Link>
              <Link href="/shop?category=flowers" onClick={() => setMenuOpen(false)} style={{ borderBottom: '1px solid rgba(44,44,44,0.08)', paddingBottom: '10px', color: '#292522' }}>Crochet Flowers</Link>
              <Link href="/shop?category=keychain" onClick={() => setMenuOpen(false)} style={{ borderBottom: '1px solid rgba(44,44,44,0.08)', paddingBottom: '10px', color: '#292522' }}>Handmade Keychains</Link>
              <Link href="/#story" onClick={() => setMenuOpen(false)} style={{ borderBottom: '1px solid rgba(44,44,44,0.08)', paddingBottom: '10px', color: '#292522' }}>Our Story</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ borderBottom: '1px solid rgba(44,44,44,0.08)', paddingBottom: '10px', color: '#292522' }}>Contact Us</Link>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(44,44,44,0.1)', fontSize: '12px', color: '#8A8078' }}>
              HANDMADE WITH LOVE • One stitch at a time
            </div>
          </div>
        </div>
      )}
    </>
  );
}


