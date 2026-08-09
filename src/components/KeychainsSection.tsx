// src/components/KeychainsSection.tsx
'use client';
import { useState, useEffect } from 'react';
import ProductCard, { ProductCardData } from './ProductCard';

const MOCK_KEYCHAINS: ProductCardData[] = [
  { _id: 'k1', name: 'Daisy Flower Keychain',       price: 179, tier: 'Basic',    category: 'Keychain', image: '', colors: ['#F5D9CE','#F5EFE6','#DFF0E4'], inStock: true,  isNewArrival: true,  isBestseller: true,  rating: 4.8, reviewsCount: 22 },
  { _id: 'k2', name: 'Rainbow Strawberry Charm',    price: 149, tier: 'Basic',    category: 'Keychain', image: '', colors: ['#C4624A','#7B9E87','#C9963C'],  inStock: true,  isNewArrival: false, isBestseller: true,  rating: 4.9, reviewsCount: 38 },
  { _id: 'k3', name: 'Sunflower Heart Set (2pc)',    price: 299, tier: 'Standard', category: 'Keychain', image: '', colors: ['#C9963C','#E8BC68','#EFC5B5'],  inStock: true,  isNewArrival: true,  isBestseller: false, rating: 5,   reviewsCount: 14 },
  { _id: 'k4', name: 'Mini Bear Amigurumi Key Ring', price: 199, tier: 'Standard', category: 'Keychain', image: '', colors: ['#F5EFE6','#EFC5B5','#C4624A'],  inStock: true,  isNewArrival: false, isBestseller: false, rating: 4.6, reviewsCount: 7  },
  { _id: 'k5', name: 'Boho Tassel Keychain',         price: 99,  originalPrice: 149, tier: 'Basic',    category: 'Keychain', image: '', colors: ['#7B9E87','#C9963C','#C4624A'],  inStock: true,  isNewArrival: false, isBestseller: false, rating: 4.2, reviewsCount: 5  },
  { _id: 'k6', name: 'Mushroom Cottage Core Charm',  price: 249, tier: 'Standard', category: 'Keychain', image: '', colors: ['#EFC5B5','#C4624A','#F5EFE6'],  inStock: true,  isNewArrival: true,  isBestseller: false, rating: 4.7, reviewsCount: 18 },
];

type FilterKey = 'all' | 'new' | 'bestseller' | 'sale';

const FILTER_TAGS: { key: FilterKey; label: string; className: string }[] = [
  { key: 'all',        label: '✨ All',        className: 'kt-bestseller' },
  { key: 'new',        label: '🌿 New',        className: 'kt-new'        },
  { key: 'bestseller', label: '🔥 Bestsellers', className: 'kt-bestseller' },
  { key: 'sale',       label: '🏷️ Sale',        className: 'kt-sale'       },
];

const DOODLES = ['🌸', '🌼', '💕', '🌿', '⭐', '🎀', '✨', '🌺'];

interface KeychainsSectionProps {
  initialProducts?: ProductCardData[];
}

function clientFilter(products: ProductCardData[], key: FilterKey): ProductCardData[] {
  switch (key) {
    case 'new':        return products.filter((p) => p.isNewArrival);
    case 'bestseller': return products.filter((p) => p.isBestseller);
    case 'sale':       return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    default:           return products;
  }
}

export default function KeychainsSection({ initialProducts }: KeychainsSectionProps) {
  const base = initialProducts && initialProducts.length > 0 ? initialProducts : MOCK_KEYCHAINS;

  const [activeTag,    setActiveTag]    = useState<FilterKey>('all');
  const [allProducts,  setAllProducts]  = useState<ProductCardData[]>(base);
  const [loading,      setLoading]      = useState(false);

  // Re-fetch from API when filter changes (uses server-side filtering where possible)
  useEffect(() => {
    if (activeTag === 'all') {
      setAllProducts(base);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ category: 'keychain' });
    if (activeTag === 'new')        params.set('new', 'true');
    if (activeTag === 'bestseller') params.set('bestseller', 'true');

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          const fetched: ProductCardData[] = (data.products ?? []).map((p: Record<string, unknown>) => ({
            _id:          (p._id as { toString(): string }).toString(),
            name:         p.name as string,
            price:        p.price as number,
            originalPrice:p.originalPrice as number | undefined,
            tier:         p.tier as string,
            category:     p.category as string,
            image:        p.image as string,
            colors:       (p.colors as string[]) || [],
            inStock:      p.inStock as boolean,
            isNewArrival: p.isNewArrival as boolean,
            isBestseller: p.isBestseller as boolean,
            rating:       (p.rating as number) || 0,
            reviewsCount: (p.reviewsCount as number) || 0,
          }));

          // For "sale" filter, API doesn't have a param — do it client-side
          const result = activeTag === 'sale'
            ? clientFilter(fetched.length > 0 ? fetched : base, 'sale')
            : fetched.length > 0 ? fetched : clientFilter(base, activeTag);

          setAllProducts(result);
        }
      })
      .catch(() => {
        if (!cancelled) setAllProducts(clientFilter(base, activeTag));
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTag]);

  const displayed = activeTag === 'all' ? allProducts : allProducts;

  return (
    <section className="keychain-section">
      {DOODLES.map((d, i) => (
        <div key={i} className="keychain-doodle" style={{ top: `${10 + (i * 12) % 80}%`, left: `${5 + (i * 13) % 90}%`, animationDelay: `${i * 0.5}s`, fontSize: `${20 + (i % 3) * 8}px` }}>
          {d}
        </div>
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <div className="section-eyebrow">Tiny Things, Big Smiles</div>
          <h2 className="section-title serif">Crochet Keychains</h2>
          <p className="section-sub">Hand-crocheted charms that make the perfect gift — or a little treat for yourself 🎀</p>
        </div>

        <div className="keychain-tags">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.key}
              className={`keychain-tag ${tag.className}${activeTag === tag.key ? ' active' : ''}`}
              onClick={() => setActiveTag(tag.key)}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, fontSize: 32 }}>
            <span style={{ animation: 'pulse 1s ease-in-out infinite', display: 'inline-block' }}>🧶</span>
          </div>
        ) : (
          <div className="products-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
            {displayed.length > 0 ? (
              displayed.map((p) => <ProductCard key={p._id} product={p} />)
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--warm-gray)' }}>
                No keychains found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
