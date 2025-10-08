"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, User, MapPin, Star, TrendingUp, Package, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import QRTIntegration from "@/utils/qrtIntegration";

interface Appointment {
  id: string;
  customerName: string;
  serviceName: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  amount: number;
  duration: string;
}

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  monthlyEarnings: number;
  completedServices: number;
  rating: number;
  pendingBookings: number;
}

export default function ProviderDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    monthlyEarnings: 0,
    completedServices: 0,
    rating: 4.8,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // QRT Integration - Quick Real-Time API calls
      console.log('🚀 QRT Integration Started...');
      
      const [dashboardStats, appointmentsData] = await Promise.all([
        QRTIntegration.getDashboardStats(),
        QRTIntegration.getAppointments()
      ]);
      
      // Update stats
      setStats({
        totalAppointments: dashboardStats.totalAppointments || 0,
        todayAppointments: dashboardStats.todayAppointments || 0,
        monthlyEarnings: dashboardStats.monthlyEarnings || 0,
        completedServices: dashboardStats.completedServices || 0,
        rating: dashboardStats.rating || 4.8,
        pendingBookings: dashboardStats.pendingBookings || 0
      });
      
      // Update appointments with defensive programming
      if (Array.isArray(appointmentsData)) {
        setAppointments(appointmentsData);
      } else if (appointmentsData && Array.isArray(appointmentsData.data)) {
        setAppointments(appointmentsData.data);
      } else {
        console.warn('QRT: appointmentsData is not an array, using fallback');
        setAppointments([]);
      }
      
      console.log('✅ QRT Integration Complete!');

      // QRT Integration handles all API calls and data transformation
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingAppointments = Array.isArray(appointments) 
    ? appointments
        .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
        .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
        .slice(0, 5)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayAppointments}</p>
                <p className="text-xs text-green-600 mt-1">↗ +12% from yesterday</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">AED {stats.monthlyEarnings}</p>
                <p className="text-xs text-green-600 mt-1">↗ +8% from last month</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Services</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedServices}</p>
                <p className="text-xs text-orange-600 mt-1">↗ +15% this week</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rating}</p>
                <p className="text-xs text-yellow-600 mt-1">★ From 247 reviews</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-xl">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Upcoming: {upcomingAppointments.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-orange-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{appointment.serviceName}</p>
                            <p className="text-sm text-gray-500 mt-1">{appointment.customerName}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                Tomorrow at {appointment.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>{appointment.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'confirmed' ? 'Confirmed' : appointment.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">AED {appointment.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to calendar
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <MapPin className="h-4 w-4 mr-2" />
                  Getting there
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Package className="h-4 w-4 mr-2" />
                  Manage appointment
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4 mr-2" />
                  Venue details
                </button>
              </div>
            </div>

            {/* Overview Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-900">AED {stats.monthlyEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm text-gray-900">AED 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-base font-medium text-gray-900">AED {stats.monthlyEarnings}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Cancellation policy</h3>
                  <p className="text-sm text-gray-600">
                    Please avoid canceling within 2 hours of your appointment time. When you cancel, changes on booking will not be allowed.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Important info</h3>
                  <p className="text-sm text-gray-600">
                    Cancellation policy: Cancel up to 1 hour in advance. When you cancel, changes on booking will not be allowed.
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Booking #: RSC84049
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}