"use client"

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { getServiceSlug } from '@/utils/serviceHelpers'
import { createServiceUrl } from '@/utils/slugify'

const DynamicHomepageSections = () => {
  const router = useRouter()

  // Fetch services for each section using backend filtering - better performance and accuracy
  const { data: newOnVividhoodServices = [], isLoading: newLoading } = useGetServicesQuery({ 
    type: 'new-on-vividhood'
  })
  const { data: popularServices = [], isLoading: popularLoading } = useGetServicesQuery({ 
    type: 'popular'
  })
  const { data: hotDealServices = [], isLoading: hotDealLoading } = useGetServicesQuery({ 
    type: 'hot-deal'
  })
  const { data: bestSellerServices = [], isLoading: bestSellerLoading } = useGetServicesQuery({ 
    type: 'best-seller'
  })
  const { data: limitedTimeServices = [], isLoading: limitedTimeLoading } = useGetServicesQuery({ 
    type: 'limited-time'
  })
  const { data: premiumServices = [], isLoading: premiumLoading } = useGetServicesQuery({ 
    type: 'premium'
  })
  const { data: topRatedServices = [], isLoading: topRatedLoading } = useGetServicesQuery({ 
    type: 'top-rated'
  })
  


  // Aggregate loading states
  const isLoading = newLoading || popularLoading || hotDealLoading || bestSellerLoading || 
                   limitedTimeLoading || premiumLoading || topRatedLoading

  // Create sections object with backend-filtered services (limit to 4 per section for homepage)
  // Only services with badges should appear on homepage - services without badges only appear in category listings
  const servicesSections = useMemo(() => {
    const sections = {
      newOnVividhood: newOnVividhoodServices.slice(0, 4),
      popular: popularServices.slice(0, 4),
      hotDeal: hotDealServices.slice(0, 4),
      bestSeller: bestSellerServices.slice(0, 4),
      limitedTime: limitedTimeServices.slice(0, 4),
      premium: premiumServices.slice(0, 4),
      topRated: topRatedServices.slice(0, 4),
    }
    return sections
  }, [newOnVividhoodServices, popularServices, hotDealServices, bestSellerServices, 
      limitedTimeServices, premiumServices, topRatedServices])

  // Service card component
  const ServiceCard = ({ service, onClick }: { service: any; onClick: () => void }) => {
    if (!service) return null
    
    return (
      <div 
        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.featuredImage || service.images?.[0] || '/service1.png'}
            alt={service.name || 'Service'}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/service1.png'
            }}
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium">
            {service.category?.name || 'Service'}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1">{service.name || 'Untitled Service'}</h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {service.providerBusinessName || service.provider?.businessName || 'Provider'}
          </p>
          <p className="text-xs text-gray-500 mb-3">{service.displayLocation || service.provider?.city || 'Location'}</p>
          
          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(service.averageRating || 0) ? 'text-yellow-400' : 'text-gray-200'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">({service.totalReviews || 0})</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#E89B8B]">
                {service.currency || 'AED'} {service.basePrice || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Section header component
  const SectionHeader = ({ title, onViewAll }: { title: string; onViewAll: () => void }) => (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-light text-gray-800">{title}</h3>
      <button 
        onClick={onViewAll}
        className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
      >
        View All
      </button>
    </div>
  )

  // Section component
  const ServiceSection = ({ 
    title, 
    services, 
    isLoading, 
    viewAllType 
  }: { 
    title: string; 
    services: any[]; 
    isLoading: boolean; 
    viewAllType: string;
  }) => {
    if (isLoading) {
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <SectionHeader title={title} onViewAll={() => {}} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    if (!services || !services.length) {
      return null // Don't show empty sections
    }

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeader 
            title={title} 
            onViewAll={() => router.push(`/services?type=${viewAllType}`)} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service) => {
              const serviceSlug = getServiceSlug(service)
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => router.push(createServiceUrl(serviceSlug))}
                />
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // No need for section configurations array - use direct rendering

  // Handle error state - if any API call fails, show error
  // Note: Individual section errors are handled by not showing empty sections

  return (
    <div className="w-full">
      {/* Top Rated */}
      {servicesSections.topRated.length > 0 && (
        <ServiceSection
          title="Top Rated"
          services={servicesSections.topRated}
          isLoading={isLoading}
          viewAllType="top-rated"
        />
      )}

      {/* Popular This Week */}
      {servicesSections.popular.length > 0 && (
        <ServiceSection
          title="Popular This Week"
          services={servicesSections.popular}
          isLoading={isLoading}
          viewAllType="popular"
        />
      )}

      {/* Best Sellers */}
      {servicesSections.bestSeller.length > 0 && (
        <ServiceSection
          title="Best Sellers"
          services={servicesSections.bestSeller}
          isLoading={isLoading}
          viewAllType="best-seller"
        />
      )}

      {/* Hot Deals */}
      {servicesSections.hotDeal.length > 0 && (
        <ServiceSection
          title="Hot Deals"
          services={servicesSections.hotDeal}
          isLoading={isLoading}
          viewAllType="hot-deal"
        />
      )}

      {/* New on Wiwihood */}
      {servicesSections.newOnVividhood.length > 0 && (
        <ServiceSection
          title="New on Wiwihood"
          services={servicesSections.newOnVividhood}
          isLoading={isLoading}
          viewAllType="new-on-vividhood"
        />
      )}

      {/* Limited Time */}
      {servicesSections.limitedTime.length > 0 && (
        <ServiceSection
          title="Limited Time"
          services={servicesSections.limitedTime}
          isLoading={isLoading}
          viewAllType="limited-time"
        />
      )}

      {/* Premium */}
      {servicesSections.premium.length > 0 && (
        <ServiceSection
          title="Premium"
          services={servicesSections.premium}
          isLoading={isLoading}
          viewAllType="premium"
        />
      )}
    </div>
  )
}

export default DynamicHomepageSections