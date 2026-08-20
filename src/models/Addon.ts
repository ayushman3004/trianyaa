// src/models/Addon.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAddon extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddonSchema = new Schema<IAddon>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, default: 'General' },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Addon) {
  delete (mongoose.models as any).Addon;
}

export const Addon: Model<IAddon> =
  mongoose.models.Addon || mongoose.model<IAddon>('Addon', AddonSchema);
