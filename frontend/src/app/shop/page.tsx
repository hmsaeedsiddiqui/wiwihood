interface Shop {
  id: string;
  businessName: string;
  description?: string | null;
  city?: string;
  address?: string;
  logo?: string;
  averageRating?: number;
  totalReviews?: number;
  services?: Array<{
    id: string;
    name: string;
    category: { id: string; name: string };
  }>;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

"use client";


import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from '../../components/Footer';

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<string>('All Reviews');
  const [sortBy, setSortBy] = useState<string>('Recommended');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Dynamic filter options
  const [locationOptions, setLocationOptions] = useState<string[]>(['All Locations']);
  const reviewOptions = ['All Reviews', '4+ Stars', '3+ Stars', '2+ Stars', '1+ Stars'];
  const sortOptions = ['Recommended', 'Highest Rated', 'Most Reviews', 'A-Z', 'Z-A'];
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('Select...');

  // Handle search submission
  const handleSearch = () => {
    // Trigger filtering by updating state - the useEffect will handle the actual filtering
    const resultsSection = document.querySelector('[data-results-section]');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear all filters and search
  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchLocation('Select...');
    setSelectedCategory('');
    setSelectedLocation('All Locations');
    setSelectedReviewFilter('All Reviews');
    setSortBy('Recommended');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.category-dropdown')) {
        setShowCategoryFilter(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers?page=1&limit=100`)
      .then(res => res.json())
      .then(data => {
        // The backend returns { data: Provider[], ... } or { items: Provider[], ... } or { providers: Provider[], ... }
        // Try to support common patterns
        let providers = [];
        if (Array.isArray(data)) {
          providers = data;
        } else if (Array.isArray(data.items)) {
          providers = data.items;
        } else if (Array.isArray(data.providers)) {
          providers = data.providers;
        } else if (Array.isArray(data.data)) {
          providers = data.data;
        }
        setShops(providers);
        
        // Extract unique locations from shops
        const uniqueLocations = ['All Locations'];
        providers.forEach((shop: any) => {
          if (shop.city && !uniqueLocations.includes(shop.city)) {
            uniqueLocations.push(shop.city);
          }
          if (shop.businessCity && !uniqueLocations.includes(shop.businessCity)) {
            uniqueLocations.push(shop.businessCity);
          }
        });
        setLocationOptions(uniqueLocations);
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        const fetchedCategories = Array.isArray(data) ? data : data.categories || [];
        
        // Calculate category counts based on shops that offer services in each category
        const categoriesWithCounts = fetchedCategories.map((cat: any) => {
          const count = shops.filter(shop => 
            shop.services && shop.services.some(service => 
              service.category?.id === cat.id || service.category?.name === cat.name
            )
          ).length;
          return { ...cat, count };
        });
        
        setCategories(categoriesWithCounts);
      })
      .catch(() => setCategories([]));
  }, [shops]); // Re-run when shops data changes

  // Filter and sort shops whenever filters change
  useEffect(() => {
    let filtered = [...shops];

    // Apply search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(shop => 
        shop.businessName?.toLowerCase().includes(searchLower) ||
        (shop.description && shop.description.toString().toLowerCase().includes(searchLower)) ||
        (shop.city && shop.city.toLowerCase().includes(searchLower)) ||
        ((shop as any).businessCity && (shop as any).businessCity.toLowerCase().includes(searchLower)) ||
        (shop.services && shop.services.some(service => 
          service.name?.toLowerCase().includes(searchLower) ||
          service.category?.name?.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply search location filter
    if (searchLocation && searchLocation !== 'Select...' && searchLocation !== 'All Locations') {
      filtered = filtered.filter(shop => 
        shop.city?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        (shop as any).businessCity?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== '' && selectedCategory !== 'all') {
      filtered = filtered.filter(shop => 
        shop.services && shop.services.some(service => 
          service.category?.id === selectedCategory || service.category?.name === selectedCategory
        )
      );
    }

    // Apply location filter from filter bar
    if (selectedLocation && selectedLocation !== 'All Locations') {
      filtered = filtered.filter(shop => 
        shop.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        (shop as any).businessCity?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Apply review filter
    if (selectedReviewFilter && selectedReviewFilter !== 'All Reviews') {
      const minRating = parseInt(selectedReviewFilter.charAt(0));
      filtered = filtered.filter(shop => 
        (shop.averageRating || 0) >= minRating
      );
    }

    // Apply sorting
    switch (sortBy.toLowerCase()) {
      case 'highest rated':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'most reviews':
        filtered.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
        break;
      case 'a-z':
        filtered.sort((a, b) => a.businessName.localeCompare(b.businessName));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.businessName.localeCompare(a.businessName));
        break;
      default: // recommended
        filtered.sort((a, b) => {
          const aScore = (a.averageRating || 0) * (a.totalReviews || 0);
          const bScore = (b.averageRating || 0) * (b.totalReviews || 0);
          return bScore - aScore;
        });
    }

    setFilteredShops(filtered);
  }, [shops, searchTerm, searchLocation, selectedCategory, selectedLocation, selectedReviewFilter, sortBy]);

  // Trending Categories section (matches provided image)
  const trendingCategoriesSection = (
    <div style={{ background: '#fff', maxWidth: 1200, margin: '0 auto', marginTop: -32, borderRadius: 18, padding: '40px 32px 32px 32px', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: '-0.5px', margin: 0 }}>Trending Categories</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.08)', cursor: 'pointer', outline: 'none' }}>
            <span style={{ color: '#10b981', fontSize: 20, fontWeight: 700, display: 'inline-block', transform: 'rotate(180deg)' }}>&#8594;</span>
          </button>
          <button style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.08)', cursor: 'pointer', outline: 'none' }}>
            <span style={{ color: '#10b981', fontSize: 20, fontWeight: 700 }}>&#8594;</span>
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ flex: 1, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 8px rgba(30,41,59,0.02)', position: 'relative', minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#111', marginBottom: 4 }}>{cat.name}</div>
            <div style={{ color: '#6b7280', fontSize: 15, fontWeight: 500 }}>({cat.count} Shops)</div>
            <div style={{ position: 'absolute', top: 18, right: 18, width: 16, height: 16, background: '#111827', borderRadius: 4 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          {/* Active Filters Count */}
          {(selectedCategory || selectedLocation !== 'All Locations' || selectedReviewFilter !== 'All Reviews' || searchTerm || (searchLocation && searchLocation !== 'Select...')) && (
            <div style={{ 
              background: '#10b981', 
              color: '#fff', 
              borderRadius: 8, 
              padding: '8px 12px', 
              fontSize: 14, 
              fontWeight: 600 
            }}>
              {[
                selectedCategory ? 1 : 0,
                selectedLocation !== 'All Locations' ? 1 : 0,
                selectedReviewFilter !== 'All Reviews' ? 1 : 0,
                searchTerm ? 1 : 0,
                (searchLocation && searchLocation !== 'Select...') ? 1 : 0
              ].reduce((a, b) => a + b, 0)} Active Filters
            </div>
          )}

          {/* Categories Filter */}
          <div className="category-dropdown" style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              style={{ 
                background: selectedCategory ? '#10b981' : (showCategoryFilter ? '#e5e7eb' : '#f3f4f6'), 
                border: '1.5px solid #e5e7eb', 
                borderRadius: 8, 
                padding: '8px 18px', 
                fontWeight: 600, 
                color: selectedCategory ? '#fff' : '#222', 
                fontSize: 15, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <span style={{ width: 16, height: 16, background: selectedCategory ? '#fff' : '#111827', borderRadius: 4, display: 'inline-block' }}></span>
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Categories' : 'Categories'}
              <span style={{ fontSize: 12 }}>▼</span>
            </button>
            {showCategoryFilter && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 10,
                minWidth: 200,
                marginTop: 4
              }}>
                <button 
                  onClick={() => { setSelectedCategory(''); setShowCategoryFilter(false); }}
                  style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: selectedCategory === '' ? '#f3f4f6' : 'transparent', cursor: 'pointer' }}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setShowCategoryFilter(false); }}
                    style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: selectedCategory === cat.id ? '#f3f4f6' : 'transparent', cursor: 'pointer' }}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Locations Filter */}
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ 
              background: selectedLocation !== 'All Locations' ? '#10b981' : '#f3f4f6', 
              border: '1.5px solid #e5e7eb', 
              borderRadius: 8, 
              padding: '8px 18px', 
              fontWeight: 600, 
              color: selectedLocation !== 'All Locations' ? '#fff' : '#222', 
              fontSize: 15, 
              outline: 'none', 
              minWidth: 120,
              cursor: 'pointer'
            }}
          >
            {locationOptions.map((location) => (
              <option key={location} value={location} style={{ background: '#fff', color: '#222' }}>{location}</option>
            ))}
          </select>

          {/* Reviews Filter */}
          <select 
            value={selectedReviewFilter}
            onChange={(e) => setSelectedReviewFilter(e.target.value)}
            style={{ 
              background: selectedReviewFilter !== 'All Reviews' ? '#10b981' : '#f3f4f6', 
              border: '1.5px solid #e5e7eb', 
              borderRadius: 8, 
              padding: '8px 18px', 
              fontWeight: 600, 
              color: selectedReviewFilter !== 'All Reviews' ? '#fff' : '#222', 
              fontSize: 15, 
              outline: 'none', 
              minWidth: 120,
              cursor: 'pointer'
            }}
          >
            {reviewOptions.map((review) => (
              <option key={review} value={review} style={{ background: '#fff', color: '#222' }}>{review}</option>
            ))}
          </select>

          {/* Clear All Filters Button */}
          <button 
            onClick={clearAllFilters}
            style={{ 
              background: '#ef4444', 
              border: 'none', 
              borderRadius: 8, 
              padding: '8px 18px', 
              fontWeight: 600, 
              color: '#fff', 
              fontSize: 15, 
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Clear All
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div style={{ minWidth: 220, display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              background: '#111827', 
              border: 'none', 
              borderRadius: 6, 
              padding: '8px 18px', 
              fontWeight: 600, 
              color: '#fff', 
              fontSize: 15, 
              outline: 'none',
              cursor: 'pointer',
              minWidth: '100%'
            }}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option} style={{ background: '#111827', color: '#fff' }}>
                Sort by: {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
  // Hero section matching the design image
  const heroSection = (
    <div className="shop-hero-section">
      {/* Background Image with dark overlay */}
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1500&h=600&fit=crop&crop=center" 
          alt="Shop Background" 
          className="hero-bg-image"
        />
        <div className="hero-dark-overlay"></div>
      </div>
      
      {/* Content Container */}
      <div className="hero-content">
        <div className="hero-layout">
          {/* Left Side - Text and Search */}
          <div className="hero-left">
            <h1 className="hero-main-title">
              Find <span className="highlight-green">Trusted Providers</span> &<br />
              <span className="highlight-green">Book Services</span> at the<br />
              Best Prices
            </h1>
            <p className="hero-subtitle-new">
              Search for top-rated beauty, wellness, and healthcare providers near you.
            </p>
            
            {/* Search Bar */}
            <div className="hero-search-container">
              <input 
                type="text" 
                placeholder="Search shops, services, or locations..."
                className="hero-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <select 
                className="hero-location-select"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              >
                <option value="Select...">Select...</option>
                <option value="All Locations">All Locations</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Miami">Miami</option>
                <option value="San Francisco">San Francisco</option>
              </select>
              <button 
                className="hero-search-button"
                onClick={handleSearch}
              >
                Find Providers
              </button>
            </div>
            
            {/* Popular Searches */}
            <div className="hero-popular-searches">
              <span className="popular-label">Popular Searches:</span>
              <span className="popular-items">
                <button 
                  onClick={() => setSearchTerm('Haircuts')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    padding: 0,
                    margin: 0,
                    font: 'inherit'
                  }}
                >
                  Haircuts
                </button>
                , {' '}
                <button 
                  onClick={() => setSearchTerm('Massage')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    padding: 0,
                    margin: 0,
                    font: 'inherit'
                  }}
                >
                  Massage
                </button>
                , {' '}
                <button 
                  onClick={() => setSearchTerm('Facials')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    padding: 0,
                    margin: 0,
                    font: 'inherit'
                  }}
                >
                  Facials
                </button>
                .
              </span>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="hero-right">
            <div className="hero-image-frame">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=center" 
                alt="Professional Service" 
                className="hero-feature-image"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Diagonal cut */}
      <div className="hero-diagonal-cut"></div>
    </div>
  );

  return (
    <>
  {heroSection}
  <div style={{ height: 32 }} />
  {trendingCategoriesSection}
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }} data-results-section>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', color: '#222' }}>Shops</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {(searchTerm || searchLocation !== 'Select...' || selectedCategory || selectedLocation !== 'All Locations' || selectedReviewFilter !== 'All Reviews') && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 14,
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Clear Filters
                </button>
              )}
              <span style={{ color: '#6b7280', fontSize: 16 }}>
                {loading ? 'Loading...' : `${filteredShops.length} of ${shops.length} shops`}
              </span>
            </div>
          </div>
          
          {/* Active Search/Filter Indicators */}
          {(searchTerm || searchLocation !== 'Select...' || selectedCategory || selectedLocation !== 'All Locations' || selectedReviewFilter !== 'All Reviews') && (
            <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {searchTerm && (
                <span style={{ background: '#e5f9f6', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
                  Search: "{searchTerm}"
                </span>
              )}
              {searchLocation !== 'Select...' && (
                <span style={{ background: '#e5f9f6', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
                  Location: {searchLocation}
                </span>
              )}
              {selectedCategory && (
                <span style={{ background: '#e5f9f6', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
              {selectedLocation !== 'All Locations' && (
                <span style={{ background: '#e5f9f6', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
                  Filter Location: {selectedLocation}
                </span>
              )}
              {selectedReviewFilter !== 'All Reviews' && (
                <span style={{ background: '#e5f9f6', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
                  Reviews: {selectedReviewFilter}
                </span>
              )}
            </div>
          )}
          
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 18 }}>Loading shops...</div>
          ) : filteredShops.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              {shops.length === 0 ? 'No shops found.' : 'No shops match your current filters. Try adjusting your search criteria.'}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              {filteredShops.map((shop) => (
                <Link key={shop.id} href={`/shop/${shop.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(16,185,129,0.10)', width: 320, minHeight: 360, maxHeight: 360, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: 24, transition: 'transform 0.2s', cursor: 'pointer' }}>
                    <div style={{ height: 180, width: '100%', background: shop.logo ? `url(${shop.logo}) center/cover no-repeat` : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid #e5e7eb' }}>
                      {!shop.logo && (
                        <span style={{ color: '#9ca3af', fontSize: 48, fontWeight: 700 }}>🛍️</span>
                      )}
                    </div>
                    <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shop.businessName}</div>
                      <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: 44, maxHeight: 44 }}>{typeof shop.description === 'string' ? shop.description : shop.description || 'No description available'}</div>
                      <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>City: {shop.city || shop.address || ''}</div>
                      <div style={{ color: '#f59e42', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Rating: {shop.averageRating?.toFixed ? shop.averageRating.toFixed(1) : (shop.averageRating ?? 'N/A')} ({shop.totalReviews ?? 0} reviews)</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
  <Footer />
    </>
  );
}
