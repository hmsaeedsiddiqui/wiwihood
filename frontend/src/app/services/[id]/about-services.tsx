import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/store/api/servicesApi";
import { useGetServicesQuery } from "@/store/api/servicesApi";
import { transformServicesWithSlugs, getServiceSlug } from "@/utils/serviceHelpers";

interface AboutServicesProps {
  service: Service;
}

// Utility function to safely format price
const formatPrice = (price: string | number, currency = '$') => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? `${currency}0.00` : `${currency}${numPrice.toFixed(2)}`;
};

function AboutServices({ service }: AboutServicesProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(service.category?.name || '');
  
  // Fetch all services for category navigation
  const { data: services = [], isLoading } = useGetServicesQuery({ 
    isActive: true, 
    status: 'active' 
  });

  // Memoize the filtered services
  const activeServices = useMemo(() => {
    return transformServicesWithSlugs(
      services.filter(service => service.isActive === true)
    )
  }, [services]);

  // Get unique categories
  const serviceCategories = useMemo(() => {
    return Array.from(
      new Set(activeServices.map(service => service.category?.name).filter(Boolean))
    )
  }, [activeServices]);

  // Filter services by selected category
  const filteredServices = useMemo(() => {
    return selectedCategory 
      ? activeServices.filter(service => {
          const categoryName = service.category?.name
          if (!categoryName) return false
          return categoryName.toLowerCase() === selectedCategory.toLowerCase()
        })
      : activeServices
  }, [selectedCategory, activeServices]);

  // Handle service navigation
  const handleServiceClick = (selectedService: Service) => {
    const serviceSlug = getServiceSlug(selectedService);
    router.push(`/services/${serviceSlug}`);
  };

  return (
    <div className="bg-[#FFF8F1] rounded-2xl p-6 mt-10 max-w-4xl">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        About {service.name}
      </h2>

      {/* Category Navigation Tabs */}
      {serviceCategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Browse Other Services</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-[#E89B8B] text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Categories ({activeServices.length})
            </button>
            {serviceCategories.map(category => {
              const categoryCount = activeServices.filter(service => service.category?.name === category).length
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#E89B8B] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category} ({categoryCount})
                </button>
              )
            })}
          </div>

          {/* Related Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E89B8B] mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.slice(0, 6).map((relatedService) => (
                <div 
                  key={relatedService.id}
                  onClick={() => handleServiceClick(relatedService)}
                  className={`bg-white border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#E89B8B] ${
                    relatedService.id === service.id ? 'border-[#E89B8B] ring-2 ring-[#E89B8B]/20' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={relatedService.featuredImage || '/service1.png'}
                      alt={relatedService.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/service1.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{relatedService.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {relatedService.providerBusinessName || 'Service Provider'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-[#E89B8B] text-sm">
                          {relatedService.currency || 'AED'} {relatedService.basePrice}
                        </span>
                        {relatedService.averageRating && (
                          <div className="flex items-center text-xs">
                            <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span>{relatedService.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No services found in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

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
