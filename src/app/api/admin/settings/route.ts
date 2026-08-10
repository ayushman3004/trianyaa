// src/app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Setting } from '@/models/Setting';
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

// PUT /api/admin/settings — Update admin settings (e.g. upload logo)
export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key, imageBase64 } = body;

    if (!key || !imageBase64) {
      return NextResponse.json({ error: 'key and imageBase64 are required.' }, { status: 400 });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder:        process.env.CLOUDINARY_UPLOAD_FOLDER_SETTINGS || 'trianyaa/settings',
      resource_type: 'image',
    });
    
    const imageUrl = result.secure_url;

    await connectDB();
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value: imageUrl },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Setting updated successfully', value: setting.value });
  } catch (err) {
    console.error('Update setting error:', err);
    return NextResponse.json({ error: 'Failed to update setting.' }, { status: 500 });
  }
}

// DELETE /api/admin/settings?key=logoUrl — Delete custom logo setting to restore fallback
export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  try {
    await connectDB();
    await Setting.deleteOne({ key });
    return NextResponse.json({ message: 'Setting reset to default successfully' });
  } catch (err) {
    console.error('Reset setting error:', err);
    return NextResponse.json({ error: 'Failed to reset setting.' }, { status: 500 });
  }
}
