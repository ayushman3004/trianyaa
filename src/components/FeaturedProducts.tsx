// src/components/FeaturedProducts.tsx
import ProductCard, { ProductCardData } from './ProductCard';

// Shown only when MongoDB returns 0 products
const MOCK_PRODUCTS: ProductCardData[] = [
  {
    _id: 'm1',
    name: 'Blush Rose Bouquet',
    price: 349,
    originalPrice: 449,
    tier: 'Basic',
    category: 'Bouquet',
    image: '',
    colors: ['#EFC5B5','#F5D9CE','#FAF6EF'],
    inStock: true,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.5,
    reviewsCount: 12,
    description: 'A beautiful blushing rose bouquet handcrafted with soft cotton yarn, perfect for gifting.',
    includedItems: ['5 Hand-crocheted roses', 'Delicate wrapping paper', 'A gift card'],
  },
  {
    _id: 'm2',
    name: 'Cozy Daisy Flowers',
    price: 799,
    originalPrice: undefined,
    tier: 'Standard',
    category: 'Flowers',
    image: '',
    colors: ['#7B9E87','#A8C5B0','#DFF0E4'],
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 5,
    reviewsCount: 28,
    description: 'A delightful pot of cozy daisy flowers to brighten any corner of your room.',
    includedItems: ['3 Daisy flowers in a pot', 'Gift wrap', 'Care instructions card'],
  },
  {
    _id: 'm3',
    name: 'Sunflower Crochet Keychain',
    price: 199,
    originalPrice: undefined,
    tier: 'Basic',
    category: 'Keychain',
    image: '',
    colors: ['#C9963C','#E8BC68','#F5EFE6'],
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 47,
    description: 'Brighten your keys or bags with this sunny, adorable handcrafted sunflower keychain.',
    includedItems: ['Sunflower keychain charm', 'Metal keyring clasp'],
  },
  {
    _id: 'm4',
    name: 'Premium Tulip Bouquet',
    price: 1199,
    originalPrice: 1499,
    tier: 'Premium',
    category: 'Bouquet',
    image: '',
    colors: ['#C4624A','#D4785F','#F0E0D8'],
    inStock: true,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.7,
    reviewsCount: 9,
    description: 'An elegant premium tulip bouquet, meticulously crocheted for weddings or special occasions.',
    includedItems: ['7 Crochet tulips', 'Premium fabric wrap', 'Greeting card'],
  },
  {
    _id: 'm5',
    name: 'Sage Green Rose Bouquet',
    price: 549,
    originalPrice: undefined,
    tier: 'Standard',
    category: 'Bouquet',
    image: '',
    colors: ['#7B9E87','#2D5016','#F5EFE6'],
    inStock: false,
    isNewArrival: false,
    isBestseller: false,
    rating: 0,
    reviewsCount: 0,
    description: 'A soothing sage green rose bouquet, ideal for cottage core styling and table decor.',
    includedItems: ['4 Green and white roses', 'Sage ribbon wrap'],
  },
  {
    _id: 'm6',
    name: 'Rainbow Heart Keychain Set',
    price: 299,
    originalPrice: 349,
    tier: 'Basic',
    category: 'Keychain',
    image: '',
    colors: ['#EFC5B5','#C9963C','#7B9E87','#C4624A'],
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 63,
    description: 'A pair of matching rainbow heart keychains to share with your favorite person.',
    includedItems: ['2 Heart keychains', '2 Metal clasps'],
  },
];

interface FeaturedProductsProps {
  products?: ProductCardData[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;

  return (
    <section className="featured-products">
      <div className="section-header">
        <div className="section-eyebrow">Handpicked for You</div>
        <h2 className="section-title serif">Featured Products</h2>
        <p className="section-sub">
          From vibrant skeins to adorable keychains — every piece tells a story.
        </p>
      </div>
      <div className="products-grid">
        {displayProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
