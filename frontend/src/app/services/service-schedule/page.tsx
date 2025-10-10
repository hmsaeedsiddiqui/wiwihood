'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/navbar'

function ServiceSchedule() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(23) // Default to 23rd (Fri)
  const [selectedStaff, setSelectedStaff] = useState('Rahi')

  const dates = [
    { date: 20, day: 'Tue', available: true },
    { date: 21, day: 'Wed', available: true },
    { date: 22, day: 'Thu', available: true },
    { date: 23, day: 'Fri', available: false }, // Fully booked
    { date: 24, day: 'Sat', available: true },
    { date: 25, day: 'Sun', available: true },
    { date: 26, day: 'Mon', available: true }
  ]

  const staffMembers = ['Rahi', 'Sarah', 'Maya', 'Emma']

  const handleBack = () => {
    router.push('/services/book-now')
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    router.push('/services/select-time')
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          {/* Left Column - Date & Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Select time</h1>
              
              {/* Staff Selection */}
              <div className="flex items-center space-x-3 mb-6">
                <select 
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
                >
                  {staffMembers.map((staff) => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
                
                <span className="text-sm text-gray-500">September 2025</span>
                
                <div className="flex items-center space-x-1 ml-auto">
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
                </div>
                
                <button className="p-2 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-7 gap-4 mb-8">
                {dates.map((dateItem) => (
                  <div key={dateItem.date} className="flex flex-col items-center">
                    <button
                      onClick={() => setSelectedDate(dateItem.date)}
                      disabled={!dateItem.available}
                      className={`w-12 h-12 rounded-xl text-lg font-semibold transition-all duration-200 mb-2 ${
                        selectedDate === dateItem.date
                          ? 'bg-[#E89B8B] text-white ring-2 ring-[#E89B8B] ring-opacity-30'
                          : dateItem.available
                          ? 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                          : 'text-gray-300 cursor-not-allowed border border-gray-100 bg-gray-50'
                      }`}
                    >
                      {dateItem.date}
                    </button>
                    <span className="text-xs text-gray-500 font-medium">{dateItem.day}</span>
                  </div>
                ))}
              </div>

              {/* Booking Status Message */}
              <div className="bg-[#FFFFFF] border border-red-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#E89B8B]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    <path d="M7 10h5v5H7z" fill="white"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selected date is fully booked on this date
                </h3>
                <p className="text-sm text-gray-600 mb-4">Available from Thu, 18 Sept</p>
                <button className="bg-[#E89B8B] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#D4876F] transition-colors mb-3">
                  Go to next available date
                </button>
                <p className="text-xs text-gray-500">You can join the waitlist instead</p>
              </div>
            </div>
          </div>

          {/* Right Column - Salon Info & Booking Summary */}
          <div className="space-y-6">
            {/* Salon Info */}
            <div className="bg-[#FFF8F1] rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-lg mb-1">Luxio Nail Ladies Salon</h2>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">4.0 (1,704)</span>
                  </div>
                  <p className="text-sm text-gray-600">Arezzo Tower, Shop 8 Exit 33, Dubai Media City, Dubai</p>
                </div>
              </div>
              
              {/* Selected Service */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">IBX Treatment without Service</h4>
                    <p className="text-sm text-gray-500">30 mins with very professional</p>
                  </div>
                  <span className="font-semibold text-gray-900">AED 70</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">AED 70</span>
                </div>
              </div>
              
              <button 
                onClick={handleContinue}
                className="w-full bg-[#E89B8B] text-white py-3 rounded-xl font-semibold hover:bg-[#D4876F] transition-colors"
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

export default ServiceSchedule