// src/app/admin/products/[id]/edit/page.tsx
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();

  const data = {
    _id:          (product._id as { toString(): string }).toString(),
    name:         product.name,
    description:  product.description,
    price:        product.price,
    originalPrice:product.originalPrice,
    tier:         product.tier,
    category:     product.category,
    colors:       product.colors,
    inStock:      product.inStock,
    isNewArrival: product.isNewArrival,
    isBestseller: product.isBestseller,
    includedItems:product.includedItems,
    image:        product.image,
  };

  return (
    <div>
      <h1 className="admin-page-title serif">Edit: {product.name}</h1>
      <ProductForm mode="edit" initialData={data} />
    </div>
  );
}
