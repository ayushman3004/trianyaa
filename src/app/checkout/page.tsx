// src/app/checkout/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import NewsletterFooter from '@/components/NewsletterFooter';
import { formatOrderMessage, buildWhatsAppUrl, WAOrderItem, WAAddonItem } from '@/lib/whatsapp';

interface AddonItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

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

  const [waLoading, setWaLoading] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Add-on states
  const [availableAddons, setAvailableAddons] = useState<AddonItem[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [activeAddonTab, setActiveAddonTab] = useState<string>('All');

  // Category config for Add-ons Gallery
  const ADDON_CATEGORIES = [
    { id: 'All', label: '✨ All' },
    { id: 'Chocolate', label: '🍫 Chocolate' },
    { id: 'Gift Wrap', label: '🎁 Gift Wrap' },
    { id: 'Letter', label: '✉️ Letter' },
  ];

  // Fetch available add-ons
  useEffect(() => {
    fetch('/api/addons')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.addons) {
          setAvailableAddons(data.addons);
        }
      })
      .catch(() => { });
  }, []);

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
      .catch(() => { });
  }, []);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (items.length === 0 && !waLoading) {
      router.push('/shop');
    }
  }, [items, waLoading, router]);

  function validateAddress(): boolean {
    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setAddressError('Please fill in all required shipping fields before ordering via WhatsApp.');
      document.getElementById('co-name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    setAddressError('');
    return true;
  }

  function toggleAddon(addonId: string) {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  }

  const selectedAddons = availableAddons.filter((a) => selectedAddonIds.includes(a._id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const subtotalWithAddons = totalPrice + addonsTotal;
  const shippingFee = subtotalWithAddons >= 999 ? 0 : 60;
  const finalTotal = subtotalWithAddons + shippingFee;

  async function handleWhatsAppOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validateAddress()) return;

    setWaLoading(true);

    const waItems: WAOrderItem[] = items.map((i) => ({
      productId: i._id,
      name: i.name,
      tier: i.tier,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    const waAddons: WAAddonItem[] = selectedAddons.map((a) => ({
      addonId: a._id,
      name: a.name,
      price: a.price,
    }));

    // 1. Save order to DB first
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: waItems,
          addonIds: selectedAddonIds,
          orderSource: 'whatsapp',
          shippingAddress: {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country: 'India',
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAddressError(data.error || 'Could not save order. Please try again.');
        setWaLoading(false);
        return;
      }
    } catch {
      setAddressError('Network error. Please check your connection and try again.');
      setWaLoading(false);
      return;
    }

    // 2. Build WA message and open WhatsApp
    const message = formatOrderMessage(
      waItems,
      { fullName, phone, addressLine1, addressLine2, city, state, postalCode },
      shippingFee,
      waAddons
    );
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');

    // 3. Clear cart and go to dashboard
    clearCart();
    router.push('/dashboard?orderPlaced=true');
  }

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
              {addressError && <div className="form-error" style={{ marginBottom: 20 }}>{addressError}</div>}

              <form onSubmit={handleWhatsAppOrder} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

                {addressError && (
                  <div className="form-error" style={{ marginBottom: 4, fontSize: 13 }}>{addressError}</div>
                )}

                <button
                  id="checkout-whatsapp-btn"
                  type="submit"
                  disabled={waLoading}
                  style={{
                    marginTop: 12,
                    padding: '14px 28px',
                    fontSize: 15,
                    background: waLoading ? 'var(--sage)' : '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--r-md)',
                    fontWeight: 700,
                    cursor: waLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'background 0.2s, transform 0.15s',
                    boxShadow: '0 4px 16px rgba(37,211,102,.3)',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => { if (!waLoading) { e.currentTarget.style.background = '#1ebe5d'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = waLoading ? 'var(--sage)' : '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.476 2.027 7.784L0 32l8.44-2.012A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333c-2.65 0-5.115-.72-7.23-1.974l-.518-.31-5.01 1.195 1.23-4.87-.337-.535A13.287 13.287 0 0 1 2.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.394-9.93c-.405-.202-2.395-1.18-2.767-1.315-.372-.135-.642-.202-.913.202-.27.405-1.047 1.315-1.283 1.585-.237.27-.473.303-.877.101-.405-.202-1.71-.63-3.257-2.011-1.203-1.074-2.016-2.401-2.252-2.806-.236-.404-.025-.623.177-.824.182-.18.405-.473.607-.71.202-.236.27-.404.405-.674.135-.27.067-.506-.034-.71-.101-.202-.913-2.2-1.25-3.013-.33-.792-.664-.685-.913-.698l-.776-.013c-.27 0-.71.101-1.081.506-.372.404-1.418 1.384-1.418 3.378s1.452 3.914 1.655 4.185c.202.27 2.859 4.365 6.93 6.118.97.418 1.727.668 2.317.855.972.31 1.857.267 2.556.162.78-.116 2.395-.979 2.733-1.924.337-.944.337-1.754.236-1.924-.101-.168-.372-.27-.776-.473z" />
                  </svg>
                  {waLoading ? 'Opening WhatsApp…' : `Order via WhatsApp • ₹${finalTotal.toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Summary details & Optional Add-ons */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Optional Add-ons Gallery Section */}
            {availableAddons.length > 0 && (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 'var(--r-lg)',
                  padding: 24,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <h2 className="serif" style={{ fontSize: 18, margin: 0, color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Add a little something extra 🎁
                  </h2>
                </div>

                {/* Category Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 16, borderBottom: '1px solid rgba(44,44,44,.08)' }}>
                  {ADDON_CATEGORIES.map((cat) => {
                    const isActive = activeAddonTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveAddonTab(cat.id)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 'var(--r-full)',
                          fontSize: 12,
                          fontWeight: isActive ? 700 : 500,
                          border: isActive ? '1.5px solid var(--terracotta)' : '1px solid rgba(44,44,44,.15)',
                          background: isActive ? 'var(--terracotta-pale, #FDF0EC)' : '#fff',
                          color: isActive ? 'var(--terracotta)' : 'var(--charcoal)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Add-ons Gallery List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {availableAddons
                    .filter((addon) => {
                      if (activeAddonTab === 'All') return true;
                      const catName = addon.category || '';
                      return (
                        catName.toLowerCase().includes(activeAddonTab.toLowerCase()) ||
                        addon.name.toLowerCase().includes(activeAddonTab.toLowerCase())
                      );
                    })
                    .map((addon) => {
                      const isSelected = selectedAddonIds.includes(addon._id);
                      const isChocolate = addon.category?.toLowerCase().includes('chocolate') || addon.name.toLowerCase().includes('chocolate');
                      const isGiftWrap = addon.category?.toLowerCase().includes('wrap') || addon.name.toLowerCase().includes('wrap');
                      const isLetter = addon.category?.toLowerCase().includes('letter') || addon.name.toLowerCase().includes('letter');

                      const fallbackIcon = isChocolate ? '🍫' : isGiftWrap ? '🎁' : isLetter ? '✉️' : '✨';
                      const badgeLabel = isChocolate ? 'Chocolate' : isGiftWrap ? 'Gift Wrap' : isLetter ? 'Letter' : addon.category || 'Add-on';

                      return (
                        <div
                          key={addon._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: 14,
                            borderRadius: 'var(--r-md)',
                            border: isSelected ? '1.5px solid var(--terracotta)' : '1px solid rgba(44,44,44,.12)',
                            background: isSelected ? 'var(--terracotta-pale, #FDF0EC)' : '#fafafa',
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <div
                            style={{
                              width: 58,
                              height: 58,
                              borderRadius: 8,
                              overflow: 'hidden',
                              background: 'linear-gradient(135deg, var(--blush-soft), var(--oat))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {addon.image ? (
                              <img src={addon.image} alt={addon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: 24 }}>{fallbackIcon}</span>
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)' }}>
                                {addon.name}
                              </span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--terracotta)' }}>
                                ₹{addon.price}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: 'rgba(44,44,44,.06)',
                                  color: 'var(--warm-gray)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.4px',
                                }}
                              >
                                {badgeLabel}
                              </span>
                            </div>
                            {addon.description && (
                              <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {addon.description}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleAddon(addon._id)}
                            style={{
                              padding: '8px 16px',
                              fontSize: 13,
                              fontWeight: 700,
                              borderRadius: 'var(--r-md)',
                              border: isSelected ? 'none' : '1px solid var(--charcoal)',
                              background: isSelected ? 'var(--terracotta)' : '#fff',
                              color: isSelected ? '#fff' : 'var(--charcoal)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease-in-out',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected ? 'Remove' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Order Summary Card */}
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
                  <span>Product Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>

                {selectedAddons.map((addon) => (
                  <div key={addon._id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--charcoal)', fontWeight: 500 }}>
                    <span>{addon.name}</span>
                    <span>₹{addon.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warm-gray)' }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingFee === 0 ? 'var(--sage)' : 'inherit', fontWeight: shippingFee === 0 ? 600 : 400 }}>
                    {shippingFee === 0 ? 'FREE' : '₹60'}
                  </span>
                </div>

                <div style={{ borderBottom: '1px solid rgba(44,44,44,.08)', margin: '6px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: 'var(--charcoal)' }}>
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
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
