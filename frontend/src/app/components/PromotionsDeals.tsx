"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

const PromotionsDeals = () => {
  const router = useRouter();
  const deals = [
    {
      id: 1,
      title: 'First Visit Special',
      service: '25% OFF on your first appointment',
      location: 'Valid at all partner salons',
      discount: '25% OFF',
      code: 'FIRST25',
      image: '/service1.png',
      category: 'New Customer',
      validUntil: 'Oct 31'
    },
    {
      id: 2,
      title: 'Spa Package Deal',
      service: 'Complete spa experience package',
      location: 'Massage, Facial & Manicure included',
      discount: '40% OFF',
      code: 'SPA40',
      image: '/service2.jpg',
      category: 'Spa Combo',
      validUntil: 'Nov 15'
    },
    {
      id: 3,
      title: 'Weekend Special',
      service: 'Hair styling and makeup combo',
      location: 'Perfect for weekend events',
      discount: '30% OFF',
      code: 'WEEKEND30',
      image: '/service3.jpg',
      category: 'Weekend Deal',
      validUntil: 'Oct 25'
    }
  ]

  const DealCard = ({ deal }: { deal: typeof deals[0] }) => (
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
        <div className="absolute top-3 right-3 bg-[#E89B8B] text-white px-3 py-1 rounded-full text-sm font-bold">
          {deal.discount}
        </div>
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
          <span className="text-xs text-gray-500">Valid until {deal.validUntil}</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromotionsDeals