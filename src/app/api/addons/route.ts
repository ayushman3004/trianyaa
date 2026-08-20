// src/app/api/addons/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Addon } from '@/models/Addon';

// GET /api/addons — fetch active checkout add-ons
export async function GET() {
  try {
    await connectDB();

    const defaultItems = [
      {
        name: 'Premium Chocolate',
        description: 'Add a delicious gourmet chocolate to your order',
        price: 49,
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80',
        category: 'Chocolate',
        isActive: true,
      },
      {
        name: 'Luxury Gift Wrap',
        description: 'Handcrafted satin ribbon & aesthetic kraft wrapping',
        price: 39,
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80',
        category: 'Gift Wrap',
        isActive: true,
      },
      {
        name: 'Handwritten Letter',
        description: 'Personalized handwritten note on premium cardstock',
        price: 29,
        image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=400&q=80',
        category: 'Letter',
        isActive: true,
      },
    ];

    for (const item of defaultItems) {
      const existing = await Addon.findOne({ name: item.name });
      if (!existing) {
        await Addon.create(item);
      }
    }

    const addons = await Addon.find({ isActive: true }).lean();

    return NextResponse.json({ addons });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/addons] Error:', message);
    return NextResponse.json({ error: 'Failed to fetch add-ons', detail: message }, { status: 500 });
  }
}
