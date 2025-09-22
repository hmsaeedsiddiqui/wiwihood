'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createStripeCheckoutSession } from '@/lib/stripe'
import { getAuthHeaders } from '@/lib/auth'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface Provider {
  id: string
  businessName: string
  user: {
    firstName: string
    lastName: string
  }
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookServicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const providerId = searchParams.get('providerId')

  const [service, setService] = useState<Service | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Generate sample time slots
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          available: Math.random() > 0.3 // Random availability
        })
      }
    }
    return slots
  }

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split('T')[0])
    
    // Generate time slots
    setTimeSlots(generateTimeSlots())

    // Mock service and provider data
    if (serviceId && providerId) {
      setService({
        id: serviceId,
        name: 'Professional Haircut & Styling',
        description: 'Complete hair styling service including wash, cut, and blow dry',
        price: 75,
        duration: 60,
        category: 'Hair'
      })
      
      setProvider({
        id: providerId,
        businessName: 'Elite Beauty Salon',
        user: {
          firstName: 'Sarah',
          lastName: 'Johnson'
        }
      })
    }
  }, [serviceId, providerId])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !service || !provider) {
      alert('Please select a date and time')
      return
    }

    setBookingLoading(true)
    try {
      // Create booking first
      const bookingData = {
        serviceId: service.id,
        providerId: provider.id,
        startTime: `${selectedDate}T${selectedTime}:00`,
        endTime: `${selectedDate}T${String(parseInt(selectedTime.split(':')[0]) + 1).padStart(2, '0')}:${selectedTime.split(':')[1]}:00`,
        totalPrice: service.price,
        notes: notes
      }

      const response = await fetch('http://localhost:8000/api/v1/bookings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        const booking = await response.json()
        // Store booking for payment success page
        localStorage.setItem('pendingBooking', JSON.stringify({
          ...bookingData,
          id: booking.id,
          serviceDetails: {
            name: service.name,
            provider: provider.businessName,
            duration: service.duration
          },
          selectedDate,
          selectedTime
        }))
        
        // Proceed to payment
        const successUrl = window.location.origin + `/booking-success?bookingId=${booking.id}`
        const cancelUrl = window.location.origin + `/book-service?serviceId=${service.id}&providerId=${provider.id}`
        
        const checkoutUrl = await createStripeCheckoutSession({
          amount: Math.round(service.price * 100), // Convert to cents
          currency: 'usd',
          description: `Booking for ${service.name} with ${provider.businessName}`,
          successUrl,
          cancelUrl,
        })

        // Redirect to Stripe checkout
        window.location.href = checkoutUrl
      } else {
        const errorData = await response.json()
        alert(`Failed to create booking: ${errorData.message || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (!serviceId || !providerId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking Request</h1>
          <p className="text-gray-600 mb-6">Please select a service from our browse page</p>
          <button 
            onClick={() => router.push('/browse')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Service</h1>
          <p className="text-gray-600">Complete your booking in just a few steps</p>
        </div>

        {/* Service Info */}
        {service && provider && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🏢</span>
                    <span>{provider.businessName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">⏱️</span>
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">💰</span>
                    <span className="font-semibold">${service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Select Date & Time</h3>
          
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 text-sm font-medium rounded-lg transition ${
                    selectedTime === slot.time
                      ? 'bg-purple-600 text-white'
                      : slot.available
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes for the provider..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTime && service && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>${service.price}</span>
                </div>
              </div>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || bookingLoading}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}