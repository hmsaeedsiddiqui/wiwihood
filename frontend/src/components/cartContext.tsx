"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import axios from 'axios';

// Create a dedicated axios instance for cart operations
const cartApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Add interceptor to include JWT token in headers
cartApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Use the unified auth token
    const token = localStorage.getItem('auth-token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export interface CartItem {
  id: string;
  name: string;
  provider: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Debounced fetch function to prevent rapid API calls
  const fetchCart = useCallback(async () => {
    if (isUpdating || !mountedRef.current) return;
    
    setLoading(true);
    try {
      const res = await cartApi.get('/cart');
      console.log('Cart response:', res.data);
      
      if (!mountedRef.current) return; // Component unmounted
      
      // Transform backend cart items to frontend format
      const transformedCart = Array.isArray(res.data) ? res.data.map((item: any) => ({
        id: item.id,
        name: item.service?.name || 'Unknown Service',
        provider: item.service?.provider?.businessName || 'Unknown Provider',
        price: item.service?.basePrice || 0,
        imageUrl: item.service?.images?.[0] || '/blog1.jpg',
        quantity: item.quantity
      })) : [];
      setCart(transformedCart);
      setError(null);
    } catch (err: any) {
      if (!mountedRef.current) return; // Component unmounted
      
      console.error('Failed to load cart:', err);
      // Don't show error for 404 (empty cart)
      if (err.response?.status === 404) {
        setCart([]);
        setError(null);
      } else {
        setError('Failed to load cart');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [isUpdating]);

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item: CartItem) => {
    if (isUpdating || !mountedRef.current) return;
    
    setIsUpdating(true);
    try {
      console.log('Adding to cart:', { serviceId: item.id, quantity: item.quantity });
      
      // Optimistic update - add item to cart immediately
      const existingItem = cart.find(i => i.id === item.id);
      if (existingItem) {
        setCart(prev => prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ));
      } else {
        setCart(prev => [...prev, item]);
      }
      
      const response = await cartApi.post('/cart', { serviceId: item.id, quantity: item.quantity });
      console.log('Add to cart response:', response.data);
      setError(null);
      
      // Only refresh if we're still mounted and operation succeeded
      if (mountedRef.current) {
        setTimeout(() => fetchCart(), 500); // Debounce refresh
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      
      console.error('Failed to add to cart:', err.response?.data || err.message);
      setError('Failed to add to cart: ' + (err.response?.data?.message || err.message));
      // Revert optimistic update on error
      await fetchCart();
    } finally {
      if (mountedRef.current) {
        setIsUpdating(false);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    if (isUpdating || !mountedRef.current) return;
    
    setIsUpdating(true);
    try {
      // Optimistic update - remove item immediately
      setCart(prev => prev.filter(i => i.id !== id));
      
      await cartApi.delete(`/cart/${id}`);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove from cart');
      // Revert optimistic update on error
      await fetchCart();
    } finally {
      if (mountedRef.current) {
        setIsUpdating(false);
      }
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    if (isUpdating || !mountedRef.current) return;
    
    setIsUpdating(true);
    try {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      
      const newQty = Math.max(1, item.quantity + delta);
      
      // Optimistic update
      setCart(prev => prev.map(i => 
        i.id === id ? { ...i, quantity: newQty } : i
      ));
      
      await cartApi.patch(`/cart/${id}`, { quantity: newQty });
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity');
      // Revert optimistic update on error
      await fetchCart();
    } finally {
      if (mountedRef.current) {
        setIsUpdating(false);
      }
    }
  };

  const clearCart = async () => {
    if (isUpdating || !mountedRef.current) return;
    
    setIsUpdating(true);
    try {
      // Optimistic update - clear cart immediately
      setCart([]);
      
      await cartApi.delete('/cart');
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
      // Revert optimistic update on error
      await fetchCart();
    } finally {
      if (mountedRef.current) {
        setIsUpdating(false);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
}
