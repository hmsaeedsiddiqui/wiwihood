"use client";

import React, { useState } from 'react';
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, location: string, filters: any) => void;
  placeholder?: string;
  showLocationFilter?: boolean;
  showAdvancedFilters?: boolean;
  categories?: Array<{ id: string; name: string }>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for services...",
  showLocationFilter = true,
  showAdvancedFilters = true,
  categories = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    rating: '',
    sortBy: 'relevance'
  });

  const handleSearch = () => {
    onSearch(searchQuery, location, filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
            />
          </div>

          {/* Location Filter */}
          {showLocationFilter && (
            <>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="relative min-w-0 flex-1">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Location"
                  className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
                />
              </div>
            </>
          )}

          {/* Advanced Filters Toggle */}
          {showAdvancedFilters && (
            <>
              <div className="w-px h-12 bg-gray-200"></div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Search Button */}
          <div className="w-px h-12 bg-gray-200"></div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium hover:shadow-lg transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && showFilters && (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (AED)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setFilters({
                  category: '',
                  priceMin: '',
                  priceMax: '',
                  rating: '',
                  sortBy: 'relevance'
                });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};