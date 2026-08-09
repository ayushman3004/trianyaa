// src/app/shop/page.tsx
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import NewsletterFooter from '@/components/NewsletterFooter';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import Link from 'next/link';

interface ShopSearchParams {
  tier?: string;
  category?: string;
  sort?: string;
}

// Convert DB product doc to card data format
function mapProduct(p: any): ProductCardData {
  return {
    _id: (p._id as { toString(): string }).toString(),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    tier: p.tier,
    category: p.category,
    image: p.image,
    colors: p.colors || [],
    inStock: p.inStock,
    isNewArrival: p.isNewArrival,
    isBestseller: p.isBestseller,
    rating: p.rating || 0,
    reviewsCount: p.reviewsCount || 0,
  };
}

async function getProducts(filters: ShopSearchParams) {
  await connectDB();
  const query: Record<string, any> = {};

  if (filters.tier) {
    query.tier = { $regex: new RegExp(`^${filters.tier}$`, 'i') };
  }
  if (filters.category) {
    query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
  }

  let sortOption: Record<string, number> = { createdAt: -1 };
  if (filters.sort === 'price-asc') {
    sortOption = { price: 1 };
  } else if (filters.sort === 'price-desc') {
    sortOption = { price: -1 };
  } else if (filters.sort === 'rating') {
    sortOption = { rating: -1 };
  }

  const docs = await Product.find(query).sort(sortOption as any).lean();
  return docs.map(mapProduct);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  // Active filters for highlights
  const activeTier = params.tier || '';
  const activeCategory = params.category || '';
  const activeSort = params.sort || 'newest';

  const categories = ['Yarn', 'Kit', 'Keychain', 'Accessory'];
  const tiers = ['Basic', 'Standard', 'Premium'];

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="shop-hero">
        <div className="shop-hero-inner">
          <div className="section-eyebrow">Explore Our Creations</div>
          <h1 className="section-title serif">The TRIANYAA Shop</h1>
          <p className="section-sub">
            Browse our curated yarns, handmade kits, and adorable crochet accessories. Each piece is crafted to bring joy.
          </p>
        </div>
      </section>

      <section className="shop-container">
        {/* Filters sidebar */}
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h3 className="filter-title serif">Tiers</h3>
            <div className="filter-links">
              <Link
                href="/shop"
                className={`filter-link${!activeTier ? ' active' : ''}`}
              >
                All Tiers
              </Link>
              {tiers.map((t) => (
                <Link
                  key={t}
                  href={`/shop?${new URLSearchParams({
                    ...params,
                    tier: t.toLowerCase(),
                  })}`}
                  className={`filter-link${
                    activeTier === t.toLowerCase() ? ' active' : ''
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title serif">Categories</h3>
            <div className="filter-links">
              <Link
                href="/shop"
                className={`filter-link${!activeCategory ? ' active' : ''}`}
              >
                All Categories
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/shop?${new URLSearchParams({
                    ...params,
                    category: c.toLowerCase(),
                  })}`}
                  className={`filter-link${
                    activeCategory === c.toLowerCase() ? ' active' : ''
                  }`}
                >
                  {c === 'Kit' ? 'Crochet Kit' : c}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid & Toolbar */}
        <div className="shop-content">
          <div className="shop-toolbar">
            <div className="product-count">
              Found <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
            </div>

            <div className="shop-sort">
              <span style={{ fontSize: 13, color: 'var(--warm-gray)', fontWeight: 500 }}>Sort by:</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  href={`/shop?${new URLSearchParams({ ...params, sort: 'newest' })}`}
                  className={`sort-btn${activeSort === 'newest' ? ' active' : ''}`}
                >
                  Newest
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...params, sort: 'price-asc' })}`}
                  className={`sort-btn${activeSort === 'price-asc' ? ' active' : ''}`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...params, sort: 'price-desc' })}`}
                  className={`sort-btn${activeSort === 'price-desc' ? ' active' : ''}`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="shop-empty">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧺</div>
              <h3 className="serif" style={{ fontSize: 20, marginBottom: 8 }}>No products found</h3>
              <p style={{ color: 'var(--warm-gray)', marginBottom: 24 }}>
                We couldn't find any products matching your active filters.
              </p>
              <Link href="/shop" className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
