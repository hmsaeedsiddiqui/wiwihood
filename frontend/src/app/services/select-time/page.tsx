'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '@/app/components/navbar'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { useGetAvailableTimeSlotsQuery, useCheckAvailabilityMutation } from '@/store/api/bookingsApi'
import { setSelectedDate, setSelectedTimeSlot } from '@/store/slices/bookingSlice'
import { RootState } from '@/store'
import { getServiceSlug, findServiceBySlug, transformServicesWithSlugs } from '@/utils/serviceHelpers'

function SelectTime() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  
  // Get service IDs from URL or fallback methods
  const serviceIds = searchParams?.get('serviceIds')?.split(',') || []
  const serviceSlug = searchParams?.get('service')
  const serviceId = searchParams?.get('serviceId')
  
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('Any Professional')
  const [selectedDateLocal, setSelectedDateLocal] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateAvailability, setDateAvailability] = useState<{[key: string]: boolean}>({})
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  // Get booking state from Redux
  const bookingState = useSelector((state: RootState) => state.booking)

  // Fetch service details
  const { data: allServices = [], isLoading: servicesLoading } = useGetServicesQuery({ 
    isActive: true, 
    status: 'active' 
  })

  // Transform services with slugs for better matching
  const transformedServices = useMemo(() => {
    return transformServicesWithSlugs(allServices.filter(service => service.isActive))
  }, [allServices])

  // Find services using multiple methods
  const selectedServices = useMemo(() => {
    let services: any[] = []
    
    // Method 1: Find by service IDs
    if (serviceIds.length > 0) {
      services = transformedServices.filter(service => serviceIds.includes(service.id))
    }
    
    // Method 2: Find by slug (from book-now navigation)
    if (services.length === 0 && serviceSlug) {
      const foundService = findServiceBySlug(transformedServices, serviceSlug)
      if (foundService) {
        services = [foundService]
      }
    }
    
    // Method 3: Find by single service ID
    if (services.length === 0 && serviceId) {
      const foundService = transformedServices.find(s => s.id === serviceId)
      if (foundService) {
        services = [foundService]
      }
    }
    
    // Method 4: Use Redux state as fallback
    if (services.length === 0 && bookingState.selectedService) {
      const foundService = transformedServices.find(s => s.id === bookingState.selectedService?.id)
      if (foundService) {
        services = [foundService]
      }
    }
    
    return services
  }, [serviceIds, serviceSlug, serviceId, transformedServices, bookingState.selectedService])

  const primaryService = selectedServices[0]

  // Check availability mutation
  const [checkAvailability] = useCheckAvailabilityMutation()

  // Generate next 30 days with availability checking
  const generateDates = () => {
    const dates = []
    const today = new Date()
    const maxAdvanceBookingDays = primaryService?.maxAdvanceBookingDays || 30
    const minAdvanceHours = primaryService?.minAdvanceBookingHours || 2
    
    for (let i = 0; i < maxAdvanceBookingDays; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Check if date is too early based on min advance booking
      const isDateAvailable = () => {
        if (i === 0) {
          // For today, check if we have enough advance notice
          const now = new Date()
          const minBookingTime = new Date(now.getTime() + (minAdvanceHours * 60 * 60 * 1000))
          return date.getTime() >= minBookingTime.getTime()
        }
        return true
      }
      
      dates.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateStr,
        available: isDateAvailable() && (dateAvailability[dateStr] !== false),
        selected: selectedDateLocal === dateStr,
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear()
      })
    }
    return dates
  }

  const [dates, setDates] = useState<any[]>([])

  // Check availability for multiple dates
  const checkDateAvailability = async (datesToCheck: string[]) => {
    if (!primaryService) return
    
    setIsCheckingAvailability(true)
    const availabilityMap: {[key: string]: boolean} = {}
    
    try {
      // Check availability for each date
      const promises = datesToCheck.map(async (dateStr) => {
        try {
          const result = await checkAvailability({
            providerId: primaryService.providerId,
            serviceId: primaryService.id,
            date: dateStr
          }).unwrap()
          
          availabilityMap[dateStr] = result.available
        } catch (error) {
          // If check fails, assume unavailable
          availabilityMap[dateStr] = false
        }
      })
      
      await Promise.all(promises)
      setDateAvailability(prev => ({ ...prev, ...availabilityMap }))
    } catch (error) {
      console.error('Error checking date availability:', error)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Set initial date and check availability
  useEffect(() => {
    if (primaryService && !selectedDateLocal) {
      const today = new Date().toISOString().split('T')[0]
      setSelectedDateLocal(today)
      dispatch(setSelectedDate(today))
    }
  }, [primaryService, selectedDateLocal, dispatch])

  // Generate dates when primary service is available
  useEffect(() => {
    if (primaryService) {
      const generatedDates = generateDates()
      setDates(generatedDates)
      
      // Check availability for the first week
      const datesToCheck = generatedDates.slice(0, 7).map(d => d.fullDate)
      checkDateAvailability(datesToCheck)
    }
  }, [primaryService, selectedDateLocal, dateAvailability])

  // Update dates when dateAvailability changes
  useEffect(() => {
    if (primaryService) {
      setDates(generateDates())
    }
  }, [dateAvailability, primaryService])

  // Fetch available time slots for the selected date and service
  const { data: availabilityData, isLoading: isLoadingSlots, error: timeSlotsError } = useGetAvailableTimeSlotsQuery(
    {
      providerId: primaryService?.providerId || '',
      serviceId: primaryService?.id || '',
      date: selectedDateLocal || new Date().toISOString().split('T')[0]
    },
    {
      skip: !primaryService || !selectedDateLocal
    }
  )

  const timeSlots = availabilityData?.timeSlots || []
  
  // Generate default time slots if API doesn't return any
  const defaultTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ]
  
  const availableTimeSlots = timeSlots.length > 0 ? timeSlots : defaultTimeSlots

  // Dynamic staff members based on service data
  const staffMembers = useMemo(() => {
    const baseStaff = ['Any Professional']
    
    // Add staff from service provider data if available
    if (primaryService?.provider?.staff) {
      return [...baseStaff, ...primaryService.provider.staff.map((staff: any) => staff.name || staff)]
    }
    
    // Add generic staff options based on service type
    if (primaryService?.serviceType === 'appointment') {
      return [...baseStaff, 'Senior Specialist', 'Junior Specialist']
    }
    
    return baseStaff
  }, [primaryService])

  const handleBack = () => {
    // Get the slug for the first selected service
    const firstService = selectedServices[0]
    if (firstService) {
      const serviceSlug = getServiceSlug(firstService)
      router.push(`/services/book-now?service=${serviceSlug}`)
    } else {
      router.push('/services/book-now')
    }
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    if (selectedTime && selectedDateLocal && selectedServices.length > 0) {
      dispatch(setSelectedTimeSlot(selectedTime))
      dispatch(setSelectedDate(selectedDateLocal))
      
      // Create service IDs array from selected services
      const serviceIdsArray = selectedServices.map(s => s.id)
      router.push(`/services/confirm-appointment?serviceIds=${serviceIdsArray.join(',')}&date=${selectedDateLocal}&time=${encodeURIComponent(selectedTime)}`)
    }
  }

  const handleDateSelect = (dateInfo: any) => {
    if (!dateInfo.available) return
    
    setSelectedDateLocal(dateInfo.fullDate)
    dispatch(setSelectedDate(dateInfo.fullDate))
    setSelectedTime('') // Reset time when date changes
    
    // Check availability for this specific date if not already checked
    if (dateAvailability[dateInfo.fullDate] === undefined) {
      checkDateAvailability([dateInfo.fullDate])
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    dispatch(setSelectedTimeSlot(time))
  }

  // Calculate total price and duration
  const totalPrice = selectedServices.reduce((total, service) => 
    total + parseFloat(service.basePrice.toString()), 0
  )
  const totalDuration = selectedServices.reduce((total, service) => 
    total + service.durationMinutes, 0
  )

  // Loading state
  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E89B8B]"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </div>
    )
  }

  // No service found
  if (!primaryService) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">
              The service you're trying to book could not be found or is no longer available.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/services')} 
                className="block w-full bg-[#E89B8B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D4876F] transition-colors"
              >
                Browse All Services
              </button>
              <button 
                onClick={() => router.back()} 
                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              <div className="text-sm text-gray-500 mt-4">
                <p>Debug info:</p>
                <p>Service IDs: {serviceIds.join(', ') || 'None'}</p>
                <p>Service Slug: {serviceSlug || 'None'}</p>
                <p>Available Services: {transformedServices.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
        <Navbar />
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
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
              <span className="font-medium text-gray-900">Time</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-500">Confirm</span>
            </div>
          </div>
          
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Time Selection */}
          <div className="lg:col-span-2 space-y-6 bg-white">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Select time</h1>
              
              {/* Staff Selection */}
<div className="flex items-center justify-between mb-6">
  {/* Left side: staff dropdown */}
  <div className="flex items-center space-x-3">
    <select 
      value={selectedStaff}
      onChange={(e) => setSelectedStaff(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent bg-white"
    >
      {staffMembers.map((staff) => (
        <option key={staff} value={staff}>{staff}</option>
      ))}
    </select>

    <span className="text-sm text-gray-500">
      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
    </span>
  </div>

  {/* Right side: navigation + calendar */}
  <div className="flex items-center space-x-1">
    <button className="p-1 hover:bg-gray-100 rounded">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button className="p-1 hover:bg-gray-100 rounded">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
    <button className="p-2 hover:bg-gray-100 rounded">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
</div>


              {/* Date Selection - Scrollable view */}
              <div className="mb-8">
                <div className="flex overflow-x-auto pb-2 space-x-3 scrollbar-hide">
                  {dates.slice(0, 14).map((dateItem) => (
                    <div key={dateItem.fullDate} className="flex flex-col items-center flex-shrink-0">
                      <button
                        onClick={() => handleDateSelect(dateItem)}
                        className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 relative ${
                          dateItem.selected
                            ? 'bg-[#E89B8B] text-white ring-2 ring-[#E89B8B] ring-opacity-30 shadow-lg'
                            : dateItem.available
                            ? 'text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-[#E89B8B]'
                            : 'text-gray-300 cursor-not-allowed border border-gray-100 bg-gray-50'
                        }`}
                        disabled={!dateItem.available}
                        title={!dateItem.available ? 'Not available' : `Select ${dateItem.day}, ${dateItem.month} ${dateItem.date}`}
                      >
                        {dateItem.date}
                        {!dateItem.available && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-8 bg-gray-400 rotate-45"></div>
                          </div>
                        )}
                        {isCheckingAvailability && dateAvailability[dateItem.fullDate] === undefined && (
                          <div className="absolute -top-1 -right-1 w-3 h-3">
                            <div className="w-3 h-3 bg-[#E89B8B] rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </button>
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                        {dateItem.day}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {dateItem.month}
                      </span>
                    </div>
                  ))}
                </div>
                {dates.length > 14 && (
                  <button
                    onClick={() => {
                      // Load more dates
                      const moreDates = generateDates()
                      setDates(moreDates.slice(0, dates.length + 7))
                    }}
                    className="text-sm text-[#E89B8B] hover:text-[#D4876F] font-medium mt-2"
                  >
                    Show more dates →
                  </button>
                )}
              </div>

              {/* Time Slots List */}
              <div className="space-y-3">
                {!selectedDateLocal ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please select a date first</p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E89B8B]"></div>
                    <p className="mt-2 text-gray-500">Loading available times...</p>
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-3 rounded-lg text-center font-medium transition-all duration-200 ${
                          selectedTime === time
                            ? 'bg-[#E89B8B] text-white ring-2 ring-[#E89B8B] ring-opacity-30 shadow-lg'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-[#E89B8B] hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-3">⏰</div>
                    <p className="text-gray-500 mb-2">No available time slots</p>
                    <p className="text-sm text-gray-400">
                      Please select a different date or try again later.
                    </p>
                    {timeSlotsError && (
                      <p className="text-xs text-red-500 mt-2">
                        Error loading time slots. Using default times.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Salon Info & Booking Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
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
                {selectedDateLocal && (
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedDateLocal).toLocaleDateString('en-US', { 
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
                        {service.durationMinutes} mins with {selectedStaff.toLowerCase()}
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
                disabled={!selectedTime || !selectedDateLocal}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  selectedTime && selectedDateLocal
                    ? 'bg-[#E89B8B] text-white hover:bg-[#D4876F] shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedTime && selectedDateLocal 
                  ? 'Continue to Confirmation' 
                  : 'Select Date and Time'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectTime