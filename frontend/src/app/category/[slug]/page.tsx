"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiService, Category, Service } from '@/lib/api';
import { Search, Star, MapPin, Clock, ArrowRight, Filter, Grid, List, Heart } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Convert slug to display name
  const getCategoryDisplayName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = category?.name || getCategoryDisplayName(categorySlug);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cat = await apiService.getCategoryBySlug(categorySlug);
        setCategory(cat || null);
        setServices(cat?.services || []);
      } catch (e) {
        // Fallback to mock data if API fails
        setCategory(null);
        setServices([
          {
            id: 1,
            title: `Professional ${getCategoryDisplayName(categorySlug)}`,
            provider: "Beauty Pro Spa Salon - Al Watery",
            rating: 4.8,
            reviews: 88,
            price: 149,
            image: "/services/service-1.jpg",
            category: getCategoryDisplayName(categorySlug),
            location: "Al Watery",
            distance: "2.5 km",
            availableSlots: ["10:00 AM", "2:00 PM", "4:30 PM"]
          } as any,
          {
            id: 2,
            title: `Premium ${getCategoryDisplayName(categorySlug)} Service`,
            provider: "Elite Beauty Center - Dubai Marina",
            rating: 4.9,
            reviews: 124,
            price: 199,
            image: "/services/service-2.jpg",
            category: getCategoryDisplayName(categorySlug),
            location: "Dubai Marina",
            distance: "1.8 km",
            availableSlots: ["11:00 AM", "1:00 PM", "5:00 PM"]
          } as any,
          {
            id: 3,
            title: `Luxury ${getCategoryDisplayName(categorySlug)} Experience`,
            provider: "Royal Spa & Wellness - JBR",
            rating: 4.7,
            reviews: 96,
            price: 249,
            image: "/services/service-3.jpg",
            category: getCategoryDisplayName(categorySlug),
            location: "JBR",
            distance: "3.2 km",
            availableSlots: ["9:00 AM", "3:00 PM", "6:00 PM"]
          } as any
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);

  const filteredServices = services.filter(service =>
    service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service as any).provider?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {categoryName} services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-light mb-4">{categoryName} Services</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover the best {categoryName.toLowerCase()} services near you with professional providers
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={`Search ${categoryName.toLowerCase()} services...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-2">
              {filteredServices.length} {categoryName} Service{filteredServices.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600">
              Book your {categoryName.toLowerCase()} appointment with top-rated professionals
            </p>
          </div>

          {/* Services Grid */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredServices.map((service) => (
              <div key={service.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100 group ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-64 h-48' : 'h-64'
                }`}>
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                    <div className="text-6xl">
                      {categorySlug === 'nails' && '💅'}
                      {categorySlug === 'haircut' && '💇‍♀️'}
                      {categorySlug === 'massage' && '💆‍♀️'}
                      {categorySlug === 'facial' && '🧴'}
                      {categorySlug === 'spa' && '🧖‍♀️'}
                      {!['nails', 'haircut', 'massage', 'facial', 'spa'].includes(categorySlug) && '✨'}
                    </div>
                  </div>
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{(service as any).title || service.name}</h3>
                    <div className="text-xl font-bold text-orange-500">
                      AED {(service as any).price || service.basePrice || 149}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{(service as any).provider || service.provider?.businessName || 'Professional Provider'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">{(service as any).rating || 4.8}</span>
                      <span className="text-sm text-gray-500 ml-1">({(service as any).reviews || 88})</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <span>{(service as any).distance || '2.5 km'}</span>
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Available today:</p>
                    <div className="flex flex-wrap gap-2">
                      {((service as any).availableSlots || ["10:00 AM", "2:00 PM"]).slice(0, 2).map((slot: string, index: number) => (
                        <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {slot}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500">+2 more</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Quick Book
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-600">
                Try adjusting your search or browse other categories
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse all our services or contact us to help you find the perfect {categoryName.toLowerCase()} service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Browse All Services
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-800 transition-all">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
