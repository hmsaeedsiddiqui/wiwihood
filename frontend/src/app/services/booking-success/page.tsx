'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/app/components/navbar'
import { useGetBookingByIdQuery } from '@/store/api/bookingsApi'

function BookingSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams?.get('bookingId')
  
  // Fetch booking details
  const { data: booking, isLoading, error } = useGetBookingByIdQuery(
    bookingId || '', 
    { skip: !bookingId }
  )

  const handleViewBookings = () => {
    router.push('/bookings')
  }

  const handleBookAnother = () => {
    router.push('/services')
  }

  const handleHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E89B8B] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the booking details.</p>
            <button 
              onClick={handleHome} 
              className="px-4 py-2 bg-[#E89B8B] text-white rounded-lg hover:bg-[#D4876F]"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Extract date from startTime
  const bookingDate = new Date(booking.startTime)
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const formattedTime = bookingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your appointment has been successfully booked. We've sent a confirmation email to {booking.customerEmail}.
          </p>

          {/* Booking Details Card */}
          <div className="bg-[#FFF8F1] rounded-2xl p-8 border border-gray-100 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Booking Details</h2>
            
            <div className="space-y-4">
              {/* Booking ID */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Booking ID</span>
                <span className="text-gray-900 font-semibold">#{booking.id}</span>
              </div>

              {/* Provider */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Provider</span>
                <span className="text-gray-900">{booking.provider?.businessName || 'Service Provider'}</span>
              </div>

              {/* Customer */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Customer</span>
                <span className="text-gray-900">{booking.customerName}</span>
              </div>

              {/* Date & Time */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Date & Time</span>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">{formattedDate}</div>
                  <div className="text-gray-600">{formattedTime}</div>
                </div>
              </div>

              {/* Service */}
              {booking.service && (
                <div className="py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Service</span>
                  <div className="mt-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-gray-900">{booking.service.name}</div>
                        <div className="text-sm text-gray-500">{booking.service.durationMinutes || booking.service.duration} mins</div>
                      </div>
                      <span className="text-gray-900">AED {booking.service.basePrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-900 font-semibold text-lg">Total Paid</span>
                <span className="text-gray-900 font-bold text-xl">
                  AED {booking.totalPrice}
                </span>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Status</span>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Payment {booking.paymentStatus || 'completed'}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="py-3">
                  <span className="text-gray-600 font-medium">Special Notes</span>
                  <div className="mt-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {booking.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Please arrive 10 minutes before your appointment time</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You can reschedule or cancel up to 2 hours before your appointment</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Confirmation email has been sent to {booking.customerEmail}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleViewBookings}
              className="px-6 py-3 bg-[#E89B8B] text-white rounded-xl font-semibold hover:bg-[#D4876F] transition-colors"
            >
              View My Bookings
            </button>
            <button 
              onClick={handleBookAnother}
              className="px-6 py-3 border border-[#E89B8B] text-[#E89B8B] rounded-xl font-semibold hover:bg-[#E89B8B] hover:text-white transition-colors"
            >
              Book Another Service
            </button>
            <button 
              onClick={handleHome}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccess