// src/app/checkout/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch profile to pre-fill address
  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setFullName(data.user.name || '');
          setPhone(data.user.phone || '');
          setAddressLine1(data.user.addressLine1 || '');
          setAddressLine2(data.user.addressLine2 || '');
          setCity(data.user.city || '');
          setState(data.user.state || '');
          setPostalCode(data.user.postalCode || '');
        }
      })
      .catch(() => {});
  }, []);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.push('/shop');
    }
  }, [items, loading, router]);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    const shippingFee = totalPrice >= 999 ? 0 : 60;
    const finalAmount = totalPrice + shippingFee;

    const body = {
      items: items.map((i) => ({
        productId: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        tier: i.tier,
      })),
      totalAmount: finalAmount,
      shippingAddress: {
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        phone,
        country: 'India',
      },
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to place order.');
        setLoading(false);
        return;
      }

      // Success! Clear cart and redirect
      clearCart();
      router.push('/dashboard?orderPlaced=true');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const shippingFee = totalPrice >= 999 ? 0 : 60;

  if (items.length === 0) {
    return null;
  }

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
        <h1 className="serif" style={{ fontSize: 32, marginBottom: 28, color: 'var(--charcoal)' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
          {/* Left: Address details */}
          <div>
            <div
              style={{
                background: '#fff',
                borderRadius: 'var(--r-lg)',
                padding: 28,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 className="serif" style={{ fontSize: 20, marginBottom: 20, color: 'var(--charcoal)' }}>
                Shipping Address
              </h2>
              {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}

              <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" htmlFor="co-name">Full Name *</label>
                  <input
                    id="co-name"
                    type="text"
                    required
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="co-phone">Phone Number *</label>
                  <input
                    id="co-phone"
                    type="tel"
                    required
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="co-addr1">Address Line 1 *</label>
                  <input
                    id="co-addr1"
                    type="text"
                    required
                    className="form-input"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Apartment, suite, unit, building, street"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="co-addr2">Address Line 2</label>
                  <input
                    id="co-addr2"
                    type="text"
                    className="form-input"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Landmark, area, colony"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label" htmlFor="co-city">City *</label>
                    <input
                      id="co-city"
                      type="text"
                      required
                      className="form-input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="co-state">State *</label>
                    <input
                      id="co-state"
                      type="text"
                      required
                      className="form-input"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="co-pin">Postal Code (PIN) *</label>
                  <input
                    id="co-pin"
                    type="text"
                    required
                    className="form-input"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400001"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ marginTop: 12, padding: '14px 28px', fontSize: 15 }}
                >
                  {loading ? 'Processing Order...' : `Place Order • ₹${(totalPrice + shippingFee).toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Summary details */}
          <aside>
            <div
              style={{
                background: '#fff',
                borderRadius: 'var(--r-lg)',
                padding: 28,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 className="serif" style={{ fontSize: 20, marginBottom: 20, color: 'var(--charcoal)' }}>
                Order Summary
              </h2>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 0, margin: '0 0 20px 0', listStyle: 'none' }}>
                {items.map((item) => (
                  <li key={item._id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--blush-soft), var(--oat))',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 22 }}>🧶</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>
                        Qty: {item.quantity} • {item.tier}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--charcoal)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ borderBottom: '1px solid rgba(44,44,44,.08)', marginBottom: 16 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warm-gray)' }}>
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warm-gray)' }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingFee === 0 ? 'var(--sage)' : 'inherit', fontWeight: shippingFee === 0 ? 600 : 400 }}>
                    {shippingFee === 0 ? 'FREE' : '₹60'}
                  </span>
                </div>

                <div style={{ borderBottom: '1px solid rgba(44,44,44,.08)', margin: '6px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: 'var(--charcoal)' }}>
                  <span>Total</span>
                  <span>₹{(totalPrice + shippingFee).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
