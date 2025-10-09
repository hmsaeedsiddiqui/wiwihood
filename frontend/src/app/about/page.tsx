"use client";

import React from 'react';
import Navbar from '@/components/app/AppNavbar';
import Footer from '@/components/app/AppFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#F5E6E0] py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 opacity-20">
          <div className="w-32 h-32 rounded-full border-2 border-[#E89B8B]"></div>
        </div>
        <div className="absolute bottom-10 left-10 opacity-20">
          <div className="w-20 h-20 rounded-full bg-[#E89B8B]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <p className="text-[#E89B8B] font-medium mb-4">About Us</p>
          <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-6 leading-tight">
            Discover, Book and Glow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A luxurious, trusted marketplace for beauty & wellness - and a new way for salons to grow their business
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="/about-img-1.png" 
                      alt="Beauty salon experience" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-[#F8F8F8] rounded-2xl p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">⭐</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 mb-3">
                      <img src="/testimonial1.jpg" alt="Customer" className="w-8 h-8 rounded-full object-cover" />
                      <img src="/testimonial2.jpg" alt="Customer" className="w-8 h-8 rounded-full object-cover" />
                      <img src="/testimonial3.jpg" alt="Customer" className="w-8 h-8 rounded-full object-cover" />
                    </div>
                    <p className="text-sm text-gray-600">Amazing experience at the salon!</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="/about-img-2.png" 
                      alt="Professional beauty services" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl font-light text-gray-800 mb-6 leading-tight">
                Our story at Vividhood,<br />
                and how we empower
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our platform provides a seamless experience for customers to discover and book appointments with trusted beauty and wellness professionals. We empower service providers with tools to grow their business while ensuring customers receive exceptional service.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E89B8B] rounded-full"></div>
                  <span className="text-gray-700">Verified professionals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E89B8B] rounded-full"></div>
                  <span className="text-gray-700">Easy online booking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E89B8B] rounded-full"></div>
                  <span className="text-gray-700">Secure payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E89B8B] rounded-full"></div>
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>

              <button className="bg-[#E89B8B] text-white px-8 py-3 rounded-full hover:bg-[#D4876F] transition-colors">
                Discover more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="py-16 bg-[#F5E6E0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center items-center space-x-16 opacity-60">
            {/* Brand icons */}
            <img src="/brand-img-1.png" alt="Partner Brand" className="w-16 h-16 object-contain" />
            <img src="/brand-img-2.png" alt="Partner Brand" className="w-16 h-16 object-contain" />
            <img src="/brand-img-3.png" alt="Partner Brand" className="w-16 h-16 object-contain" />
            <img src="/brand-img-4.png" alt="Partner Brand" className="w-16 h-16 object-contain" />
            <img src="/brand-img-5.png" alt="Partner Brand" className="w-16 h-16 object-contain" />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Content */}
            <div>
              <p className="text-[#E89B8B] font-medium mb-4">Impact</p>
              <h2 className="text-4xl font-light text-gray-800 mb-6">
                Our impact, told in numbers
              </h2>
              <p className="text-gray-600 mb-12 leading-relaxed">
                These figures reflect our journey in transforming the beauty industry by connecting customers with exceptional service providers and creating meaningful experiences.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">1.2M +</div>
                  <div className="text-gray-600">Happy customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">450,000 +</div>
                  <div className="text-gray-600">Bookings completed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">130,000 +</div>
                  <div className="text-gray-600">Service providers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">4.9 ★</div>
                  <div className="text-gray-600">Average rating</div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <img src="/badge1.png" alt="Payment Method" className="w-12 h-8 object-contain" />
                <img src="/badge2.png" alt="Payment Method" className="w-12 h-8 object-contain" />
                <img src="/badge3.png" alt="Security Badge" className="w-12 h-8 object-contain" />
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img 
                  src="/about-img-3.png" 
                  alt="Beauty impact statistics" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#F5E6E0]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#E89B8B] font-medium mb-4">For Businesses</p>
          <h2 className="text-4xl font-light text-gray-800 mb-4">
            Simple, transparent fees
          </h2>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            We charge a small fee per booking with no setup costs or monthly fees. You only pay when you earn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pay as you go */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Pay as you go</h3>
              <div className="text-3xl font-bold text-gray-800 mb-1">12%</div>
              <div className="text-gray-600 mb-6">per booking fee</div>
              
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Online booking & payment
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Customer reviews & feedback
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Basic analytics & reporting
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Email support
                </li>
              </ul>

              <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-full hover:bg-gray-200 transition-colors">
                Get free business
              </button>
            </div>

            {/* Standard */}
            <div className="bg-[#E89B8B] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-[#E89B8B] px-3 py-1 rounded-full text-sm font-medium">
                Most popular
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">Standard</h3>
              <div className="text-3xl font-bold mb-1">$39 <span className="text-lg font-normal">per month</span></div>
              <div className="opacity-90 mb-6">7% per booking</div>
              
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  All features in Pay as you go
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Advanced calendar management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Marketing tools & promotions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Priority customer support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Staff management
                </li>
              </ul>

              <button className="w-full bg-white text-[#E89B8B] py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
                Start Standard
              </button>
            </div>

            {/* Growth */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Growth</h3>
              <div className="text-3xl font-bold text-gray-800 mb-1">$79 <span className="text-lg font-normal">per month</span></div>
              <div className="text-gray-600 mb-6">5% per booking</div>
              
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  All features in Standard
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Advanced analytics & insights
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Custom branding options
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  API access & integrations
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Dedicated account manager
                </li>
              </ul>

              <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-full hover:bg-gray-200 transition-colors">
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-4 mb-8">
            <img src="/testimonial1.jpg" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
            <img src="/testimonial2.jpg" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
            <img src="/testimonial3.jpg" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
          </div>
          
          <div className="text-6xl mb-6">💬</div>
          
          <blockquote className="text-2xl font-light text-gray-800 mb-8 leading-relaxed">
            "I love how easy it is to book beauty appointments on Vividhood. The platform connects me with professional services near me and the booking process is so quick and seamless"
          </blockquote>
          
          <div className="text-gray-600">
            <div className="font-medium">Sophia Lee</div>
            <div className="text-sm">Happy Customer</div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-[#F5E6E0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#E89B8B] font-medium mb-4">Latest News</p>
            <h2 className="text-4xl font-light text-gray-800">News & Articles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <article key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item === 1 ? '/facial-treatment.jpg' : item === 2 ? '/service2.jpg' : '/service3.jpg'}
                    alt={`Beauty article ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[#E89B8B] text-sm font-medium mb-2">Beauty</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {item === 1 ? 'Latest facial treatments and techniques' : 
                     item === 2 ? 'Professional nail care essentials' : 
                     'Wellness and beauty trends 2024'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item === 1 ? 'Discover the latest facial treatments that are taking the beauty world by storm this season.' :
                     item === 2 ? 'Learn about professional nail care techniques and the latest trends in nail art.' :
                     'Explore the most important wellness and beauty trends that will define 2024.'}
                  </p>
                  <div className="text-gray-400 text-xs">
                    Nov {15 + item}, 2024
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}