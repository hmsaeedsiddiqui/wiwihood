"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function Hero() {
  // State for search form
  const [selectedService, setSelectedService] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [currentLocationText, setCurrentLocationText] = useState('')
  
  const router = useRouter()

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [])

  // Handle geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setCurrentLocationText('Getting your location...')
      setUseCurrentLocation(true)
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocationText('Current location detected')
          setSelectedLocation('current-location')
        },
        (error) => {
          setCurrentLocationText('Unable to detect location')
          setUseCurrentLocation(false)
          console.error('Error getting location:', error)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  // Handle search
  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      service: selectedService,
      location: useCurrentLocation ? 'current-location' : selectedLocation,
      date: selectedDate,
      time: selectedTime
    })
    
    router.push(`/search-results?${searchParams.toString()}`)
  }
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div className="absolute w-[1920px] h-[800px] left-1/2 -translate-x-1/2 top-0 bg-cover bg-center bg-no-repeat" 
           style={{backgroundImage: "url('/hero-bg-image.jpg')"}}>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0"></div>
      </div>
      
      {/* Vector Overlay */}
      <div className="absolute right-0 bottom-[10px]">
        <img 
          src="/Vector-overlay.svg" 
          alt="Vector overlay"
          className="w-full h-auto"
        />
      </div>

        {/* Vector Overlay */}
      <div className="absolute left-0 bottom-[10px]">
        <img 
          src="/Vector-overlay.svg" 
          alt="Vector overlay"
          className="w-full h-auto"
        />
      </div>
    

      {/* Image at bottom right */}
      <div className="absolute bottom-5 right-0">
        <img 
          src="/bottom-right-image.png" 
          alt="Beauty services" 
          className="w-64 h-64 object-cover"
        />
      </div>


      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg mb-3">Welcome to viyhood</p>
            <h1 className="text-5xl font-light text-gray-800 mb-4">Make Appointment</h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Explore premium beauty services near you and indulge in self-care. From rejuvenating facials to professional hair treatments, 
              Vividhood connects you with trusted professionals.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              
              {/* Services Dropdown */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Select Service
                  <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </label>
                <div className="relative">
                  <select 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-[#E89B8B] transition-all duration-200 text-gray-700"
                  >
                    <option value="">Select Service</option>
                    <option value="haircuts">Hair Cuts & Styling</option>
                    <option value="facials">Facial Treatments</option>
                    <option value="massages">Massage Therapy</option>
                    <option value="nails">Nail Care</option>
                    <option value="eyebrows">Eyebrow Services</option>
                    <option value="waxing">Waxing Services</option>
                                        <option value="spa">Spa Packages</option>
                    <option value="makeup">Makeup Services</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Location with Geolocation */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-[#E89B8B] transition-all duration-200 text-gray-700"
                    disabled={useCurrentLocation}
                  >
                    <option value="">{useCurrentLocation ? currentLocationText : 'Select Location'}</option>
                    <option value="dubai-marina">Dubai Marina</option>
                    <option value="downtown-dubai">Downtown Dubai</option>
                    <option value="jumeirah">Jumeirah</option>
                    <option value="bur-dubai">Bur Dubai</option>
                    <option value="deira">Deira</option>
                    <option value="sheikh-zayed">Sheikh Zayed Road</option>
                    <option value="al-barsha">Al Barsha</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Enhanced Geolocation Button */}
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-base text-[#E89B8B] hover:text-[#D4876F] flex items-center transition-colors justify-center w-full py-2 px-3 rounded-lg hover:bg-[#E89B8B] hover:text-white font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use current location
                </button>
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Select Date"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-[#E89B8B] transition-all duration-200 text-gray-700"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Time</label>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-[#E89B8B] transition-all duration-200 text-gray-700"
                  >
                    <option value="" disabled>Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white py-4 px-8 rounded-xl text-lg font-semibold hover:from-[#D4876F] hover:to-[#C07962] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Available Services
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
