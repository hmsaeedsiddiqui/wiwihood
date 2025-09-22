"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cartContext';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    amount: '',
    paymentMethod: '',
    bookingDate: ''
  });

  useEffect(() => {
    // Get order details from URL parameters
    const orderId = searchParams?.get('orderId') || 'ORD-' + Date.now();
    const amount = searchParams?.get('amount') || '0';
    const paymentMethod = searchParams?.get('method') || 'card';
    const bookingDate = new Date().toLocaleDateString();

    setOrderDetails({
      orderId,
      amount,
      paymentMethod,
      bookingDate
    });

    // Clear cart after successful payment
    const clearCartAfterPayment = async () => {
      try {
        await clearCart();
        setIsClearing(false);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        setIsClearing(false);
      }
    };

    clearCartAfterPayment();
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Thank you for your booking. Your appointment has been confirmed.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmation</h2>
            <p className="text-gray-600">Your booking details have been sent to your email.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Order ID:</span>
              <span className="text-gray-900 font-bold">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Amount Paid:</span>
              <span className="text-green-600 font-bold text-xl">${orderDetails.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Payment Method:</span>
              <span className="text-gray-900 font-semibold capitalize">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Booking Date:</span>
              <span className="text-gray-900 font-semibold">{orderDetails.bookingDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Cart Status:</span>
              <span className={`font-semibold ${isClearing ? 'text-yellow-600' : 'text-green-600'}`}>
                {isClearing ? 'Clearing...' : 'Cleared ✓'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <h3 className="text-2xl font-bold mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">1</span>
              </div>
              <p>You'll receive an email confirmation with your booking details</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">2</span>
              </div>
              <p>The service provider will contact you to confirm the appointment time</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">3</span>
              </div>
              <p>You can view and manage your bookings in your dashboard</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/bookings"
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>View Bookings</span>
            </div>
          </Link>
          
          <Link 
            href="/services"
            className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Book More</span>
            </div>
          </Link>
          
          <Link 
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </div>
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need help? Contact our support team</p>
          <div className="flex justify-center space-x-6">
            <Link href="/help" className="text-blue-600 hover:text-blue-800 font-medium">
              Help Center
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}