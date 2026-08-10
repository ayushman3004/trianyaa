// src/app/page.tsx
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryStrip from '@/components/CategoryStrip';
import FeaturedProducts from '@/components/FeaturedProducts';
import TierCards from '@/components/TierCards';
import KeychainsSection from '@/components/KeychainsSection';
import PaletteStrip from '@/components/PaletteStrip';
import Testimonials from '@/components/Testimonials';
import Tutorials from '@/components/Tutorials';
import NewsletterFooter from '@/components/NewsletterFooter';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import type { ProductCardData } from '@/components/ProductCard';

// Map a raw Mongoose lean doc → ProductCardData
function mapProduct(p: Record<string, unknown>): ProductCardData {
  return {
    _id:           (p._id as { toString(): string }).toString(),
    name:          p.name as string,
    price:         p.price as number,
    originalPrice: p.originalPrice as number | undefined,
    tier:          p.tier as string,
    category:      p.category as string,
    image:         p.image as string,
    colors:        (p.colors as string[]) || [],
    inStock:       p.inStock as boolean,
    isNewArrival:  p.isNewArrival as boolean,
    isBestseller:  p.isBestseller as boolean,
    rating:        (p.rating as number) || 0,
    reviewsCount:  (p.reviewsCount as number) || 0,
    description:   (p.description as string) || '',
    includedItems: (p.includedItems as string[]) || [],
  };
}

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    await connectDB();

    // Prioritise new arrivals + bestsellers, then any in-stock product
    const docs = await Product
      .find({ inStock: true })
      .sort({ isNewArrival: -1, isBestseller: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return docs.map((p) => mapProduct(p as unknown as Record<string, unknown>));
  } catch (err) {
    console.error('getFeaturedProducts error:', err);
    return [];
  }
}

async function getKeychainProducts(): Promise<ProductCardData[]> {
  try {
    await connectDB();

    // Keychains: category name contains "keychain" (case-insensitive)
    const docs = await Product
      .find({ inStock: true, category: { $regex: /keychain/i } })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return docs.map((p) => mapProduct(p as unknown as Record<string, unknown>));
  } catch (err) {
    console.error('getKeychainProducts error:', err);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, keychainProducts] = await Promise.all([
    getFeaturedProducts(),
    getKeychainProducts(),
  ]);

  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <CategoryStrip />
      <FeaturedProducts products={featuredProducts} />
      <TierCards />
      <KeychainsSection initialProducts={keychainProducts} />
      <PaletteStrip />
      <Testimonials />
      <Tutorials />
      <NewsletterFooter />
    </main>
  );
}
