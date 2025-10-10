'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/navbar'

function Payment() {
  const router = useRouter()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditcard')

  const paymentMethods = [
    { id: 'creditcard', name: 'Pay with credit card', icon: '💳' }
  ]

  const handleBack = () => {
    router.push('/services/select-time')
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    // Process payment and complete booking
    router.push('/services/confirm-appointment')
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
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Review and confirm</h1>
              
              {/* Payment Method Selection */}
              <div className="bg-white space-y-4 rounded-xl">
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
                        {/* Credit Card Icons */}
                        <div className="flex space-x-1">
                          {/* Visa */}
                          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            VISA
                          </div>
                          {/* Mastercard */}
                          <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            MC
                          </div>
                          {/* American Express */}
                          <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                            AE
                          </div>
                          {/* Generic Card */}
                          <div className="w-8 h-5 bg-gray-600 rounded text-white text-xs flex items-center justify-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                              <path d="M6 8h8v2H6V8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <span className="font-medium text-gray-900">{method.name}</span>
                      
                      {/* Radio Button */}
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
            </div>
          </div>

          {/* Right Column - Booking Summary */}
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
              
              {/* Appointment Details */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-gray-900">Wednesday, 1 October</span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">10:00-10:30 pm (30 mins duration)</span>
                </div>
              </div>
              
              {/* Service Details */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">IBX Treatment without Service</h4>
                    <p className="text-sm text-gray-500">30 mins with any professional</p>
                  </div>
                  <span className="font-semibold text-gray-900">AED 70</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">AED 70</span>
                </div>
              </div>
              
              {/* Continue Button */}
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

export default Payment