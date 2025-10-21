"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetPopularServicesQuery } from '@/store/api/servicesApi'

const PopularServices = () => {
  const router = useRouter();
  const { data: popular = [], isLoading, isError } = useGetPopularServicesQuery({ limit: 6 })

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
        {
          isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#F5F0EF] border-2 border-[#E89B8B] rounded-2xl p-6 animate-pulse h-36" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-gray-500">Failed to load popular services.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {popular.map((svc: any, index: number) => (
                <div
                  key={svc.id || index}
                  onClick={() => goToServices(svc)}
                  className={`bg-[#F5F0EF] border-2 border-[#E89B8B] hover:bg-[#F0E6E4] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center group`}
                >
                  <div className="mb-3 flex justify-center h-12 items-center overflow-hidden">
                    {svc.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={svc.featuredImage} alt={svc.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <svg className="w-12 h-12 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9M21 9H9M21 13H9M21 17H9" />
                      </svg>
                    )}
                  </div>
                  <p className="text-base font-medium text-gray-700 truncate" title={svc.name}>{svc.name}</p>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </section>
  )
}

export default PopularServices