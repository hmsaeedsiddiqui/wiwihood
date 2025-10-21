"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetPopularServicesQuery, useGetServicesQuery } from '@/store/api/servicesApi'

const PopularServices = () => {
  const router = useRouter();
  // Prefer services with badges indicating popularity; fallback to popular endpoint
  const { data: allActive = [], isLoading: loadAll, isError: errAll } = useGetServicesQuery({ isActive: true })
  const badgeSet = new Set(['Popular', 'Premium', 'Top Rated', 'Top-rated', 'Top rated'])
  const withBadge = (allActive as any[]).filter(s => badgeSet.has((s?.adminAssignedBadge || '').toString()))
  const { data: popular = [], isLoading: loadPopular, isError: errPopular } = useGetPopularServicesQuery({ limit: 12 }, { skip: withBadge.length > 0 })
  const items = (withBadge.length > 0 ? withBadge.slice(0, 6) : (popular as any[]).slice(0, 6))
  const isLoading = loadAll || (withBadge.length === 0 && loadPopular)
  const isError = errAll && (withBadge.length === 0 && errPopular)

  const goToServices = (service: any) => {
    // Prefer category filter if available; else search by name
    if (service?.category?.id) {
      router.push(`/services?categoryId=${service.category.id}`)
    } else if (service?.category?.name) {
      router.push(`/services?category=${encodeURIComponent(service.category.name)}`)
    } else if (service?.name) {
      router.push(`/services?search=${encodeURIComponent(service.name)}`)
    } else {
      router.push('/services')
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-800 mb-4">Popular Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after beauty and wellness services
          </p>
          <button 
            onClick={() => router.push('/services?filter=popular')}
            className="mt-6 bg-[#E89B8B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D4876F] transition-colors"
          >
            View All Popular Services
          </button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-gray-500">Failed to load popular services.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((svc: any, index: number) => (
              <div
                key={svc.id || index}
                onClick={() => goToServices(svc)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.featuredImage || (Array.isArray(svc.images) ? svc.images[0] : '/service1.png')}
                    alt={svc.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Category badge */}
                  {svc?.category?.name && (
                    <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded text-xs text-gray-600 font-medium">
                      {svc.category.name}
                    </div>
                  )}
                  {/* Popular badge */}
                  {svc?.adminAssignedBadge && (
                    <div className="absolute top-3 right-3 bg-[#E89B8B] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {svc.adminAssignedBadge}
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate" title={svc.name}>{svc.name}</h3>
                  {svc?.provider?.businessName && (
                    <p className="text-sm text-gray-600 mb-1 truncate">{svc.provider.businessName}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-3 truncate">{svc.displayLocation || svc.shortDescription || ''}</p>
                  {/* Rating & Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(Number(svc.averageRating) || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({svc.totalReviews || 0})</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{svc.formattedPrice || `${svc.basePrice} ${svc.currency || ''}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PopularServices