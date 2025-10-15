'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { QRTIntegration } from '@/utils/qrtIntegration'
import { checkProviderAuth } from '@/utils/providerAuth'
import { useServicesQuery } from '@/store/api/servicesApi'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive?: boolean
}

interface ApprovedService {
  id: string
  name: string
  shortDescription: string
  categoryId: string
  isActive: boolean
  isApproved: boolean
  approvalStatus: string
  category?: Category
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch approved services
  const { 
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError
  } = useServicesQuery({
    filters: {
      isApproved: true,
      isActive: true,
      approvalStatus: 'APPROVED'
    }
  });

  const approvedServices = servicesData?.services || [];

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoriesData = await QRTIntegration.getCategories()
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback categories
        setCategories([
          { id: 'hair-services', name: 'Hair Services', slug: 'hair-services' },
          { id: 'beauty-services', name: 'Beauty Services', slug: 'beauty-services' },
          { id: 'spa-wellness', name: 'Spa & Wellness', slug: 'spa-wellness' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <nav className="bg-[#E89B8B] w-full mx-auto px-6 py-4 flex items-center justify-between relative overflow-hidden z-50">
       {/* 🌊 Vector Overlay (Bottom) */}
      <div className="absolute left-0 -bottom-5 w-full translate-y-3 opacity-70">
  <img
    src="/Vector-overlay.svg"
    alt="Vector overlay bottom"
    className="w-full h-auto color-[#D9D9D9]"
  />
</div>

      
      {/* Logo */}
      <div className="text-white font-light text-2xl relative z-10">
        vividhood
      </div>
      
      {/* Right side buttons */}
      <div className="flex items-center space-x-4 relative z-10">
        {/* Login/Signup */}
        <Link href="/auth/login">
          <div className="flex items-center text-white cursor-pointer hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">Login/Signup</span>
          </div>
        </Link>
        
        {/* List Your Business Button */}
        <ListYourBusinessButton />
        
        {/* Menu Button with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            className="bg-white text-[#E89B8B] px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <span className="mr-2">Menu</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop overlay */}
              <div className="fixed inset-0 z-[9998] bg-transparent bg-opacity-10" onClick={() => setIsMenuOpen(false)} />
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-[9999]"
                   style={{
                     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                   }}>
                <Link 
                  href="/about" 
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#E89B8B] hover:text-white transition-all duration-150 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                >
                  <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium">About Us</span>
                </Link>
                
                <Link 
                  href="/services" 
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#E89B8B] hover:text-white transition-all duration-150 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                >
                  <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">All Services</span>
                </Link>

                {/* Dynamic Categories with Approved Services */}
                {loading || servicesLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Loading categories...</div>
                ) : (
                  <>
                    {/* Show categories that have approved services */}
                    {categories.map((category) => {
                      const categoryServices = approvedServices.filter(service => 
                        service.categoryId === category.id || 
                        service.category?.id === category.id
                      );
                      
                      // Only show category if it has approved services
                      if (categoryServices.length === 0) return null;

                      return (
                        <div key={category.id} className="border-b border-gray-100">
                          {/* Category Header */}
                          <Link 
                            href={`/services?category=${category.slug}`}
                            className="flex items-center px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-[#E89B8B]/10 transition-all duration-150 bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsMenuOpen(false)
                            }}
                          >
                            <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9M21 9H9M21 13H9M21 17H9" />
                            </svg>
                            <span>{category.name}</span>
                            <span className="ml-auto text-xs bg-[#E89B8B] text-white px-2 py-1 rounded-full">
                              {categoryServices.length}
                            </span>
                          </Link>
                          
                          {/* Category Services */}
                          {categoryServices.slice(0, 5).map((service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.id}`}
                              className="flex items-center pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-[#E89B8B]/5 hover:text-[#E89B8B] transition-all duration-150"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsMenuOpen(false)
                              }}
                            >
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="truncate">{service.name}</span>
                            </Link>
                          ))}
                          
                          {/* Show more services link if there are more than 5 */}
                          {categoryServices.length > 5 && (
                            <Link
                              href={`/services?category=${category.slug}`}
                              className="flex items-center pl-8 pr-4 py-2 text-sm text-[#E89B8B] hover:bg-[#E89B8B]/5 transition-all duration-150 font-medium"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsMenuOpen(false)
                              }}
                            >
                              <span>View all {categoryServices.length} services →</span>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Show message if no approved services found */}
                    {approvedServices.length === 0 && (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-sm">No approved services available</p>
                        <p className="text-xs text-gray-400 mt-1">Services will appear here after admin approval</p>
                      </div>
                    )}
                  </>
                )}
                
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#E89B8B] hover:text-white transition-all duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                >
                  <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253 M12 9 L16 12 L12 15 L8 12 Z" />
                  </svg>
                  <span className="font-medium">Services</span>
                </Link>
                
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#E89B8B] hover:text-white transition-all duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                >
                  <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Home</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// Component for provider-specific business listing button
function ListYourBusinessButton() {
  const handleBusinessListingClick = () => {
    const { isProvider, isRegistered } = checkProviderAuth();
    
    if (isProvider) {
      // If already logged in as provider, go to dashboard
      window.location.href = '/provider/dashboard';
    } else if (isRegistered) {
      // If was registered but token expired, show login page
      window.location.href = '/auth/provider/login';
    } else {
      // If never registered, show signup page
      window.location.href = '/auth/provider/signup';
    }
  };

  return (
    <button 
      onClick={handleBusinessListingClick}
      className="bg-[#2C2C2C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500 transition-colors"
    >
      List Your Business
    </button>
  );
}

export default Navbar