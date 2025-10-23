'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Navbar from '@/app/components/navbar'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { setSelectedService } from '@/store/slices/bookingSlice'
import { findServiceBySlug, getServiceSlug, transformServicesWithSlugs } from '@/utils/serviceHelpers'

function BookNow() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const serviceSlug = searchParams?.get('service') || searchParams?.get('serviceId') // Support both for backward compatibility
  
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

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
      }
    } else if (activeServices.length > 0 && !selectedCategory) {
      setSelectedCategory(serviceCategories[0] || '')
    }
  }, [serviceSlug, activeServices, serviceCategories, selectedCategory, dispatch])

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
    <div className="min-h-screen h-[495px] bg-gray-50">
        <Navbar />
      <div className="container mx-auto px-4 py-6">
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
              <span className="font-medium text-gray-900">Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Time</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Confirm</span>
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
            <div className="bg-[#FFF8F1] rounded-2xl p-6 h-[495px]">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Services</h1>
              
              {/* Service Categories */}
              <div className="flex flex-wrap gap-3 mb-8">
                {serviceCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#E89B8B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Service Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">
                          {service.durationMinutes} minutes • {service.serviceType}
                        </p>
                        <p className="font-bold text-gray-900">
                          {service.currency || 'AED'} {service.basePrice}
                        </p>
                        {service.shortDescription && (
                          <p className="text-gray-500 text-sm mt-1">{service.shortDescription}</p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => toggleService(service.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedServices.includes(service.id)
                            ? 'bg-[#E89B8B] border-[#E89B8B]'
                            : 'border-gray-300 hover:border-[#E89B8B]'
                        }`}
                      >
                        {selectedServices.includes(service.id) ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Salon Info & Booking Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-[#FFF8F1] h-[495px] rounded-2xl p-6">
              {selectedServices.length > 0 && (
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                    {activeServices.find(s => s.id === selectedServices[0])?.featuredImage && (
                      <img 
                        src={activeServices.find(s => s.id === selectedServices[0])?.featuredImage} 
                        alt="Service"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-gray-900 text-lg mb-1">
                      {activeServices.find(s => s.id === selectedServices[0])?.providerBusinessName || 'Service Provider'}
                    </h2>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {activeServices.find(s => s.id === selectedServices[0])?.averageRating || 4.0} 
                        ({activeServices.find(s => s.id === selectedServices[0])?.totalReviews || 0})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {activeServices.find(s => s.id === selectedServices[0])?.displayLocation || 'Location not specified'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                {selectedServices.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {selectedServices.map((serviceId) => {
                      const service = activeServices.find(s => s.id === serviceId)
                      return service ? (
                        <div key={serviceId} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-500">
                              {service.durationMinutes} mins • {service.serviceType}
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {service.currency || 'AED'} {service.basePrice}
                          </span>
                        </div>
                      ) : null
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No services selected</p>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">
                    {selectedServices.length > 0 
                      ? `AED ${totalPrice.toFixed(2)}`
                      : 'AED 0.00'
                    }
                  </span>
                </div>
                
                <button 
                  onClick={handleContinue}
                  disabled={selectedServices.length === 0}
                  className={`w-full py-3 rounded-full font-semibold transition-colors ${
                    selectedServices.length > 0
                      ? 'bg-[#E89B8B] text-white hover:bg-[#D4876F]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookNow