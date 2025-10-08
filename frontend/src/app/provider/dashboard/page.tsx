"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, User, Bell, MapPin, Star, TrendingUp, Package, Eye } from "lucide-react";
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
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Action Handlers for Business Dashboard
  const handleAddToCalendar = async () => {
    setIsLoading(true);
    try {
      // Redirect to calendar page for appointment scheduling
      router.push('/provider/calendar');
    } catch (error) {
      console.error('Calendar error:', error);
      router.push('/provider/calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGettingThere = async () => {
    setIsLoading(true);
    try {
      const location = await QRTIntegration.getVenueLocation();
      if (location && location.address) {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
        window.open(mapsUrl, '_blank');
      } else {
        const defaultLocation = "Business Location, UAE";
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultLocation)}`;
        window.open(mapsUrl, '_blank');
      }
    } catch (error) {
      console.error('Location error:', error);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=Business Location UAE`;
      window.open(mapsUrl, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageAppointment = () => {
    router.push('/provider/appointments');
  };

  const handleVenueDetails = async () => {
    setIsLoading(true);
    try {
      const venueInfo = await QRTIntegration.getVenueLocation();
      if (venueInfo) {
        console.log('Venue details:', venueInfo);
        router.push('/provider/settings?section=venue');
      } else {
        router.push('/provider/settings');
      }
    } catch (error) {
      console.error('Venue details error:', error);
      router.push('/provider/settings');
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-white/10 bg-opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Welcome Back!</h1>
              <p className="text-white/90 text-lg mb-4">Here's what's happening with your business today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={handleAddToCalendar}
            disabled={isLoading}
            className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/20 p-4 rounded-xl w-fit mb-4 mx-auto backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Add to Calendar</h3>
              <p className="text-blue-100 text-sm opacity-90">Schedule events & meetings</p>
              <div className="mt-4 bg-white/20 rounded-lg px-3 py-1 text-xs w-fit mx-auto">New Feature</div>
            </div>
          </button>

          <button
            onClick={handleGettingThere}
            disabled={isLoading}
            className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/20 p-4 rounded-xl w-fit mb-4 mx-auto backdrop-blur-sm">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Getting There</h3>
              <p className="text-emerald-100 text-sm opacity-90">View location & directions</p>
              <div className="mt-4 bg-white/20 rounded-lg px-3 py-1 text-xs w-fit mx-auto">Maps</div>
            </div>
          </button>

          <button
            onClick={handleManageAppointment}
            className="group relative bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/20 p-4 rounded-xl w-fit mb-4 mx-auto backdrop-blur-sm">
                <User className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Manage Appointments</h3>
              <p className="text-purple-100 text-sm opacity-90">View & manage bookings</p>
              <div className="mt-4 bg-white/20 rounded-lg px-3 py-1 text-xs w-fit mx-auto">Bookings</div>
            </div>
          </button>

          <button
            onClick={handleVenueDetails}
            disabled={isLoading}
            className="group relative bg-gradient-to-br from-orange-500 via-pink-500 to-red-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="bg-white/20 p-4 rounded-xl w-fit mb-4 mx-auto backdrop-blur-sm">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Venue Details</h3>
              <p className="text-orange-100 text-sm opacity-90">Business information</p>
              <div className="mt-4 bg-white/20 rounded-lg px-3 py-1 text-xs w-fit mx-auto">Settings</div>
            </div>
          </button>
        </div>
        
        {/* Enhanced Stats Grid - Business Overview Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Today's Bookings</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{stats.todayAppointments}</p>
              <p className="text-xs text-gray-500">vs yesterday</p>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Revenue Summary</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">AED {stats.monthlyEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500">this month</p>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+15%</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Completed Services</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{stats.completedServices}</p>
              <p className="text-xs text-gray-500">this week</p>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-yellow-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">★ 247</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Customer Rating</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{stats.rating}</p>
              <p className="text-xs text-gray-500">from reviews</p>
            </div>
          </div>
        </div>

        {/* Enhanced Platform Expenses, Net Earnings & Business Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Platform Expenses Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Platform Expenses</h3>
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Commission (5%)</span>
                  <span className="font-bold text-red-600">AED {(stats.monthlyEarnings * 0.05).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Listing Fee</span>
                  <span className="font-bold text-red-600">AED 99</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Ads Fees</span>
                  <span className="font-bold text-red-600">AED 150</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                    <span className="font-bold text-gray-900">Total Expenses</span>
                    <span className="font-bold text-red-600 text-xl">AED {(stats.monthlyEarnings * 0.05 + 99 + 150).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Earnings Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Net Earnings</h3>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Gross Revenue</span>
                  <span className="font-bold text-green-600">AED {stats.monthlyEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Platform Fees</span>
                  <span className="font-bold text-red-600">-AED {(stats.monthlyEarnings * 0.05 + 99 + 150).toFixed(0)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <span className="font-bold text-gray-900">Net Profit</span>
                    <span className="font-bold text-green-600 text-2xl">AED {(stats.monthlyEarnings - (stats.monthlyEarnings * 0.05 + 99 + 150)).toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-green-100 text-green-700 rounded-lg py-2 px-4">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">+18% profit margin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Alerts Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Business Alerts</h3>
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                    3
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
                  <div className="bg-yellow-200 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Payment Due</p>
                    <p className="text-xs text-gray-600 mt-1">Platform fee payment due in 3 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">New Review</p>
                    <p className="text-xs text-gray-600 mt-1">5-star review from Sarah Johnson</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
                  <div className="bg-green-200 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Booking Surge</p>
                    <p className="text-xs text-gray-600 mt-1">25% increase in bookings this week</p>
                  </div>
                </div>
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