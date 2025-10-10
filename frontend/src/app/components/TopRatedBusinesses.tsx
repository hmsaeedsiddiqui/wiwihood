"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

const TopRatedBusinesses = () => {
  const router = useRouter()
  
  const businesses = [
    {
      id: 1,
      name: 'Glamour Studio',
      service: 'Premium Hair & Makeup Services',
      location: 'Dubai Marina, Near JBR',
      rating: 4.9,
      reviews: 247,
      image: '/service1.png',
      category: 'Hair & Makeup'
    },
    {
      id: 2,
      name: 'Serenity Spa',
      service: 'Relaxing Massage & Facial Treatments',
      location: 'Downtown Dubai, DIFC',
      rating: 4.8,
      reviews: 189,
      image: '/service2.jpg',
      category: 'Spa & Wellness'
    },
    {
      id: 3,
      name: 'Elite Beauty',
      service: 'Professional Nails & Eyebrow Care',
      location: 'Jumeirah, Near Mall',
      rating: 4.7,
      reviews: 312,
      image: '/service3.jpg',
      category: 'Beauty Care'
    }
  ]

  const BusinessCard = ({ business }: { business: typeof businesses[0] }) => (
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopRatedBusinesses