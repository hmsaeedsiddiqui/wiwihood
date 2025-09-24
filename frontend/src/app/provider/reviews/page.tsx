'use client';

import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/lib/auth';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  providerResponse?: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  booking: {
    id: string;
    service: {
      name: string;
    };
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string>('');

  useEffect(() => {
    fetchProviderInfo();
  }, []);

  useEffect(() => {
    if (providerId) {
      fetchReviews();
      fetchStats();
    }
  }, [providerId]);

  const getProviderAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('providerToken') || 
                  localStorage.getItem('auth-token') || 
                  localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const fetchProviderInfo = async () => {
    try {
      const headers = getProviderAuthHeaders();
      console.log('Fetching provider info with headers:', headers);
      const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
        headers
      });
      
      console.log('Provider info response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Provider info data:', data);
        if (data.provider && data.provider.id) {
          setProviderId(data.provider.id);
          console.log('Set provider ID from provider object:', data.provider.id);
        } else {
          setProviderId(data.id);
          console.log('Set provider ID from user ID:', data.id);
        }
      } else {
        const errorText = await response.text();
        console.error('Provider info fetch failed:', response.status, errorText);
        setError('Failed to fetch provider information');
      }
    } catch (error) {
      console.error('Error fetching provider info:', error);
      setError('Failed to fetch provider information');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const headers = getProviderAuthHeaders();
      console.log('Fetching reviews for provider ID:', providerId);
      console.log('Using headers:', headers);
      
      const response = await fetch(`http://localhost:8000/api/v1/reviews/provider/${providerId}`, {
        headers
      });
      
      console.log('Reviews response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews data received:', data);
        setReviews(data || []);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch reviews:', response.status, errorText);
        setReviews([]);
        setError(`Failed to fetch reviews: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setError(`Error fetching reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const headers = getProviderAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/v1/reviews/provider/${providerId}/stats`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch review stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const addProviderResponse = async (reviewId: string, response: string) => {
    try {
      const headers = getProviderAuthHeaders();
      const apiResponse = await fetch(`http://localhost:8000/api/v1/reviews/${reviewId}/response`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerResponse: response }),
      });
      
      if (apiResponse.ok) {
        // Refresh reviews after adding response
        fetchReviews();
      } else {
        console.error('Failed to add provider response:', apiResponse.status);
      }
    } catch (error) {
      console.error('Error adding provider response:', error);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">View and manage customer reviews for your services</p>
        </div>

        {/* Review Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900 mr-2">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="flex">{renderStars(Math.round(stats.averageRating || 0))}</div>
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {stats.ratingDistribution ? Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0) : 0}
              </div>
              <div className="text-sm text-gray-600">Published Reviews</div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
          </div>
          
          {reviews.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">
                Once customers complete their bookings and leave reviews, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 mr-3">
                          {review.customer.firstName} {review.customer.lastName}
                        </h3>
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Service: {review.booking.service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {review.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                      {review.isPublished ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {review.comment && (
                    <div className="mb-4">
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  )}
                  
                  {review.providerResponse ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Your Response:</h4>
                      <p className="text-blue-800">{review.providerResponse}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const response = prompt('Enter your response to this review:');
                          if (response) {
                            addProviderResponse(review.id, response);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Add Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}