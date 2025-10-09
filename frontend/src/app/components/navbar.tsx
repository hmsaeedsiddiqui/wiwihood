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
      // Replace with your actual backend API endpoint
      const response = await fetch('/api/categories')
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      } else {
        // Fallback to default categories if API fails
        setCategories([
          { id: 1, name: 'Hair Services', slug: 'hair', icon: '✂️' },
          { id: 2, name: 'Nail Services', slug: 'nail', icon: '💅' },
          { id: 3, name: 'Massage Services', slug: 'massage', icon: '💆‍♀️' },
          { id: 4, name: 'Facial Services', slug: 'facial', icon: '✨' },
          { id: 5, name: 'Beauty Services', slug: 'beauty', icon: '💄' },
          { id: 6, name: 'Wellness Services', slug: 'wellness', icon: '🧘‍♀️' }
        ])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to default categories
      setCategories([
        { id: 1, name: 'Hair Services', slug: 'hair', icon: '✂️' },
        { id: 2, name: 'Nail Services', slug: 'nail', icon: '💅' },
        { id: 3, name: 'Massage Services', slug: 'massage', icon: '💆‍♀️' },
        { id: 4, name: 'Facial Services', slug: 'facial', icon: '✨' },
        { id: 5, name: 'Beauty Services', slug: 'beauty', icon: '💄' },
        { id: 6, name: 'Wellness Services', slug: 'wellness', icon: '🧘‍♀️' }
      ])
    } finally {
      setLoadingCategories(false)
    }
  }

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
        <div className="flex items-center text-white cursor-pointer">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm">Login/Signup</span>
        </div>
        
        {/* List Your Business Button */}
        <button className="bg-[#2C2C2C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-500 transition-colors">
          List Your Business
        </button>
        
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
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">Categories</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-90' : ''}`} 
                      fill="none" 
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
                            href={`/category/${category.slug}`} 
                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-[#E89B8B] hover:text-white transition-all duration-150"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsMenuOpen(false)
                              setIsCategoriesOpen(false)
                            }}
                          >
                            <span className="text-2xl mr-3">{category.icon}</span>
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
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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