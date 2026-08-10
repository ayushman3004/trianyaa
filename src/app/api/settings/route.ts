// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Setting } from '@/models/Setting';

// GET /api/settings?key=XYZ
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  try {
    await connectDB();
    const setting = await Setting.findOne({ key }).lean();
    return NextResponse.json({ value: setting ? setting.value : null });
  } catch (err) {
    console.error('Fetch setting error:', err);
    return NextResponse.json({ error: 'Failed to fetch setting.' }, { status: 500 });
  }
}
