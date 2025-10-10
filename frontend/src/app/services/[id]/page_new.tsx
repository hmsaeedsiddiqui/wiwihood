"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

interface ServiceDetail {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  verified: boolean;
  description: string;
  address: string;
  phone: string;
  website?: string;
  priceFrom: number;
  distance: number;
  gallery: string[];
  services: {
    id: number;
    name: string;
    duration: string;
    price: number;
    description: string;
  }[];
  staff: {
    id: number;
    name: string;
    role: string;
    experience: string;
    photo: string;
    rating: number;
  }[];
  hours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  userReviews: {
    id: number;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    photos?: string[];
    verified: boolean;
  }[];
}

function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock service data - In real app, this would come from API
  const serviceData: ServiceDetail = {
    id: parseInt(serviceId || "1"),
    name: "Lumi Nail Studio",
    category: "Nails & Beauty",
    rating: 4.8,
    reviews: 127,
    verified: true,
    description: "Premium nail and beauty studio offering professional services in a luxurious, relaxing environment. Our expert technicians use only the highest quality products to ensure beautiful, long-lasting results.",
    address: "Double Tree by Hilton M-Square, AWR Properties, Al Masihood, Dubai Marina",
    phone: "+971 4 555 0123",
    website: "www.luminailstudio.ae",
    priceFrom: 89,
    distance: 2.3,
    gallery: [
      "/service1.png",
      "/service2.jpg",
      "/service3.jpg",
      "/service1.png",
      "/service2.jpg"
    ],
    services: [
      {
        id: 1,
        name: "Classic Manicure",
        duration: "45 min",
        price: 89,
        description: "Complete nail care with shaping, cuticle treatment, and polish"
      },
      {
        id: 2,
        name: "Gel Manicure",
        duration: "60 min",
        price: 129,
        description: "Long-lasting gel polish with base and top coat"
      },
      {
        id: 3,
        name: "French Manicure",
        duration: "50 min",
        price: 109,
        description: "Classic French tips with precision application"
      },
      {
        id: 4,
        name: "Pedicure",
        duration: "60 min",
        price: 99,
        description: "Complete foot care with exfoliation and massage"
      },
      {
        id: 5,
        name: "Nail Art",
        duration: "30 min",
        price: 59,
        description: "Custom nail designs and decorations"
      }
    ],
    staff: [
      {
        id: 1,
        name: "Sarah Ahmed",
        role: "Senior Nail Technician",
        experience: "5+ years",
        photo: "/staff1.jpg",
        rating: 4.9
      },
      {
        id: 2,
        name: "Maria Gonzalez",
        role: "Nail Artist",
        experience: "3+ years",
        photo: "/staff2.jpg",
        rating: 4.8
      },
      {
        id: 3,
        name: "Aisha Khan",
        role: "Beauty Specialist",
        experience: "4+ years",
        photo: "/staff3.jpg",
        rating: 4.7
      }
    ],
    hours: [
      { day: "Monday", open: "9:00 AM", close: "9:00 PM", isOpen: true },
      { day: "Tuesday", open: "9:00 AM", close: "9:00 PM", isOpen: true },
      { day: "Wednesday", open: "9:00 AM", close: "9:00 PM", isOpen: true },
      { day: "Thursday", open: "9:00 AM", close: "9:00 PM", isOpen: true },
      { day: "Friday", open: "9:00 AM", close: "10:00 PM", isOpen: true },
      { day: "Saturday", open: "9:00 AM", close: "10:00 PM", isOpen: true },
      { day: "Sunday", open: "10:00 AM", close: "8:00 PM", isOpen: true }
    ],
    userReviews: [
      {
        id: 1,
        userName: "Fatima Al-Zahra",
        rating: 5,
        date: "2 days ago",
        comment: "Absolutely amazing service! Sarah did my gel manicure and it's been 2 weeks and still looks perfect. The studio is clean and luxurious.",
        photos: ["/review1.jpg", "/review2.jpg"],
        verified: true
      },
      {
        id: 2,
        userName: "Emma Johnson",
        rating: 5,
        date: "1 week ago",
        comment: "Best nail salon in Dubai Marina! The staff is so professional and the results are always perfect. Highly recommend!",
        verified: true
      },
      {
        id: 3,
        userName: "Layla Hassan",
        rating: 4,
        date: "2 weeks ago",
        comment: "Great experience overall. Love the ambiance and the nail art options. Will definitely be back!",
        photos: ["/review3.jpg"],
        verified: true
      },
      {
        id: 4,
        userName: "Sophie Martinez",
        rating: 5,
        date: "3 weeks ago",
        comment: "Maria is incredibly talented! My nail art came out even better than I imagined. The attention to detail is outstanding.",
        verified: true
      },
      {
        id: 5,
        userName: "Priya Sharma",
        rating: 5,
        date: "1 month ago",
        comment: "Clean, professional, and friendly staff. The pedicure was so relaxing and my feet feel amazing!",
        verified: true
      }
    ]
  };

  const handleBookNow = () => {
    router.push(`/services/${serviceId}/booking`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Service Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{serviceData.name}</h1>
                {serviceData.verified && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                <span className="bg-[#F5F0EF] text-[#E89B8B] px-3 py-1 rounded-full font-medium">
                  {serviceData.category}
                </span>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="font-semibold text-gray-900">{serviceData.rating}</span>
                  <span>({serviceData.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{serviceData.distance} km away</span>
                </div>
              </div>
              
              <p className="text-gray-600 max-w-3xl">{serviceData.description}</p>
            </div>
            
            <div className="ml-8 text-right">
              <div className="text-3xl font-bold text-[#E89B8B] mb-2">
                From AED {serviceData.priceFrom}
              </div>
              <button 
                onClick={handleBookNow}
                className="bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#D4876F] hover:to-[#C67B65] transition-all duration-300 shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'gallery', label: 'Gallery', icon: '📸' },
              { id: 'services', label: 'Services & Prices', icon: '💰' },
              { id: 'staff', label: 'Our Team', icon: '👥' },
              { id: 'reviews', label: 'Reviews', icon: '⭐' },
              { id: 'location', label: 'Location', icon: '📍' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'text-[#E89B8B] border-[#E89B8B]'
                    : 'text-gray-600 border-transparent hover:text-[#E89B8B]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Image Gallery */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Photo Gallery</h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 px-6 pb-6">
                    <div className="col-span-3">
                      <img
                        src={serviceData.gallery[selectedImage]}
                        alt={serviceData.name}
                        className="w-full h-80 object-cover rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      {serviceData.gallery.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          onClick={() => setSelectedImage(index)}
                          className={`w-full h-18 object-cover rounded-lg cursor-pointer transition-all ${
                            selectedImage === index ? 'ring-2 ring-[#E89B8B]' : 'hover:opacity-80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About {serviceData.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{serviceData.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">{serviceData.phone}</span>
                      </div>
                      
                      {serviceData.website && (
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c0-5 0-9 0-9s0 4 0 9z" />
                          </svg>
                          <a href={`https://${serviceData.website}`} className="text-[#E89B8B] hover:underline">
                            {serviceData.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700">{serviceData.distance} km away</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Open today until 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {selectedTab === 'gallery' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Photo Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {serviceData.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Services Tab */}
            {selectedTab === 'services' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Services & Prices</h3>
                <div className="space-y-4">
                  {serviceData.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#E89B8B] transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{service.name}</h4>
                          <p className="text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {service.duration}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-[#E89B8B]">AED {service.price}</div>
                          <button className="mt-2 bg-[#E89B8B] text-white px-4 py-2 rounded-lg hover:bg-[#D4876F] transition-colors">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {selectedTab === 'staff' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Meet Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceData.staff.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#E89B8B] transition-colors">
                      <div className="flex items-center space-x-4">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-gray-600 text-sm">{member.role}</p>
                          <p className="text-gray-500 text-sm">{member.experience} experience</p>
                          <div className="flex items-center mt-2">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className="text-sm text-gray-600 ml-1">{member.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {selectedTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-lg font-semibold">{serviceData.rating}</span>
                    <span className="text-gray-600">({serviceData.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {serviceData.userReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-[#E89B8B] rounded-full flex items-center justify-center text-white font-semibold">
                          {review.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                            )}
                            <span className="text-gray-500 text-sm">• {review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          {review.photos && review.photos.length > 0 && (
                            <div className="flex space-x-2">
                              {review.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo}
                                  alt={`Review photo ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Tab */}
            {selectedTab === 'location' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Location & Hours</h3>
                
                {/* Map Placeholder */}
                <div className="bg-gray-200 h-64 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-500">Interactive Map Coming Soon</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">{serviceData.address}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Hours of Operation</h4>
                    <div className="space-y-2">
                      {serviceData.hours.map((schedule, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-700">{schedule.day}</span>
                          <span className="text-gray-600">{schedule.open} - {schedule.close}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Quick Book Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-[#E89B8B] mb-2">
                    From AED {serviceData.priceFrom}
                  </div>
                  <p className="text-gray-600">Starting price</p>
                </div>
                
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white py-3 rounded-xl font-semibold hover:from-[#D4876F] hover:to-[#C67B65] transition-all duration-300 shadow-lg mb-4"
                >
                  Book Now
                </button>

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Instant booking</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Free cancellation</span>
                  </div>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{serviceData.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{serviceData.distance} km away</span>
                  </div>

                  {serviceData.website && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#E89B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c0-5 0-9 0-9s0 4 0 9z" />
                      </svg>
                      <a href={`https://${serviceData.website}`} className="text-[#E89B8B] hover:underline">
                        {serviceData.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Hours of Operation</h4>
                <div className="space-y-2">
                  {serviceData.hours.slice(0, 7).map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.open} - {schedule.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ServiceDetailPage;