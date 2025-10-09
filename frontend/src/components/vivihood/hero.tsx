"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Search } from 'lucide-react';

export default function Hero() {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');

  return (
    <section className="relative min-h-screen overflow-hidden pt-20" style={{
      background: 'linear-gradient(135deg, #FFB5B5 0%, #FFC4A3 50%, #FFD3CC 100%)',
    }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full border-2 border-white/20 opacity-60"></div>
        <div className="absolute bottom-32 right-20 w-20 h-20 rounded-full border-2 border-white/30"></div>
        <div className="absolute top-40 right-32 w-8 h-8 rounded-full border-2 border-white/25"></div>
        <div className="absolute top-1/2 right-16 w-4 h-4 rounded-full border-2 border-white/20"></div>
        <div className="absolute bottom-1/4 right-40 w-6 h-6 rounded-full border-2 border-white/15"></div>
      </div>

      <div className="relative flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Text */}
            <p className="text-gray-700 mb-4 text-lg font-medium">Welcome to Vivihood</p>
            
            {/* Main Headline - Exact Match */}
            <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-8 leading-tight">
              Make Appointment
            </h1>
            
            {/* Subtext */}
            <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Easily accessible beauty services that take care of your beauty appointments in instant
              <br />
              Appointment analytics cost with booking information.
            </p>

            {/* Enhanced Booking Form - Matching Design */}
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-left text-gray-700 font-medium text-sm">Select a Service</label>
                  <div className="relative">
                    <select 
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none bg-white appearance-none"
                    >
                      <option value="">Choose Service</option>
                      <option value="nail">Nail Services</option>
                      <option value="hair">Hair Services</option>
                      <option value="spa">Spa Services</option>
                      <option value="massage">Massage Services</option>
                      <option value="facial">Facial Services</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-left text-gray-700 font-medium text-sm">Location</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-left text-gray-700 font-medium text-sm">Date & Time</label>
                  <input 
                    type="date" 
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none"
                  />
                </div>
              </div>
              
              <Link href="/services">
                <button className="w-full bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
                  Make Appointment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}