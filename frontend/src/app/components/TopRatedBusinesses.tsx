"use client"

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetServicesQuery } from '@/store/api/servicesApi'

const TopRatedBusinesses = () => {
  const router = useRouter()

  // Backend ServiceFilterDto doesn't accept limit/page in public GET; slice client-side instead
  const { data: services = [], isLoading, isError } = useGetServicesQuery({ isActive: true })

  // Derive top-rated unique providers from services
  const items = useMemo(() => {
    const S = services as any[]
    const badgePreferred = S.filter(s => (s?.adminAssignedBadge || '').toString().toLowerCase().includes('top'))
    const source = badgePreferred.length > 0 ? badgePreferred : S
    const byProvider = new Map<string, any>()
    for (const s of source) {
      const provId = s?.provider?.id || s?.providerId || s?.provider?.name
      if (!provId) continue
      const current = byProvider.get(provId)
      const rating = typeof s?.averageRating === 'number' ? s.averageRating : 0
      const reviews = typeof s?.totalReviews === 'number' ? s.totalReviews : 0
      if (!current || rating > current.rating) {
        byProvider.set(provId, {
          id: provId,
          name: s?.provider?.businessName || s?.provider?.name || 'Provider',
          service: s?.shortDescription || s?.name || '—',
          location: s?.displayLocation || s?.provider?.city || '',
          rating,
          reviews,
          image: s?.featuredImage || (Array.isArray(s?.images) ? s.images[0] : undefined) || '/service1.png',
          category: s?.category?.name || 'Services',
        })
      }
    }
    return Array.from(byProvider.values()).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6)
  }, [services])

  const BusinessCard = ({ business }: { business: any }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.image}
          alt={business.service}
          className="w-full h-full object-cover"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium">
          {business.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{business.name}</h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {business.service}
        </p>
        <p className="text-xs text-gray-500 mb-3">{business.location}</p>
        
        {/* Rating */}
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(business.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({business.reviews})</span>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-light text-gray-800">Top-rated Businesses</h3>
          <button 
            onClick={() => router.push('/services')}
            className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
          >
            View all
          </button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-gray-500">Failed to load top-rated items.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((business: any) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TopRatedBusinesses