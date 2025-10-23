'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '@/app/components/navbar'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { setBookingNotes } from '@/store/slices/bookingSlice'
import { RootState } from '@/store'

interface CustomerDetails {
  name: string
  email: string
  phone: string
  notes: string
}

function ConfirmAppointment() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  
  const serviceIds = searchParams?.get('serviceIds')?.split(',') || []
  const selectedDate = searchParams?.get('date') || ''
  const selectedTime = decodeURIComponent(searchParams?.get('time') || '')

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<CustomerDetails>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get booking state from Redux
  const bookingState = useSelector((state: RootState) => state.booking)

  // Fetch service details
  const { data: allServices = [] } = useGetServicesQuery({ isActive: true, status: 'active' })
  const selectedServices = allServices.filter(service => serviceIds.includes(service.id))
  const primaryService = selectedServices[0]

  // Calculate total price and duration
  const totalPrice = selectedServices.reduce((total, service) => 
    total + parseFloat(service.basePrice.toString()), 0
  )
  const totalDuration = selectedServices.reduce((total, service) => 
    total + service.durationMinutes, 0
  )

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {}

    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(customerDetails.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBack = () => {
    router.push(`/services/select-time?serviceIds=${serviceIds.join(',')}`)
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    if (validateForm()) {
      setIsSubmitting(true)
      // Store notes in Redux
      dispatch(setBookingNotes(customerDetails.notes))
      
      // Navigate to payment page with all details
      const params = new URLSearchParams({
        serviceIds: serviceIds.join(','),
        date: selectedDate,
        time: selectedTime,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        notes: customerDetails.notes
      })
      
      router.push(`/services/payment?${params.toString()}`)
    }
  }

  if (!primaryService) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <p className="text-red-600">No service selected. Please go back and select a service.</p>
            <button 
              onClick={() => router.push('/services')} 
              className="mt-4 px-4 py-2 bg-[#E89B8B] text-white rounded-lg hover:bg-[#D4876F]"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
              <span className="text-gray-500">Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-500">Time</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900">Confirm</span>
            </div>
          </div>
          
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Details</h1>
              
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={customerDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Notes Field */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={customerDetails.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent resize-none"
                    placeholder="Any special requests or notes for the service provider..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                  {primaryService?.featuredImage && (
                    <img 
                      src={primaryService.featuredImage} 
                      alt="Service"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-lg mb-1">
                    {primaryService?.providerBusinessName || 'Service Provider'}
                  </h2>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(primaryService?.averageRating || 0) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {primaryService?.averageRating || 4.0} ({primaryService?.totalReviews || 0})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {primaryService?.displayLocation || 'Location not specified'}
                  </p>
                </div>
              </div>
              
              {/* Selected Date & Time */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                {selectedDate && (
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">
                      {selectedTime} ({totalDuration} mins duration)
                    </span>
                  </div>
                )}
              </div>
              
              {/* Selected Services */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between mb-2">
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
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">AED {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleContinue}
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#E89B8B] text-white hover:bg-[#D4876F]'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmAppointment