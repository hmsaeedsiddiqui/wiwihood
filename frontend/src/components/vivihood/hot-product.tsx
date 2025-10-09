"use client";

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Heart, ArrowRight } from 'lucide-react';

interface HotProductProps {
  title: string;
  subtitle: string;
}

export default function HotProduct({ title, subtitle }: HotProductProps) {
  const services = [
    {
      id: 1,
      title: "Luxe Nail Studio",
      provider: "Beauty Pro Spa Salon - Al Watery",
      location: "Al Watery",
      rating: 4.8,
      reviews: 88,
      price: 149,
      category: "Nail Services",
      distance: "2.5 km",
      availableSlots: ["10:00 AM", "2:00 PM", "4:30 PM"]
    },
    {
      id: 2,
      title: "Luxe Nail Studio",
      provider: "Beauty Pro Spa Salon - Al Watery", 
      location: "Al Watery",
      rating: 4.8,
      reviews: 88,
      price: 149,
      category: "Nail Services",
      distance: "1.8 km",
      availableSlots: ["11:00 AM", "1:00 PM", "5:00 PM"]
    },
    {
      id: 3,
      title: "Luxe Nail Studio",
      provider: "Beauty Pro Spa Salon - Al Watery",
      location: "Al Watery",
      rating: 4.8,
      reviews: 88,
      price: 149,
      category: "Nail Services",
      distance: "3.2 km",
      availableSlots: ["9:00 AM", "3:00 PM", "6:00 PM"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-light text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 max-w-2xl">{subtitle}</p>
          </div>
          <Link href="/services">
            <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center bg-orange-50 px-4 py-2 rounded-full">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100 group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.id === 1 ? '/service1.png' : service.id === 2 ? '/service2.jpg' : '/service3.jpg'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                  <div className="text-xl font-bold text-orange-500">
                    AED {service.price}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{service.provider}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({service.reviews})</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>{service.distance}</span>
                  </div>
                </div>

                {/* Available Time Slots */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Available today:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.availableSlots.slice(0, 2).map((slot, index) => (
                      <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {slot}
                      </span>
                    ))}
                    {service.availableSlots.length > 2 && (
                      <span className="text-xs text-gray-500">+{service.availableSlots.length - 2} more</span>
                    )}
                  </div>
                </div>
                
                <Link href={`/services/${service.id}`}>
                  <button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Quick Book
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}