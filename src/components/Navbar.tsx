// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

function TrianyaaLogo() {
  return (
    <svg className="logo-emblem" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" stroke="#2D5016" strokeWidth="1.5" fill="#FDFAF5"/>
      <circle cx="60" cy="60" r="52" stroke="#2D5016" strokeWidth="0.8" fill="none"/>
      <g stroke="#2D5016" strokeWidth="1" fill="none" opacity="0.7">
        <line x1="60" y1="8" x2="60" y2="14"/>
        <path d="M58 10 Q60 7 62 10" fill="#7B9E87" stroke="none" opacity="0.8"/>
        <line x1="110" y1="60" x2="104" y2="60"/>
        <path d="M108 58 Q111 60 108 62" fill="#7B9E87" stroke="none" opacity="0.8"/>
        <line x1="10" y1="60" x2="16" y2="60"/>
        <path d="M12 58 Q9 60 12 62" fill="#7B9E87" stroke="none" opacity="0.8"/>
        <line x1="60" y1="112" x2="60" y2="106"/>
        <path d="M58 110 Q60 113 62 110" fill="#7B9E87" stroke="none" opacity="0.8"/>
        <circle cx="38" cy="15" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="82" cy="15" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="38" cy="105" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="82" cy="105" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="16" cy="40" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="104" cy="40" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="16" cy="80" r="1.5" fill="#2D5016" opacity="0.5"/>
        <circle cx="104" cy="80" r="1.5" fill="#2D5016" opacity="0.5"/>
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
  const { totalItems, openCart } = useCart();
  const [user, setUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
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
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <TrianyaaLogo />
        <div className="logo-text-group">
          <span className="logo-brand serif">TRIANYAA</span>
          <span className="logo-tagline">Handmade with Love</span>
        </div>
      </Link>

      <ul className="navbar-links">
        <li><Link href="/shop">Shop</Link></li>
        <li><Link href="/shop?tier=basic">Basic</Link></li>
        <li><Link href="/shop?tier=standard">Standard</Link></li>
        <li><Link href="/shop?tier=premium">Premium</Link></li>
        <li><Link href="/shop?category=keychain">Keychains</Link></li>
        <li><Link href="/tutorials">Tutorials</Link></li>
      </ul>

      <div className="navbar-actions">
        <button className="navbar-icon-btn" aria-label="Search" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* User Account / Dropdown */}
        <div className="user-menu-container" style={{ position: 'relative', display: 'inline-block' }}>
          {user ? (
            <>
              <button
                className={`navbar-icon-btn${dropdownOpen ? ' active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User account"
                title="My Account"
              >
                <div className="user-avatar-initial">
                  {user.email[0].toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-email-title">{user.email}</div>
                    <div className="user-role-badge">{user.role}</div>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="user-dropdown-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📊 Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/shop"
                    className="user-dropdown-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🛍️ Shop All
                  </Link>
                  <div className="user-dropdown-divider"></div>
                  <button onClick={handleLogout} className="user-dropdown-logout-btn">
                    🚪 Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/auth/login" className="navbar-icon-btn" aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}
        </div>

        {/* Cart button — opens the drawer */}
        <button
          className="navbar-icon-btn cart-badge"
          onClick={openCart}
          aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          id="navbar-cart-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  );
}
