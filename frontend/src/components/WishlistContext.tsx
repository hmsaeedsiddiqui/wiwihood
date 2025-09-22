"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface WishlistService {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
  durationMinutes?: number;
  image?: string;
}

interface WishlistContextType {
  wishlist: WishlistService[];
  addToWishlist: (service: WishlistService) => void;
  removeFromWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistService[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToWishlist = useCallback((service: WishlistService) => {
    setWishlist((prev) => prev.some((s) => s.id === service.id) ? prev : [...prev, service]);
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const isWished = useCallback((id: string) => wishlist.some((s) => s.id === id), [wishlist]);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWished, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
