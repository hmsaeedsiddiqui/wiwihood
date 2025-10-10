"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, MessageSquare, Camera, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import PostAppointmentReviewModal from '../../components/PostAppointmentReviewModal';

interface Appointment {
  id: string;
  businessName: string;
  businessId: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  address: string;
  businessPhoto: string;
  hasReview: boolean;
  canReview: boolean; // True for completed appointments within review window
}

export default function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock appointments data
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      businessName: 'Luxe Beauty Salon & Spa',
      businessId: 'luxe-beauty',
      serviceName: 'Premium Hair Cut & Styling',
      staffName: 'Sarah Ahmad',
      date: '2025-10-10',
      time: '2:00 PM',
      duration: 75,
      price: 179,
      status: 'upcoming',
      address: 'Dubai Marina, Dubai',
      businessPhoto: '/business/salon-1.jpg',
      hasReview: false,
      canReview: false
    },
    {
      id: '2',
      businessName: 'Zen Spa & Wellness',
      businessId: 'zen-spa',
      serviceName: 'Relaxing Body Massage',
      staffName: 'Aisha Al-Mansouri',
      date: '2025-10-06',
      time: '4:30 PM',
      duration: 120,
      price: 299,
      status: 'completed',
      address: 'JLT, Dubai',
      businessPhoto: '/business/spa-1.jpg',
      hasReview: false,
      canReview: true
    },
    {
      id: '3',
      businessName: 'Perfect Nails Studio',
      businessId: 'perfect-nails',
      serviceName: 'Luxury Manicure & Pedicure',
      staffName: 'Linda Rodriguez',
      date: '2025-09-28',
      time: '11:00 AM',
      duration: 90,
      price: 149,
      status: 'completed',
      address: 'Downtown Dubai',
      businessPhoto: '/business/nails-1.jpg',
      hasReview: true,
      canReview: false
    },
    {
      id: '4',
      businessName: 'Glow Wellness Center',
      businessId: 'glow-wellness',
      serviceName: 'Signature Facial Treatment',
      staffName: 'Maya Chen',
      date: '2025-09-20',
      time: '1:15 PM',
      duration: 90,
      price: 199,
      status: 'cancelled',
      address: 'Business Bay, Dubai',
      businessPhoto: '/business/wellness-1.jpg',
      hasReview: false,
      canReview: false
    },
    {
      id: '5',
      businessName: 'Elite Hair Studio',
      businessId: 'elite-hair',
      serviceName: 'Bridal Makeup Package',
      staffName: 'Fatima Al-Zahra',
      date: '2025-09-15',
      time: '10:00 AM',
      duration: 180,
      price: 599,
      status: 'completed',
      address: 'Palm Jumeirah, Dubai',
      businessPhoto: '/business/makeup-1.jpg',
      hasReview: false,
      canReview: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleReviewPrompt = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData: any) => {
    // Simulate API call to submit review
    console.log('Submitting review:', reviewData);
    
    // Update appointment to mark as reviewed
    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment?.id 
        ? { ...apt, hasReview: true, canReview: false }
        : apt
    ));

    // Close modal after a delay to show success message
    setTimeout(() => {
      setReviewModalOpen(false);
      setSelectedAppointment(null);
    }, 2000);
  };

  const filteredAppointments = appointments.filter(apt => apt.status === selectedTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'upcoming':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your bookings and share your experiences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'upcoming', label: 'Upcoming', count: appointments.filter(a => a.status === 'upcoming').length },
                { id: 'completed', label: 'Completed', count: appointments.filter(a => a.status === 'completed').length },
                { id: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${
                    selectedTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedTab === tab.id 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No {selectedTab} appointments
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedTab === 'upcoming' 
                    ? "You don't have any upcoming appointments. Book a service today!"
                    : selectedTab === 'completed'
                    ? "No completed appointments yet. Complete your first booking to see it here."
                    : "No cancelled appointments."
                  }
                </p>
                {selectedTab === 'upcoming' && (
                  <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Book Appointment
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={appointment.businessPhoto}
                            alt={appointment.businessName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-business.jpg';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{appointment.serviceName}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(appointment.status)}
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-orange-600 font-medium mb-2">{appointment.businessName}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time} ({appointment.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.address}</span>
                            </div>
                          </div>
                          
                          {appointment.staffName && (
                            <p className="text-sm text-gray-600 mt-2">
                              with <span className="font-medium">{appointment.staffName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800 mb-2">
                          AED {appointment.price}
                        </div>
                        
                        <div className="space-y-2">
                          {appointment.status === 'completed' && appointment.canReview && !appointment.hasReview && (
                            <button
                              onClick={() => handleReviewPrompt(appointment)}
                              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                              <Star className="h-4 w-4" />
                              Write Review
                            </button>
                          )}
                          
                          {appointment.status === 'completed' && appointment.hasReview && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>Reviewed</span>
                            </div>
                          )}
                          
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1">
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Prompts for Recent Completed Appointments */}
        {appointments.filter(apt => apt.canReview && !apt.hasReview && apt.status === 'completed').length > 0 && (
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Share Your Experience
                </h3>
                <p className="text-gray-600">
                  You have {appointments.filter(apt => apt.canReview && !apt.hasReview && apt.status === 'completed').length} completed appointment(s) waiting for your review
                </p>
              </div>
              <button
                onClick={() => {
                  const firstUnreviewed = appointments.find(apt => apt.canReview && !apt.hasReview && apt.status === 'completed');
                  if (firstUnreviewed) {
                    handleReviewPrompt(firstUnreviewed);
                  }
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Write Review
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedAppointment && (
        <PostAppointmentReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedAppointment(null);
          }}
          businessName={selectedAppointment.businessName}
          serviceName={selectedAppointment.serviceName}
          staffName={selectedAppointment.staffName}
          appointmentDate={selectedAppointment.date}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}