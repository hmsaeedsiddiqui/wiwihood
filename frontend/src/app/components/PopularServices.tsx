"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

const PopularServices = () => {
  const router = useRouter();
  const services = [
    { 
      name: 'Hair Cut', 
      icon: (
        <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9M21 9H9M21 13H9M21 17H9" />
        </svg>
      ), 
      color: 'bg-[#F5F0EF] border-[#E89B8B] hover:bg-[#F0E6E4]' 
    },
    { 
      name: 'Facial', 
      icon: (
        <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          <circle cx="15" cy="9" r="1.5" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13s1.5 2 4 2 4-2 4-2" />
        </svg>
      ), 
      color: 'bg-[#F5F0EF] border-[#E89B8B] hover:bg-[#F0E6E4]' 
    },
    { 
      name: 'Massage', 
      icon: (
        <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M12 8v8M9 12h6" />
        </svg>
      ), 
      color: 'bg-[#F5F0EF] border-[#E89B8B] hover:bg-[#F0E6E4]' 
    },
    { 
      name: 'Manicure', 
      icon: (
        <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l4-4h6l-4 4M3 17l4-4V7a4 4 0 118 0v6l4 4" />
        </svg>
      ), 
      color: 'bg-[#F5F0EF] border-[#E89B8B] hover:bg-[#F0E6E4]' 
    },
    { 
      name: 'Eyebrows', 
      icon: (
        <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8c1.5-1 3-1 6-1s4.5 0 6 1M6 8c-1 .5-1.5 1.5-1.5 2.5M18 8c1 .5 1.5 1.5 1.5 2.5" />
        </svg>
      ), 
      color: 'bg-[#F5F0EF] border-[#E89B8B] hover:bg-[#F0E6E4]' 
    },
    { 
      name: 'Spa', 
      icon: (
        <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ), 
      color: 'bg-[#F5F0EF] border-[#E89B8B] hover:bg-[#F0E6E4]' 
    }
  ]

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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`${service.color} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center group`}
            >
              <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <p className="text-base font-medium text-gray-700">{service.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularServices