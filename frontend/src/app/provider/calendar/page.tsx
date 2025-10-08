"use client";
import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin, Plus, Ban, RotateCcw } from "lucide-react";
import QRTIntegration from "@/utils/qrtIntegration";
import TimeBlockModal from "@/components/TimeBlockModal";
import RecurringModal from "@/components/RecurringModal";
import GoogleCalendarSync from "@/components/GoogleCalendarSync";

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  scheduledAt: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  customerPhone?: string;
  servicePrice?: number;
}

interface TimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
  type: 'blocked' | 'break' | 'vacation';
}

interface RecurringAppointment {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  duration: number;
  interval: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  status: 'active' | 'paused' | 'ended';
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [recurringAppointments, setRecurringAppointments] = useState<RecurringAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showTimeBlockModal, setShowTimeBlockModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchTimeBlocks();
    fetchRecurringAppointments();
  }, [currentDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // QRT Integration - Calendar Bookings
      console.log('🚀 QRT Calendar Integration...');
      
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const calendarData = await QRTIntegration.getCalendarBookings(year, month);
      const bookingsArray = calendarData.bookings || calendarData || [];
      
      // Transform API data to expected format
      const transformedBookings: Booking[] = bookingsArray.map((booking: any) => ({
        id: booking.id,
        customerName: booking.customerName || `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim() || 'Unknown Customer',
        serviceName: booking.serviceName || booking.service?.name || 'Service',
        scheduledAt: booking.scheduledAt,
        duration: booking.duration || booking.service?.durationMinutes || 60,
        status: booking.status || 'confirmed',
        customerPhone: booking.customerPhone || booking.user?.phone,
        servicePrice: booking.servicePrice || booking.totalAmount || booking.service?.price
      }));
      
      setBookings(transformedBookings);
      console.log('✅ QRT Calendar Complete!');
      
    } catch (error) {
      console.error('QRT Calendar Error:', error);
      setMockBookings();
    } finally {
      setLoading(false);
    }
  };

  const setMockBookings = () => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        customerName: 'Sarah Johnson',
        serviceName: 'Hair Styling',
        scheduledAt: '2025-10-08T14:00:00Z',
        duration: 60,
        status: 'confirmed',
        customerPhone: '+1234567890',
        servicePrice: 85
      },
      {
        id: '2',
        customerName: 'John Smith',
        serviceName: 'Massage Therapy',
        scheduledAt: '2025-10-08T16:00:00Z',
        duration: 90,
        status: 'confirmed',
        customerPhone: '+1987654321',
        servicePrice: 120
      },
      {
        id: '3',
        customerName: 'Emma Wilson',
        serviceName: 'Facial Treatment',
        scheduledAt: '2025-10-09T10:00:00Z',
        duration: 75,
        status: 'pending',
        customerPhone: '+1122334455',
        servicePrice: 95
      }
    ];
    setBookings(mockBookings);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.scheduledAt);
        return bookingDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date: day,
        fullDate: date,
        bookings: dayBookings,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    
    return days;
  };

  const fetchTimeBlocks = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:8000/api/v1/time-blocks?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTimeBlocks(data);
      } else {
        // Fallback to empty array if API not available
        setTimeBlocks([]);
      }
    } catch (error) {
      console.error('Error fetching time blocks:', error);
      setTimeBlocks([]);
    }
  };

  const fetchRecurringAppointments = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/recurring-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecurringAppointments(data);
      } else {
        // Fallback to empty array if API not available
        setRecurringAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching recurring appointments:', error);
      setRecurringAppointments([]);
    }
  };

  const handleTimeBlockCreated = (timeBlock: TimeBlock) => {
    setTimeBlocks(prev => [...prev, timeBlock]);
  };

  const handleRecurringCreated = (recurring: RecurringAppointment) => {
    setRecurringAppointments(prev => [...prev, recurring]);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                Calendar & Appointments
              </h1>
              <p className="text-gray-600 mt-1">Manage your schedule and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedDate(new Date());
                  setShowTimeBlockModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Ban className="w-4 h-4" />
                Block Time
              </button>
              
              <button
                onClick={() => {
                  setSelectedDate(new Date());
                  setShowRecurringModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Recurring Appointment
              </button>
              
              <button
                onClick={() => {
                  // TODO: Implement Google Calendar sync
                  alert('Google Calendar sync coming soon!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Sync with Google
              </button>
            </div>
          </div>

          {/* Google Calendar Integration */}
          <div className="p-6 border-b border-gray-200">
            <GoogleCalendarSync onSyncComplete={() => fetchBookings()} />
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <div 
                  key={index} 
                  className={`h-32 border border-gray-200 rounded-lg transition-colors ${
                    day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                  }`}
                  onClick={() => day && handleDateClick(day.fullDate)}
                >
                  {day && (
                    <div className={`h-full p-2 rounded-lg ${day.isToday ? 'bg-orange-50 border-orange-200' : ''}`}>
                      <div className={`text-sm font-medium mb-2 flex justify-between items-center ${day.isToday ? 'text-orange-600' : 'text-gray-900'}`}>
                        <span>{day.date}</span>
                        <div className="flex gap-1">
                          {/* Time block indicators */}
                          {timeBlocks.filter(block => 
                            block.date === day.fullDate.toISOString().split('T')[0]
                          ).slice(0, 2).map((block, idx) => (
                            <div 
                              key={idx}
                              className={`w-2 h-2 rounded-full ${
                                block.type === 'blocked' ? 'bg-red-400' :
                                block.type === 'break' ? 'bg-yellow-400' :
                                'bg-blue-400'
                              }`}
                              title={`${block.type}: ${block.startTime}-${block.endTime}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {day.bookings.slice(0, 2).map((booking) => (
                          <div
                            key={booking.id}
                            className={`text-xs rounded px-2 py-1 truncate border ${getStatusColor(booking.status)}`}
                            title={`${booking.serviceName} - ${booking.customerName} - ${new Date(booking.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                          >
                            <div className="font-medium">{new Date(booking.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="truncate">{booking.customerName}</div>
                          </div>
                        ))}
                        {day.bookings.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{day.bookings.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">{booking.serviceName}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{booking.duration} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {booking.servicePrice && (
                        <span className="text-sm font-medium text-gray-900">${booking.servicePrice}</span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Booking Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm text-gray-700">Confirmed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span className="text-sm text-gray-700">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-sm text-gray-700">Cancelled</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Time Blocks</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Blocked Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Break Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Vacation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <TimeBlockModal
        isOpen={showTimeBlockModal}
        onClose={() => setShowTimeBlockModal(false)}
        selectedDate={selectedDate}
        onTimeBlockCreated={handleTimeBlockCreated}
      />
      
      <RecurringModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        selectedDate={selectedDate}
        onRecurringCreated={handleRecurringCreated}
      />
    </div>
  );
}
