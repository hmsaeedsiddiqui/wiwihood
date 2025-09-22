"use client";

import React, { useState } from 'react';
import { useCart } from '../../components/cartContext';

export default function CartTest() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, error } = useCart();
  const [testResult, setTestResult] = useState<string>('');

  // Test service data
  const testService = {
    id: 'test-service-123',
    name: 'Hair Cut & Styling',
    provider: 'Test Salon',
    price: 50.00,
    imageUrl: '/blog1.jpg',
    quantity: 1
  };

  const runCartTest = async () => {
    try {
      setTestResult('Running cart test...\n');
      
      // Test 1: Add item to cart
      setTestResult(prev => prev + '1. Adding test service to cart...\n');
      await addToCart(testService);
      setTestResult(prev => prev + '✓ Service added successfully\n');
      
      setTestResult(prev => prev + '\n2. Cart test completed successfully!\n');
    } catch (err: any) {
      setTestResult(prev => prev + `❌ Test failed: ${err.message}\n`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart Functionality Test</h1>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            Loading cart...
          </div>
        )}
        
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-4">
            <button
              onClick={runCartTest}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4"
            >
              Run Cart Test
            </button>
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>
          
          {/* Test Results */}
          {testResult && (
            <div className="mt-4 bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
            </div>
          )}
        </div>
        
        {/* Test Service Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Service</h2>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{testService.name}</h3>
              <p className="text-gray-600">{testService.provider}</p>
              <p className="text-green-600 font-semibold">${testService.price}</p>
            </div>
            <button
              onClick={() => addToCart(testService)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
        
        {/* Current Cart Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Cart ({cart.length} items)</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.provider}</p>
                    <p className="text-green-600 font-semibold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-gray-100 rounded">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
