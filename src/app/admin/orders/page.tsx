// src/app/admin/orders/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tier: string;
}

interface AdminOrderAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

interface AdminOrder {
  _id: string;
  userId?: { _id?: string; name?: string; email?: string } | string | null;
  items: OrderItem[];
  addons?: AdminOrderAddon[];
  totalAmount: number;
  orderSource?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  status: string;
  createdAt: string;
}

const ALL_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Pending:    { color: '#b45309', bg: '#fef3c7', icon: '⏳' },
  Confirmed:  { color: '#1d4ed8', bg: '#dbeafe', icon: '✅' },
  Processing: { color: '#c2410c', bg: '#ffedd5', icon: '🔄' },
  Shipped:    { color: '#7c3aed', bg: '#ede9fe', icon: '🚚' },
  Delivered:  { color: '#15803d', bg: '#dcfce7', icon: '🎉' },
  Cancelled:  { color: '#dc2626', bg: '#fee2e2', icon: '✕'  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders]         = useState<AdminOrder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [updating, setUpdating]     = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  const customerName = (o: AdminOrder) => {
    if (o.userId && typeof o.userId === 'object') {
      return o.userId.name || o.userId.email || o.shippingAddress?.fullName || 'Guest';
    }
    return o.shippingAddress?.fullName || (typeof o.userId === 'string' ? o.userId : 'Guest');
  };

  const customerEmail = (o: AdminOrder) => {
    if (o.userId && typeof o.userId === 'object') {
      return o.userId.email || '';
    }
    return '';
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <h1 className="admin-page-title serif" style={{ margin: 0 }}>Orders</h1>
        <button
          onClick={fetchOrders}
          style={{
            background: 'var(--forest)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-md)',
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {['all', ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--r-full)',
              border: filter === s ? '2px solid var(--charcoal)' : '1px solid rgba(44,44,44,.15)',
              background: filter === s ? 'var(--charcoal)' : '#fff',
              color: filter === s ? '#fff' : 'var(--charcoal)',
              fontWeight: filter === s ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
          >
            {s === 'all' ? 'All Orders' : `${STATUS_CONFIG[s]?.icon} ${s}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--warm-gray)' }}>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--warm-gray)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={{ fontWeight: 600 }}>No orders found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? { color: 'var(--charcoal)', bg: 'rgba(44,44,44,.08)', icon: '•' };
            const isExpanded = expandedId === order._id;

            return (
              <div
                key={order._id}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  border: '1px solid rgba(44,44,44,.06)',
                }}
              >
                {/* Card header row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(140px,1fr) minmax(140px,1fr) minmax(120px,auto) minmax(200px,auto) 36px',
                    gap: 16,
                    padding: '16px 20px',
                    alignItems: 'center',
                    background: 'var(--oat-pale, #FAF6EF)',
                    borderBottom: isExpanded ? '1px solid rgba(44,44,44,.08)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                >
                  {/* Customer + date */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--charcoal)' }}>
                      {customerName(order)}
                      {order.orderSource === 'whatsapp' && (
                        <span style={{
                          marginLeft: 8,
                          fontSize: 10,
                          fontWeight: 700,
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '2px 7px',
                          borderRadius: 20,
                        }}>
                          WA
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>
                      {customerEmail(order)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--warm-gray)', marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {' · '}
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div style={{ fontSize: 12, color: 'var(--warm-gray)', lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 600, color: 'var(--charcoal)' }}>
                      {order.shippingAddress?.fullName || '—'}
                    </div>
                    {order.shippingAddress?.addressLine1 && <div>{order.shippingAddress.addressLine1}</div>}
                    <div>
                      {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode].filter(Boolean).join(', ') || 'No address provided'}
                    </div>
                    {order.shippingAddress?.phone && <div>📞 {order.shippingAddress.phone}</div>}
                  </div>

                  {/* Amount + items count */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--charcoal)' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--warm-gray)', marginTop: 2 }}>
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--warm-gray)', marginTop: 2 }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <label style={{ fontSize: 11, color: 'var(--warm-gray)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                      STATUS
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id={`status-${order._id}`}
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          appearance: 'none',
                          padding: '6px 28px 6px 12px',
                          borderRadius: 'var(--r-md)',
                          border: `1.5px solid ${cfg.color}`,
                          background: cfg.bg,
                          color: cfg.color,
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                          width: '100%',
                          minWidth: 130,
                        }}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_CONFIG[s]?.icon} {s}</option>
                        ))}
                      </select>
                      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: cfg.color }}>
                        ▼
                      </span>
                    </div>
                    {updating === order._id && (
                      <div style={{ fontSize: 10, color: 'var(--warm-gray)', marginTop: 3 }}>Saving…</div>
                    )}
                  </div>

                  {/* Expand toggle */}
                  <div style={{ fontSize: 18, color: 'var(--warm-gray)', textAlign: 'center', userSelect: 'none' }}>
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded: items & add-ons list */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warm-gray)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Items & Add-ons
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}>
                      {order.items.map((item, i) => (
                        <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 6,
                            background: 'linear-gradient(135deg, var(--blush-soft), var(--oat))',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {item.image
                              ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ fontSize: 18 }}>🧶</span>
                            }
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>
                              {item.tier} · Qty {item.quantity} · ₹{item.price.toLocaleString('en-IN')} each
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--warm-gray)', marginTop: 1 }}>
                              ID: {item.productId}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--charcoal)' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </li>
                      ))}

                      {order.addons && order.addons.length > 0 && order.addons.map((addon, ai) => (
                        <li key={`addon-${ai}`} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--terracotta-pale, #FDF0EC)', padding: '8px 12px', borderRadius: 6 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 6,
                            background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18,
                          }}>
                            🍫
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>
                              {addon.name} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--terracotta)' }}>(Add-on)</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--warm-gray)' }}>
                              Qty {addon.quantity} · ₹{addon.price.toLocaleString('en-IN')} each
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--terracotta)' }}>
                            ₹{(addon.price * addon.quantity).toLocaleString('en-IN')}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
