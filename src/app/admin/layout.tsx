// src/app/admin/layout.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — TRIANYAA',
};

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="logo-brand serif">TRIANYAA</div>
        <div className="logo-tagline">Admin Panel</div>
      </div>
      <nav className="admin-nav">
        <Link href="/admin">📊 Dashboard</Link>
        <Link href="/admin/orders">📋 Orders</Link>
        <Link href="/admin/products">📦 Products</Link>
        <Link href="/admin/products/new">➕ Add Product</Link>
        <Link href="/admin/settings">⚙️ Settings</Link>
        <Link href="/" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '12px' }}>
          🏠 View Store
        </Link>
        <a href="/api/auth/logout">🚪 Logout</a>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
