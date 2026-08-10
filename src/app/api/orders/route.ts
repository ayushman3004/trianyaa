// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

function getUserIdFromSession(req: NextRequest): string | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  return payload ? payload.uid : null;
}

// GET /api/orders — fetch order history
export async function GET(req: NextRequest) {
  const uid = getUserIdFromSession(req);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ userId: uid }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}

// POST /api/orders — place order
export async function POST(req: NextRequest) {
  const uid = getUserIdFromSession(req);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, totalAmount, shippingAddress } = body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.create({
      userId: uid,
      items,
      totalAmount,
      shippingAddress,
      status: 'Processing',
    });

    return NextResponse.json({ message: 'Order placed successfully', order }, { status: 201 });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to place order.' }, { status: 500 });
  }
}
