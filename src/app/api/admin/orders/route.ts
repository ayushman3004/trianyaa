// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

function getAdminFromSession(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = verifySessionToken(token);
  return payload?.role === 'admin';
}

// GET /api/admin/orders — fetch all orders with user details
export async function GET(req: NextRequest) {
  if (!getAdminFromSession(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  await connectDB();

  const query: Record<string, unknown> = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .lean();

  return NextResponse.json({ orders });
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: NextRequest) {
  if (!getAdminFromSession(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status } = body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!orderId || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated', order });
  } catch (err) {
    console.error('Update order status error:', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
