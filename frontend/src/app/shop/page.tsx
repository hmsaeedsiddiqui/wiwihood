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

  // Trending Categories section with Tailwind CSS
  const trendingCategoriesSection = (
    <div className="bg-white max-w-[1400px] mx-auto w-[95%] -mt-8 rounded-2xl py-10 relative z-[2]">
      <div className="flex justify-between items-center flex-wrap mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight m-0">Trending Categories</h2>
        <div className="flex gap-2 ">
          <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer outline-none transition-shadow duration-200">
            <span className="text-emerald-600 text-xl font-bold inline-block rotate-180">&#8594;</span>
          </button>
          <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer outline-none transition-shadow duration-200">
            <span className="text-emerald-600 text-xl font-bold">&#8594;</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border-[1.5px] border-gray-200 rounded-xl px-6 py-5 flex flex-col justify-center shadow-sm hover:shadow-md relative min-w-[180px] transition-shadow duration-200">
        <div className="font-bold text-lg text-gray-900 mb-1">{cat.name}</div>
        <div className="text-gray-500 text-sm font-medium">({cat.count} Shops)</div>
        <div className="absolute top-6 right-4 w-4 h-4 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mb-5 justify-center flex-wrap">
        <div className="flex-1 flex gap-2 flex-wrap">
          {/* Active Filters Count */}
          {(selectedCategory || selectedLocation !== 'All Locations' || selectedReviewFilter !== 'All Reviews' || searchTerm || (searchLocation && searchLocation !== 'Select...')) && (
            <div className="bg-emerald-600 text-white rounded-lg px-3 py-2 text-sm font-semibold">
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
          <div className="category-dropdown relative">
            <button 
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className={`border-[1.5px] border-gray-200 rounded-lg px-4 py-2 font-semibold text-sm flex items-center gap-2 cursor-pointer outline-none transition-colors duration-200 ${
                selectedCategory 
                  ? 'bg-emerald-600 text-white' 
                  : showCategoryFilter 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className={`w-4 h-4 rounded inline-block ${
                selectedCategory ? 'bg-white' : 'bg-gray-800'
              }`}></span>
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Categories' : 'Categories'}
              <span className="text-xs">▼</span>
            </button>
            {showCategoryFilter && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] mt-1">
                <button 
                  onClick={() => { setSelectedCategory(''); setShowCategoryFilter(false); }}
                  className={`w-full px-4 py-3 text-left border-none cursor-pointer hover:bg-gray-50 ${
                    selectedCategory === '' ? 'bg-gray-100' : 'bg-transparent'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setShowCategoryFilter(false); }}
                    className={`w-full px-4 py-3 text-left border-none cursor-pointer hover:bg-gray-50 ${
                      selectedCategory === cat.id ? 'bg-gray-100' : 'bg-transparent'
                    }`}
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
            className={`border-[1.5px] border-gray-200 rounded-lg px-4 py-2 font-semibold text-sm outline-none min-w-[120px] cursor-pointer transition-colors duration-200 ${
              selectedLocation !== 'All Locations' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {locationOptions.map((location) => (
              <option key={location} value={location} className="bg-white text-gray-800">{location}</option>
            ))}
          </select>

          {/* Reviews Filter */}
          <select 
            value={selectedReviewFilter}
            onChange={(e) => setSelectedReviewFilter(e.target.value)}
            className={`border-[1.5px] border-gray-200 rounded-lg px-4 py-2 font-semibold text-sm outline-none min-w-[120px] cursor-pointer transition-colors duration-200 ${
              selectedReviewFilter !== 'All Reviews' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {reviewOptions.map((review) => (
              <option key={review} value={review} className="bg-white text-gray-800">{review}</option>
            ))}
          </select>

          {/* Clear All Filters Button */}
          <button 
            onClick={clearAllFilters}
            className="bg-red-500 hover:bg-red-600 border-none rounded-lg px-4 py-2 font-semibold text-white text-sm cursor-pointer outline-none transition-colors duration-200"
          >
            Clear All
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="min-w-[220px] flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 hover:bg-gray-900 border-none rounded-md px-4 py-2 font-semibold text-white text-sm outline-none cursor-pointer w-full transition-colors duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option} className="bg-gray-800 text-white">
                Sort by: {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
  // Hero section with Tailwind CSS matching homepage design
  const heroSection = (
    <section 
      className="w-full min-h-[650px] relative flex items-start justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 40, 49, 0.45), rgba(34, 40, 49, 0.45)), url('https://images.unsplash.com/photo-1560472355-536de3962603?w=1500&h=600&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Diagonal White Cut - Fixed with inline style */}
      <div 
        className="absolute left-0 bottom-0 w-full h-32 bg-white z-20"
        style={{
          transform: 'skewY(-4deg)',
          transformOrigin: 'bottom right'
        }}
      />

      <div className="relative z-30 max-w-[1400px] mx-auto w-[95%] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
          
          {/* LEFT: HERO TEXT & SEARCH */}
            <div className="space-y-8 flex flex-col  items-start h-full ">
            <h1 className="text-white text-4xl sm:text-3xl md:text-5xl font-extrabold leading-none mb-4">
              Discover{' '}
              <br />
              <span className="inline-block italic rounded-xl font-bold  text-4xl sm:text-3xl md:text-5xl bg-emerald-500 text-white px-4 py-1 mx-1 border-2 border-white">
              Top-Rated Shops
              </span>{' '}
              & <br />
              <span className="inline-block rounded-xl italic font-bold  text-4xl sm:text-3xl md:text-5xl bg-emerald-500 text-white px-4 py-1 mx-1 border-2 border-white">
                Book Services
              </span>{' '}
              at the<br />
              Best Prices
            </h1>
            
            <p className="text-white text-md font-medium pb-5">
              Browse trusted providers in your area and book appointments with confidence.
            </p>
            
            {/* SEARCH BAR - Responsive Tailwind classes */}
            <div className="w-full max-w-2xl mb-4">
              <div className="flex flex-col sm:flex-row gap-2 rounded-xl bg-white shadow-2xl p-2">
                <input 
                  type="text" 
                  placeholder="Search shops, services, or locations..."
                  className="flex-1 px-4 py-3 text-gray-700 bg-transparent border-none outline-none text-base placeholder-gray-500 min-w-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <select 
                  className="px-4 py-3 text-gray-700 bg-white border-l-0 sm:border-l border-gray-200 outline-none text-base cursor-pointer min-w-0 sm:min-w-[160px]"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                >
                  <option value="Select...">Select Location...</option>
                  <option value="All Locations">All Locations</option>
                  {locationOptions.slice(1).map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <button 
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 w-full sm:w-auto whitespace-nowrap"
                  onClick={handleSearch}
                >
                  Find Shops
                </button>
              </div>
            </div>
            
            <div className="text-white text-base font-medium drop-shadow-lg">
              Popular Searches: {' '}
              <button 
                onClick={() => setSearchTerm('Haircuts')}
                className="text-white underline hover:text-emerald-200 transition-colors duration-200 bg-transparent border-none cursor-pointer font-inherit"
              >
                Haircuts
              </button>
              , {' '}
              <button 
                onClick={() => setSearchTerm('Massage')}
                className="text-white underline hover:text-emerald-200 transition-colors duration-200 bg-transparent border-none cursor-pointer font-inherit"
              >
                Massage
              </button>
              , {' '}
              <button 
                onClick={() => setSearchTerm('Facials')}
                className="text-white underline hover:text-emerald-200 transition-colors duration-200 bg-transparent border-none cursor-pointer font-inherit"
              >
                Facials
              </button>
              .
            </div>
          </div>
          
          {/* RIGHT: IMAGE CARD */}
          <div className="flex justify-center lg:justify-center items-start pt-12">
            <div className="w-100 h-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden relative border-8 border-white transform hover:scale-105 transition-transform duration-300 block sm:hidden lg:block">
              <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=center"
              alt="Professional Service"
              className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
  {heroSection}
  <div style={{ height: 32 }} />
  {trendingCategoriesSection}
      <div className="bg-slate-50 min-h-screen font-[Manrope,sans-serif] py-15" data-results-section>
        <div className="max-w-[1400px] w-[95%] mx-auto ">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">Shops</h1>
            <div className="flex items-center gap-4">
              {(searchTerm || searchLocation !== 'Select...' || selectedCategory || selectedLocation !== 'All Locations' || selectedReviewFilter !== 'All Reviews') && (
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-500 cursor-pointer font-medium transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
              <span className="text-gray-500 text-base">
                {loading ? 'Loading...' : `${filteredShops.length} of ${shops.length} shops`}
              </span>
            </div>
          </div>
          
          {/* Active Search/Filter Indicators */}
          {(searchTerm || searchLocation !== 'Select...' || selectedCategory || selectedLocation !== 'All Locations' || selectedReviewFilter !== 'All Reviews') && (
            <div className="mb-6 flex gap-2 flex-wrap">
              {searchTerm && (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
              {searchLocation !== 'Select...' && (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                  Location: {searchLocation}
                </span>
              )}
              {selectedCategory && (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
              {selectedLocation !== 'All Locations' && (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                  Filter Location: {selectedLocation}
                </span>
              )}
              {selectedReviewFilter !== 'All Reviews' && (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                  Reviews: {selectedReviewFilter}
                </span>
              )}
            </div>
          )}
          
          {loading ? (
            <div className="text-center text-gray-500 text-lg">Loading shops...</div>
          ) : filteredShops.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg px-8 py-8 text-center text-gray-500 text-lg">
              {shops.length === 0 ? 'No shops found.' : 'No shops match your current filters. Try adjusting your search criteria.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
              {filteredShops.map((shop) => (
              <Link key={shop.id} href={`/shop/${shop.id}`} className="no-underline">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl  overflow-hidden flex flex-col mb-6 transition-all duration-200 cursor-pointer hover:-translate-y-1">
                <div 
                  className="h-45 w-full bg-gray-100 flex items-center justify-center border-b-2 border-gray-200"
                  style={{ 
                  height: '180px',
                  backgroundImage: shop.logo ? `url(${shop.logo})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                  }}
                >
                  {!shop.logo && (
                  <span className="text-gray-400 text-5xl font-bold">🛍️</span>
                  )}
                </div>
                <div className="px-6 py-6 flex-1 flex flex-col justify-between">
                  <div className="font-[Manrope,sans-serif] font-bold text-xl text-gray-800 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{shop.businessName}</div>
                  <div 
                  className="text-gray-500 text-sm mb-2 min-h-[44px] max-h-[44px] overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                  >
                  {typeof shop.description === 'string' ? shop.description : shop.description || 'No description available'}
                  </div>
                  <div className="text-gray-500 text-sm mb-2 whitespace-nowrap overflow-hidden text-ellipsis">City: {shop.city || shop.address || ''}</div>
                  <div className="text-amber-500 font-bold text-sm mb-2">Rating: {shop.averageRating?.toFixed ? shop.averageRating.toFixed(1) : (shop.averageRating ?? 'N/A')} ({shop.totalReviews ?? 0} reviews)</div>
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
