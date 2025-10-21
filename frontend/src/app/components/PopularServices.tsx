"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetCategoriesQuery } from '@/store/api/providersApi'
import { Scissors, Hand, Sparkles, Eye, Droplets, Leaf, HeartPulse } from 'lucide-react'

const PopularServices = () => {
  const router = useRouter()
  const { data: categories = [], isLoading: loadingCats, isError: catsError } = useGetCategoriesQuery({ isActive: true })

  // Theme-aligned icons (Lucide) based on category names
  const getIconForCategory = (name: string) => {
    const n = (name || '').toLowerCase()
    const commonProps = { className: 'w-4 h-4 text-[#D4876F]' }
    if (n.includes('hair')) return <Scissors {...commonProps} />
    if (n.includes('nail')) return <Hand {...commonProps} />
    if (n.includes('massage') || n.includes('wellness')) return <HeartPulse {...commonProps} />
    if (n.includes('spa')) return <Droplets {...commonProps} />
    if (n.includes('facial') || n.includes('skin')) return <Droplets {...commonProps} />
    if (n.includes('beauty') || n.includes('makeup')) return <Sparkles {...commonProps} />
    if (n.includes('eyebrow') || n.includes('lash')) return <Eye {...commonProps} />
    if (n.includes('beard') || n.includes('shave')) return <Scissors {...commonProps} />
    return <Leaf {...commonProps} />
  }

  // Sort categories: featured first, then by sortOrder, then name
  const categoriesSorted = React.useMemo(() => {
    return [...(categories as any[])]
      .sort((a, b) => (b?.isFeatured === true ? 1 : 0) - (a?.isFeatured === true ? 1 : 0))
      .sort((a, b) => {
        const ao = typeof a?.sortOrder === 'number' ? a.sortOrder : 9999
        const bo = typeof b?.sortOrder === 'number' ? b.sortOrder : 9999
        return ao - bo
      })
      .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
  }, [categories])

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50/40 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800">Explore Categories</h2>
          <p className="mt-2 text-gray-600">Find services faster by browsing our most popular categories</p>
          <button
            onClick={() => router.push('/browse')}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E89B8B] text-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-[#D4876F] transition-colors"
          >
            View all categories
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>

        {/* Categories content */}
        {loadingCats ? (
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-11 w-40 rounded-full bg-white shadow-sm ring-1 ring-gray-200 animate-pulse" />
            ))}
          </div>
        ) : catsError ? (
          <div className="text-center text-gray-500">Unable to load categories right now.</div>
        ) : categoriesSorted.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesSorted.slice(0, 20).map((cat: any) => (
              <button
                key={cat.id}
                aria-label={`Browse ${cat.name}`}
                onClick={() => router.push(cat?.slug ? `/category/${cat.slug}` : `/services?categoryId=${cat.id}`)}
                className="group relative shrink-0 pl-2 pr-3 h-11 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                title={cat.name}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-rose-100 ring-1 ring-rose-100">
                  {getIconForCategory(cat.name)}
                </span>
                <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#E89B8B] transition-colors" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                {cat?.isFeatured ? (
                  <span className="absolute -top-2 -right-2 rounded-full bg-[#E89B8B] text-white text-[10px] px-2 py-0.5 shadow">Featured</span>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No categories available yet.</div>
        )}
      </div>
    </section>
  )
}

export default PopularServices