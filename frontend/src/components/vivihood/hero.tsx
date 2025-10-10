"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Search } from 'lucide-react';

export default function Hero() {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Reverse geocoding to get address
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              setLocation(data.results[0].formatted);
            } else {
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch (error) {
            console.error('Error getting address:', error);
            setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoadingLocation(false);
    }
  };

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                      <option value="beauty">Beauty Services</option>
                      <option value="wellness">Wellness Services</option>
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
                      placeholder="Enter location or use GPS"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={loadingLocation}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-orange-500 hover:text-orange-600 disabled:opacity-50"
                    >
                      {loadingLocation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-left text-gray-700 font-medium text-sm">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-left text-gray-700 font-medium text-sm">Time</label>
                  <select 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-300 focus:outline-none bg-white appearance-none"
                  >
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="09:30">9:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
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