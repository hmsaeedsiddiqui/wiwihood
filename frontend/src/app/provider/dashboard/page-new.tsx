"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, User, Bell, MapPin, Star, TrendingUp, Package, Eye } from "lucide-react";

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        console.error('No provider token found');
        return;
      }

      // Fetch bookings/appointments
      const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings || [];
        
        // Transform bookings to appointments format
        const transformedAppointments: Appointment[] = bookings.map((booking: any) => ({
          id: booking.id,
          customerName: `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim() || 'Unknown Customer',
          serviceName: booking.service?.name || 'Service',
          time: new Date(booking.scheduledAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          date: new Date(booking.scheduledAt).toLocaleDateString('en-US'),
          status: booking.status,
          amount: booking.totalAmount || 0,
          duration: booking.service?.duration ? `${booking.service.duration}min` : '1h'
        }));
        
        setAppointments(transformedAppointments);

        // Calculate stats
        const today = new Date().toLocaleDateString('en-US');
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        const todayAppts = transformedAppointments.filter(apt => apt.date === today);
        const monthlyAppts = transformedAppointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear;
        });

        setStats({
          totalAppointments: transformedAppointments.length,
          todayAppointments: todayAppts.length,
          monthlyEarnings: monthlyAppts
            .filter(apt => apt.status === 'completed')
            .reduce((sum, apt) => sum + apt.amount, 0),
          completedServices: transformedAppointments.filter(apt => apt.status === 'completed').length,
          rating: 4.8,
          pendingBookings: transformedAppointments.filter(apt => apt.status === 'pending').length
        });
      }
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

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6" />
                {stats.pendingBookings > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.pendingBookings}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900">AED {stats.monthlyEarnings}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Upcoming: {upcomingAppointments.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-orange-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{appointment.serviceName}</p>
                            <p className="text-sm text-gray-500">{appointment.customerName}</p>
                            <div className="flex items-center mt-1 space-x-4">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to calendar
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <MapPin className="h-4 w-4 mr-2" />
                  Getting there
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Package className="h-4 w-4 mr-2" />
                  Manage appointment
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Eye className="h-4 w-4 mr-2" />
                  Venue details
                </button>
              </div>
            </div>

            {/* Overview Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  <p className="text-sm text-gray-600 mt-2">
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