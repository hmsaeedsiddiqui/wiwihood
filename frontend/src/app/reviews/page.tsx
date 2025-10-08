"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';

interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  providerId: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt: string;
  serviceName: string;
  providerName: string;
  customerName?: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    fetchReviewStats();
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'given' ? 'reviews/given' : 'reviews/received';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/${endpoint}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        // Set demo data for now
        setReviews(getDemoReviews());
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(getDemoReviews());
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/reviews/stats`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Set demo stats
        setStats({
          totalReviews: 12,
          averageRating: 4.3,
          ratingDistribution: { 5: 6, 4: 4, 3: 1, 2: 1, 1: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
      setStats({
        totalReviews: 12,
        averageRating: 4.3,
        ratingDistribution: { 5: 6, 4: 4, 3: 1, 2: 1, 1: 0 }
      });
    }
  };

  const getDemoReviews = (): Review[] => {
    if (activeTab === 'given') {
      return [
        {
          id: '1',
          bookingId: 'booking-1',
          serviceId: 'service-1',
          providerId: 'provider-1',
          rating: 5,
          comment: 'Excellent massage therapy session! The therapist was very professional and knowledgeable. I felt completely relaxed and my back pain was significantly reduced.',
          response: 'Thank you for the wonderful review! We\'re delighted you had such a positive experience.',
          createdAt: '2025-01-15T10:30:00Z',
          serviceName: 'Deep Tissue Massage',
          providerName: 'Zen Wellness Spa'
        },
        {
          id: '2',
          bookingId: 'booking-2',
          serviceId: 'service-2',
          providerId: 'provider-2',
          rating: 4,
          comment: 'Good haircut and styling service. The stylist listened to what I wanted and delivered. Clean salon with friendly staff.',
          createdAt: '2025-01-10T14:15:00Z',
          serviceName: 'Hair Cut & Style',
          providerName: 'Elegance Hair Studio'
        },
        {
          id: '3',
          bookingId: 'booking-3',
          serviceId: 'service-3',
          providerId: 'provider-3',
          rating: 5,
          comment: 'Amazing facial treatment! My skin feels so soft and refreshed. The products used were high quality and the ambiance was perfect.',
          createdAt: '2025-01-05T16:45:00Z',
          serviceName: 'Rejuvenating Facial',
          providerName: 'Beauty Haven'
        }
      ];
    } else {
      return [
        {
          id: '4',
          bookingId: 'booking-4',
          serviceId: 'service-4',
          providerId: 'provider-4',
          rating: 5,
          comment: 'Wonderful customer! Very punctual and respectful. Easy to work with.',
          createdAt: '2025-01-12T09:00:00Z',
          serviceName: 'Personal Training',
          providerName: 'FitLife Gym',
          customerName: 'John Smith'
        }
      ];
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fas fa-star ${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
              <p className="text-gray-600 mt-2">Manage and view your reviews and feedback</p>
            </div>
            <Link href="/profile" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Profile
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="fas fa-star text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                  <div className="ml-2">
                    {renderStars(Math.round(stats.averageRating), 'sm')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="fas fa-comments text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <i className="fas fa-thumbs-up text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">5-Star Reviews</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.ratingDistribution[5]}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <i className="fas fa-chart-bar text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('given')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'given'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-edit mr-2"></i>
                Reviews Given ({getDemoReviews().length})
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-inbox mr-2"></i>
                Reviews Received (1)
              </button>
            </nav>
          </div>

          <div className="p-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-star text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'given' ? 'No reviews given yet' : 'No reviews received yet'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'given' 
                    ? 'Start booking services and share your experiences!'
                    : 'Complete some bookings to receive feedback from customers.'
                  }
                </p>
                {activeTab === 'given' && (
                  <Link href="/browse" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Browse Services
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">
                            {review.serviceName}
                          </h3>
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activeTab === 'given' ? `at ${review.providerName}` : `by ${review.customerName || 'Customer'}`}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>

                    {review.response && (
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-center mb-2">
                          <i className="fas fa-reply text-blue-600 mr-2"></i>
                          <span className="text-sm font-medium text-gray-900">Response from provider:</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.response}</p>
                      </div>
                    )}

                    {activeTab === 'received' && !review.response && (
                      <div className="mt-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          <i className="fas fa-reply mr-2"></i>
                          Respond to Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        {stats.totalReviews > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rating Distribution</h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-700 mr-2">{rating}</span>
                    <i className="fas fa-star text-yellow-400 w-4 h-4"></i>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{
                          width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
