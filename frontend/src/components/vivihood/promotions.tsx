"use client";

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, Percent, Gift } from 'lucide-react';

export default function Promotions() {
  const promotions = [
    {
      id: 1,
      title: "50% Off First Visit",
      business: "Luxe Beauty Salon",
      originalPrice: 200,
      discountedPrice: 100,
      discount: 50,
      category: "Hair Services",
      location: "Dubai Marina",
      rating: 4.8,
      reviews: 156,
      validUntil: "2025-10-30",
      image: "/service1.png",
      badge: "Limited Time"
    },
    {
      id: 2,
      title: "Buy 2 Get 1 Free",
      business: "Nail Art Studio",
      originalPrice: 150,
      discountedPrice: 100,
      discount: 33,
      category: "Nail Services",
      location: "JLT",
      rating: 4.9,
      reviews: 89,
      validUntil: "2025-10-25",
      image: "/service2.jpg",
      badge: "Popular"
    },
    {
      id: 3,
      title: "Weekend Special",
      business: "Zen Spa & Wellness",
      originalPrice: 300,
      discountedPrice: 225,
      discount: 25,
      category: "Massage Services",
      location: "Downtown",
      rating: 4.7,
      reviews: 203,
      validUntil: "2025-10-28",
      image: "/service3.jpg",
      badge: "Weekend Only"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-light text-gray-800">Special Deals & Promotions</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Save big on your favorite beauty and wellness services with these limited-time offers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <Link key={promo.id} href={`/promotion/${promo.id}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-orange-100 group relative">
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Percent className="w-3 h-3 mr-1" />
                    {promo.discount}% OFF
                  </div>
                </div>

                {/* Special Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {promo.badge}
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  {/* Category */}
                  <div className="text-xs text-orange-600 font-medium mb-2 uppercase tracking-wide">
                    {promo.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{promo.title}</h3>
                  
                  {/* Business Name */}
                  <p className="text-gray-600 mb-3">{promo.business}</p>
                  
                  {/* Location & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{promo.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">{promo.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({promo.reviews})</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-orange-500">AED {promo.discountedPrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">AED {promo.originalPrice}</span>
                    </div>
                  </div>

                  {/* Valid Until */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Valid until {new Date(promo.validUntil).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Book Now Button */}
                  <button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Claim Deal
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center mt-12">
          <Link href="/promotions">
            <button className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all">
              View All Deals
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}