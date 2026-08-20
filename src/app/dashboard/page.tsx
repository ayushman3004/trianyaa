// src/app/dashboard/page.tsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import NewsletterFooter from '@/components/NewsletterFooter';

type TabKey = 'orders' | 'profile' | 'password';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tier: string;
}

interface OrderAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  addons?: OrderAddon[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  status: string;
  orderSource?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Pending:    { color: '#b45309', bg: '#fef3c7', icon: '⏳' },
  Confirmed:  { color: '#1d4ed8', bg: '#dbeafe', icon: '✅' },
  Processing: { color: '#c2410c', bg: '#ffedd5', icon: '🔄' },
  Shipped:    { color: '#7c3aed', bg: '#ede9fe', icon: '🚚' },
  Delivered:  { color: '#15803d', bg: '#dcfce7', icon: '🎉' },
  Cancelled:  { color: '#dc2626', bg: '#fee2e2', icon: '✕'  },
};


function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('orders');
  
  // Alert message for order placement success
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Check query params
  useEffect(() => {
    if (searchParams.get('orderPlaced') === 'true') {
      setSuccessMsg('🎉 Your order was placed successfully! Thank you for shopping with TRIANYAA.');
      // Remove query parameter cleanly
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  // Fetch orders and profile details on mount
  useEffect(() => {
    // Fetch profile
    fetch('/api/auth/profile')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setName(data.user.name || '');
          setPhone(data.user.phone || '');
          setAddressLine1(data.user.addressLine1 || '');
          setAddressLine2(data.user.addressLine2 || '');
          setCity(data.user.city || '');
          setState(data.user.state || '');
          setPostalCode(data.user.postalCode || '');
        }
      })
      .catch(() => {});

    // Fetch orders
    fetch('/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setOrdersLoading(false);
      })
      .catch(() => {
        setOrdersLoading(false);
      });
  }, []);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || 'Failed to update profile.');
      } else {
        setProfileSuccess('✨ Profile details updated successfully!');
      }
    } catch {
      setProfileError('Something went wrong. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }

    setPwdLoading(true);

    try {
      const res = await fetch('/api/auth/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdError(data.error || 'Failed to change password.');
      } else {
        setPwdSuccess('✨ Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPwdError('Something went wrong. Please try again.');
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px', minHeight: '65vh' }}>
        {successMsg && (
          <div
            style={{
              background: 'var(--sage-pale, #EAF2EC)',
              color: 'var(--forest, #2D5016)',
              padding: '16px 20px',
              borderRadius: 'var(--r-md)',
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 24,
              border: '1px solid var(--sage)',
            }}
          >
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 className="serif" style={{ fontSize: 32, margin: 0, color: 'var(--charcoal)' }}>
            My Account
          </h1>
          <a
            href="/api/auth/logout"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--terracotta)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--terracotta-pale)',
            }}
          >
            🚪 Logout
          </a>
        </div>

        {/* Dashboard Tabs & Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* Sidebar Menu */}
          <nav
            style={{
              background: '#fff',
              borderRadius: 'var(--r-lg)',
              padding: 16,
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: 'var(--r-md)',
                background: activeTab === 'orders' ? 'var(--terracotta-pale, #FDF0EC)' : 'none',
                color: activeTab === 'orders' ? 'var(--terracotta)' : 'var(--charcoal)',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              📦 Order History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: 'var(--r-md)',
                background: activeTab === 'profile' ? 'var(--terracotta-pale, #FDF0EC)' : 'none',
                color: activeTab === 'profile' ? 'var(--terracotta)' : 'var(--charcoal)',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              👤 Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: 'var(--r-md)',
                background: activeTab === 'password' ? 'var(--terracotta-pale, #FDF0EC)' : 'none',
                color: activeTab === 'password' ? 'var(--terracotta)' : 'var(--charcoal)',
                fontWeight: activeTab === 'password' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              🔒 Change Password
            </button>
          </nav>

          {/* Main Tab Content */}
          <div style={{ gridColumn: 'span 2' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 'var(--r-lg)',
                padding: 32,
                boxShadow: 'var(--shadow-sm)',
                minHeight: '400px',
              }}
            >
              {/* Tab: Orders */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="serif" style={{ fontSize: 22, marginBottom: 20, color: 'var(--charcoal)', marginTop: 0 }}>
                    Order History
                  </h2>

                  {ordersLoading ? (
                    <div style={{ textAlign: 'center', padding: 48, color: 'var(--warm-gray)' }}>Loading your orders...</div>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--warm-gray)' }}>
                      <div style={{ fontSize: 44, marginBottom: 14 }}>📦</div>
                      <p style={{ fontWeight: 600, color: 'var(--charcoal)', margin: '0 0 6px 0' }}>No orders placed yet</p>
                      <p style={{ fontSize: 13, margin: '0 0 20px 0' }}>Each purchase you make helps support our handmade stitch craft!</p>
                      <a href="/shop" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px', fontSize: 13 }}>
                        Shop Products
                      </a>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          style={{
                            border: '1px solid rgba(44,44,44,.08)',
                            borderRadius: 'var(--r-md)',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Order Card Header */}
                          <div
                            style={{
                              background: 'var(--oat-pale, #FAF6EF)',
                              padding: '16px 20px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              gap: 16,
                              fontSize: 13,
                              borderBottom: '1px solid rgba(44,44,44,.08)',
                            }}
                          >
                            <div>
                              <div style={{ color: 'var(--warm-gray)', fontWeight: 500 }}>ORDER PLACED</div>
                              <div style={{ fontWeight: 600, color: 'var(--charcoal)', marginTop: 2 }}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--warm-gray)', fontWeight: 500 }}>TOTAL AMOUNT</div>
                              <div style={{ fontWeight: 700, color: 'var(--charcoal)', marginTop: 2 }}>
                                ₹{order.totalAmount.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--warm-gray)', fontWeight: 500 }}>STATUS</div>
                              {(() => {
                                const cfg = STATUS_CONFIG[order.status] ?? { color: 'var(--charcoal)', bg: 'rgba(44,44,44,.08)', icon: '•' };
                                return (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    marginTop: 4,
                                    padding: '3px 10px',
                                    borderRadius: 'var(--r-full)',
                                    background: cfg.bg,
                                    color: cfg.color,
                                    fontWeight: 700,
                                    fontSize: 11,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                  }}>
                                    {cfg.icon} {order.status}
                                  </span>
                                );
                              })()}
                            </div>
                            <div>
                              <div style={{ color: 'var(--warm-gray)', fontWeight: 500 }}>ORDER ID</div>
                              <div style={{ color: 'var(--charcoal)', fontFamily: 'monospace', marginTop: 2, fontSize: 11 }}>
                                #{order._id.slice(-8).toUpperCase()}
                              </div>
                              {order.orderSource === 'whatsapp' && (
                                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                                  <svg width="12" height="12" viewBox="0 0 32 32" fill="currentColor">
                                    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.476 2.027 7.784L0 32l8.44-2.012A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm7.394 22.403c-.405-.202-2.395-1.18-2.767-1.315-.372-.135-.642-.202-.913.202-.27.405-1.047 1.315-1.283 1.585-.237.27-.473.303-.877.101-.405-.202-1.71-.63-3.257-2.011-1.203-1.074-2.016-2.401-2.252-2.806-.236-.404-.025-.623.177-.824.182-.18.405-.473.607-.71.202-.236.27-.404.405-.674.135-.27.067-.506-.034-.71-.101-.202-.913-2.2-1.25-3.013-.33-.792-.664-.685-.913-.698l-.776-.013c-.27 0-.71.101-1.081.506-.372.404-1.418 1.384-1.418 3.378s1.452 3.914 1.655 4.185c.202.27 2.859 4.365 6.93 6.118.97.418 1.727.668 2.317.855.972.31 1.857.267 2.556.162.78-.116 2.395-.979 2.733-1.924.337-.944.337-1.754.236-1.924-.101-.168-.372-.27-.776-.473z"/>
                                  </svg>
                                  Via WhatsApp
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Items & Add-ons List */}
                          <div style={{ padding: '16px 20px' }}>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 0, margin: 0, listStyle: 'none' }}>
                              {order.items.map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                  <div
                                    style={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 6,
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
                                      <span style={{ fontSize: 20 }}>🧶</span>
                                    )}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{item.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>
                                      Qty: {item.quantity} • {item.tier} • ₹{item.price.toLocaleString('en-IN')} each
                                    </div>
                                  </div>
                                </li>
                              ))}

                              {/* Render Add-ons if present */}
                              {order.addons && order.addons.length > 0 && order.addons.map((addon, ai) => (
                                <li key={`addon-${ai}`} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--terracotta-pale, #FDF0EC)', padding: '8px 12px', borderRadius: 6 }}>
                                  <div
                                    style={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: 6,
                                      background: '#fff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                      fontSize: 18,
                                    }}
                                  >
                                    🍫
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>
                                      {addon.name} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--terracotta)' }}>(Add-on)</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--warm-gray)' }}>
                                      Qty: {addon.quantity} • ₹{addon.price.toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            {/* Shipping summary inside order card */}
                            <div style={{ borderTop: '1px solid rgba(44,44,44,.06)', marginTop: 14, paddingTop: 12, fontSize: 12, color: 'var(--warm-gray)' }}>
                              <strong>Ship to:</strong> {order.shippingAddress.fullName} • {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode} • Tel: {order.shippingAddress.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Edit Profile */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="serif" style={{ fontSize: 22, marginBottom: 20, color: 'var(--charcoal)', marginTop: 0 }}>
                    Edit Profile
                  </h2>

                  {profileError && <div className="form-error" style={{ marginBottom: 20 }}>{profileError}</div>}
                  {profileSuccess && <div className="form-success" style={{ marginBottom: 20 }}>{profileSuccess}</div>}

                  <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
                    <div>
                      <label className="form-label" htmlFor="df-name">Full Name</label>
                      <input
                        id="df-name"
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="form-label" htmlFor="df-phone">Phone Number</label>
                      <input
                        id="df-phone"
                        type="tel"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                      />
                    </div>

                    <div style={{ borderBottom: '1px solid rgba(44,44,44,.08)', margin: '8px 0' }} />

                    <h3 className="serif" style={{ fontSize: 16, margin: 0, color: 'var(--charcoal)' }}>Default Shipping Address</h3>

                    <div>
                      <label className="form-label" htmlFor="df-addr1">Address Line 1</label>
                      <input
                        id="df-addr1"
                        type="text"
                        className="form-input"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="Apartment, unit, street"
                      />
                    </div>

                    <div>
                      <label className="form-label" htmlFor="df-addr2">Address Line 2</label>
                      <input
                        id="df-addr2"
                        type="text"
                        className="form-input"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Landmark, colony"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label className="form-label" htmlFor="df-city">City</label>
                        <input
                          id="df-city"
                          type="text"
                          className="form-input"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="df-state">State</label>
                        <input
                          id="df-state"
                          type="text"
                          className="form-input"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Maharashtra"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" htmlFor="df-pin">Postal Code (PIN)</label>
                      <input
                        id="df-pin"
                        type="text"
                        className="form-input"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="400001"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="btn-primary"
                      style={{ width: 'auto', padding: '10px 24px', fontSize: 13, alignSelf: 'start', marginTop: 8 }}
                    >
                      {profileLoading ? 'Saving...' : 'Save Profile Details'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Change Password */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="serif" style={{ fontSize: 22, marginBottom: 20, color: 'var(--charcoal)', marginTop: 0 }}>
                    Change Password
                  </h2>

                  {pwdError && <div className="form-error" style={{ marginBottom: 20 }}>{pwdError}</div>}
                  {pwdSuccess && <div className="form-success" style={{ marginBottom: 20 }}>{pwdSuccess}</div>}

                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
                    <div>
                      <label className="form-label" htmlFor="pw-curr">Current Password *</label>
                      <input
                        id="pw-curr"
                        type="password"
                        required
                        className="form-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="form-label" htmlFor="pw-new">New Password *</label>
                      <input
                        id="pw-new"
                        type="password"
                        required
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="•••••••• (min 6 chars)"
                      />
                    </div>

                    <div>
                      <label className="form-label" htmlFor="pw-conf">Confirm New Password *</label>
                      <input
                        id="pw-conf"
                        type="password"
                        required
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="btn-primary"
                      style={{ width: 'auto', padding: '10px 24px', fontSize: 13, alignSelf: 'start', marginTop: 8 }}
                    >
                      {pwdLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--warm-gray)', fontFamily: 'var(--font-serif)', fontSize: 16 }}>
        Loading Dashboard...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
