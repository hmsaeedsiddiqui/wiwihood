'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  User, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  MessageCircle, 
  ThumbsUp,
  Flag,
  Edit3,
  Trash2
} from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isPublished: boolean;
  isVerified: boolean;
  providerResponse?: string;
  providerResponseAt?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  provider: {
    id: string;
    businessName: string;
    logo?: string;
  };
  booking: {
    id: string;
    service: {
      name: string;
    };
    startDateTime: string;
  };
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  isPublished: boolean;
}

interface ReviewFlowProps {
  bookingId?: string;
  providerId?: string;
  customerId?: string;
  mode: 'create' | 'display' | 'manage';
  currentUserId?: string;
  userRole?: 'customer' | 'provider' | 'admin';
  onReviewSubmitted?: (review: Review) => void;
  onReviewUpdated?: (review: Review) => void;
  onReviewDeleted?: (reviewId: string) => void;
}

export const ReviewFlow: React.FC<ReviewFlowProps> = ({
  bookingId,
  providerId,
  customerId,
  mode,
  currentUserId,
  userRole = 'customer',
  onReviewSubmitted,
  onReviewUpdated,
  onReviewDeleted
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    comment: '',
    isPublished: true
  });
  const [providerResponse, setProviderResponse] = useState('');
  const [showResponseForm, setShowResponseForm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadReviews();
  }, [providerId, customerId, bookingId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;
      
      if (providerId) {
        url += `/provider/${providerId}`;
      } else if (customerId && userRole === 'customer') {
        url += `/my-reviews`;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      showToast('Please select a rating between 1 and 5', 'error');
      return;
    }

    if (!bookingId && !editingReview) {
      showToast('Booking ID is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingReview 
        ? `${process.env.NEXT_PUBLIC_API_URL}/reviews/${editingReview.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/reviews`;
      
      const method = editingReview ? 'PATCH' : 'POST';
      const body = editingReview 
        ? { ...formData }
        : { ...formData, bookingId };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const review = await response.json();
        
        if (editingReview) {
          setReviews(prev => prev.map(r => r.id === review.id ? review : r));
          onReviewUpdated?.(review);
          showToast('Review updated successfully', 'success');
          setEditingReview(null);
        } else {
          setReviews(prev => [review, ...prev]);
          onReviewSubmitted?.(review);
          showToast('Review submitted successfully', 'success');
        }

        setShowForm(false);
        setFormData({ rating: 5, title: '', comment: '', isPublished: true });
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to submit review', 'error');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        onReviewDeleted?.(reviewId);
        showToast('Review deleted successfully', 'success');
      } else {
        showToast('Failed to delete review', 'error');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('Failed to delete review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitProviderResponse = async (reviewId: string) => {
    if (!providerResponse.trim()) {
      showToast('Please enter a response', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/response`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ response: providerResponse })
        }
      );

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
        setProviderResponse('');
        setShowResponseForm(null);
        showToast('Response added successfully', 'success');
      } else {
        showToast('Failed to add response', 'error');
      }
    } catch (error) {
      console.error('Error adding response:', error);
      showToast('Failed to add response', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ open: true, message, type });
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Write a Review' : 
           mode === 'manage' ? 'My Reviews' : 'Customer Reviews'}
        </h2>
        
        {(mode === 'create' || mode === 'manage') && userRole === 'customer' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {(showForm || editingReview) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? 'Edit Review' : 'Write Your Review'}
          </h3>
          
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              {renderStars(formData.rating, true, (rating) => 
                setFormData(prev => ({ ...prev, rating }))
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share details about your experience"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Publish Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                Make this review public
              </label>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={submitReview}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingReview(null);
                  setFormData({ rating: 5, title: '', comment: '', isPublished: true });
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 && !loading ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              {mode === 'create' ? 'Be the first to write a review!' : 'No reviews have been submitted yet.'}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.customer.profileImage ? (
                      <img
                        src={review.customer.profileImage}
                        alt={`${review.customer.firstName} ${review.customer.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {review.customer.firstName} {review.customer.lastName}
                      </h4>
                      {review.isVerified && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(review.createdAt)}</span>
                      {review.booking && (
                        <>
                          <span>•</span>
                          <span>{review.booking.service.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                {userRole === 'customer' && review.customer.id === currentUserId && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setFormData({
                          rating: review.rating,
                          title: review.title || '',
                          comment: review.comment || '',
                          isPublished: review.isPublished
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Rating and Title */}
              <div className="mb-3">
                {renderStars(review.rating)}
                {review.title && (
                  <h5 className="font-medium text-gray-900 mt-2">{review.title}</h5>
                )}
              </div>

              {/* Review Content */}
              {review.comment && (
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
              )}

              {/* Review Status */}
              <div className="flex items-center space-x-4 text-sm">
                {!review.isPublished && (
                  <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Private
                  </span>
                )}
                {review.isVerified && (
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>

              {/* Provider Response */}
              {review.providerResponse && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <h6 className="font-medium text-blue-900">Response from {review.provider.businessName}</h6>
                    <span className="text-sm text-blue-600">
                      {formatDate(review.providerResponseAt!)}
                    </span>
                  </div>
                  <p className="text-blue-800">{review.providerResponse}</p>
                </div>
              )}

              {/* Provider Response Form */}
              {userRole === 'provider' && !review.providerResponse && (
                <div className="mt-4">
                  {showResponseForm === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={providerResponse}
                        onChange={(e) => setProviderResponse(e.target.value)}
                        placeholder="Write your response to this review..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => submitProviderResponse(review.id)}
                          disabled={loading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                        >
                          {loading ? 'Submitting...' : 'Submit Response'}
                        </button>
                        <button
                          onClick={() => {
                            setShowResponseForm(null);
                            setProviderResponse('');
                          }}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowResponseForm(review.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Respond to review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Toast Notification */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg z-50 font-medium flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          {toast.message}
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col gap-2 w-full max-w-sm z-50" />
      </Toast.Provider>
    </div>
  );
};

export default ReviewFlow;
