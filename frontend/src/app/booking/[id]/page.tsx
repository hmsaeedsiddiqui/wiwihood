'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Star, MapPin, Phone, Mail, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number | string;
  notes?: string;
  paymentStatus: string;
  service: {
    id: string;
    name: string;
    description: string;
    price: number | string;
    duration: number;
  };
  provider: {
    id: string;
    businessName: string;
    logo?: string;
    averageRating?: number;
    totalReviews?: number;
    address?: string;
    phone?: string;
    email?: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  hasReview?: boolean;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8000/api/v1/bookings/${bookingId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);
      } else if (response.status === 401) {
        setError('Please log in to view booking details');
      } else {
        throw new Error('Failed to fetch booking details');
      }
    } catch (error: any) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
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

    const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    }
    return '0.00';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReschedule = () => {
    // Navigate to reschedule page
    router.push(`/booking/${booking?.id}/reschedule`);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (response.ok) {
        // Refresh booking data to show updated status
        await fetchBookingDetails();
        alert('Booking cancelled successfully');
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleViewProviderProfile = () => {
    if (booking?.provider?.id) {
      router.push(`/provider/${booking.provider.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Booking not found'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "The booking you're looking for doesn't exist."}
          </p>
          <Link href="/customer/bookings" className="text-blue-600 hover:text-blue-700">
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
            href="/customer/bookings"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to bookings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600">Booking #{booking.bookingNumber}</p>
            </div>
            <div className="flex space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')) : 'Unknown'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                {booking.paymentStatus ? (booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)) : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">{booking.service.name}</h3>
                  <p className="text-gray-600">{booking.service.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="text-gray-900">{booking.service.duration} minutes</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Price</span>
                    <p className="text-gray-900 font-semibold">${formatPrice(booking.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Provider Information</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {booking.provider.logo ? (
                    <img
                      src={booking.provider.logo}
                      alt={booking.provider.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-lg font-medium">
                        {booking.provider.businessName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-lg">{booking.provider.businessName}</h3>
                  {booking.provider.averageRating && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {booking.provider.averageRating.toFixed(1)} ({booking.provider.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                  <div className="mt-3 space-y-2">
                    {booking.provider.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.provider.address}
                      </div>
                    )}
                    {booking.provider.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {booking.provider.phone}
                      </div>
                    )}
                    {booking.provider.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {booking.provider.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(booking.startDateTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{formatTime(booking.startDateTime)} - {formatTime(booking.endDateTime)}</span>
                  </div>
                </div>
                {booking.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {booking.status === 'completed' && (
                  <Link
                    href={`/booking/${booking.id}/review`}
                    className="block w-full bg-yellow-500 text-white text-center py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    {booking.hasReview ? '👁️ View Review' : '⭐ Write Review'}
                  </Link>
                )}
                
                <button
                  onClick={handleViewProviderProfile}
                  className="block w-full border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  View Provider Profile
                </button>
                
                <button
                  onClick={() => router.push(`/customer/messages?providerId=${booking.provider.id}`)}
                  className="block w-full border border-green-600 text-green-600 text-center py-2 px-4 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  💬 Contact Provider
                </button>
                
                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                  <>
                    <button 
                      onClick={handleReschedule}
                      className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={handleCancelBooking}
                      className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Price</span>
                  <span className="font-medium">${formatPrice(booking.service.price)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-lg">${formatPrice(booking.totalPrice)}</span>
                </div>
                <div className="flex items-center text-sm pt-2">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Payment Status: </span>
                  <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus ? (booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}