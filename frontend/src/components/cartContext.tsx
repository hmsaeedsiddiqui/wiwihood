"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL; // Set base URL for all axios requests

// Add interceptor to include JWT token and user ID in headers
axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token found' : 'No token found');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Add test user ID header for cart functionality
    config.headers = config.headers || {};
    config.headers['x-user-id'] = 'test-user-id';
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

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
  const res = await axios.get('/cart');
      console.log('Cart response:', res.data);
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
      console.error('Failed to load cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      console.log('Adding to cart:', { serviceId: item.id, quantity: item.quantity });
  const response = await axios.post('/cart', { serviceId: item.id, quantity: item.quantity });
      console.log('Add to cart response:', response.data);
      await fetchCart();
      setError(null);
    } catch (err: any) {
      console.error('Failed to add to cart:', err.response?.data || err.message);
      setError('Failed to add to cart: ' + (err.response?.data?.message || err.message));
    }
  };

  const removeFromCart = async (id: string) => {
    try {
  await axios.delete(`/cart/${id}`);
      await fetchCart();
    } catch (err) {
      setError('Failed to remove from cart');
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    try {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      const newQty = Math.max(1, item.quantity + delta);
  await axios.patch(`/cart/${id}`, { quantity: newQty });
      await fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
  await axios.delete('/cart');
      await fetchCart();
    } catch (err) {
      setError('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
}
