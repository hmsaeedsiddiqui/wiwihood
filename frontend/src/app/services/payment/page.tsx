'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Navbar from '@/app/components/navbar'
import { useGetServicesQuery } from '@/store/api/servicesApi'
import { useCreateBookingMutation } from '@/store/api/bookingsApi'
import { useCreatePaymentIntentMutation } from '@/store/api/stripeApi'

interface CardDetails {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

function Payment() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  
  // Get all booking details from URL params
  const serviceIds = searchParams?.get('serviceIds')?.split(',') || []
  const selectedDate = searchParams?.get('date') || ''
  const selectedTime = decodeURIComponent(searchParams?.get('time') || '')
  const customerName = searchParams?.get('customerName') || ''
  const customerEmail = searchParams?.get('customerEmail') || ''
  const customerPhone = searchParams?.get('customerPhone') || ''
  const notes = searchParams?.get('notes') || ''

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditcard')
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [errors, setErrors] = useState<Partial<CardDetails>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // RTK Query hooks
  const { data: allServices = [] } = useGetServicesQuery({ isActive: true, status: 'active' })
  const [createBooking] = useCreateBookingMutation()
  const [createPaymentIntent] = useCreatePaymentIntentMutation()

  const selectedServices = allServices.filter(service => serviceIds.includes(service.id))
  const primaryService = selectedServices[0]

  // Calculate totals
  const subtotal = selectedServices.reduce((total, service) => 
    total + parseFloat(service.basePrice.toString()), 0
  )
  const tax = subtotal * 0.05 // 5% tax
  const totalAmount = subtotal + tax
  const totalDuration = selectedServices.reduce((total, service) => 
    total + service.durationMinutes, 0
  )

  const paymentMethods = [
    { id: 'creditcard', name: 'Pay with credit card', icon: '💳' }
  ]

  const handleCardInputChange = (field: keyof CardDetails, value: string) => {
    let formattedValue = value

    // Format card number
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19)
    }

    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5)
    }

    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateCard = (): boolean => {
    const newErrors: Partial<CardDetails> = {}

    if (!cardDetails.cardNumber.replace(/\s/g, '') || cardDetails.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }

    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)'
    }

    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV'
    }

    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBack = () => {
    const params = new URLSearchParams({
      serviceIds: serviceIds.join(','),
      date: selectedDate,
      time: selectedTime
    })
    router.push(`/services/confirm-appointment?${params.toString()}`)
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handlePayment = async () => {
    if (!validateCard()) return

    setIsProcessing(true)
    
    try {
      // Create payment intent
      const paymentIntentResponse = await createPaymentIntent({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'aed',
        serviceId: serviceIds[0],
        providerId: primaryService?.providerId || '',
        customerEmail: customerEmail,
        customerName: customerName,
        description: `Booking for ${selectedServices.map(s => s.name).join(', ')}`
      }).unwrap()

      // Create booking
      const bookingData = {
        serviceId: serviceIds[0], // Primary service
        providerId: primaryService?.providerId || '',
        startTime: `${selectedDate}T${selectedTime}:00Z`,
        endTime: `${selectedDate}T${selectedTime}:00Z`, // Will be calculated on backend
        totalPrice: totalAmount,
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || undefined,
        status: 'confirmed' as const
      }

      const bookingResponse = await createBooking(bookingData).unwrap()

      // Navigate to success page
      router.push(`/services/booking-success?bookingId=${bookingResponse.id}`)
      
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
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
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h1>
              
              {/* Payment Method Selection */}
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? 'border-[#E89B8B] bg-[#E89B8B]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Payment Method Icons */}
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            VISA
                          </div>
                          <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            MC
                          </div>
                          <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                            AE
                          </div>
                        </div>
                      </div>
                      
                      <span className="font-medium text-gray-900">{method.name}</span>
                      
                      <div className="ml-auto">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? 'border-[#E89B8B] bg-[#E89B8B]'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Credit Card Form */}
              {selectedPaymentMethod === 'creditcard' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
                  
                  {/* Card Number */}
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      id="cardholderName"
                      value={cardDetails.cardholderName}
                      onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent ${
                        errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
                  </div>
                </div>
              )}
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
              
              {/* Customer Details */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="text-gray-900 font-medium">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-900">{customerPhone}</span>
                  </div>
                </div>
              </div>
              
              {/* Appointment Details */}
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
              
              {/* Payment Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="text-gray-900">AED {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg">AED {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pay Button */}
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  isProcessing
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#E89B8B] text-white hover:bg-[#D4876F]'
                }`}
              >
                {isProcessing ? 'Processing Payment...' : `Pay AED ${totalAmount.toFixed(2)}`}
              </button>
              
              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment