// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order, IOrderAddon } from '@/models/Order';
import { Addon } from '@/models/Addon';
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
    const { items, addonIds, addons: inputAddons, shippingAddress, orderSource } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    await connectDB();

    // Extract addon IDs from either array format: addonIds = ['id1'] or inputAddons = [{ addonId: 'id1' }]
    const requestedAddonIds: string[] = Array.isArray(addonIds)
      ? addonIds
      : Array.isArray(inputAddons)
      ? inputAddons.map((a: { addonId?: string } | string) => (typeof a === 'string' ? a : a.addonId)).filter((id): id is string => Boolean(id))
      : [];

    // Calculate product subtotal from items
    const productSubtotal = items.reduce((acc: number, item: { price: number; quantity: number }) => {
      return acc + (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }, 0);

    // Fetch active add-ons from DB to calculate actual price securely
    let addonTotal = 0;
    const processedAddons: IOrderAddon[] = [];

    if (requestedAddonIds.length > 0) {
      const dbAddons = await Addon.find({ _id: { $in: requestedAddonIds }, isActive: true }).lean();

      for (const dbAddon of dbAddons) {
        const addonIdStr = String(dbAddon._id);
        const price = Number(dbAddon.price) || 0;
        const quantity = 1;

        addonTotal += price * quantity;
        processedAddons.push({
          addonId: addonIdStr,
          name: dbAddon.name,
          price,
          quantity,
        });
      }
    }

    // Free delivery for orders >= ₹999 (products + addons)
    const subtotal = productSubtotal + addonTotal;
    const shippingFee = subtotal >= 999 ? 0 : 60;
    const calculatedTotalAmount = subtotal + shippingFee;

    const order = await Order.create({
      userId: uid,
      items,
      addons: processedAddons,
      totalAmount: calculatedTotalAmount,
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

