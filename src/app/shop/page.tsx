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
  search?: string;
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
    description: p.description || '',
    includedItems: p.includedItems || [],
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
  if (filters.search) {
    query.$or = [
      { name: { $regex: new RegExp(filters.search, 'i') } },
      { description: { $regex: new RegExp(filters.search, 'i') } },
    ];
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

  const categories = ['Keychain', 'Flowers', 'Bouquet'];
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
          <div className="filter-group" style={{ marginBottom: 28 }}>
            <h3 className="filter-title serif">Search</h3>
            <form action="/shop" method="GET" style={{ position: 'relative' }}>
              {params.category && <input type="hidden" name="category" value={params.category} />}
              {params.tier && <input type="hidden" name="tier" value={params.tier} />}
              {params.sort && <input type="hidden" name="sort" value={params.sort} />}
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Type to search..."
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 14px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgba(44,44,44,.12)',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  background: '#fff',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--warm-gray)', cursor: 'pointer',
                  fontSize: 14
                }}
                aria-label="Search"
              >
                🔍
              </button>
            </form>
            {params.search && (
              <Link href={`/shop?${new URLSearchParams(
                Object.fromEntries(
                  Object.entries(params).filter(([k, v]) => k !== 'search' && v)
                )
              )}`} style={{ fontSize: 12, color: 'var(--terracotta)', marginTop: 8, display: 'inline-block', fontWeight: 500 }}>
                Clear search
              </Link>
            )}
          </div>

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
                  {c}
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
