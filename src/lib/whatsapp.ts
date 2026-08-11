// src/lib/whatsapp.ts

export interface WAOrderItem {
  productId: string;
  name: string;
  tier: string;
  price: number;
  quantity: number;
}

export interface WAShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export function formatOrderMessage(
  items: WAOrderItem[],
  address: WAShippingAddress,
  shippingFee: number,
): string {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

  const itemLines = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n` +
        `   Product ID: \`${item.productId}\`\n` +
        `   Tier: ${item.tier} | Qty: ${item.quantity} | ₹${(item.price * item.quantity).toLocaleString('en-IN')}`,
    )
    .join('\n\n');

  const addr = [
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.state} - ${address.postalCode}`,
    'India',
  ]
    .filter(Boolean)
    .join('\n');

  const lines = [
    '🛍️ *New Order from TRIANYAA*',
    '',
    '*Items:*',
    itemLines,
    '',
    '*Shipping To:*',
    address.fullName,
    `📞 +${address.phone.replace(/^\+/, '')}`,
    addr,
    '',
    `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`,
    `*Shipping:* ${shippingFee === 0 ? 'FREE 🎉' : `₹${shippingFee}`}`,
    `*Order Total:* ₹${total.toLocaleString('en-IN')}`,
    '',
    '---',
    '_Sent via TRIANYAA Shop_',
  ];

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WA_NUMBER ?? '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getShippingFee(subtotal: number): number {
  return subtotal >= 999 ? 0 : 60;
}
