"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import AboutServices from "./about-services";
import Services from "./services";
import Review from "./review";
import SelectTime from "./select-time";

function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const handleBookNow = () => {
    router.push(`/services/book-now?serviceId=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Image Section */}
      <div className="bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900 transition-colors">
                Home
              </a>
              <span className="text-gray-400">/</span>
              <a href="/services" className="hover:text-gray-900 transition-colors">
                Bestseller
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                Al Shanab Gents Salon
              </span>
            </nav>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img
                  src="/service1.png"
                  alt="Al Shanab Gents Salon"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {["/service1.png", "/service2.jpg", "/service3.jpg", "/service1.png", "/service2.jpg"].map((image, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#E89B8B] cursor-pointer">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Service Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Al Shanab Gents Salon</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  4.8 (127 reviews)
                </span>
                <span className="text-sm text-gray-600">2.3 km away</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-[#E89B8B]">$399.00 - $429.00</div>
                <p className="text-gray-600 text-sm">Price starts from lowest service</p>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-2 mb-6">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-800">Shop New York Hair Salon</p>
                  <p className="text-sm text-gray-600">Get directions</p>
                </div>
              </div>

              {/* Book Now Button */}
              <button 
                onClick={handleBookNow}
                className="w-full bg-[#E89B8B] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#D4876F] transition-colors mb-4"
              >
                Book Now
              </button>

              {/* Service Hours */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Today's Hours</h3>
                <div className="flex justify-between items-center text-sm">
                  <span>Monday</span>
                  <span>11:00am - 9:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Tuesday</span>
                  <span>11:00am - 9:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Wednesday</span>
                  <span>11:00am - 9:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Thursday</span>
                  <span>11:00am - 9:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Friday</span>
                  <span>11:00am - 9:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Saturday</span>
                  <span>11:00am - 9:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Sunday</span>
                  <span>10:00am - 8:00pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Time Selection */}
          <SelectTime />
          
          {/* About Services */}
          <AboutServices />
          
          {/* Reviews */}
          <Review />
          
          {/* Related Services */}
          <Services />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ServiceDetailPage;