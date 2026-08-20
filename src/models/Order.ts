// src/models/Order.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tier: string;
}

export interface IOrderAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type OrderSource = 'whatsapp' | 'direct';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  addons?: IOrderAddon[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  status: OrderStatus;
  orderSource: OrderSource;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, default: '' },
        tier: { type: String, required: true },
      },
    ],
    addons: [
      {
        addonId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    orderSource: {
      type: String,
      enum: ['whatsapp', 'direct'],
      default: 'direct',
    },
  },
  { timestamps: true }
);

// Safely get or create the model — handles Next.js hot-reload model caching
let Order: Model<IOrder>;

if (mongoose.models && mongoose.models.Order) {
  delete (mongoose.models as any).Order;
}
Order = mongoose.model<IOrder>('Order', OrderSchema);

export { Order };

