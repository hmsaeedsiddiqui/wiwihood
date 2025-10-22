import React from 'react'

interface ServiceHeroProps {
  categoryName?: string;
  breadcrumb?: string;
}

function ServiceHero({ categoryName = 'Beauty Services', breadcrumb = 'All Services' }: ServiceHeroProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#F5E6E3] to-[#F0D5D1] h-[586px] flex items-center overflow-hidden">
        {/* Background image */}
      <div className="absolute w-[1920px] h-[800px] left-1/2 -translate-x-1/2 top-0 bg-cover bg-center bg-no-repeat" 
           style={{backgroundImage: "url('/hero-bg-image.jpg')"}}>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0"></div>
      </div>
        {/* Image at bottom right */}
      <div className="absolute bottom-5 right-0">
        <img 
          src="/bottom-right-image.png" 
          alt="Beauty services" 
          className="w-64 h-64 object-cover"
        />
      </div>

        <div className="container mx-auto px-6 text-center relative z-10">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Home <span className="text-gray-600"> &gt; </span> {breadcrumb}
          </p>
          <h1 className="text-5xl font-light text-gray-800 mb-6">
           {categoryName}
          </h1>
          
        </div>

        {/* Vector Overlay */}
        <div className="absolute left-0 -bottom-8 w-[1920px]">
          <img 
            src="/Vector-overlay.svg" 
            alt="Vector overlay"
            className="w-full h-auto"
          />
        </div>
      </section>
    </>
  )
}

export default ServiceHero