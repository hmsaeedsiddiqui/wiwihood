"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Star, MapPin, Clock, ArrowRight, Filter, Grid, List } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock services data matching vivihood design
  const mockServices = [
    {
      id: 1,
      title: "Luxe Nail Studio",
      provider: "Beauty Pro Spa Salon - Al Watery",
      rating: 4.8,
      reviews: 88,
      price: 149,
      image: "/services/nail-1.jpg",
      category: "Nail Services",
      duration: 60,
      description: "Professional nail care with premium products and expert techniques"
    },
    {
      id: 2,
      title: "Signature Facial Treatment",
      provider: "Glow Wellness Center - Dubai Marina",
      rating: 4.9,
      reviews: 156,
      price: 199,
      image: "/services/facial-1.jpg",
      category: "Facial Services",
      duration: 90,
      description: "Deep cleansing and rejuvenating facial treatment for all skin types"
    },
    {
      id: 3,
      title: "Relaxing Deep Tissue Massage",
      provider: "Zen Spa & Wellness - JLT",
      rating: 4.7,
      reviews: 203,
      price: 299,
      image: "/services/massage-1.jpg",
      category: "Massage Services",
      duration: 120,
      description: "Therapeutic massage to relieve tension and promote relaxation"
    },
    {
      id: 4,
      title: "Hair Cut & Styling",
      provider: "Elite Hair Studio - Business Bay",
      rating: 4.8,
      reviews: 134,
      price: 179,
      image: "/services/hair-1.jpg",
      category: "Hair Services",
      duration: 75,
      description: "Professional haircut and styling by expert stylists"
    },
    {
      id: 5,
      title: "Eyebrow Threading & Shaping",
      provider: "Perfect Brows Salon - Downtown",
      rating: 4.6,
      reviews: 92,
      price: 89,
      image: "/services/brow-1.jpg",
      category: "Beauty Services",
      duration: 45,
      description: "Precision eyebrow threading and shaping for perfect arch"
    },
    {
      id: 6,
      title: "Manicure & Pedicure Combo",
      provider: "Luxury Nail Lounge - Palm Jumeirah",
      rating: 4.9,
      reviews: 167,
      price: 249,
      image: "/services/mani-pedi-1.jpg",
      category: "Nail Services",
      duration: 105,
      description: "Complete nail care package with luxury treatments"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'nail', name: 'Nail Services' },
    { id: 'facial', name: 'Facial Services' },
    { id: 'massage', name: 'Massage Services' },
    { id: 'hair', name: 'Hair Services' },
    { id: 'beauty', name: 'Beauty Services' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           service.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-200 via-pink-200 to-rose-300 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover premium beauty and wellness services from trusted professionals
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and View Controls */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Mode and Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {filteredServices.length} services found
              </span>
              
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredServices.map((service) => (
              <Link key={service.id} href={`/service/${service.id}`}>
                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100 cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-64 h-48' : 'h-64'
                  }`}>
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                      {service.category === 'Nail Services' && <div className="text-6xl">💅</div>}
                      {service.category === 'Facial Services' && <div className="text-6xl">✨</div>}
                      {service.category === 'Massage Services' && <div className="text-6xl">💆‍♀️</div>}
                      {service.category === 'Hair Services' && <div className="text-6xl">✂️</div>}
                      {service.category === 'Beauty Services' && <div className="text-6xl">💄</div>}
                      {!['Nail Services', 'Facial Services', 'Massage Services', 'Hair Services', 'Beauty Services'].includes(service.category) && <div className="text-6xl">🌸</div>}
                    </div>
                  </div>
                  
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                      <span className="text-2xl font-bold text-orange-500">AED {service.price}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{service.provider}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({service.reviews})</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-200 to-pink-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Don't see what you're looking for?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Contact us and we'll help you find the perfect service provider
          </p>
          <Link href="/contact">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
              Get in Touch
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}