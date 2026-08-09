// src/app/admin/products/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  tier: string;
  category: string;
  inStock: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  image: string;
  colors: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setProducts(data.products);
    } catch {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  async function toggleStock(id: string, current: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !current }),
    });
    fetchProducts();
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  }

  const tierColor: Record<string, string> = {
    basic: 'var(--sage)', standard: 'var(--terracotta)', premium: 'var(--gold)',
  };

  const discount = (p: Product) =>
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="admin-page-title serif" style={{ margin: 0 }}>Products</h1>
        <Link href="/admin/products/new" className="btn-add-product" style={{ margin: 0 }}>
          ➕ Add Product
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--warm-gray)', fontSize: 16 }}>
          Loading products…
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--warm-gray)', fontSize: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          No products yet.{' '}
          <Link href="/admin/products/new" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Tier</th>
                <th>Category</th>
                <th>Price</th>
                <th>Flags</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const pct = discount(p);
                return (
                  <tr key={p._id}>
                    <td>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--oat)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🧶</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{p.name}</div>
                      {p.productId && <div style={{ fontSize: 11, color: 'var(--warm-gray)', marginTop: 2 }}>{p.productId}</div>}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(0,0,0,.06)', color: tierColor[p.tier.toLowerCase()] || 'var(--charcoal)' }}>
                        {p.tier}
                      </span>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</div>
                      {pct && <div style={{ fontSize: 11, color: 'var(--sage)', fontWeight: 600 }}>−{pct}% off</div>}
                    </td>
                    <td style={{ fontSize: 18, letterSpacing: 4 }}>
                      {p.isNewArrival && <span title="New Arrival">🌿</span>}
                      {p.isBestseller && <span title="Bestseller">🔥</span>}
                    </td>
                    <td>
                      <span className={`stock-badge ${p.inStock ? 'in-stock' : 'out-stock'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Link href={`/admin/products/${p._id}/edit`} className="btn-admin-action btn-edit">Edit</Link>
                        <button className="btn-admin-action btn-stock" onClick={() => toggleStock(p._id, p.inStock)}>
                          {p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                        </button>
                        <button className="btn-admin-action btn-delete" onClick={() => deleteProduct(p._id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
