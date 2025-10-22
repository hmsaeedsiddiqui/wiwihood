"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetCategoriesQuery } from '@/store/api/providersApi'

const PopularServices = () => {
  const router = useRouter()
  const { data: categories = [], isLoading: loadingCats, isError: catsError } = useGetCategoriesQuery({ isActive: true })

  // Get theme-appropriate icon for each category
  const getCategoryIcon = (name: string) => {
    const n = (name || '').toLowerCase()
    
    if (n.includes('hair')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2s-3 3-3 9c0 3 1 6 3 6s3-3 3-6c0-6-3-9-3-9z"/>
          <path d="M12 17v5"/>
          <path d="M9 20h6"/>
        </svg>
      )
    }
    
    if (n.includes('nail')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="4" ry="3"/>
          <ellipse cx="12" cy="12" rx="6" ry="5"/>
          <path d="M12 17v5"/>
        </svg>
      )
    }
    
    if (n.includes('massage') || n.includes('spa') || n.includes('wellness')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.16.21 2.76.21 3.92 0 5.16-1 9-5.45 9-11V7z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    }
    
    if (n.includes('facial') || n.includes('skin')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="9" cy="9" r="1"/>
          <circle cx="15" cy="9" r="1"/>
          <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
        </svg>
      )
    }
    
    if (n.includes('beauty') || n.includes('makeup')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L8 7v8a4 4 0 0 0 8 0V7z"/>
          <path d="M8 7h8"/>
          <circle cx="12" cy="18" r="3"/>
        </svg>
      )
    }
    
    if (n.includes('eyebrow') || n.includes('lash') || n.includes('eye')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )
    }
    
    if (n.includes('beard') || n.includes('shave')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C8 2 5 5 5 9v4c0 3 1 6 3 8h8c2-2 3-5 3-8V9c0-4-3-7-7-7z"/>
          <path d="M8 15c1 1 2 1 4 1s3 0 4-1"/>
        </svg>
      )
    }
    
    // Default star icon
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    )
  }

  // Sort categories: featured first, then by sortOrder, then name
  const categoriesSorted = React.useMemo(() => {
    return [...(categories as any[])]
      .sort((a, b) => {
        // Featured first
        if (a?.isFeatured && !b?.isFeatured) return -1
        if (!a?.isFeatured && b?.isFeatured) return 1
        
        // Then by sortOrder
        const ao = typeof a?.sortOrder === 'number' ? a.sortOrder : 9999
        const bo = typeof b?.sortOrder === 'number' ? b.sortOrder : 9999
        if (ao !== bo) return ao - bo
        
        // Finally by name
        return (a?.name || '').localeCompare(b?.name || '')
      })
  }, [categories])

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-3">Explore Categories</h2>
          <p className="text-gray-600 mb-6">Find services faster by browsing our most popular categories</p>
          <button
            onClick={() => router.push('/browse')}
            className="inline-flex items-center gap-2 rounded-full bg-[#E89B8B] text-white px-6 py-2.5 text-sm font-medium shadow-sm hover:bg-[#D4876F] hover:shadow-md transition-all duration-200"
          >
            View all categories
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Categories content */}
        {loadingCats ? (
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 w-44 rounded-full bg-white shadow-sm ring-1 ring-gray-200 animate-pulse" />
            ))}
          </div>
        ) : catsError ? (
          <div className="text-center text-gray-500 py-8">Unable to load categories right now.</div>
        ) : categoriesSorted.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesSorted.slice(0, 20).map((cat: any) => (
              <button
                key={cat.id}
                aria-label={`Browse ${cat.name}`}
                onClick={() => router.push(cat?.slug ? `/category/${cat.slug}` : `/services?categoryId=${cat.id}`)}
                className="group relative shrink-0 pl-3 pr-4 h-12 rounded-full bg-white/95 backdrop-blur border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#E89B8B]/30 transition-all duration-200 flex items-center gap-3"
                title={cat.name}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E89B8B]/10 to-[#E89B8B]/20 text-[#E89B8B] group-hover:from-[#E89B8B]/20 group-hover:to-[#E89B8B]/30 transition-colors">
                  {getCategoryIcon(cat.name)}
                </span>
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{cat.name}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#E89B8B] transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                {cat?.isFeatured && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-[#E89B8B] text-white text-[10px] px-2 py-0.5 shadow-sm font-medium">
                    Featured
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No categories available yet.</div>
        )}
      </div>
    </section>
  )
}

export default PopularServices