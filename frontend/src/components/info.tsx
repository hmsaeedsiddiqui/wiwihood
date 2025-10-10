import React from 'react'

function Info() {
  const testimonials = [
    {
      id: 1,
      image: "/testimonial1.jpg",
      alt: "Customer testimonial 1"
    },
    {
      id: 2,
      image: "/testimonial2.jpg", 
      alt: "Customer testimonial 2"
    },
    {
      id: 3,
      image: "/testimonial3.jpg",
      alt: "Customer testimonial 3"
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background image with gradient */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('/service-bg.jpg')"}}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-transparent to-white opacity-90"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Pictures */}
          <div className="flex justify-center items-center mb-8 space-x-4">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`relative ${index === 1 ? 'z-10 scale-110' : 'z-0'}`}
              >
                <div className={`rounded-full overflow-hidden border-4 border-white shadow-lg ${
                  index === 1 ? 'w-20 h-20' : 'w-16 h-16'
                }`}>
                  <img 
                    src={testimonial.image}
                    alt={testimonial.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quote Icon */}
          <div className="mb-8">
           <svg className='mx-auto' width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6H4.5C2.01855 6 0 8.01855 0 10.5V24C0 26.4814 2.01855 28.5 4.5 28.5H10.5549L8.27782 40.2136C8.19213 40.6538 8.30785 41.1086 8.59276 41.4543C8.87768 41.8 9.30175 42 9.75 42H14.6096C15.9141 42 17.0735 41.1467 17.4683 39.9111L21.835 29.5532C21.8599 29.4939 21.8811 29.4331 21.8979 29.3716C22.2978 27.9346 22.5 26.4485 22.5 24.9551V10.5C22.5 8.01855 20.4814 6 18 6Z" fill="#FDBFB0"/>
<path d="M43.5 6H30C27.5185 6 25.5 8.01855 25.5 10.5V24C25.5 26.4814 27.5185 28.5 30 28.5H36.0557L33.7778 40.2136C33.6914 40.6538 33.8071 41.1086 34.0928 41.4543C34.377 41.8 34.8018 42 35.25 42H40.1103C41.4155 42 42.5742 41.1467 42.9683 39.9104L47.3349 29.5532C47.3598 29.4939 47.3804 29.4331 47.3979 29.3716C47.7978 27.9331 48 26.447 48 24.9551V10.5C48 8.01855 45.9814 6 43.5 6Z" fill="#FDBFB0"/>
</svg>

          </div>

          {/* Testimonial Quote */}
          <blockquote className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-8 max-w-3xl mx-auto">
            "I love how easy it is to book beauty appointments on Vividhood. The platform 
            connects me with professional services near me and the booking process is so 
            quick and seamless!"
          </blockquote>

          {/* Author Info */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Sophia Lee</h4>
            <p className="text-gray-600 text-sm">Happy Client</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className="w-5 h-5 text-[#E89B8B] mx-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Info