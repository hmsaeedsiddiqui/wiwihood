"use client"

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetServicesQuery } from '@/store/api/servicesApi'

const NewOnWiwihood = () => {
  const router = useRouter()
  const { data: services = [], isLoading, isError } = useGetServicesQuery({ isActive: true })

  const items = useMemo(() => {
    const S = services as any[]
    // Support both spellings the admin may use
    const list = S.filter(s => {
      const b = (s?.adminAssignedBadge || '').toString().toLowerCase()
      return b.includes('new on wiwihood') || b.includes('new on vividhood')
    })
    return list.slice(0, 6)
  }, [services])

  const goTo = (svc: any) => {
    if (svc?.category?.id) router.push(`/services?categoryId=${svc.category.id}`)
    else router.push('/services')
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-light text-gray-800">New on Wiwihood</h3>
          <button
            onClick={() => router.push('/services?filter=new')}
            className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D4876F] transition-colors"
          >
            View all
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-gray-500">Failed to load new services.</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">No new services right now.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {items.map((svc: any) => (
              <div
                key={svc.id}
                onClick={() => goTo(svc)}
                className="bg-[#F5F0EF] border-2 border-[#E89B8B] hover:bg-[#F0E6E4] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center group"
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
        )}
      </div>
    </section>
  )
}

export default NewOnWiwihood
