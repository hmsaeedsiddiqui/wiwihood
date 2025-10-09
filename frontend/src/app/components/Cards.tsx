"use client";

import React from 'react';
import { Star, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { CloudinaryImage } from '@/components/cloudinary/CloudinaryImage';
import Link from 'next/link';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  rating: number;
  reviewCount: number;
  providerName: string;
  providerLocation: string;
  image?: string;
  category?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  description,
  price,
  duration,
  rating,
  reviewCount,
  providerName,
  providerLocation,
  image,
  category
}) => {
  return (
    <Link href={`/services/${id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
        {/* Service Image */}
        <div className="relative h-48 overflow-hidden">
          {image ? (
            <CloudinaryImage
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <div className="text-orange-500 text-4xl font-bold">
                {name.charAt(0)}
              </div>
            </div>
          )}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
              {rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Provider Info */}
          <div className="flex items-center mb-4 text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span className="mr-4">{providerName}</span>
            <MapPin className="h-4 w-4 mr-1" />
            <span>{providerLocation}</span>
          </div>

          {/* Service Details */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
              <span>{rating} ({reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price & Book Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-xl font-bold text-gray-900">
                {price.toFixed(0)}
              </span>
              <span className="text-gray-500 text-sm ml-1">AED</span>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ProviderCardProps {
  id: string;
  businessName: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  serviceCount: number;
  image?: string;
  category?: string;
  isVerified?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  businessName,
  description,
  location,
  rating,
  reviewCount,
  serviceCount,
  image,
  category,
  isVerified
}) => {
  return (
    <Link href={`/providers/${id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
        {/* Provider Image */}
        <div className="relative h-40 overflow-hidden">
          {image ? (
            <CloudinaryImage
              src={image}
              alt={businessName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <div className="text-orange-500 text-3xl font-bold">
                {businessName.charAt(0)}
              </div>
            </div>
          )}
          {isVerified && (
            <div className="absolute top-3 left-3">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                ✓ Verified
              </span>
            </div>
          )}
        </div>

        {/* Provider Info */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {businessName}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {/* Location & Category */}
          <div className="flex items-center mb-3 text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="mr-4">{location}</span>
            {category && (
              <>
                <span className="mr-1">•</span>
                <span>{category}</span>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
              <span>{rating.toFixed(1)} ({reviewCount})</span>
            </div>
            <div className="text-sm text-gray-500">
              {serviceCount} services
            </div>
          </div>

          {/* View Button */}
          <button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
            View Services
          </button>
        </div>
      </div>
    </Link>
  );
};