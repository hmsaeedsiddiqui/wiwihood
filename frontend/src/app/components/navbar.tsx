'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      // Use the real backend API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/categories?isActive=true`)
      
      if (response.ok) {
        const data = await response.json()
        // Transform backend data to match navbar format
        const transformedCategories = data.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: getIconForCategory(category.name), // Helper function for icons
          description: category.description
        }))
        setCategories(transformedCategories)
      } else {
        // API failed - set empty array to show only real data
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // API error - set empty array to show only real data
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  // Helper function to get icon based on category name
  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'Hair Services': '✂️',
      'Nail Services': '💅',
      'Massage Services': '💆‍♀️',
      'Facial Services': '✨',
      'Beauty Services': '💄',
      'Wellness Services': '🧘‍♀️',
      'Spa Services': '🛁',
      'Makeup Services': '💄',
      'Eyebrow Services': '👁️',
      'Waxing Services': '🕯️'
    }
    return iconMap[categoryName] || '🌟'
  }

  // No hardcoded fallback categories - use only real API data

  // Load categories when component mounts or when categories menu is opened for first time
  useEffect(() => {
    // Only fetch if categories menu is opened and we don't have categories yet
    if (isCategoriesOpen && categories.length === 0 && !loadingCategories) {
      fetchCategories()
    }
  }, [isCategoriesOpen, categories.length, loadingCategories])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
        setIsCategoriesOpen(false)
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
    <nav className="bg-[#E89B8B] w-full mx-auto px-6 py-4 flex items-center justify-between fixed top-0 left-0 right-0 overflow-hidden z-[99997]">
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
        <Link href="/auth/provider/signup">
          <button className="bg-[#2C2C2C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500 transition-colors">
            List Your Business
          </button>
        </Link>
        
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
              <div className="fixed inset-0 z-[99998] bg-transparent" onClick={() => {
                setIsMenuOpen(false)
                setIsCategoriesOpen(false)
              }} />
              
              {/* Dropdown */}
              <div 
                className="navbar-dropdown fixed right-6 top-16 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-[99999]"
                style={{
                  zIndex: 999999,
                  position: 'fixed',
                  backgroundColor: 'white',
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v1a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V5a1 1 0 011 1v6.5M8 6V5a1 1 0 00-1 1v6.5" />
                  </svg>
                  <span className="font-medium">Services</span>
                </Link>
                
                {/* Categories with Submenu */}
                <div className="relative">
                  <button 
                    className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#E89B8B] hover:text-white transition-all duration-150 border-b border-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsCategoriesOpen(!isCategoriesOpen)
                    }}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">Categories</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 text-[#E89B8B] ${isCategoriesOpen ? 'rotate-90' : ''}`} 
                      fill="currentColor" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Categories Submenu */}
                  {isCategoriesOpen && (
                    <div className="ml-4 py-2 bg-gray-50 rounded-lg">
                      {loadingCategories ? (
                        <div className="flex items-center justify-center px-4 py-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E89B8B]"></div>
                          <span className="ml-2 text-sm text-gray-600">Loading...</span>
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <Link 
                            key={category.id}
                            href={`/services?category=${category.slug}`} 
                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-[#E89B8B] hover:text-white transition-all duration-150"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsMenuOpen(false)
                              setIsCategoriesOpen(false)
                            }}
                          >
                            {/* Custom SVG icons based on category name */}
                            {category.name === 'Hair Services' ? (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.14 2 5 5.14 5 9c0 3.31 2.24 6.09 5.27 6.81L9 17v5h2v-5h2v5h2v-5l-1.27-1.19C16.76 15.09 19 12.31 19 9c0-3.86-3.14-7-7-7z"/>
                              </svg>
                            ) : category.name === 'Nail Services' ? (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                              </svg>
                            ) : category.name === 'Massage Services' ? (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm7 7h-3v2h3c1.1 0 2-.9 2-2s-.9-2-2-2zm-14 2c0 1.1.9 2 2 2h3V9H5c-1.1 0-2 .9-2 2zm9 7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h-4v2zm-6 0v-2H4v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2z"/>
                              </svg>
                            ) : category.name === 'Facial Services' ? (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            ) : category.name === 'Beauty Services' ? (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                <path d="M19 7h-3V4h-2v3h-3v2h3v3h2V9h3V7z"/>
                              </svg>
                            ) : category.name === 'Wellness Services' ? (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            )}
                            <span>{category.name}</span>
                          </Link>
                        ))
                      ) : (
                        <div className="flex items-center px-4 py-2 text-sm text-gray-500">
                          <span>No categories available</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#E89B8B] hover:text-white transition-all duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                >
                  <svg className="w-5 h-5 mr-3 text-[#E89B8B]" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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

export default Navbar