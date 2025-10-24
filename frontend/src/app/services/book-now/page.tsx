'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Navbar from '@/app/components/navbar'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { setSelectedService, setSelectedProvider } from '@/store/slices/bookingSlice'
import { findServiceBySlug, getServiceSlug, transformServicesWithSlugs } from '@/utils/serviceHelpers'

function BookNow() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const serviceSlug = searchParams?.get('service') || searchParams?.get('serviceId') // Support both for backward compatibility
  const providerId = searchParams?.get('provider')
  
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [primaryService, setPrimaryService] = useState<any>(null)

  // Fetch services from API
  const { data: services = [], isLoading, error } = useGetServicesQuery({ 
    isActive: true, 
    status: 'active' 
  })

  // Filter active and approved services and add slugs
  const activeServices = transformServicesWithSlugs(
    services.filter(service => 
      service.isActive && 
      (service.status === 'active') &&
      (!service.approvalStatus || service.approvalStatus === 'approved' || service.approvalStatus === 'APPROVED')
    )
  )

  // Get unique categories
  const serviceCategories = Array.from(
    new Set(activeServices.map(service => service.category?.name).filter(Boolean))
  )

  // Set initial category and service if provided via URL
  useEffect(() => {
    if (serviceSlug && activeServices.length > 0) {
      // Try to find by slug first, then fallback to ID for backward compatibility
      let foundService = findServiceBySlug(activeServices, serviceSlug)
      if (!foundService) {
        foundService = activeServices.find(s => s.id === serviceSlug) || null
      }
      
      if (foundService) {
        setPrimaryService(foundService)
        setSelectedServices([foundService.id])
        setSelectedCategory(foundService.category?.name || '')
        
        // Convert to booking slice format
        const bookingService = {
          id: foundService.id,
          name: foundService.name,
          description: foundService.description,
          basePrice: foundService.basePrice,
          duration: foundService.durationMinutes,
          isActive: foundService.isActive,
          categoryId: foundService.categoryId,
          providerId: foundService.providerId,
          imageUrl: foundService.featuredImage,
          createdAt: foundService.createdAt,
          updatedAt: foundService.updatedAt
        }
        dispatch(setSelectedService(bookingService))
        
        // Set provider information if available
        if (foundService.provider) {
          const providerInfo = {
            id: foundService.provider.id || foundService.providerId,
            businessName: foundService.provider.businessName || foundService.providerBusinessName || 'Service Provider',
            businessDescription: foundService.provider.businessDescription || '',
            businessAddress: foundService.provider.businessAddress || foundService.displayLocation || '',
            businessCity: foundService.provider.businessCity || '',
            businessCountry: foundService.provider.businessCountry || '',
            businessPhoneNumber: foundService.provider.businessPhoneNumber || '',
            businessEmail: foundService.provider.businessEmail || '',
            websiteUrl: foundService.provider.websiteUrl || '',
            logoUrl: foundService.provider.logoUrl || foundService.featuredImage || '',
            isVerified: foundService.provider.isVerified || false,
            averageRating: foundService.averageRating || 4.0,
            totalReviews: foundService.totalReviews || 0,
            createdAt: foundService.provider.createdAt || foundService.createdAt,
            updatedAt: foundService.provider.updatedAt || foundService.updatedAt
          }
          dispatch(setSelectedProvider(providerInfo))
        }
      }
    } else if (activeServices.length > 0 && !selectedCategory) {
      setSelectedCategory(serviceCategories[0] || '')
    }
  }, [serviceSlug, activeServices, serviceCategories, selectedCategory, dispatch, providerId])

  // Filter services by category
  const filteredServices = selectedCategory 
    ? activeServices.filter(service => service.category?.name === selectedCategory)
    : activeServices

  const handleBack = () => {
    router.back()
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      // Store selected services in booking slice
      const selectedServiceObjects = activeServices.filter(s => selectedServices.includes(s.id))
      if (selectedServiceObjects.length > 0) {
        const firstService = selectedServiceObjects[0]
        // Convert to booking slice format
        const bookingService = {
          id: firstService.id,
          name: firstService.name,
          description: firstService.description,
          basePrice: firstService.basePrice,
          duration: firstService.durationMinutes,
          isActive: firstService.isActive,
          categoryId: firstService.categoryId,
          providerId: firstService.providerId,
          imageUrl: firstService.featuredImage,
          createdAt: firstService.createdAt,
          updatedAt: firstService.updatedAt
        }
        dispatch(setSelectedService(bookingService))
      }
      router.push(`/services/select-time?serviceIds=${selectedServices.join(',')}`)
    }
  }

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  // Calculate total price
  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = activeServices.find(s => s.id === serviceId)
    return total + (service ? parseFloat(service.basePrice.toString()) : 0)
  }, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E89B8B]"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <p className="text-red-600">Failed to load services. Please try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#E89B8B] text-white rounded-lg hover:bg-[#D4876F]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="font-medium text-[#E89B8B]">1. Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-400">2. Time</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-400">3. Confirm</span>
              {primaryService && (
                <>
                  <span className="text-gray-300 mx-2">|</span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {primaryService.name}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Available Services</h1>
                  {primaryService && (
                    <p className="text-sm text-gray-600 mt-1">
                      From {primaryService.providerBusinessName || 'Service Provider'}
                    </p>
                  )}
                </div>
                {primaryService && (
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Starting from</span>
                    <p className="font-bold text-[#E89B8B]">
                      {primaryService.currency || 'AED'} {Math.min(...filteredServices.map(s => parseFloat(s.basePrice)))}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Service Categories */}
              <div className="flex flex-wrap gap-3 mb-6">
                {serviceCategories.map((category) => {
                  const categoryCount = activeServices.filter(s => s.category?.name === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-[#E89B8B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {category} ({categoryCount})
                    </button>
                  )
                })}
              </div>

              {/* Service Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    const isPrimary = primaryService && service.id === primaryService.id;
                    
                    return (
                      <div 
                        key={service.id} 
                        className={`bg-white border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                          isSelected 
                            ? 'border-[#E89B8B] shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isPrimary ? 'ring-2 ring-[#E89B8B]/20' : ''}`}
                        onClick={() => toggleService(service.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Service Header */}
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-base">{service.name}</h3>
                              {isPrimary && (
                                <span className="text-xs bg-[#E89B8B] text-white px-2 py-0.5 rounded-full">
                                  Primary
                                </span>
                              )}
                              {service.adminAssignedBadge && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {service.adminAssignedBadge}
                                </span>
                              )}
                            </div>
                            
                            {/* Service Details */}
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{service.durationMinutes} mins</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="capitalize">{service.serviceType}</span>
                              </span>
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-bold text-[#E89B8B] text-lg">
                                {service.currency || 'AED'} {service.basePrice}
                              </span>
                              {service.originalPrice && parseFloat(service.originalPrice) > parseFloat(service.basePrice) && (
                                <span className="text-sm text-gray-500 line-through">
                                  {service.currency || 'AED'} {service.originalPrice}
                                </span>
                              )}
                              {service.discountPercentage && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                  {service.discountPercentage}% OFF
                                </span>
                              )}
                            </div>
                            
                            {/* Description */}
                            {service.shortDescription && (
                              <p className="text-gray-500 text-sm overflow-hidden" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {service.shortDescription}
                              </p>
                            )}
                            
                            {/* Additional Info */}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              {service.totalBookings > 0 && (
                                <span>{service.totalBookings} bookings</span>
                              )}
                              {service.averageRating && (
                                <span className="flex items-center space-x-1">
                                  <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                  </svg>
                                  <span>{service.averageRating.toFixed(1)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Selection Button */}
                          <button
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ml-4 ${
                              isSelected
                                ? 'bg-[#E89B8B] border-[#E89B8B] transform scale-110'
                                : 'border-gray-300 hover:border-[#E89B8B] hover:bg-[#E89B8B]/5'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(service.id);
                            }}
                          >
                            {isSelected ? (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">No services found</h3>
                    <p className="text-sm text-gray-500">Try selecting a different category or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Provider Info & Booking Summary */}
          <div className="space-y-6">
            {/* Provider & Booking Summary */}
            <div className="bg-[#FFF8F1] min-h-[500px] rounded-2xl p-6">
              {/* Provider Info */}
              {primaryService && (
                <div className="mb-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                      {primaryService.featuredImage ? (
                        <img 
                          src={primaryService.featuredImage} 
                          alt="Service Provider"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-provider.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#E89B8B] to-[#D4876F] flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {(primaryService.providerBusinessName || 'Service Provider').charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-gray-900 text-lg mb-1">
                        {primaryService.providerBusinessName || 'Service Provider'}
                      </h2>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => {
                            const rating = primaryService.averageRating || 4.0;
                            return (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            )
                          })}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {(primaryService.averageRating || 4.0).toFixed(1)} ({primaryService.totalReviews || 0} reviews)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {primaryService.displayLocation || 'Location not specified'}
                      </p>
                      {primaryService.category && (
                        <p className="text-xs text-gray-500 mt-1">
                          {primaryService.category.name} • {primaryService.serviceType}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Primary Service Highlight */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Selected Service</h3>
                        <p className="text-gray-600 text-sm">{primaryService.name}</p>
                        <p className="text-xs text-gray-500">
                          {primaryService.durationMinutes} mins • {primaryService.serviceType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#E89B8B] text-lg">
                          {primaryService.currency || 'AED'} {primaryService.basePrice}
                        </p>
                        {primaryService.originalPrice && parseFloat(primaryService.originalPrice) > parseFloat(primaryService.basePrice) && (
                          <p className="text-xs text-gray-500 line-through">
                            {primaryService.currency || 'AED'} {primaryService.originalPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Booking Summary */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                
                {selectedServices.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {selectedServices.map((serviceId) => {
                      const service = activeServices.find(s => s.id === serviceId)
                      const isPrimary = primaryService && serviceId === primaryService.id
                      return service ? (
                        <div key={serviceId} className={`p-3 rounded-lg border ${isPrimary ? 'border-[#E89B8B] bg-[#E89B8B]/5' : 'border-gray-200 bg-white'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                {isPrimary && (
                                  <span className="text-xs bg-[#E89B8B] text-white px-2 py-0.5 rounded-full">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {service.durationMinutes} mins • {service.serviceType}
                              </p>
                              {service.shortDescription && (
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                  {service.shortDescription}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-3">
                              <span className="font-semibold text-gray-900">
                                {service.currency || 'AED'} {service.basePrice}
                              </span>
                              {service.originalPrice && parseFloat(service.originalPrice) > parseFloat(service.basePrice) && (
                                <p className="text-xs text-gray-500 line-through">
                                  {service.currency || 'AED'} {service.originalPrice}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null
                    })}
                    
                    {/* Duration Summary */}
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Duration:</span>
                        <span className="font-medium text-gray-900">
                          {selectedServices.reduce((total, serviceId) => {
                            const service = activeServices.find(s => s.id === serviceId)
                            return total + (service ? service.durationMinutes : 0)
                          }, 0)} minutes
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Services Count:</span>
                        <span className="font-medium text-gray-900">{selectedServices.length}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No additional services selected</p>
                    <p className="text-xs text-gray-400 mt-1">You can add more services from the same provider</p>
                  </div>
                )}
                
                {/* Total Price */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <div className="text-right">
                      <span className="font-bold text-xl text-[#E89B8B]">
                        AED {totalPrice.toFixed(2)}
                      </span>
                      {selectedServices.length > 1 && (
                        <p className="text-xs text-gray-500">
                          Avg: AED {(totalPrice / selectedServices.length).toFixed(2)} per service
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Continue Button */}
                <button 
                  onClick={handleContinue}
                  disabled={selectedServices.length === 0}
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-200 ${
                    selectedServices.length > 0
                      ? 'bg-[#E89B8B] text-white hover:bg-[#D4876F] hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedServices.length > 0 
                    ? `Continue with ${selectedServices.length} Service${selectedServices.length > 1 ? 's' : ''}`
                    : 'Select Services to Continue'
                  }
                </button>
                
                {/* Additional Info */}
                {selectedServices.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      Next: Select your preferred time slot
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookNow