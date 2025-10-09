'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, User, Heart, ShoppingBag, Phone, MapPin, ChevronDown } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => setMounted(true), []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Import API service dynamically to avoid SSR issues
        const { apiService } = await import('@/lib/api');
        const cats = await apiService.getCategories(true);
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback categories if API fails
        setCategories([
          { id: 1, name: 'Hair Cut', slug: 'haircut' },
          { id: 2, name: 'Nails', slug: 'nails' },
          { id: 3, name: 'Massage', slug: 'massage' },
          { id: 4, name: 'Facial', slug: 'facial' },
          { id: 5, name: 'Spa Services', slug: 'spa' },
          { id: 6, name: 'Beauty Treatment', slug: 'beauty' }
        ]);
      }
    };
    
    fetchCategories();
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="relative z-50">
      {/* Transparent Navbar - Not Full Width */}
      <div className="absolute top-0 left-0 w-full" style={{
        background: 'linear-gradient(135deg, #FFB5B5 0%, #FFC4A3 50%, #FFD3CC 100%)'
      }}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl font-bold text-white">vivihood</span>
            </Link>

            {/* Right Side Buttons */}
            <div className="flex items-center space-x-3">
              {/* Sign Up/Login Button */}
              <Link href="/auth/login">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/90 text-gray-800 rounded-full font-medium hover:bg-white transition-colors text-sm backdrop-blur-sm">
                  <User className="h-4 w-4" />
                  <span>Login/Signup</span>
                </button>
              </Link>

              {/* List Your Business Button */}
              <Link href="/provider/signup">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors text-sm">
                  List Your Business
                </button>
              </Link>

              {/* Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/90 text-gray-800 rounded-full font-medium hover:bg-white transition-colors text-sm backdrop-blur-sm"
              >
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </button>

              {/* Mobile Menu Button (for very small screens) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-white hover:text-orange-200 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {/* Navigation Menu - Not Full Width */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay for click outside */}
          <div 
            className="fixed inset-0 bg-black/20 z-30" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="bg-white border border-gray-200 absolute top-full right-4 lg:right-8 w-80 lg:w-96 z-40 shadow-xl rounded-lg overflow-hidden">
            <div className="py-6 px-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Navigation</h3>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 px-3 rounded-lg font-medium transition-colors hover:bg-orange-50 ${
                      pathname === item.href
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Categories Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-2 px-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <div className="col-span-2 text-center py-4 text-gray-500">
                      Loading categories...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </header>
  );
}