"use client"

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetServicesQuery } from '@/store/api/servicesApi'

function HotProduct() {
  const router = useRouter();
  // Fetch all active services for badge-driven selections
  const { data: activeServices = [], isLoading: loadingActive, isError: errorActive } = useGetServicesQuery({ isActive: true })
  // No fallback services - use only real API data matching badges

  // Map API services to card model
  // Popular this week: prefer badges Popular/Premium/Top Rated - ONLY SHOW 1 SERVICE
  const popularThisWeek = useMemo(() => {
    const S = (activeServices as any[])
    console.log('🔍 HotProduct: Total active services received:', S.length, S.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    // Popular This Week: Only Top Rated badge (excluding Best Seller for more specificity)
    const popularBadges = ['popular', 'premium', 'top rated', 'top-rated', 'trending', 'most popular']
    const withBadges = S.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase()
      return popularBadges.some(b => badge === b || badge.includes(b))
    })
    console.log('🔍 HotProduct: Popular badges matched:', withBadges.length, withBadges.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    // ONLY SHOW 1 SERVICE for Popular this week as requested
    const base = withBadges.slice(0, 1)
    if (!base || base.length === 0) return []
    return base.map((s: any, idx: number) => ({
      id: s.id || idx,
      title: s.provider?.businessName || 'Featured Provider',
      service: s.name,
      location: s.displayLocation || s.category?.name || '—',
      rating: s.averageRating || 4.6,
      reviews: s.totalReviews || Math.floor(Math.random() * 50) + 10,
      image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service1.png',
      category: s.category?.name || 'Service'
    }))
  }, [activeServices])

  // New on vividhood: prefer badges
  const newOnVividhood = useMemo(() => {
    const S = (activeServices as any[])
    console.log('🔍 HotProduct: Checking for New badges in:', S.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    // New on Platform: New, New on vividhood, Recently added badges
    const newBadges = ['new', 'new on vividhood', 'new on wiwihood', 'new on', 'recently added', 'latest']
    const withBadges = S.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase()
      return newBadges.some(b => badge === b || badge.includes(b))
    })
    console.log('🔍 HotProduct: New badges matched:', withBadges.length, withBadges.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    const base = withBadges.slice(0, 3)
    if (!base || base.length === 0) return []
    return base.map((s: any, idx: number) => ({
      id: s.id || idx,
      title: s.provider?.businessName || 'Featured Provider',
      service: s.name,
      location: s.displayLocation || s.category?.name || '—',
      rating: s.averageRating || 4.6,
      reviews: s.totalReviews || Math.floor(Math.random() * 50) + 10,
      image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service2.jpg',
      category: s.category?.name || 'Service'
    }))
  }, [activeServices])

  // Best Sellers section: only Best Seller badges
  const bestSellers = useMemo(() => {
    const S = (activeServices as any[])
    console.log('🔍 HotProduct: Checking for Best Seller badges in:', S.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    // Best Sellers: Best Seller badges only
    const bestSellerBadges = ['best seller', 'best-seller', 'bestseller', 'top seller']
    const withBadges = S.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase()
      return bestSellerBadges.some(b => badge === b || badge.includes(b))
    })
    console.log('🔍 HotProduct: Best Seller badges matched:', withBadges.length, withBadges.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    const base = withBadges.slice(0, 3)
    if (!base || base.length === 0) return []
    return base.map((s: any, idx: number) => ({
      id: s.id || idx,
      title: s.provider?.businessName || 'Featured Provider',
      service: s.name,
      location: s.displayLocation || s.category?.name || '—',
      rating: s.averageRating || 4.6,
      reviews: s.totalReviews || Math.floor(Math.random() * 50) + 10,
      image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service3.jpg',
      category: s.category?.name || 'Service'
    }))
  }, [activeServices])

  // Hot Deals section: only Hot Deal badges
  const hotDeals = useMemo(() => {
    const S = (activeServices as any[])
    console.log('🔍 HotProduct: Checking for Hot Deal badges in:', S.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    // Hot Deals: Hot Deal badges only
    const hotDealBadges = ['hot deal', 'hot-deal', 'deal', 'limited time', 'special offer', 'promotion']
    const withBadges = S.filter(s => {
      const badge = (s?.adminAssignedBadge || '').toString().toLowerCase()
      return hotDealBadges.some(b => badge === b || badge.includes(b))
    })
    console.log('🔍 HotProduct: Hot Deal badges matched:', withBadges.length, withBadges.map(s => ({ name: s.name, badge: s.adminAssignedBadge })))
    const base = withBadges.slice(0, 3)
    if (!base || base.length === 0) return []
    return base.map((s: any, idx: number) => ({
      id: s.id || idx,
      title: s.provider?.businessName || 'Featured Provider',
      service: s.name,
      location: s.displayLocation || s.category?.name || '—',
      rating: s.averageRating || 4.6,
      reviews: s.totalReviews || Math.floor(Math.random() * 50) + 10,
      image: s.featuredImage || (Array.isArray(s.images) ? s.images[0] : undefined) || '/service4.jpg',
      category: s.category?.name || 'Service'
    }))
  }, [activeServices])

  type CardService = {
    id: string | number
    title: string
    service: string
    location: string
    rating: number
    reviews: number
    image: string
    category: string
  }

  const ServiceCard = ({ service }: { service: CardService }) => (
    <div 
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => router.push(`/services/${service.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.service}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium">
          {service.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#E89B8B] transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {service.service}
        </p>
        <p className="text-xs text-gray-500 mb-3">{service.location}</p>
        
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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('/service-bg.jpg')"}}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-90"></div>
        
        {/* Banner shape overlay */}
        <div className="absolute top-0 left-0 w-[166px] h-[153px]">
          <img 
            src="/banner-3-shape.png" 
            alt="Decorative shape"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-800 mb-4">What's hot right now</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Beyond the most popular treatments, our staff reviews and selections bring you 
            brand-new professionals on Wiwihood.
          </p>
        </div>

        {/* Popular this week section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-light text-gray-800">Popular this week</h3>
            <button className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors">
              View all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularThisWeek.map((service) => (
              <ServiceCard key={`popular-${service.id}`} service={service} />
            ))}
          </div>
        </div>

        {/* Best Sellers section */}
        {bestSellers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-gray-800">Best Sellers</h3>
              <button 
                onClick={() => router.push('/services?filter=bestseller')}
                className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
              >
                View all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((service) => (
                <ServiceCard key={`bestseller-${service.id}`} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Hot Deals section */}
        {hotDeals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-gray-800">Hot Deals</h3>
              <button 
                onClick={() => router.push('/services?filter=deals')}
                className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
              >
                View all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotDeals.map((service) => (
                <ServiceCard key={`hotdeal-${service.id}`} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* New on vividhood section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-light text-gray-800">New on Wiwihood</h3>
            <button 
              onClick={() => router.push('/services?filter=new')}
              className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
            >
              View all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newOnVividhood.map((service) => (
              <ServiceCard key={`new-${service.id}`} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HotProduct