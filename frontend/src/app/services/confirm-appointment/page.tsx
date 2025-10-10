'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function ConfirmAppointment() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const upcomingAppointments = [
    {
      id: 1,
      salon: 'Luxio Nail Ladies Salon',
      time: 'Tomorrow at 12:00 pm',
      price: 'AED 291 - 1 item',
      image: '/service1.png'
    },
    {
      id: 2,
      salon: 'Luxio Nail Ladies Salon',
      time: 'Tomorrow at 12:00 pm',
      price: 'AED 291 - 1 item',
      image: '/service1.png'
    },
    {
      id: 3,
      salon: 'Luxio Nail Ladies Salon',
      time: 'Tomorrow at 12:00 pm',
      price: 'AED 291 - 1 item',
      image: '/service1.png'
    }
  ]

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  const handleAppointmentsClick = () => {
    console.log('Appointments clicked')
  }

  const handleWalletClick = () => {
    console.log('Wallet clicked')
  }

  const handleFavouritesClick = () => {
    console.log('Favourites clicked')
  }

  const handleProductOrdersClick = () => {
    console.log('Product orders clicked')
  }

  const handleSettingsClick = () => {
    console.log('Settings clicked')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#E89B8B] text-white px-4 py-2 rounded-full font-bold text-lg">
                vividhood
              </div>
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search stylists,therapists, salons, spas and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                <button onClick={handleProfileClick} className="w-full flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700">Profile</span>
                </button>
                
                <button onClick={handleAppointmentsClick} className="w-full flex items-center space-x-3 text-left p-3 rounded-lg bg-[#E89B8B] text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Appointments</span>
                </button>
                
                <button onClick={handleWalletClick} className="w-full flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-700">Wallet</span>
                </button>
                
                <button onClick={handleFavouritesClick} className="w-full flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-gray-700">Favourites</span>
                </button>
                
                <div className="border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-500 font-medium">Forms</span>
                </div>
                
                <button onClick={handleProductOrdersClick} className="w-full flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-gray-700">Product orders</span>
                </button>
                
                <button onClick={handleSettingsClick} className="w-full flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              </div>
              
              {/* Upcoming Section */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
                  <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{appointment.salon}</h3>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                        <p className="text-sm text-gray-500">{appointment.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Appointment Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              {/* Main Appointment Card */}
              <div className="relative mb-6">
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">Luxio Nail Ladies Salon</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Confirmed</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Tomorrow at 12:00 pm</h3>
                <p className="text-sm text-gray-500">2 hours duration</p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Add to calendar</p>
                    <p className="text-xs text-gray-500">Get reminded automatically</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Getting there</p>
                    <p className="text-xs text-gray-500">Arezzo Tower, Shop 8 Exit 33, Dubai Media City, Dubai</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Manage appointment</p>
                    <p className="text-xs text-gray-500">Reschedule or cancel your appointment</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Venue details</p>
                    <p className="text-xs text-gray-500">Luxio Nail Ladies Salon</p>
                  </div>
                </button>
              </div>
              
              {/* Overview Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Overview</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Dry Pedicure / Luxio Gel</p>
                      <p className="text-xs text-gray-500">2 hrs with Rahi</p>
                    </div>
                    <span className="font-semibold text-gray-900">AED 200</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">AED 200</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">AED 10</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">AED 210</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Cancellation policy</h5>
                    <p className="text-xs text-gray-600">Please cancel at least a day or 2 hours of your appointment time.</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Important info</h5>
                    <p className="text-xs text-gray-600">Cancellation policy: Cancel by 1 day ago. 2 hours ahead, otherwise you can be charged 100% of the total booking amount.</p>
                    <p className="text-xs text-gray-600 mt-2">Booking at: 8/30/2024/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmAppointment