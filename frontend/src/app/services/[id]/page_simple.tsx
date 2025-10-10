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
    router.push(`/services/${serviceId}/booking`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Service Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Al Shanab Gents Salon</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  4.8 (127 reviews)
                </span>
                <span>2.3 km away</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#E89B8B] mb-2">$399.00 - $429.00</div>
              <button 
                onClick={handleBookNow}
                className="bg-[#E89B8B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D4876F] transition-colors"
              >
                Book Now
              </button>
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