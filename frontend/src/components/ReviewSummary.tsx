'use client';

import { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, Users } from 'lucide-react';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

interface ReviewSummaryProps {
  providerId: string;
  className?: string;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  providerId,
  className = ''
}) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [providerId]);

  const loadStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/reviews/provider/${providerId}/stats`
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingPercentage = (rating: number) => {
    if (!stats || stats.totalReviews === 0) return 0;
    return Math.round((stats.ratingDistribution[rating] || 0) / stats.totalReviews * 100);
  };

  const getQualityLabel = (averageRating: number) => {
    if (averageRating >= 4.5) return { label: 'Exceptional', color: 'text-green-600' };
    if (averageRating >= 4.0) return { label: 'Excellent', color: 'text-green-500' };
    if (averageRating >= 3.5) return { label: 'Very Good', color: 'text-blue-600' };
    if (averageRating >= 3.0) return { label: 'Good', color: 'text-yellow-600' };
    if (averageRating >= 2.0) return { label: 'Fair', color: 'text-orange-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 h-8 w-32 rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-2">
              <div className="bg-gray-200 h-4 w-8 rounded"></div>
              <div className="bg-gray-200 h-2 flex-1 rounded"></div>
              <div className="bg-gray-200 h-4 w-8 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">Be the first to review this service provider!</p>
      </div>
    );
  }

  const qualityInfo = getQualityLabel(stats.averageRating);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          {stats.totalReviews} reviews
        </div>
      </div>

      {/* Overall Rating */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className={`text-sm font-medium ${qualityInfo.color}`}>
            {qualityInfo.label}
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-8">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {getRatingPercentage(rating)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Indicators */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.round((stats.ratingDistribution[5] || 0) / stats.totalReviews * 100)}%
          </div>
          <div className="text-xs text-gray-600">5-star reviews</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.round(((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalReviews * 100)}%
          </div>
          <div className="text-xs text-gray-600">Positive</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            {stats.totalReviews}
          </div>
          <div className="text-xs text-gray-600">Total reviews</div>
        </div>
      </div>

      {/* Achievement Badges */}
      {stats.averageRating >= 4.5 && stats.totalReviews >= 10 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 bg-yellow-50 text-yellow-800 px-3 py-2 rounded-lg">
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">Top Rated Provider</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
