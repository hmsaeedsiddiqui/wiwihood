import React from "react";
import type { Service } from "@/store/api/servicesApi";

interface AboutServicesProps {
  service: Service;
}

// Utility function to safely format price
const formatPrice = (price: string | number, currency = '$') => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? `${currency}0.00` : `${currency}${numPrice.toFixed(2)}`;
};

function AboutServices({ service }: AboutServicesProps) {
  return (
    <div className="bg-[#FFF8F1] rounded-2xl p-6 mt-10 max-w-4xl">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        About {service.name}
      </h2>

      {/* Service Description */}
      {service.description && (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{service.description}</p>
        </div>
      )}

      {/* Service Tags */}
      {service.tags && service.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {service.tags.map((tag, index) => (
            <button 
              key={index}
              className="bg-[#E9B787] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[#E89B8B] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Main Service Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-6 bg-white rounded-lg border border-[#E9B787]/30 shadow-sm">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Duration: {service.durationMinutes} minutes
              {service.serviceType && ` • ${service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}`}
            </p>
            {service.shortDescription && (
              <p className="text-sm text-gray-600 mb-3">{service.shortDescription}</p>
            )}
            <div className="flex items-center space-x-4">
              <p className="font-bold text-[#E89B8B] text-xl">
                {formatPrice(service.basePrice, service.currency)}
                {service.originalPrice && parseFloat(String(service.originalPrice)) > parseFloat(String(service.basePrice)) && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(service.originalPrice, service.currency)}
                  </span>
                )}
              </p>
              {service.pricingType !== 'fixed' && (
                <span className="text-sm text-gray-500">
                  ({service.pricingType} pricing)
                </span>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <button className="bg-[#E9B787] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#E89B8B] transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 space-y-4">
        {/* Preparation Instructions */}
        {service.preparationInstructions && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Preparation Instructions</h4>
            <p className="text-sm text-gray-700">{service.preparationInstructions}</p>
          </div>
        )}

        {/* Aftercare Instructions */}
        {service.aftercareInstructions && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Aftercare Instructions</h4>
            <p className="text-sm text-gray-700">{service.aftercareInstructions}</p>
          </div>
        )}

        {/* What's Excluded */}
        {service.excludes && service.excludes.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Not Included</h4>
            <ul className="space-y-1">
              {service.excludes.map((item, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deal Information */}
        {service.isPromotional && (service.dealDescription || service.promotionText) && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              {service.dealCategory ? `${service.dealCategory} Offer` : 'Special Offer'}
            </h4>
            {service.dealDescription && (
              <p className="text-sm text-gray-700 mb-2">{service.dealDescription}</p>
            )}
            {service.promotionText && (
              <p className="text-sm text-gray-700 mb-2">{service.promotionText}</p>
            )}
            {service.dealValidUntil && (
              <p className="text-xs text-gray-600">Valid until: {new Date(service.dealValidUntil).toLocaleDateString()}</p>
            )}
            {service.dealTerms && (
              <p className="text-xs text-gray-500 mt-2">Terms: {service.dealTerms}</p>
            )}
          </div>
        )}

        {/* Provider Information */}
        {service.provider && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">About the Provider</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Business:</strong> {service.provider.businessName}</p>
              <p><strong>Type:</strong> {service.provider.providerType}</p>
              <p><strong>Location:</strong> {service.provider.city}, {service.provider.country}</p>
              {service.provider.phone && (
                <p><strong>Phone:</strong> {service.provider.phone}</p>
              )}
              {service.provider.isVerified && (
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mt-2">
                  ✓ Verified Provider
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutServices;
