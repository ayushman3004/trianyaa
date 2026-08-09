// src/app/api/products/route.ts — public product listing
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const tier        = searchParams.get('tier');       // "Basic" | "Standard" | "Premium"
  const category    = searchParams.get('category');   // free text
  const newArrival  = searchParams.get('new');        // "true"
  const bestseller  = searchParams.get('bestseller'); // "true"

  const query: Record<string, unknown> = { inStock: true };

  if (tier)     query.tier     = { $regex: new RegExp(`^${tier}$`, 'i') };
  if (category) query.category = { $regex: new RegExp(category, 'i') };
  if (newArrival  === 'true') query.isNewArrival = true;
  if (bestseller  === 'true') query.isBestseller = true;

  const products = await Product
    .find(query)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({ products });
}
