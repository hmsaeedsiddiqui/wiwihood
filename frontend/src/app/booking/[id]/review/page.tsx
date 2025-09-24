'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, Star, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReviewFlow from '@/components/ReviewFlow';
import ReviewModal from '@/components/ReviewModal';
import ReviewSummary from '@/components/ReviewSummary';
import { getAuthHeaders } from '@/lib/auth';

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  notes?: string;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  };
  provider: {
    id: string;
    businessName: string;
    logo?: string;
    averageRating?: number;
    totalReviews?: number;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  hasReview?: boolean;
  review?: any;
}

export default function BookingReviewPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
      loadCurrentUser();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/bookings/${bookingId}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  };

  const canWriteReview = () => {
    return booking && 
           booking.status === 'completed' && 
           !booking.hasReview &&
           currentUser?.id === booking.customer.id;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking not found</h1>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
          <Link href="/bookings" className="text-blue-600 hover:text-blue-700">
            Return to bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/bookings" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to bookings
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Booking #{booking.bookingNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                {formatDate(booking.startDateTime)} at {formatTime(booking.startDateTime)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                {/* Service Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{booking.service.name}</h3>
                    <p className="text-gray-600 text-sm">{booking.service.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.service.duration} minutes
                      </div>
                      <div className="font-medium text-gray-900">
                        ${booking.service.price}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    {booking.provider.logo ? (
                      <img
                        src={booking.provider.logo}
                        alt={booking.provider.businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {booking.provider.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{booking.provider.businessName}</h4>
                    {booking.provider.averageRating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {booking.provider.averageRating.toFixed(1)} ({booking.provider.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(booking.startDateTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{formatTime(booking.startDateTime)} - {formatTime(booking.endDateTime)}</span>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-600">{booking.notes}</p>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${booking.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Review Section */}
            {booking.status === 'completed' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Review</h2>
                  {canWriteReview() && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Write Review
                    </button>
                  )}
                </div>

                {booking.hasReview ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      Thank you for your review! Your feedback helps other customers and providers.
                    </p>
                  </div>
                ) : booking.status === 'completed' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      How was your experience? Share your feedback to help other customers.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600">
                      Reviews can be written after the service is completed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Customer Reviews for Provider */}
            {booking.provider && (
              <ReviewFlow
                providerId={booking.provider.id}
                mode="display"
                currentUserId={currentUser?.id}
                userRole={currentUser?.role}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Review Summary */}
            <ReviewSummary providerId={booking.provider.id} />

            {/* Action Buttons */}
            {booking.status === 'completed' && canWriteReview() && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Share Your Experience</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Help other customers by sharing your experience with {booking.provider.businessName}.
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Write Review
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/provider/${booking.provider.id}`}
                  className="block text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Provider Profile
                </Link>
                <Link
                  href={`/services/${booking.service.id}`}
                  className="block text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Service Details
                </Link>
                {booking.status === 'confirmed' && (
                  <Link
                    href={`/bookings/${booking.id}/reschedule`}
                    className="block text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Reschedule Booking
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          bookingId={booking.id}
          providerName={booking.provider.businessName}
          serviceName={booking.service.name}
          onReviewSubmitted={(review) => {
            setBooking(prev => prev ? { ...prev, hasReview: true, review } : null);
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
}
