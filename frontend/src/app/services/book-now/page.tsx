'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/navbar'

function BookNow() {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Haircut')

  const handleBack = () => {
    router.back()
  }

  const handleClose = () => {
    router.push('/services')
  }

  const handleContinue = () => {
    router.push('/services/select-time')
  }

  const serviceCategories = [
    'Haircut', 'Wet Shave', 'Beard Trimming', 'Combination', 'Student Cuts'
  ]

  const services = [
    {
      id: 1,
      name: 'IBX Treatment without Service',
      duration: '30 mins',
      price: 'AED 70'
    },
    {
      id: 2,
      name: 'IBX Treatment without Service',
      duration: '30 mins',
      price: 'AED 70'
    }
  ]

  const toggleService = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  return (
    <div className="min-h-screen h-[495px] bg-gray-50">
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
              <span className="font-medium text-gray-900">Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Time</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Confirm</span>
            </div>
          </div>
          
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#FFF8F1] rounded-2xl p-6 h-[495px]">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Services</h1>
              
              {/* Service Categories */}
              <div className="flex flex-wrap gap-3 mb-8">
                {serviceCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#E89B8B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Service Items */}
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className=" bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">{service.duration}</p>
                        <p className="font-bold text-gray-900">{service.price}</p>
                      </div>
                      
                      <button
                        onClick={() => toggleService(service.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedServices.includes(service.id)
                            ? 'bg-[#E89B8B] border-[#E89B8B]'
                            : 'border-gray-300 hover:border-[#E89B8B]'
                        }`}
                      >
                        {selectedServices.includes(service.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" />
                          </svg>
                        )}
                        {!selectedServices.includes(service.id) && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Salon Info & Booking Summary */}
          <div className="space-y-6">
            {/* Salon Info */}
            <div className="bg-[#FFF8F1] h-[495px] rounded-2xl p-6">
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
              
              <div className="border-t border-gray-200 pt-4">
                {selectedServices.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {selectedServices.map((serviceId) => {
                      const service = services.find(s => s.id === serviceId)
                      return service ? (
                        <div key={serviceId} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-500">{service.duration} with very professional</p>
                          </div>
                          <span className="font-semibold text-gray-900">{service.price}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No services selected</p>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">
                    {selectedServices.length > 0 
                      ? `AED ${selectedServices.reduce((total, serviceId) => {
                          const service = services.find(s => s.id === serviceId)
                          return total + (service ? parseInt(service.price.replace('AED ', '')) : 0)
                        }, 0)}`
                      : 'free'
                    }
                  </span>
                </div>
                
                <button 
                  onClick={handleContinue}
                  disabled={selectedServices.length === 0}
                  className={`w-full py-3 rounded-full font-semibold transition-colors ${
                    selectedServices.length > 0
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
    </div>
  )
}

export default BookNow