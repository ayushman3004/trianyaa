// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import { CookieConsentProvider } from '@/components/cookie-consent/CookieProvider';
import CookieConsentBanner from '@/components/cookie-consent/CookieConsent';
import CookiePreferences from '@/components/cookie-consent/CookiePreferences';

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
        <CookieConsentProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <CartDrawer />
              <WishlistDrawer />
            </WishlistProvider>
          </CartProvider>
          <CookieConsentBanner />
          <CookiePreferences />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
