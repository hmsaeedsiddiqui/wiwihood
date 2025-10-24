"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import AboutServices from "./about-services";
import Services from "./services";
import Review from "./review";
import SelectTime from "./select-time";
import { useGetServiceByIdQuery, useGetServicesQuery } from "@/store/api/servicesApi";
import type { Service } from "@/store/api/servicesApi";
import { findServiceBySlug, getServiceSlug } from "@/utils/serviceHelpers";

// Utility function to safely format price
const formatPrice = (price: string | number, currency = '$') => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? `${currency}0.00` : `${currency}${numPrice.toFixed(2)}`;
};

function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.id as string;
  
  // Fetch all services to find by slug (alternative: use getServiceBySlug API if backend supports it)
  const {
    data: allServices = [],
    isLoading: loading,
    isError,
    error
  } = useGetServicesQuery({ isActive: true, status: 'active' });
  
  // Find service by slug
  const service = findServiceBySlug(allServices, slug);



  const handleBookNow = () => {
    if (service) {
      // Pass both slug and service ID for better compatibility
      const serviceSlug = getServiceSlug(service);
      router.push(`/services/book-now?service=${serviceSlug}&serviceId=${service.id}&provider=${service.providerId}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E89B8B]"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state - simplified without test data
  if (isError || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center max-w-2xl px-4">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">
              Service Slug: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{slug}</code>
            </p>
            <p className="text-gray-600 mb-6">
              {error && 'data' in error 
                ? `${(error as any).data?.message || 'Service not found'}` 
                : error && 'message' in error
                ? (error as any).message
                : 'The service you are looking for could not be found in our database.'}
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/services" 
                className="block bg-[#E89B8B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D4876F] transition-colors"
              >
                Browse All Services
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Image Section */}
      <div className="bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/services" className="hover:text-gray-900 transition-colors">
                Services
              </Link>
              <span className="text-gray-400">/</span>
              {service.category && (
                <>
                  <Link 
                    href={`/services?category=${service.category.slug}`} 
                    className="hover:text-gray-900 transition-colors"
                  >
                    {service.category.name}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              )}
              <span className="text-gray-900 font-medium">
                {service.name}
              </span>
            </nav>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img
                  src={service.featuredImage || service.images?.[0] || '/service1.png'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/service1.png';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {service.images && service.images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {service.images.slice(0, 5).map((image, index) => (
                    <div 
                      key={index} 
                      className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#E89B8B] cursor-pointer flex-shrink-0"
                    >
                      <img
                        src={image}
                        alt={`${service.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/service1.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Service Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{service.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                {service.averageRating && service.totalReviews && (
                  <span className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {service.averageRating.toFixed(1)} ({service.totalReviews} reviews)
                  </span>
                )}
                {service.displayLocation && (
                  <span className="text-sm text-gray-600">{service.displayLocation}</span>
                )}
                {service.highlightBadge && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {service.highlightBadge}
                  </span>
                )}
                {service.adminAssignedBadge && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {service.adminAssignedBadge}
                  </span>
                )}
                {service.isActive && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Active</span>
                )}
                {service.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Featured</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-[#E89B8B]">
                    {formatPrice(service.basePrice, service.currency)}
                    {service.originalPrice && parseFloat(String(service.originalPrice)) > parseFloat(String(service.basePrice)) && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {formatPrice(service.originalPrice, service.currency)}
                      </span>
                    )}
                  </div>
                  {service.discountPercentage && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {service.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {service.pricingType === 'fixed' ? 'Fixed price' : 
                   service.pricingType === 'hourly' ? 'Per hour' : 'Variable pricing'}
                  {service.durationMinutes && ` • ${service.durationMinutes} minutes`}
                </p>
                {service.promotionText && (
                  <p className="text-green-600 text-sm font-medium mt-1">{service.promotionText}</p>
                )}
              </div>

              {/* Location */}
              {(service.providerBusinessName || service.displayLocation) && (
                <div className="flex items-start space-x-2 mb-6">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    {service.providerBusinessName && (
                      <p className="text-sm text-gray-800">{service.providerBusinessName}</p>
                    )}
                    {service.displayLocation && (
                      <p className="text-sm text-gray-600">{service.displayLocation}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Service Details */}
              {service.shortDescription && (
                <div className="mb-6">
                  <p className="text-gray-700">{service.shortDescription}</p>
                </div>
              )}

              {/* Service Features */}
              {(service.includes && service.includes.length > 0) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What's Included:</h3>
                  <ul className="space-y-1">
                    {service.includes.map((item, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Book Now Button */}
              <button 
                onClick={handleBookNow}
                className="w-full bg-[#E89B8B] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#D4876F] transition-colors mb-4"
              >
                Book Now
              </button>

              {/* Service Information */}
              <div className="space-y-4">
                {/* Service Type & Duration */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="capitalize">{service.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{service.durationMinutes} minutes</span>
                    </div>
                    {service.requiresDeposit && service.depositAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit Required:</span>
                        <span>{formatPrice(service.depositAmount, service.currency)}</span>
                      </div>
                    )}
                    {service.totalBookings > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Bookings:</span>
                        <span>{service.totalBookings}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Policies */}
                {(service.minAdvanceBookingHours || service.cancellationPolicyHours) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Booking Policies</h3>
                    <div className="space-y-2 text-sm">
                      {service.minAdvanceBookingHours && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Advance Booking:</span>
                          <span>{service.minAdvanceBookingHours} hours minimum</span>
                        </div>
                      )}
                      {service.cancellationPolicyHours && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cancellation:</span>
                          <span>{service.cancellationPolicyHours} hours notice</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Requirements */}
                {service.specialRequirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Special Requirements</h3>
                    <p className="text-sm text-gray-600">{service.specialRequirements}</p>
                  </div>
                )}

                {/* Age & Gender Restrictions */}
                {(service.ageRestriction || service.genderPreference !== 'any') && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Restrictions</h3>
                    <div className="space-y-2 text-sm">
                      {service.ageRestriction && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age Restriction:</span>
                          <span>{service.ageRestriction}</span>
                        </div>
                      )}
                      {service.genderPreference && service.genderPreference !== 'any' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender Preference:</span>
                          <span className="capitalize">{service.genderPreference}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Time Selection */}
          <SelectTime service={service} />
          
          {/* About Services */}
          <AboutServices service={service} />
          
          {/* Reviews */}
          <Review service={service} />
          
          {/* Related Services */}
          <Services categoryId={service.categoryId} excludeServiceId={service.id} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ServiceDetailPage;