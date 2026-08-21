// src/context/CartContext.tsx
'use client';
import React, {
  createContext, useContext, useEffect, useReducer, useCallback, useState,
} from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  tier: string;   // "Basic" | "Standard" | "Premium"
  image: string;
  quantity: number;
}

/* ── Coupon definitions ─────────────────────────────────────── */
interface CouponDef {
  code: string;
  discountPercent: number;
}

const VALID_COUPONS: CouponDef[] = [
  { code: 'TRIANYAA10', discountPercent: 10 },
];

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };

    case 'ADD': {
      const existing = state.items.find((i) => i._id === action.item._id);
      const items = existing
        ? state.items.map((i) =>
            i._id === action.item._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...action.item, quantity: 1 }];
      return { ...state, items, isOpen: true };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i._id !== action.id) };

    case 'UPDATE_QTY': {
      if (action.quantity < 1) {
        return { ...state, items: state.items.filter((i) => i._id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    case 'OPEN':
      return { ...state, isOpen: true };

    case 'CLOSE':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  couponCode: string | null;
  discountPercent: number;
  discountAmount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'trianyaa_cart';

const COUPON_STORAGE_KEY = 'trianyaa_coupon';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) });
    } catch { /* ignore */ }
    // Hydrate coupon
    try {
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        const match = VALID_COUPONS.find((c) => c.code === parsed.code);
        if (match) {
          setCouponCode(match.code);
          setDiscountPercent(match.discountPercent);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch({ type: 'CLOSE' }); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const addItem    = useCallback((item: Omit<CartItem, 'quantity'>) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), []);
  const updateQty  = useCallback((id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', id, quantity: qty }), []);
  const clearCart  = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    setCouponCode(null);
    setDiscountPercent(0);
    try { localStorage.removeItem(COUPON_STORAGE_KEY); } catch { /* ignore */ }
  }, []);
  const openCart   = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCart  = useCallback(() => dispatch({ type: 'CLOSE' }), []);

  const applyCoupon = useCallback((code: string): string | null => {
    const normalized = code.trim().toUpperCase();
    const match = VALID_COUPONS.find((c) => c.code === normalized);
    if (!match) return 'Invalid coupon code';
    setCouponCode(match.code);
    setDiscountPercent(match.discountPercent);
    try {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify({ code: match.code }));
    } catch { /* ignore */ }
    return null; // success
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setDiscountPercent(0);
    try { localStorage.removeItem(COUPON_STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = couponCode ? Math.round(totalPrice * discountPercent / 100) : 0;

  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, totalItems, totalPrice, couponCode, discountPercent, discountAmount, addItem, removeItem, updateQty, clearCart, openCart, closeCart, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
