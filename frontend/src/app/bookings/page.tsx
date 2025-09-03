'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Eye,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import ReviewModal from '@/components/ReviewModal';

interface Booking {
  id: string;
  bookingNumber: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  provider: {
    id: string;
    businessName: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  hasReview?: boolean;
  review?: any;
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [showReviewModal, setShowReviewModal] = useState<{
    show: boolean;
    booking: Booking | null;
  }>({ show: false, booking: null });

  useEffect(() => {
    setMounted(true);
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/bookings/my-bookings`;
      
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return 'Loading...';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!mounted) return 'Loading...';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canWriteReview = (booking: Booking) => {
    return booking.status === 'completed' && !booking.hasReview;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and share your experiences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'blue' },
            { 
              label: 'Completed', 
              value: bookings.filter(b => b.status === 'completed').length, 
              color: 'green' 
            },
            { 
              label: 'Upcoming', 
              value: bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length, 
              color: 'yellow' 
            },
            { 
              label: 'Need Review', 
              value: bookings.filter(b => canWriteReview(b)).length, 
              color: 'purple' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.key === 'all' 
                      ? bookings.length 
                      : bookings.filter(b => b.status === tab.key).length
                    }
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Start exploring services!"
                  : `You don't have any ${filter} bookings at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Link
                  href="/services"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Services
                </Link>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Booking Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      {getStatusIcon(booking.status)}
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.service.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Booking #{booking.bookingNumber}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Provider</div>
                        <div className="font-medium text-gray-900">
                          {booking.provider.businessName}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Date</div>
                        <div className="font-medium text-gray-900">
                          {formatDate(booking.startTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Time</div>
                        <div className="font-medium text-gray-900">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="font-medium text-gray-900">
                          ${booking.totalPrice}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/booking/${booking.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>

                      {canWriteReview(booking) && (
                        <button
                          onClick={() => setShowReviewModal({ show: true, booking })}
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Write Review
                        </button>
                      )}

                      {booking.hasReview && (
                        <Link
                          href={`/booking/${booking.id}/review`}
                          className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          View Review
                        </Link>
                      )}

                      {booking.status === 'confirmed' && (
                        <Link
                          href={`/booking/${booking.id}/reschedule`}
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reschedule
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Booking Menu */}
                  <div className="ml-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">Notes</div>
                    <div className="text-gray-900">{booking.notes}</div>
                  </div>
                )}

                {/* Review Prompt for Completed Bookings */}
                {canWriteReview(booking) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-purple-900">
                            Share Your Experience
                          </h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Help other customers by sharing your experience with {booking.provider.businessName}.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowReviewModal({ show: true, booking })}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          Write Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal.show && showReviewModal.booking && (
        <ReviewModal
          isOpen={showReviewModal.show}
          onClose={() => setShowReviewModal({ show: false, booking: null })}
          bookingId={showReviewModal.booking.id}
          providerName={showReviewModal.booking.provider.businessName}
          serviceName={showReviewModal.booking.service.name}
          onReviewSubmitted={(review) => {
            // Update the booking in the list
            setBookings(prev => prev.map(b => 
              b.id === showReviewModal.booking?.id 
                ? { ...b, hasReview: true, review }
                : b
            ));
            setShowReviewModal({ show: false, booking: null });
          }}
        />
      )}
    </div>
  );
}

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
