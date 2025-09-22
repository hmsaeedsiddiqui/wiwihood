'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { getAuthHeaders } from '@/lib/auth'

interface BookingConfirmation {
  id: string
  date: string
  time: string
  status: string
  totalPrice: number
  service: any
  provider: any
}

interface PendingBooking {
  serviceId: string
  providerId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: string
  notes?: string
  serviceDetails: {
    name: string
    provider: string
    duration: number
  }
  selectedDate: string
  selectedTime: string
}

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState<BookingConfirmation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const confirmBookingAfterPayment = async () => {
      try {
        if (!searchParams) {
          throw new Error('Search parameters not available')
        }

        // Check if we have a bookingId (new flow) or session_id (old flow)
        const bookingId = searchParams.get('bookingId')
        const sessionId = searchParams.get('session_id')
        
        if (!bookingId && !sessionId) {
          throw new Error('Payment session or booking ID not found')
        }

        // If we have a bookingId, the booking was already created, just fetch it
        if (bookingId) {
          const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
          const response = await fetch(`${apiBaseURL}/bookings/${bookingId}`, {
            headers: getAuthHeaders()
          })

          if (response.ok) {
            const bookingData = await response.json()
            setBooking(bookingData)
            localStorage.removeItem('pendingBooking') // Clean up
          } else {
            throw new Error('Failed to fetch booking details')
          }
        } else {
          // Old flow - create booking after payment (fallback)
          const pendingBookingData = localStorage.getItem('pendingBooking')
          if (!pendingBookingData) {
            throw new Error('Booking data not found')
          }

          const pendingBooking: PendingBooking = JSON.parse(pendingBookingData)
          
          const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
          const token = localStorage.getItem('token')

          const axiosConfig = {
            baseURL: apiBaseURL,
            headers: getAuthHeaders() as any,
          }

        // Final availability check before creating booking
        const availabilityCheck = await fetch(`${apiBaseURL}/bookings/check-availability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            providerId: pendingBooking.providerId,
            startTime: pendingBooking.startTime,
            endTime: pendingBooking.endTime,
          }),
        })

        if (availabilityCheck.ok) {
          const availabilityResult = await availabilityCheck.json()
          if (!availabilityResult.available) {
            throw new Error('Time slot is no longer available. Your payment will be refunded within 3-5 business days.')
          }
        }

        const response = await axios.post(`${apiBaseURL}/bookings`, {
          serviceId: pendingBooking.serviceId,
          providerId: pendingBooking.providerId,
          startTime: pendingBooking.startTime,
          endTime: pendingBooking.endTime,
          totalPrice: pendingBooking.totalPrice,
          status: 'confirmed', // Set as confirmed since payment is done
          notes: pendingBooking.notes,
        }, axiosConfig)

        console.log('Booking created successfully:', response.data)
        setBooking(response.data)

        // Clear pending booking data
        localStorage.removeItem('pendingBooking')
        }

      } catch (err: any) {
        console.error('Failed to confirm booking after payment:', err)
        setError(err.response?.data?.message || err.message || 'Failed to confirm booking')
      } finally {
        setLoading(false)
      }
    }

    confirmBookingAfterPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Processing your booking...</h2>
          <p className="text-gray-600">Please wait while we confirm your reservation.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/browse')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No booking found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your payment has been processed and your booking is confirmed.</p>
          </div>

          {/* Booking Details */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Service Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{booking.service?.name || 'Service'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{booking.provider?.businessName || 'Provider'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600 capitalize">{booking.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Schedule & Payment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{booking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium text-green-600">€{Number(booking.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/bookings')}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                View My Bookings
              </button>
              <button
                onClick={() => router.push('/browse')}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Book Another Service
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You will receive a confirmation email shortly</li>
            <li>• The provider will contact you if any changes are needed</li>
            <li>• You can view and manage your bookings in your account</li>
            <li>• Need to make changes? Contact the provider directly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}