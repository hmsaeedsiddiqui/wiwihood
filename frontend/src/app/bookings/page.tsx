"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const demoBookings = [
  {
    id: 1,
    bookingId: 'BK-2025-001',
    service: 'Hair Cut & Styling',
    provider: {
      name: 'Elite Hair Studio',
      address: '123 Beauty Street, Downtown',
      phone: '+1 (555) 123-4567'
    },
    date: '2025-08-28',
    time: '2:00 PM',
    duration: 60,
    price: 45.00,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&q=80',
    notes: 'Please use organic products if possible',
    paymentStatus: 'paid'
  },
  {
    id: 2,
    bookingId: 'BK-2025-002',
    service: 'Deep Cleaning',
    provider: {
      name: 'Sparkling Clean Co',
      address: '456 Service Ave, Uptown',
      phone: '+1 (555) 987-6543'
    },
    date: '2025-08-30',
    time: '9:00 AM',
    duration: 120,
    price: 120.00,
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80',
    notes: 'Please bring eco-friendly cleaning supplies',
    paymentStatus: 'pending'
  },
  {
    id: 3,
    bookingId: 'BK-2025-003',
    service: 'Massage Therapy',
    provider: {
      name: 'Zen Wellness Spa',
      address: '789 Wellness Blvd, Spa District',
      phone: '+1 (555) 456-7890'
    },
    date: '2025-09-02',
    time: '4:00 PM',
    duration: 90,
    price: 90.00,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=facearea&w=400&h=400&q=80',
    notes: 'Focus on lower back tension',
    paymentStatus: 'paid'
  }
];

export default function BookingsPage() {
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const filteredBookings = demoBookings.filter(booking => {
    if (filter === 'upcoming') return ['confirmed', 'pending'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const selectedBookingData = demoBookings.find(b => b.id === selectedBooking);

  const handleCancelBooking = () => {
    console.log('Cancelling booking:', selectedBooking, 'Reason:', cancelReason);
    setShowCancelModal(false);
    setSelectedBooking(null);
    setCancelReason('');
  };

  const handleReschedule = (bookingId: number) => {
    console.log('Reschedule booking:', bookingId);
  };

  const canCancel = (booking: any) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 3600);
    return hoursDiff >= 24 && ['confirmed', 'pending'].includes(booking.status);
  };

  const canReschedule = (booking: any) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 3600);
    return hoursDiff >= 24 && ['confirmed', 'pending'].includes(booking.status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container - Centered */}
      <div className="flex justify-center">
        <div className="max-w-7xl w-full px-4 py-8">
          
          {/* Header - Centered */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">My Bookings</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Manage your appointments and view booking history</p>
          </div>

          {/* Summary Cards - Centered */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-6xl px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 w-full max-w-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Bookings</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">{demoBookings.length}</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-full">
                      <div className="text-3xl">📅</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 w-full max-w-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Upcoming</p>
                      <p className="text-4xl font-bold text-orange-600 mt-2">
                        {demoBookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-4 rounded-full">
                      <div className="text-3xl">⏰</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 w-full max-w-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</p>
                      <p className="text-4xl font-bold text-green-600 mt-2">
                        {demoBookings.filter(b => b.status === 'completed').length}
                      </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-full">
                      <div className="text-3xl">✅</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 w-full max-w-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Spent</p>
                      <p className="text-4xl font-bold text-yellow-600 mt-2">
                        ${demoBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.price, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-full">
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Centered */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full border border-gray-100">
              <div className="p-2">
                <nav className="flex justify-center space-x-2">
                  {[
                    { key: 'all', label: `All (${demoBookings.length})` },
                    { key: 'upcoming', label: `Upcoming (${demoBookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length})` },
                    { key: 'completed', label: `Completed (${demoBookings.filter(b => b.status === 'completed').length})` },
                    { key: 'cancelled', label: `Cancelled (${demoBookings.filter(b => b.status === 'cancelled').length})` }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                        filter === tab.key
                          ? 'bg-blue-600 text-white shadow-md transform scale-105'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Booking Cards - Centered */}
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500 mb-6">You don't have any bookings in this category yet.</p>
                  <Link href="/shop" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold">
                    Book a Service
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookings.map(booking => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Image */}
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={booking.image}
                          alt={booking.service}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Service Name and Status */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{booking.service}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Provider Info */}
                        <div className="mb-4">
                          <p className="font-medium text-gray-900">{booking.provider.name}</p>
                          <p className="text-sm text-gray-600">{booking.provider.address}</p>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>⏱️</span>
                            <span>{booking.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>💰</span>
                            <span>${booking.price.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking.id)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            View Details
                          </button>
                          {canReschedule(booking) && (
                            <button
                              onClick={() => handleReschedule(booking.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                            >
                              Reschedule
                            </button>
                          )}
                          {canCancel(booking) && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking.id);
                                setShowCancelModal(true);
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status === 'completed' && (
                            <Link
                              href={`/reviews/new?booking=${booking.id}`}
                              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-medium"
                            >
                              Review
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions - Centered */}
          <div className="text-center mt-8">
            <Link href="/shop" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mr-4">
              Book New Service
            </Link>
            <Link href="/dashboard" className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBookingData && !showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Service Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Service:</strong> {selectedBookingData.service}</p>
                  <p><strong>Booking ID:</strong> {selectedBookingData.bookingId}</p>
                  <p><strong>Date:</strong> {new Date(selectedBookingData.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedBookingData.time}</p>
                  <p><strong>Duration:</strong> {selectedBookingData.duration} minutes</p>
                  <p><strong>Price:</strong> ${selectedBookingData.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Provider Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedBookingData.provider.name}</p>
                  <p><strong>Address:</strong> {selectedBookingData.provider.address}</p>
                  <p><strong>Phone:</strong> {selectedBookingData.provider.phone}</p>
                </div>
              </div>
            </div>
            
            {selectedBookingData.notes && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                <p className="text-sm text-gray-600">{selectedBookingData.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              rows={3}
              placeholder="Enter reason for cancellation..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
