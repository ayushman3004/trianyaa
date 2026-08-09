// src/components/ProductForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  initialData?: {
    _id?: string;
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    tier?: string;
    category?: string;
    colors?: string[];
    inStock?: boolean;
    isNewArrival?: boolean;
    isBestseller?: boolean;
    includedItems?: string[];
    image?: string;
  };
  mode: 'create' | 'edit';
}

export default function ProductForm({ initialData = {}, mode }: ProductFormProps) {
  const router = useRouter();
  const [name,          setName]          = useState(initialData.name || '');
  const [description,   setDescription]   = useState(initialData.description || '');
  const [price,         setPrice]         = useState(initialData.price?.toString() || '');
  const [originalPrice, setOriginalPrice] = useState(initialData.originalPrice?.toString() || '');
  const [tier,          setTier]          = useState(initialData.tier || 'Basic');
  const [category,      setCategory]      = useState(initialData.category || 'Yarn');
  const [colors,        setColors]        = useState((initialData.colors || []).join(', '));
  const [includedItems, setIncludedItems] = useState((initialData.includedItems || []).join(', '));
  const [inStock,       setInStock]       = useState(initialData.inStock !== false);
  const [isNewArrival,  setIsNewArrival]  = useState(initialData.isNewArrival || false);
  const [isBestseller,  setIsBestseller]  = useState(initialData.isBestseller || false);
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [preview,       setPreview]       = useState<string>(initialData.image || '');
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      // Convert image to base64 if a new one was selected
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const body = {
        name, description,
        price:         parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        tier, category,
        colors:        colors.split(',').map((s) => s.trim()).filter(Boolean),
        includedItems: includedItems.split(',').map((s) => s.trim()).filter(Boolean),
        inStock, isNewArrival, isBestseller,
        imageBase64,
      };

      const url    = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${initialData._id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save product.'); return; }

      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-card">
      {error && <div className="form-error" style={{ marginBottom: 24 }}>{error}</div>}

      <div className="admin-form-grid">
        {/* Name */}
        <div className="full-span">
          <label className="form-label" htmlFor="pf-name">Product Name *</label>
          <input id="pf-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Blue Love Keychain" />
        </div>

        {/* Description */}
        <div className="full-span">
          <label className="form-label" htmlFor="pf-desc">Description</label>
          <textarea id="pf-desc" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product…" />
        </div>

        {/* Price */}
        <div>
          <label className="form-label" htmlFor="pf-price">Price (₹) *</label>
          <input id="pf-price" type="number" min="0" step="1" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="599" />
        </div>

        {/* Original Price */}
        <div>
          <label className="form-label" htmlFor="pf-orig-price">Original Price (₹) — for discount</label>
          <input id="pf-orig-price" type="number" min="0" step="1" className="form-input" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="699 (leave blank if no discount)" />
        </div>

        {/* Tier */}
        <div>
          <label className="form-label" htmlFor="pf-tier">Tier *</label>
          <select id="pf-tier" className="form-select" value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="form-label" htmlFor="pf-category">Category *</label>
          <select id="pf-category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Yarn">Yarn</option>
            <option value="Kit">Crochet Kit</option>
            <option value="Keychain">Keychain</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>

        {/* Colors */}
        <div>
          <label className="form-label" htmlFor="pf-colors">Colors (hex, comma-separated)</label>
          <input id="pf-colors" className="form-input" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="#F7D6D0, #8A9A86" />
        </div>

        {/* Included Items */}
        <div>
          <label className="form-label" htmlFor="pf-items">Included Items (comma-separated)</label>
          <input id="pf-items" className="form-input" value={includedItems} onChange={(e) => setIncludedItems(e.target.value)} placeholder="Yarn skein, Crochet hook, Pattern card" />
        </div>

        {/* Flags */}
        <div className="full-span" style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <label className="form-checkbox-label">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} style={{ accentColor: 'var(--sage)' }} />
            In Stock
          </label>
          <label className="form-checkbox-label">
            <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} style={{ accentColor: 'var(--sage)' }} />
            🌿 New Arrival
          </label>
          <label className="form-checkbox-label">
            <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} style={{ accentColor: 'var(--terracotta)' }} />
            🔥 Bestseller
          </label>
        </div>

        {/* Image Upload */}
        <div className="full-span">
          <div className="form-label">Product Image</div>
          <label className="image-upload-area" htmlFor="pf-image">
            <input id="pf-image" type="file" accept="image/*" onChange={handleFileChange} />
            <div className="upload-icon">🖼️</div>
            <div className="upload-text">Click to upload product image (JPG, PNG, WEBP)</div>
          </label>
          {preview && (
            <div style={{ marginTop: 12 }}>
              <img src={preview} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--oat)' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '14px 40px' }}>
          {loading ? 'Saving…' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ padding: '14px 28px', borderRadius: 'var(--r-full)', background: 'var(--oat)', color: 'var(--charcoal-soft)', fontWeight: 600, fontSize: 14, border: 'none' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
