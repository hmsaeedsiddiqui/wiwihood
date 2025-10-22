"use client"

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetServicesQuery } from '@/store/api/servicesApi'
// Removed external badge mapping import

function OurChoice() {
  const router = useRouter();

  // Fetch active services from API
  const { data: activeServices = [], isLoading, isError } = useGetServicesQuery({ isActive: true })

  // Filter services with "choice" badge or related badges
  const services = useMemo(() => {
    const S = (activeServices as any[])
    console.log('🔍 OurChoice: Total active services received:', S.length, S.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    // Our Choice badges: Choice, Featured, Recommended, Editor's pick, Staff pick
    const choiceBadges = ['choice', 'our choice', 'featured', 'recommended', 'editor\'s pick', 'staff pick', 'handpicked', 'curated']
    const choiceServices = S.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase()
      return choiceBadges.some(b => badge === b || badge.includes(b))
    })
    console.log('🔍 OurChoice: Choice badges matched:', choiceServices.length, choiceServices.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    
    // Only show services with choice/featured/recommended badges - no fallback
    if (choiceServices.length === 0) return []
    
    return choiceServices.slice(0, 3).map((s: any, idx: number) => ({
      id: s.id || idx,
      title: s.provider?.businessName || 'Featured Provider',
      service: s.name || s.shortDescription || 'Service',
      location: s.displayLocation || s.provider?.city || 'Location',
      rating: s.averageRating || 4.5,
      reviews: s.totalReviews || Math.floor(Math.random() * 20) + 5,
      image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service1.png',
      category: s.category?.name || 'Service'
    }))
  }, [activeServices])

  const ServiceCard = ({ service }: { service: typeof services[0] }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.service}
          className="w-full h-full object-cover"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-md text-xs text-gray-600 font-medium shadow-sm">
          {service.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-2 text-lg">{service.title}</h3>
        <div className="flex items-start mb-2">
          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600 leading-relaxed">{service.service}</p>
        </div>
        <p className="text-xs text-gray-500 mb-4 ml-6">{service.location}</p>
        
        {/* Rating */}
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({service.reviews})</span>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-16 relative overflow-hidden">
     
      {/* Background image with gradient */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('/service-bg.jpg')"}}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 w-full h-full opacity-90"></div>
        
        {/* Vector shape at bottom */}
        <div className="absolute -bottom-35 right-0 w-[2091.16px] h-[341.08px] z-0">
          <img 
            src="/Vector-overlay.svg" 
            alt="Decorative shape"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-light text-gray-800">Our Choice for you</h2>
          <button 
            onClick={() => router.push('/services?filter=choice')}
            className="bg-[#D4A574] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#C19660] transition-colors"
          >
            View all
          </button>
        </div>

        {/* Service Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-gray-500 py-12">Failed to load our choice services.</div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No featured services available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default OurChoice