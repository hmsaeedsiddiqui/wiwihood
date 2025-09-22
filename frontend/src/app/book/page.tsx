"use client";
import Link from "next/link";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  User, 
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  basePrice: number
  duration: number
  provider: {
    id: number
    businessName: string
    businessAddress: string
    businessCity: string
    averageRating: number
    totalReviews: number
    user: {
      firstName: string
      lastName: string
    }
  }
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookingPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const { cart, clearCart } = useCart();
  const [bookingDetails, setBookingDetails] = useState({
    notes: '',
    customerInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: ''
    }
  })
  const [loading, setLoading] = useState(false)

  // Service data will be loaded from URL params or API when integrated
  // Currently using cart items for service information

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
      })
    }
    return dates
  }

  // Generate time slots
  const getTimeSlots = (date: string): TimeSlot[] => {
    const slots = []
    const startHour = 9
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        // Mock availability - in real app, check against provider's schedule
        const available = Math.random() > 0.3
        slots.push({ time, available })
      }
    }
    return slots
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    try {
      // Mock booking API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, make API call to create booking
      console.log('Booking created:', {
        serviceId: selectedService?.id,
        providerId: selectedService?.provider.id,
        date: selectedDate,
        time: selectedTime,
        customerInfo: bookingDetails.customerInfo,
        notes: bookingDetails.notes
      })
      
      setStep(4) // Success step
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const availableDates = getAvailableDates()
  const timeSlots = selectedDate ? getTimeSlots(selectedDate) : []

  // Remove selectedService check, use cart check only
  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No services selected for booking. <Link href="/shop" className="text-green-600 underline">Browse Services</Link></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600">
            {step === 4 ? 'Booking Confirmed!' : `Step ${step} of 3`}
          </p>
        </div>

        {/* Progress Bar */}
        {step !== 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Service', 'Date & Time', 'Details'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                    {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {stepName}
                  </span>
                  {index < 2 && (
                    <div className="mx-4 flex-1 h-px" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Cart</CardTitle>
                  <CardDescription>
                    Review all services you are booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-start space-x-4 border-b pb-4 mb-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.provider}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.quantity} x {item.price} USD
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700">
                      Continue to Date & Time
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                    <CardDescription>
                      Choose your preferred appointment date
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableDates.map((dateInfo) => (
                        <button
                          key={dateInfo.date}
                          onClick={() => setSelectedDate(dateInfo.date)}
                          className={"p-3 rounded-lg border text-center transition-colors"}
                        >
                          <div className="font-medium text-sm">{dateInfo.dayName}</div>
                          <div className="text-sm text-gray-600">{dateInfo.displayDate}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Time</CardTitle>
                      <CardDescription>
                        Available times for {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={"p-2 rounded-lg border text-center text-sm transition-colors"}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={!selectedDate || !selectedTime}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Booking Details */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    Complete your booking information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        value={bookingDetails.customerInfo.firstName}
                        onChange={(e) => setBookingDetails({
                          ...bookingDetails,
                          customerInfo: {
                            ...bookingDetails.customerInfo,
                            firstName: e.target.value
                          }
                        })}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        value={bookingDetails.customerInfo.lastName}
                        onChange={(e) => setBookingDetails({
                          ...bookingDetails,
                          customerInfo: {
                            ...bookingDetails.customerInfo,
                            lastName: e.target.value
                          }
                        })}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={bookingDetails.customerInfo.email}
                      onChange={(e) => setBookingDetails({
                        ...bookingDetails,
                        customerInfo: {
                          ...bookingDetails.customerInfo,
                          email: e.target.value
                        }
                      })}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={bookingDetails.customerInfo.phone}
                      onChange={(e) => setBookingDetails({
                        ...bookingDetails,
                        customerInfo: {
                          ...bookingDetails.customerInfo,
                          phone: e.target.value
                        }
                      })}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      value={bookingDetails.notes}
                      onChange={(e) => setBookingDetails({
                        ...bookingDetails,
                        notes: e.target.value
                      })}
                      placeholder="Any special requests or notes for the provider..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleBooking}
                      disabled={loading || !bookingDetails.customerInfo.firstName || !bookingDetails.customerInfo.email}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Booking Confirmed!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => router.push('/dashboard')} className="w-full">
                      View My Bookings
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService && (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedService.name}</h4>
                      <p className="text-sm text-gray-600">{selectedService.provider.businessName}</p>
                    </div>
                    
                    {selectedDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                    
                    {selectedTime && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedTime} ({selectedService.duration} min)
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                          
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                {step === 3 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Payment Information</p>
                        <p>Payment will be collected at the time of service. Cash, card, and digital payments accepted.</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
