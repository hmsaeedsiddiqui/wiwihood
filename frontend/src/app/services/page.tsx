"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getServiceSlug } from '@/utils/serviceHelpers';
import { createServiceUrl } from '@/utils/slugify';
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ServiceHero from "../services/service-hero";
import { useGetServicesQuery } from '@/store/api/servicesApi';
import { useGetCategoriesQuery } from '@/store/api/providersApi';

function ServicesPage() {
  const searchParams = useSearchParams();
  
  // Get query parameters
  const categoryParam = searchParams?.get('category');
  const typeParam = searchParams?.get('type');
  
  // UI state
  const [breadcrumb, setBreadcrumb] = useState('All Services');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Prepare API filters based on query parameters
  const apiFilters = {
    isActive: true,
    status: 'active' as const,
    ...(categoryParam && { category: categoryParam }),
    ...(typeParam && { type: typeParam as any })
  };

  // Fetch services and categories from API
  const { data: services = [], isLoading, error } = useGetServicesQuery(apiFilters);
  const { data: categories = [] } = useGetCategoriesQuery({ isActive: true });

  // Update breadcrumb based on parameters
  useEffect(() => {
    if (typeParam) {
      const typeLabels = {
        'top-rated': 'Top-Rated Services',
        'popular': 'Popular This Week',
        'best-seller': 'Best Sellers',
        'hot-deal': 'Hot Deals',
        'new': 'New on Wiwihood'
      };
      setBreadcrumb(typeLabels[typeParam as keyof typeof typeLabels] || 'Services');
    } else if (categoryParam) {
      const category = categories.find(cat => 
        cat.name.toLowerCase() === categoryParam.toLowerCase() || 
        cat.slug === categoryParam
      );
      setBreadcrumb(category ? category.name : categoryParam);
    } else {
      setBreadcrumb('All Services');
    }
  }, [categoryParam, typeParam, categories]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, typeParam]);

  // Pagination logic
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ServiceHero />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E89B8B]"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ServiceHero />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">Failed to load services</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#E89B8B] text-white px-4 py-2 rounded-lg hover:bg-[#D4876F]"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ServiceHero />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#E89B8B]">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/services" className="text-gray-500 hover:text-[#E89B8B]">
              Services
            </Link>
            {breadcrumb !== 'All Services' && (
              <>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">{breadcrumb}</span>
              </>
            )}
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{breadcrumb}</h1>
          <p className="text-gray-600">
            {services.length} service{services.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Category Filter Chips */}
        {!categoryParam && !typeParam && categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:border-[#E89B8B] hover:text-[#E89B8B] transition-colors"
              >
                All Categories
              </Link>
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:border-[#E89B8B] hover:text-[#E89B8B] transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No services found</div>
            <Link
              href="/services"
              className="bg-[#E89B8B] text-white px-6 py-3 rounded-lg hover:bg-[#D4876F] transition-colors"
            >
              View All Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentServices.map((service) => {
              const serviceSlug = getServiceSlug(service);
              
              return (
                <Link 
                  key={service.id} 
                  href={createServiceUrl(serviceSlug)} 
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={service.featuredImage || service.images?.[0] || '/service1.png'}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.category?.name && (
                      <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium">
                        {service.category.name}
                      </div>
                    )}
                    {service.adminAssignedBadge && (
                      <div className="absolute top-3 right-3 bg-[#E89B8B] text-white px-2 py-1 rounded text-xs font-medium">
                        {service.adminAssignedBadge}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {service.name.length > 50 ? `${service.name.substring(0, 50)}...` : service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex-1">
                      {service.shortDescription || service.description 
                        ? (service.shortDescription || service.description).length > 100 
                          ? `${(service.shortDescription || service.description).substring(0, 100)}...` 
                          : service.shortDescription || service.description
                        : 'Professional service available'
                      }
                    </p>
                    
                    {/* Provider */}
                    <div className="flex items-center mb-3">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {service.providerBusinessName || service.provider?.businessName || 'Professional Provider'}
                      </span>
                    </div>

                    {/* Rating and Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(service.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({service.totalReviews || 0})
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#E89B8B]">
                          {service.currency || 'AED'} {service.basePrice}
                        </div>
                        {service.durationMinutes && (
                          <div className="text-xs text-gray-500">
                            {service.durationMinutes} mins
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button className="w-full bg-[#E89B8B] text-white py-3 rounded-lg font-medium hover:bg-[#D4876F] transition-colors text-sm mt-auto">
                      Book Now
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  currentPage === i + 1
                    ? 'text-white bg-[#E89B8B]'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ServicesPage;