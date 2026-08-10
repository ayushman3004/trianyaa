// src/context/WishlistContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  tier: string;
  image: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = 'trianyaa_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load wishlist from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  }, []);

  // Save wishlist to local storage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i._id === item._id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i._id === item._id)) {
        return prev.filter((i) => i._id !== item._id);
      }
      return [...prev, item];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return items.some((i) => i._id === id);
  }, [items]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isOpen,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
