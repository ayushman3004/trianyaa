// src/models/Product.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  productId: string;          // e.g. "p-58da4a8d"
  name: string;
  description: string;
  price: number;
  originalPrice?: number;     // for showing strikethrough / discount %
  category: string;           // "Basic" | "Standard" | "Premium" | etc.
  tier: string;               // mirrors category — "Basic" | "Standard" | "Premium"
  image: string;              // single Cloudinary URL
  colors: string[];           // hex color codes e.g. ["#F7D6D0", "#8A9A86"]
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  includedItems: string[];    // list of items included in the kit/bundle
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    productId:     { type: String, unique: true, sparse: true },
    name:          { type: String, required: true, trim: true },
    description:   { type: String, default: '' },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    category:      { type: String, required: true, index: true },
    tier:          { type: String, required: true, index: true },
    image:         { type: String, default: '' },
    colors:        { type: [String], default: [] },
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount:  { type: Number, default: 0, min: 0 },
    inStock:       { type: Boolean, default: true, index: true },
    isNewArrival:  { type: Boolean, default: false, index: true },
    isBestseller:  { type: Boolean, default: false, index: true },
    includedItems: { type: [String], default: [] },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

export const Product: Model<IProduct> =
  mongoose.model<IProduct>('Product', ProductSchema);

