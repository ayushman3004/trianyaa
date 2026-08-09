// src/app/admin/products/new/page.tsx
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="admin-page-title serif">Add New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
