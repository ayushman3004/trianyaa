// src/components/ShippingAddressModal.tsx
'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WAShippingAddress } from '@/lib/whatsapp';

interface ShippingAddressModalProps {
  onConfirm: (address: WAShippingAddress) => void;
  onClose: () => void;
  /** Optional initial values (e.g. from cart checkout form) */
  initial?: Partial<WAShippingAddress>;
}

export default function ShippingAddressModal({
  onConfirm,
  onClose,
  initial = {},
}: ShippingAddressModalProps) {
  const [fullName, setFullName]       = useState(initial.fullName ?? '');
  const [phone, setPhone]             = useState(initial.phone ?? '');
  const [addressLine1, setAddressLine1] = useState(initial.addressLine1 ?? '');
  const [addressLine2, setAddressLine2] = useState(initial.addressLine2 ?? '');
  const [city, setCity]               = useState(initial.city ?? '');
  const [state, setState]             = useState(initial.state ?? '');
  const [postalCode, setPostalCode]   = useState(initial.postalCode ?? '');
  const [loading, setLoading]         = useState(false);

  // Pre-fill from logged-in profile
  useEffect(() => {
    if (initial.fullName) return; // skip if parent already passed values
    fetch('/api/auth/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.user) return;
        const u = data.user;
        if (u.name)         setFullName(u.name);
        if (u.phone)        setPhone(u.phone);
        if (u.addressLine1) setAddressLine1(u.addressLine1);
        if (u.addressLine2) setAddressLine2(u.addressLine2);
        if (u.city)         setCity(u.city);
        if (u.state)        setState(u.state);
        if (u.postalCode)   setPostalCode(u.postalCode);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll & Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onConfirm({ fullName, phone, addressLine1, addressLine2, city, state, postalCode });
  }

  return createPortal(
    <div
      className="cart-backdrop visible"
      style={{ zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--ivory)',
          borderRadius: 'var(--r-xl)',
          width: 'min(520px, 95vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          position: 'relative',
          animation: 'fadeUp 0.28s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>📦</span>
              <h2
                className="serif"
                style={{ fontSize: 22, color: 'var(--charcoal)', margin: 0 }}
              >
                Shipping Address
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--warm-gray)', margin: 0 }}>
              We&apos;ll send your order details to WhatsApp after this.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--charcoal)',
              fontSize: 16,
              flexShrink: 0,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(44,44,44,.08)', margin: '20px 0 0' }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full Name */}
          <div>
            <label className="form-label" htmlFor="wa-name">Full Name *</label>
            <input
              id="wa-name"
              type="text"
              required
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="form-label" htmlFor="wa-phone">Phone Number *</label>
            <input
              id="wa-phone"
              type="tel"
              required
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="form-label" htmlFor="wa-addr1">Address Line 1 *</label>
            <input
              id="wa-addr1"
              type="text"
              required
              className="form-input"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Flat/House no., Building, Street"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="form-label" htmlFor="wa-addr2">Address Line 2</label>
            <input
              id="wa-addr2"
              type="text"
              className="form-input"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Landmark, Area, Colony"
            />
          </div>

          {/* City + State */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label" htmlFor="wa-city">City *</label>
              <input
                id="wa-city"
                type="text"
                required
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="wa-state">State *</label>
              <input
                id="wa-state"
                type="text"
                required
                className="form-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
              />
            </div>
          </div>

          {/* PIN Code */}
          <div>
            <label className="form-label" htmlFor="wa-pin">Postal Code (PIN) *</label>
            <input
              id="wa-pin"
              type="text"
              required
              pattern="[0-9]{6}"
              className="form-input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="400001"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            id="wa-confirm-btn"
            style={{
              marginTop: 8,
              padding: '14px 20px',
              background: loading ? 'var(--sage)' : '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--r-md)',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'background 0.2s, transform 0.15s',
              boxShadow: '0 4px 14px rgba(37,211,102,.35)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.476 2.027 7.784L0 32l8.44-2.012A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333c-2.65 0-5.115-.72-7.23-1.974l-.518-.31-5.01 1.195 1.23-4.87-.337-.535A13.287 13.287 0 0 1 2.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.394-9.93c-.405-.202-2.395-1.18-2.767-1.315-.372-.135-.642-.202-.913.202-.27.405-1.047 1.315-1.283 1.585-.237.27-.473.303-.877.101-.405-.202-1.71-.63-3.257-2.011-1.203-1.074-2.016-2.401-2.252-2.806-.236-.404-.025-.623.177-.824.182-.18.405-.473.607-.71.202-.236.27-.404.405-.674.135-.27.067-.506-.034-.71-.101-.202-.913-2.2-1.25-3.013-.33-.792-.664-.685-.913-.698l-.776-.013c-.27 0-.71.101-1.081.506-.372.404-1.418 1.384-1.418 3.378s1.452 3.914 1.655 4.185c.202.27 2.859 4.365 6.93 6.118.97.418 1.727.668 2.317.855.972.31 1.857.267 2.556.162.78-.116 2.395-.979 2.733-1.924.337-.944.337-1.754.236-1.924-.101-.168-.372-.27-.776-.473z" />
            </svg>
            {loading ? 'Opening WhatsApp…' : 'Continue to WhatsApp'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
