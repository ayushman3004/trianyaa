// src/app/api/admin/products/[id]/route.ts
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

type Params = { params: Promise<{ id: string }> };

// PUT /api/admin/products/[id] — edit product
export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const {
      name, description, price, originalPrice,
      tier, category, colors,
      inStock, isNewArrival, isBestseller,
      includedItems, imageBase64,
    } = body;

    await connectDB();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

    // Replace image if a new one was uploaded
    if (imageBase64) {
      const result = await cloudinary.uploader.upload(imageBase64, {
        folder:        process.env.CLOUDINARY_UPLOAD_FOLDER || 'trianyaa/products',
        resource_type: 'image',
      });
      product.image = result.secure_url;
    }

    if (name          !== undefined) product.name          = name;
    if (description   !== undefined) product.description   = description;
    if (price         !== undefined) product.price         = Number(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? Number(originalPrice) : undefined;
    if (tier          !== undefined) product.tier          = tier;
    if (category      !== undefined) product.category      = category;
    if (colors        !== undefined) product.colors        = colors;
    if (inStock       !== undefined) product.inStock       = inStock;
    if (isNewArrival  !== undefined) product.isNewArrival  = isNewArrival;
    if (isBestseller  !== undefined) product.isBestseller  = isBestseller;
    if (includedItems !== undefined) product.includedItems = includedItems;

    await product.save();
    return NextResponse.json({ product });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
