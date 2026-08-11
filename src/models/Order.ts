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

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type OrderSource = 'whatsapp' | 'direct';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
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

if (mongoose.models.Order) {
  // If the cached model's schema has the old enum, overwrite it
  const cachedEnums: string[] = (mongoose.models.Order.schema.path('status') as { options?: { enum?: string[] } })?.options?.enum ?? [];
  if (!cachedEnums.includes('Pending')) {
    // Old schema cached — delete and re-register
    const models = mongoose.models as Record<string, unknown>;
    delete models['Order'];
    const connModels = mongoose.connection.models as Record<string, unknown>;
    delete connModels['Order'];
    Order = mongoose.model<IOrder>('Order', OrderSchema);
  } else {
    Order = mongoose.models.Order as Model<IOrder>;
  }
} else {
  Order = mongoose.model<IOrder>('Order', OrderSchema);
}

export { Order };
