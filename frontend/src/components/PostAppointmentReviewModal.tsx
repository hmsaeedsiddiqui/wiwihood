"use client";

import React, { useState } from 'react';
import { Star, Camera, X, Check, Upload, Smile, Heart, ThumbsUp } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  serviceName: string;
  staffName?: string;
  appointmentDate: string;
  onSubmit: (reviewData: any) => void;
}

export default function PostAppointmentReviewModal({
  isOpen,
  onClose,
  businessName,
  serviceName,
  staffName,
  appointmentDate,
  onSubmit
}: ReviewModalProps) {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [staffRating, setStaffRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const aspects = [
    { id: 'cleanliness', label: 'Cleanliness', icon: '✨' },
    { id: 'service-quality', label: 'Service Quality', icon: '⭐' },
    { id: 'staff-friendliness', label: 'Staff Friendliness', icon: '😊' },
    { id: 'ambiance', label: 'Ambiance', icon: '🏢' },
    { id: 'value-for-money', label: 'Value for Money', icon: '💰' },
    { id: 'punctuality', label: 'Punctuality', icon: '⏰' }
  ];

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair', 
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  if (!isOpen) return null;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + photos.length > 5) {
      alert('You can upload maximum 5 photos');
      return;
    }

    setPhotos([...photos, ...files]);
    
    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPhotoUrls([...photoUrls, ...newUrls]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newUrls = photoUrls.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoUrls(newUrls);
  };

  const toggleAspect = (aspectId: string) => {
    setSelectedAspects(prev => 
      prev.includes(aspectId) 
        ? prev.filter(id => id !== aspectId)
        : [...prev, aspectId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setSubmitting(true);

    const reviewData = {
      businessRating: rating,
      staffRating,
      comment,
      photos,
      wouldRecommend,
      aspects: selectedAspects,
      serviceName,
      staffName,
      appointmentDate
    };

    try {
      await onSubmit(reviewData);
      setStep(4); // Success step
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 4 ? 'Thank You!' : 'How was your experience?'}
            </h2>
            <p className="text-gray-600">
              {step === 4 
                ? 'Your review has been submitted successfully'
                : `${serviceName} at ${businessName}`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Overall Rating */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Rate your overall experience
                </h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      <Star className={`h-12 w-12 ${star <= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-lg font-medium text-gray-700">
                    {ratingLabels[rating as keyof typeof ratingLabels]}
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={rating === 0}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Feedback */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Tell us more about your experience
                </h3>
                
                {/* Staff Rating */}
                {staffName && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How would you rate {staffName}?
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setStaffRating(star)}
                          className={`p-1 ${
                            star <= staffRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        >
                          <Star className={`h-6 w-6 ${star <= staffRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aspects */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What did you like most? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {aspects.map((aspect) => (
                      <button
                        key={aspect.id}
                        onClick={() => toggleAspect(aspect.id)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          selectedAspects.includes(aspect.id)
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg mr-2">{aspect.icon}</span>
                        <span className="text-sm font-medium">{aspect.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Would you recommend this business to others?
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setWouldRecommend(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes, definitely
                    </button>
                    <button
                      onClick={() => setWouldRecommend(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <X className="h-4 w-4" />
                      No, not really
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Comments and Photos */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Share your thoughts and photos
                </h3>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write a review (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add photos (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to add photos</p>
                      <p className="text-xs text-gray-500">Up to 5 photos</p>
                    </label>
                  </div>

                  {/* Photo Preview */}
                  {photoUrls.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {photoUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Review Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for taking the time to share your experience. Your feedback helps other customers and helps businesses improve their services.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={() => {/* Share review logic */}}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Share Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}