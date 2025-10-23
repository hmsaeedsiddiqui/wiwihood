import React from "react";
import type { Service } from "@/store/api/servicesApi";

interface ReviewProps {
  service: Service;
}

// Fallback reviews for now - ideally these would come from the API
const fallbackReviews = [
  {
    name: "Sarah Lee",
    rating: 5,
    date: "2 days ago",
    comment:
      "Amazing service! The staff was very professional and the results were exactly what I wanted.",
  },
  {
    name: "Emma Wilson",
    rating: 5,
    date: "1 week ago",
    comment:
      "Great experience. Clean facility and excellent nail work. Will definitely come back!",
  },
  {
    name: "Maria Garcia",
    rating: 4,
    date: "2 weeks ago",
    comment: "Good service overall. The manicure lasted longer than expected.",
  },
  {
    name: "Jennifer Kim",
    rating: 5,
    date: "3 weeks ago",
    comment: "Perfect! Love my new nails. The staff was friendly and skilled.",
  },
];

function Review({ service }: ReviewProps) {
  // Use service data if available, otherwise fallback
  const reviews = fallbackReviews; // In a real app, this would come from the API
  const averageRating = service.averageRating || (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length);
  const totalReviews = service.totalReviews || reviews.length;

  return (
    <div className="bg-[#FFF8F1] rounded-2xl p-6 max-w-4xl mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reviews for {service.name}
        </h2>
      </div>

      {/* Overall Rating */}
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <span className="text-lg font-semibold text-gray-900">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-gray-500">({totalReviews} reviews)</span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {reviews.map((review, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 mb-1">
                {review.name}
              </h4>
              <p className="text-xs text-gray-500">{review.date}</p>
            </div>

            {/* Star Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "fill-orange-400" : "fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <button className="flex items-center gap-2 px-6 py-2 bg-[#FFDBB2] text-gray-700 rounded-full hover:bg-[#E9B787] transition-colors">
        See all
        <svg
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_141_3400)">
            <path
              d="M5.5039 1.90495L5.49989 10.6833L3.85731 9.04364C3.76318 8.94688 3.63391 8.89225 3.49891 8.89225C3.05346 8.89603 2.83472 9.43621 3.15223 9.74867L5.65126 12.2507C5.84663 12.4465 6.16389 12.4465 6.35927 12.2507L8.85829 9.74867C9.34772 9.27606 8.61921 8.5516 8.14931 9.04364L6.49989 10.693L6.5039 1.90495C6.50891 1.62309 6.27993 1.39282 5.99804 1.39566C5.72035 1.39755 5.49848 1.6273 5.5039 1.90495Z"
              fill="#2C2C2C"
            />
          </g>
          <defs>
            <clipPath id="clip0_141_3400">
              <rect
                width="12"
                height="12"
                fill="white"
                transform="translate(0 0.900024)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
}

export default Review;
