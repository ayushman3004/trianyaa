// src/app/admin/page.tsx
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';

async function getStats() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalProducts, basic, standard, premium, inStock,
      totalOrders, pendingOrders, todayOrders, waOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ tier: { $regex: /^basic$/i } }),
      Product.countDocuments({ tier: { $regex: /^standard$/i } }),
      Product.countDocuments({ tier: { $regex: /^premium$/i } }),
      Product.countDocuments({ inStock: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ orderSource: 'whatsapp' }),
    ]);

    return { totalProducts, basic, standard, premium, inStock, totalOrders, pendingOrders, todayOrders, waOrders };
  } catch {
    return { totalProducts: 0, basic: 0, standard: 0, premium: 0, inStock: 0, totalOrders: 0, pendingOrders: 0, todayOrders: 0, waOrders: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const productCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'var(--charcoal)' },
    { label: 'Basic Tier',     value: stats.basic,         icon: '🧶', color: 'var(--sage)' },
    { label: 'Standard Tier',  value: stats.standard,      icon: '🎁', color: 'var(--terracotta)' },
    { label: 'Premium Tier',   value: stats.premium,       icon: '👑', color: 'var(--gold)' },
    { label: 'In Stock',       value: stats.inStock,       icon: '✅', color: 'var(--forest)' },
    { label: 'Out of Stock',   value: stats.totalProducts - stats.inStock, icon: '⚠️', color: '#C4624A' },
  ];

  const orderCards = [
    { label: 'Total Orders',    value: stats.totalOrders,   icon: '🛍️', color: 'var(--charcoal)' },
    { label: 'Pending (WA)',    value: stats.pendingOrders, icon: '⏳', color: '#b45309' },
    { label: "Today's Orders",  value: stats.todayOrders,   icon: '📅', color: 'var(--forest)' },
    { label: 'Via WhatsApp',    value: stats.waOrders,      icon: '💬', color: '#15803d' },
  ];

  return (
    <div>
      <h1 className="admin-page-title serif">Dashboard</h1>

      {/* Order stats */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--warm-gray)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Orders
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {orderCards.map((card) => (
          <div
            key={card.label}
            style={{ background: '#fff', borderRadius: 'var(--r-lg)', padding: '20px 16px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: card.color, fontFamily: 'var(--font-serif)', marginBottom: 4 }}>
              {card.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)', fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Product stats */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--warm-gray)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Products
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
        {productCards.map((card) => (
          <div
            key={card.label}
            style={{ background: '#fff', borderRadius: 'var(--r-lg)', padding: '20px 16px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: card.color, fontFamily: 'var(--font-serif)', marginBottom: 4 }}>
              {card.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)', fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/admin/orders" className="btn-add-product" style={{ background: '#1d4ed8' }}>
          📋 Manage Orders
        </Link>
        <Link href="/admin/products/new" className="btn-add-product">
          ➕ Add New Product
        </Link>
        <Link href="/admin/products" className="btn-add-product" style={{ background: 'var(--forest)' }}>
          📦 Manage Products
        </Link>
      </div>
    </div>
  );
}
