// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'TRIANYAA — Handmade Crochet & Yarn Craft Brand',
  description:
    'Discover curated yarns, crochet kits, and handmade keychains by TRIANYAA. Shop Basic, Standard, and Premium craft kits — made with love, one stitch at a time.',
  keywords: 'crochet, yarn, handmade, keychain, crochet kit, india, craft',
  openGraph: {
    title: 'TRIANYAA — Handmade with Love, One Stitch at a Time',
    description: 'Curated yarns, crochet kits, and keychains to inspire your next handmade piece.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
