
import React from "react";
import Link from "next/link";
import { useGetServicesQuery } from "@/store/api/servicesApi";
import { getServiceSlug } from "@/utils/serviceHelpers";
import { createServiceUrl } from "@/utils/slugify";

interface ServicesProps {
  categoryId?: string;
  excludeServiceId?: string;
}

function Services({ categoryId, excludeServiceId }: ServicesProps) {
  // Always get all services and filter client-side for better reliability
  const { data: services = [], isLoading, error } = useGetServicesQuery({});

  // Filter by category and exclude current service
  const filteredServices = Array.isArray(services) && services.length > 0
    ? services.filter(s => {
        // Must be active and approved
        if (!s.isActive || s.status !== 'active') return false;
        // Check if service is approved (handle different approval status formats)
        if (s.approvalStatus && 
            s.approvalStatus !== 'approved' && 
            s.approvalStatus !== 'APPROVED') return false;
        if (s.isApproved === false) return false;
        // Exclude current service
        if (excludeServiceId && s.id === excludeServiceId) return false;
        // If categoryId provided, show only same category services
        if (categoryId && s.categoryId === categoryId) return true;
        // If no categoryId or no same-category services, show other services
        if (!categoryId) return true;
        return false;
      }).slice(0, 5) // Limit to 5 services as requested
    : [];

  // Fallback: if no same-category services, show other services
  const allOtherServices = Array.isArray(services) && filteredServices.length === 0
    ? services.filter(s => {
        if (!s.isActive || s.status !== 'active') return false;
        // Check if service is approved (handle different approval status formats)
        if (s.approvalStatus && 
            s.approvalStatus !== 'approved' && 
            s.approvalStatus !== 'APPROVED') return false;
        if (s.isApproved === false) return false;
        if (excludeServiceId && s.id === excludeServiceId) return false;
        return true;
      }).slice(0, 5)
    : [];

  const displayServices = filteredServices.length > 0 ? filteredServices : allOtherServices;

  // Always show the section, even if loading or no services
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          You may also like
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading related services...</div>
        </div>
      </div>
    );
  }

  // Helper function to format price safely
  const formatPrice = (price: string | number, currency = '$') => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? `${currency}0.00` : `${currency}${numPrice.toFixed(2)}`;
  };

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          You may also like
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-500">Unable to load related services</div>
        </div>
      </div>
    );
  }

  if (displayServices.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          You may also like
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-500">No related services available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        You may also like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {displayServices.map((service, index) => {
          const serviceSlug = getServiceSlug(service);
          return (
            <Link
              key={service.id || index}
              href={createServiceUrl(serviceSlug)}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow block"
            >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={service.featuredImage || service.images?.[0] || "/service1.png"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{service.category?.name || "Service"}</p>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{service.name}</h3>
              <div className="flex items-start gap-2 mb-3">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs text-gray-600 leading-relaxed truncate">
                  {service.providerBusinessName || service.provider?.businessName || "Available"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < Math.round(service.averageRating || 0) ? "fill-yellow-400" : "fill-gray-200"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({service.totalReviews || 0})</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#E89B8B]">
                    {formatPrice(service.basePrice, service.currency)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          )
        })}
      </div>
      
      {/* View More Button */}
      {Array.isArray(services) && services.length > 5 && (
        <div className="text-center mt-4">
          <Link 
            href="/services" 
            className="inline-block bg-[#E89B8B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#D4876F] transition-colors"
          >
            View More Services
          </Link>
        </div>
      )}
    </div>
  );
}

export default Services;
