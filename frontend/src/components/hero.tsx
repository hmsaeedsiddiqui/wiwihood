import React from 'react'

function Hero() {
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


      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gray-600 text-lg mb-4">Welcome to viyhood</p>
            <h1 className="text-5xl font-light text-gray-800 mb-6">Make Appointment</h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
              Explore premium beauty services near you and indulge in self-care. From rejuvenating facials to professional hair treatments, 
              Vividhood connects you with trusted professionals.
            </p>
          </div>

          {/* Appointment Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* All treatments & venues */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center">
                  All treatments & venues
                  <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent">
                    <option>Beauty & Wellness</option>
                    <option>Hair Salon</option>
                    <option>Spa Services</option>
                    <option>Nail Care</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Select location */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Select location</label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent">
                    <option>Canada</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Select date & time */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Select date & time</label>
                <div className="relative">
                  <input 
                    type="time" 
                    defaultValue="01:00"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Book Appointment Button */}
            <button className="w-full bg-[#E89B8B] text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-[#D4876F] transition-colors duration-200">
              Book Your Appointment
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
