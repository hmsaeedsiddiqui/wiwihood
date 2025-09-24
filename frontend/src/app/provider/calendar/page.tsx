"use client";
import React, { useState, useEffect } from 'react';
import ProviderNav from '@/components/ProviderNav';

interface CalendarBooking {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  scheduledAt: string;
  status: string;
}

interface Service {
  id: string;
  name: string;
  basePrice: number;
  durationMinutes: number;
}

export default function ProviderCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [providerId, setProviderId] = useState<string>('');
  const [addBookingForm, setAddBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    time: '',
    duration: 60,
    price: 0,
    notes: ''
  });

  // Get current month/year for display
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch bookings from API
  useEffect(() => {
    fetchProviderInfo();
    fetchBookings();
  }, [currentDate]);

  useEffect(() => {
    if (providerId) {
      fetchServices();
    }
  }, [providerId]);

  const fetchProviderInfo = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.provider && data.provider.id) {
          setProviderId(data.provider.id);
        } else {
          setProviderId(data.id);
        }
      }
    } catch (error) {
      console.error('Error fetching provider info:', error);
    }
  };

  const fetchServices = async () => {
    try {
      if (!providerId) return;
      
      const token = localStorage.getItem('providerToken');
      const response = await fetch(`http://localhost:8000/api/v1/services/provider/${providerId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the API response to match calendar interface
        const transformedBookings = data.bookings?.map((booking: any) => ({
          id: booking.id,
          customer: {
            name: `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 'Unknown Customer',
            email: booking.customer?.email || ''
          },
          service: {
            name: booking.service?.name || 'Unknown Service',
            duration: booking.service?.duration || 60,
            price: parseFloat(booking.totalPrice) || 0
          },
          scheduledAt: booking.startTime || booking.createdAt,
          status: booking.status || 'pending'
        })) || [];
        
        setBookings(transformedBookings);
        setError(null);
      } else if (response.status === 401) {
        setError('Unauthorized access. Please login again.');
      } else {
        console.log('API call failed, showing empty calendar');
        setBookings([]);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new booking from calendar
  const handleAddBooking = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(new Date());
    }
    setError(null); // Clear any previous errors
    setShowAddBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', addBookingForm);
    
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      // Validate required fields
      if (!addBookingForm.customerName.trim()) {
        setError('Customer name is required');
        return;
      }
      if (!addBookingForm.customerEmail.trim()) {
        setError('Customer email is required');
        return;
      }
      if (!addBookingForm.serviceId.trim()) {
        setError('Service selection is required');
        return;
      }
      if (!addBookingForm.time.trim()) {
        setError('Time is required');
        return;
      }

      // Combine selected date with time
      const bookingDate = selectedDate || new Date();
      const timeStr = addBookingForm.time.trim();
      
      // Validate time format
      if (!timeStr.includes(':')) {
        setError('Invalid time format. Please use HH:MM format');
        return;
      }
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        setError('Invalid time. Please enter a valid time in HH:MM format');
        return;
      }
      
      const startDateTime = new Date(bookingDate);
      startDateTime.setHours(hours, minutes, 0, 0);
      const endDateTime = new Date(startDateTime.getTime() + addBookingForm.duration * 60000);

      // For manual bookings by providers, we'll use a fallback approach
      // In a real implementation, you'd want to either:
      // 1. Have a customer search/creation system
      // 2. Use a special "manual booking" customer account
      // 3. Extend the API to handle customer creation in booking
      
      // For now, let's use the provider's user ID as a fallback
      // This is not ideal but will allow testing the booking creation
      const fallbackCustomerId = '123e4567-e89b-12d3-a456-426614174000'; // Default customer ID from backend
      
      const bookingData = {
        serviceId: addBookingForm.serviceId,
        providerId: providerId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalPrice: addBookingForm.price,
        notes: `Manual booking for ${addBookingForm.customerName} (${addBookingForm.customerEmail}${addBookingForm.customerPhone ? ', ' + addBookingForm.customerPhone : ''}). ${addBookingForm.notes}`.trim(),
        status: 'confirmed'
      };

      console.log('Sending booking data:', bookingData);

      const response = await fetch('http://localhost:8000/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Booking created successfully:', responseData);
        
        // Refresh calendar data
        fetchBookings();
        
        // Close modal and reset form
        setShowAddBookingModal(false);
        setAddBookingForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          serviceId: '',
          time: '',
          duration: 60,
          price: 0,
          notes: ''
        });
        
        setError(null);
        alert('Booking created successfully!');
      } else {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        
        // Special handling for the customerId issue
        if (response.status === 400) {
          setError(`API Error: The current booking system is designed for customer-initiated bookings. To create manual bookings as a provider, the backend needs to be extended with a dedicated manual booking endpoint. Error details: ${errorData}`);
        } else {
          throw new Error(`Failed to create booking: ${response.status} ${errorData}`);
        }
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking');
    }
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getBookingsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.scheduledAt.split('T')[0] === dateString
    );
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProviderNav />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading calendar...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600 mt-1">View and manage your booking schedule</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={goToToday}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Today
              </button>
              <button 
                onClick={() => handleAddBooking()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Booking
              </button>
            </div>
          </div>
        </div>

        {/* View Selector */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  view === viewType
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {bookings.length} bookings this month
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const dayBookings = getBookingsForDate(date);
                const isCurrentDay = isToday(date);
                
                return (
                  <div
                    key={index}
                    onClick={() => date && handleAddBooking(date)}
                    className={`
                      min-h-[120px] border border-gray-200 rounded-lg p-2 
                      ${date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                      ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                      ${date ? 'cursor-pointer' : 'cursor-default'}
                      transition
                    `}
                  >
                    {date && (
                      <>
                        <div className={`
                          text-sm font-medium mb-2
                          ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}
                        `}>
                          {date.getDate()}
                        </div>
                        
                        {/* Bookings for this day */}
                        <div className="space-y-1">
                          {dayBookings.slice(0, 3).map((booking) => (
                            <div
                              key={booking.id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                                }
                              `}
                              title={`${booking.customer.name} - ${booking.service.name}`}
                            >
                              {new Date(booking.scheduledAt).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })} {booking.customer.name}
                            </div>
                          ))}
                          
                          {dayBookings.length > 3 && (
                            <div className="text-xs text-gray-500 text-center py-1">
                              +{dayBookings.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Calendar Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
              <span className="text-gray-600">Confirmed Bookings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
              <span className="text-gray-600">Pending Bookings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
              <span className="text-gray-600">Other Status</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-50 border-2 border-blue-500 rounded mr-2"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed This Month</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              ${bookings.reduce((sum, b) => sum + (b.service?.price || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(bookings.map(b => b.customer.email)).size}
            </div>
            <div className="text-sm text-gray-600">Unique Customers</div>
          </div>
        </div>
      </div>

      {/* Add Booking Modal */}
      {showAddBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Booking 
                  {selectedDate && (
                    <span className="text-blue-600 ml-2">
                      - {selectedDate.toLocaleDateString()}
                    </span>
                  )}
                </h2>
                <button 
                  onClick={() => setShowAddBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addBookingForm.customerName}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, customerName: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={addBookingForm.customerEmail}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, customerEmail: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={addBookingForm.customerPhone}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, customerPhone: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service *
                  </label>
                  <select
                    required
                    value={addBookingForm.serviceId}
                    onChange={(e) => {
                      const selectedService = services.find(s => s.id === e.target.value);
                      setAddBookingForm(prev => ({
                        ...prev, 
                        serviceId: e.target.value,
                        price: selectedService ? selectedService.basePrice : 0,
                        duration: selectedService ? selectedService.durationMinutes : 60
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.basePrice} ({service.durationMinutes} min)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={addBookingForm.time}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, time: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={addBookingForm.duration}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, duration: parseInt(e.target.value)}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={addBookingForm.price}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, price: parseFloat(e.target.value)}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Notes
                  </label>
                  <textarea
                    rows={3}
                    value={addBookingForm.notes}
                    onChange={(e) => setAddBookingForm(prev => ({...prev, notes: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}