"use client";

import StripePayButton from '@/components/StripePayButton';

import { useCart, CartItem } from '@/components/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    loading,
    error
  } = useCart();

  const [showClearModal, setShowClearModal] = useState(false);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const shipping = getTotalPrice() > 50 ? 0 : 5.99;
  const tax = getTotalPrice() * 0.1; // 10% tax
  const discount = 10.00; // Sample discount
  const finalTotal = Math.max(0, getTotalPrice() + shipping + tax - discount);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      const currentItem = cart.find(item => item.id === id);
      if (currentItem) {
        const delta = newQuantity - currentItem.quantity;
        updateQuantity(id, delta);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center mt-8">
        <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center w-full flex flex-col items-center">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 mt-8">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8 9m0 0h9.2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any services to your cart yet. Start exploring our amazing services!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-lg text-gray-600">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden mb-8">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cart Items</h2>
            <button
              onClick={() => setShowClearModal(true)}
              className="text-red-600 hover:text-red-700 font-semibold text-base px-3 py-1 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {cart.map((item: CartItem) => (
              <div
                key={item.id}
                className="py-8 px-4 md:px-8 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center gap-8 md:gap-10 rounded-2xl mb-2"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <Image
                    src={item.imageUrl || '/provider1.jpg'}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                </div>
                {/* Product Details */}
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                  <p className="text-gray-500 mb-3 text-sm md:text-base">by {item.provider || 'Unknown Provider'}</p>
                  <div className="flex items-center gap-2 md:gap-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-white hover:bg-gray-200 border border-gray-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="font-semibold text-gray-900 w-8 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-white hover:bg-gray-200 border border-gray-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Price and Remove */}
                <div className="flex flex-col items-end justify-between min-w-[120px] md:min-w-[160px] gap-2 md:gap-3">
                  <p className="text-2xl font-bold text-gray-900 mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mb-0">${item.price} each</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1 px-2 py-1 rounded-lg transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
          </div>
          <div className="p-8 space-y-6">
            {/* Promo Code */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100 flex items-center gap-3">
              <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-base px-2"
              />
              <button className="text-green-600 font-semibold text-base hover:text-green-700 px-3 py-1 rounded-lg transition-colors">
                Apply
              </button>
            </div>
            {/* Pricing Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-gray-600">
                  Shipping {getTotalPrice() > 50 && <span className="text-green-600 text-sm">(Free!)</span>}
                </span>
                <span className="font-semibold">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between text-xl font-extrabold">
                  <span>Total</span>
                  <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                </div>
                {getTotalPrice() < 50 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Add ${(50 - getTotalPrice()).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
            {/* Stripe Checkout Button */}
            <div className="w-full">
              <StripePayButton amount={Math.round(finalTotal * 100)} />
            </div>
            {/* Trust Indicators */}
            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure checkout guaranteed
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Free cancellation within 24 hours
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Best price guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clear Cart?</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    setShowClearModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
