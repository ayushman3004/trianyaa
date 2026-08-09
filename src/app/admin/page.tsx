// src/app/admin/page.tsx
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

async function getStats() {
  try {
    await connectDB();
    const [total, basic, standard, premium, inStock] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ tier: { $regex: /^basic$/i } }),
      Product.countDocuments({ tier: { $regex: /^standard$/i } }),
      Product.countDocuments({ tier: { $regex: /^premium$/i } }),
      Product.countDocuments({ inStock: true }),
    ]);
    return { total, basic, standard, premium, inStock };
  } catch {
    return { total: 0, basic: 0, standard: 0, premium: 0, inStock: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: '📦', color: 'var(--charcoal)' },
    { label: 'Basic Tier',     value: stats.basic,    icon: '🧶', color: 'var(--sage)' },
    { label: 'Standard Tier',  value: stats.standard, icon: '🎁', color: 'var(--terracotta)' },
    { label: 'Premium Tier',   value: stats.premium,  icon: '👑', color: 'var(--gold)' },
    { label: 'In Stock',       value: stats.inStock,  icon: '✅', color: 'var(--forest)' },
    { label: 'Out of Stock',   value: stats.total - stats.inStock, icon: '⚠️', color: '#C4624A' },
  ];

  return (
    <div>
      <h1 className="admin-page-title serif">Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 20,
        marginBottom: 40,
      }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: 'var(--r-lg)',
              padding: '24px 20px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: card.color, fontFamily: 'var(--font-serif)', marginBottom: 4 }}>
              {card.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--warm-gray)', fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
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
