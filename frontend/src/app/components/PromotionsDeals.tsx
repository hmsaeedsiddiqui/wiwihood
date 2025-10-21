"use client"

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetServicesQuery, useGetPopularServicesQuery } from '@/store/api/servicesApi'

const PromotionsDeals = () => {
  const router = useRouter();
  // Avoid unsupported params; limit client-side
  const { data: services = [], isLoading, isError } = useGetServicesQuery({ isActive: true })
  // Always fetch popular to have a graceful fallback when no badge/promo items exist
  const { data: popularFallback = [], isLoading: isLoadingFallback, isError: isErrorFallback } = useGetPopularServicesQuery({ limit: 12 })

  const deals = useMemo(() => {
    const S = (services as any[])
    const P = (popularFallback as any[])

    const badgeKeywords = ['deal', 'hot', 'limited', 'offer', 'discount', 'sale']
    const getBadgeText = (s: any) => {
      const b = s?.adminAssignedBadge
      if (Array.isArray(b)) return b.join(' ').toString()
      return (b || '').toString()
    }
    const hasDealBadge = (s: any) => {
      const b = getBadgeText(s).toLowerCase()
      return badgeKeywords.some(k => b.includes(k))
    }
    const formatDiscount = (s: any) => {
      const raw = s?.discountPercentage
      const num = typeof raw === 'number' ? raw : (typeof raw === 'string' ? parseFloat(raw) : NaN)
      if (Number.isFinite(num) && num > 0) return `${num}% OFF`
      const badge = getBadgeText(s)
      if (badge) return badge
      if (s?.promotionText) return s.promotionText
      return 'Deal'
    }

    // 1) Prefer admin badges indicating deals (even if promo fields are not set)
    const badgeFirst = S.filter(hasDealBadge)
    if (badgeFirst.length > 0) {
      return badgeFirst.slice(0, 6).map(s => ({
        id: s.id,
        title: s.dealTitle || s.name,
        service: s.dealDescription || s.shortDescription || s.description || 'Special promotion',
        location: s.displayLocation || s.provider?.businessName || '',
        discount: formatDiscount(s),
        code: s.promoCode || '—',
        image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service2.jpg',
        category: s.dealCategory || s.category?.name || 'Promotion',
        validUntil: s.dealValidUntil ? new Date(s.dealValidUntil).toLocaleDateString() : '',
      }))
    }

    // 2) Otherwise, use items with promo fields
    const promoList = S.filter(s => !!s?.isPromotional || !!s?.discountPercentage || !!s?.promoCode)
    if (promoList.length > 0) {
      return promoList.slice(0, 6).map(s => ({
        id: s.id,
        title: s.dealTitle || s.name,
        service: s.dealDescription || s.shortDescription || s.description || 'Special promotion',
        location: s.displayLocation || s.provider?.businessName || '',
        discount: (() => {
          const raw = s?.discountPercentage
          const num = typeof raw === 'number' ? raw : (typeof raw === 'string' ? parseFloat(raw) : NaN)
          return Number.isFinite(num) && num > 0 ? `${num}% OFF` : (s.isPromotional ? 'Deal' : '')
        })(),
        code: s.promoCode || '—',
        image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service2.jpg',
        category: s.dealCategory || s.category?.name || 'Promotion',
        validUntil: s.dealValidUntil ? new Date(s.dealValidUntil).toLocaleDateString() : '',
      }))
    }

    // 3) Final fallback to backend popular
    return P.slice(0, 6).map(s => ({
      id: s.id,
      title: s.name,
      service: s.shortDescription || s.description || 'Featured service',
      location: s.displayLocation || s.provider?.businessName || '',
      discount: '',
      code: '—',
      image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service2.jpg',
      category: s.category?.name || 'Service',
      validUntil: '',
    }))
  }, [services, popularFallback])

  const DealCard = ({ deal }: { deal: any }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={deal.image}
          alt={deal.service}
          className="w-full h-full object-cover"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium">
          {deal.category}
        </div>
        {/* Discount badge */}
        {deal.discount && (
          <div className="absolute top-3 right-3 bg-[#E89B8B] text-white px-3 py-1 rounded-full text-sm font-bold">
            {deal.discount}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{deal.title}</h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {deal.service}
        </p>
        <p className="text-xs text-gray-500 mb-3">{deal.location}</p>
        
        {/* Code and Valid Until */}
        <div className="flex items-center justify-between">
          <div className="bg-[#F5F0EF] px-2 py-1 rounded text-xs font-medium text-[#E89B8B]">
            Code: {deal.code}
          </div>
          {deal.validUntil && (
            <span className="text-xs text-gray-500">Valid until {deal.validUntil}</span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-light text-gray-800">Special Deals & Promotions</h3>
          <button 
            onClick={() => router.push('/services?filter=deals')}
            className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
          >
            View all
          </button>
        </div>
        {isLoading || isLoadingFallback ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (isError && isErrorFallback && deals.length === 0) ? (
          <div className="text-center text-gray-500">No promotions available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PromotionsDeals