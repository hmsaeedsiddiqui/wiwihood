'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '@/app/components/navbar'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { useGetAvailableTimeSlotsQuery } from '@/store/api/bookingsApi'
import { setSelectedDate, setSelectedTimeSlot } from '@/store/slices/bookingSlice'
import { RootState } from '@/store'

function SelectTime() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const serviceIds = searchParams?.get('serviceIds')?.split(',') || []
  
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('Any Professional')
  const [selectedDate, setSelectedDateLocal] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get booking state from Redux
  const bookingState = useSelector((state: RootState) => state.booking)

  // Fetch service details
  const { data: allServices = [] } = useGetServicesQuery({ isActive: true, status: 'active' })
  const selectedServices = allServices.filter(service => serviceIds.includes(service.id))
  const primaryService = selectedServices[0]

  // Generate next 7 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toISOString().split('T')[0],
        available: true,
        selected: selectedDate === date.toISOString().split('T')[0]
      })
    }
    return dates
  }

  const [dates, setDates] = useState(generateDates())

  // Set initial date to today if not selected
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0]
      setSelectedDateLocal(today)
      dispatch(setSelectedDate(today))
    }
  }, [selectedDate, dispatch])

  // Update dates when selectedDate changes
  useEffect(() => {
    setDates(generateDates())
  }, [selectedDate])

  // Fetch available time slots for the selected date and service
  const { data: availabilityData, isLoading: isLoadingSlots } = useGetAvailableTimeSlotsQuery(
    {
      providerId: primaryService?.providerId || '',
      serviceId: primaryService?.id || '',
      date: selectedDate || new Date().toISOString().split('T')[0]
    },
    {
      skip: !primaryService || !selectedDate
    }
  )

  const timeSlots = availabilityData?.timeSlots || []

  const staffMembers = ['Any Professional'] // For now, we'll keep this simple

  const handleBack = () => {
    router.push(`/services/book-now?serviceId=${serviceIds[0]}`)
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    if (selectedTime && selectedDate) {
      dispatch(setSelectedTimeSlot(selectedTime))
      dispatch(setSelectedDate(selectedDate))
      router.push(`/services/confirm-appointment?serviceIds=${serviceIds.join(',')}&date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`)
    }
  }

  const handleDateSelect = (dateInfo: any) => {
    setSelectedDateLocal(dateInfo.fullDate)
    dispatch(setSelectedDate(dateInfo.fullDate))
    setSelectedTime('') // Reset time when date changes
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

    <span className="text-sm text-gray-500">September 2025</span>
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


              {/* Date Selection - Small view */}
              <div className="grid grid-cols-7 gap-3 mb-8">
                {dates.map((dateItem) => (
                  <div key={dateItem.fullDate} className="flex flex-col items-center">
                    <button
                      onClick={() => handleDateSelect(dateItem)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${
                        dateItem.selected
                          ? 'bg-[#E89B8B] text-white ring-2 ring-[#E89B8B] ring-opacity-30'
                          : dateItem.available
                          ? 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                          : 'text-gray-300 cursor-not-allowed border border-gray-100 bg-gray-50'
                      }`}
                      disabled={!dateItem.available}
                    >
                      {dateItem.date}
                    </button>
                    <span className="text-xs text-gray-500 font-medium">{dateItem.day}</span>
                  </div>
                ))}
              </div>

              {/* Time Slots List */}
              <div className="space-y-3">
                {isLoadingSlots ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E89B8B]"></div>
                    <p className="mt-2 text-gray-500">Loading available times...</p>
                  </div>
                ) : timeSlots.length > 0 ? (
                  timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? 'bg-[#E89B8B] text-white ring-2 ring-[#E89B8B] ring-opacity-30'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#E89B8B] hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No available time slots for this date.</p>
                    <p className="text-sm text-gray-400 mt-1">Please select a different date.</p>
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
                disabled={!selectedTime || !selectedDate}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  selectedTime && selectedDate
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
  )
}

export default SelectTime