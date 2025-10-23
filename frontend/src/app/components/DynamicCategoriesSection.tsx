"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetCategoriesQuery } from '@/store/api/providersApi'

const DynamicCategoriesSection = () => {
  const router = useRouter()
  const { data: categories = [], isLoading } = useGetCategoriesQuery({ isActive: true })

  // Get theme-appropriate icon for each category
  const getCategoryIcon = (name: string) => {
    const n = (name || '').toLowerCase()
    
    if (n.includes('hair')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2s-3 3-3 9c0 3 1 6 3 6s3-3 3-6c0-6-3-9-3-9z"/>
          <path d="M12 17v5"/>
          <path d="M9 20h6"/>
        </svg>
      )
    }
    
    if (n.includes('nail')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="4" ry="3"/>
          <ellipse cx="12" cy="12" rx="6" ry="5"/>
          <path d="M12 17v5"/>
        </svg>
      )
    }
    
    if (n.includes('massage') || n.includes('spa') || n.includes('wellness')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.16.21 2.76.21 3.92 0 5.16-1 9-5.45 9-11V7z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    }
    
    if (n.includes('facial') || n.includes('skin')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="9" cy="9" r="1"/>
          <circle cx="15" cy="9" r="1"/>
          <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
        </svg>
      )
    }
    
    if (n.includes('makeup') || n.includes('beauty')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    }
    
    // Default icon
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-light text-center text-gray-800 mb-4">
            Popular Services
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Choose from our most popular categories
          </p>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories.length) {
    return null // Don't show empty section
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light text-center text-gray-800 mb-4">
          Popular Services
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Choose from our most popular categories
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.slice(0, 12).map((category) => (
            <div
              key={category.id}
              onClick={() => router.push(`/services?category=${encodeURIComponent(category.name)}`)}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#FFF8F1] rounded-full flex items-center justify-center mb-4 text-[#E89B8B] group-hover:bg-[#E89B8B] group-hover:text-white transition-colors">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {category.description.length > 30 
                      ? `${category.description.substring(0, 30)}...` 
                      : category.description
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {categories.length > 12 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => router.push('/services')}
              className="bg-[#E89B8B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D4876F] transition-colors"
            >
              View All Categories
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default DynamicCategoriesSection