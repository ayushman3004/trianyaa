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

// GET /api/orders — fetch order history for logged-in user
export async function GET(req: NextRequest) {
  const uid = getUserIdFromSession(req);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ userId: uid }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}

// POST /api/orders — place order (direct or whatsapp)
export async function POST(req: NextRequest) {
  const uid = getUserIdFromSession(req);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, totalAmount, shippingAddress, orderSource } = body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.create({
      userId: uid,
      items,
      totalAmount,
      shippingAddress,
      orderSource: orderSource === 'whatsapp' ? 'whatsapp' : 'direct',
      // WhatsApp orders start as Pending; direct orders start as Processing
      status: orderSource === 'whatsapp' ? 'Pending' : 'Processing',
    });

    return NextResponse.json({ message: 'Order placed successfully', order }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack   = err instanceof Error ? err.stack   : '';
    console.error('[POST /api/orders] Error:', message);
    console.error(stack);
    return NextResponse.json({ error: 'Failed to place order.', detail: message }, { status: 500 });
  }
}
