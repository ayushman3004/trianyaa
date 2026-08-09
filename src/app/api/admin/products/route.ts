// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

// GET /api/admin/products
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

// POST /api/admin/products — create product
export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, description, price, originalPrice,
      tier, category, colors,
      inStock, isNewArrival, isBestseller,
      includedItems, imageBase64,
    } = body;

    if (!name || !price || !tier || !category) {
      return NextResponse.json({ error: 'name, price, tier, category are required.' }, { status: 400 });
    }

    // Upload single image to Cloudinary
    let imageUrl = '';
    if (imageBase64) {
      const result = await cloudinary.uploader.upload(imageBase64, {
        folder:        process.env.CLOUDINARY_UPLOAD_FOLDER || 'trianyaa/products',
        resource_type: 'image',
      });
      imageUrl = result.secure_url;
    }

    // Generate unique productId
    const productId = `p-${Math.random().toString(36).slice(2, 10)}`;

    const product = await Product.create({
      productId,
      name,
      description:   description || '',
      price:         Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      tier,
      category,
      image:         imageUrl,
      colors:        colors || [],
      inStock:       inStock !== undefined ? inStock : true,
      isNewArrival:  isNewArrival || false,
      isBestseller:  isBestseller || false,
      includedItems: includedItems || [],
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}
