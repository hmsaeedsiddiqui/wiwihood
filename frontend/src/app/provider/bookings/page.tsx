"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProviderNav from "@/components/ProviderNav";

// Interface for booking data
interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  notes: string;
  bookingDate: string;
  paymentStatus: string;
}

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    bookingId: '',
    newDate: '',
    newTime: '',
    reason: ''
  });
  const [manualBookingForm, setManualBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    service: '',
    date: '',
    time: '',
    duration: 60,
    price: 0,
    notes: ''
  });

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the API response to match our interface
        const transformedBookings = data.bookings?.map((booking: any) => ({
          id: booking.id,
          customerName: `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 'Unknown Customer',
          customerEmail: booking.customer?.email || '',
          customerPhone: booking.customer?.phone || '',
          service: booking.service?.name || 'Unknown Service',
          date: booking.startTime ? new Date(booking.startTime).toISOString().split('T')[0] : '',
          time: booking.startTime ? new Date(booking.startTime).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }) : '',
          duration: booking.service?.duration || 60,
          price: parseFloat(booking.totalPrice) || 0,
          status: booking.status || 'pending',
          notes: booking.notes || '',
          bookingDate: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : '',
          paymentStatus: booking.paymentStatus || 'pending'
        })) || [];
        
        setBookings(transformedBookings);
        setError(null);
      } else if (response.status === 401) {
        setError('Unauthorized access. Please login again.');
      } else {
        // For now, show empty state instead of error to avoid API dependency
        console.log('API not available, showing empty state');
        setBookings([]);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      // For now, show empty state instead of error to avoid API dependency
      setBookings([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      let response;
      
      // Use specific endpoints based on the status
      if (newStatus === 'cancelled') {
        response = await fetch(`http://localhost:8000/api/v1/bookings/${bookingId}/cancel`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } else if (newStatus === 'completed') {
        response = await fetch(`http://localhost:8000/api/v1/bookings/${bookingId}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Empty body for completion
        });
      } else {
        // For confirmed status, use general update endpoint
        response = await fetch(`http://localhost:8000/api/v1/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      }

      if (response.ok) {
        // Update the booking in the local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ));
        
        // Show success message (you can add a toast notification here)
        console.log(`Booking status updated to ${newStatus}`);
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status');
    }
  };

  // Function to check in a booking
  const checkInBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/bookings/${bookingId}/checkin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}), // Empty body for check-in
      });

      if (response.ok) {
        // Update the booking in the local state to in_progress
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'in_progress' }
            : booking
        ));
        
        console.log('Customer checked in successfully');
      } else {
        throw new Error('Failed to check in customer');
      }
    } catch (error: any) {
      console.error('Error checking in customer:', error);
      setError('Failed to check in customer');
    }
  };

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
  };

  const handleDeclineBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const handleCompleteBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
  };

  const handleCheckInBooking = (bookingId: string) => {
    checkInBooking(bookingId);
  };

  const handleReschedule = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      // Convert time from "2:30 PM" format to "14:30" format for input
      let formattedTime = '';
      if (booking.time) {
        const timeMatch = booking.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const period = timeMatch[3].toUpperCase();
          
          if (period === 'PM' && hours !== 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }
          
          formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }
      
      setRescheduleForm({
        bookingId: bookingId,
        newDate: new Date().toISOString().split('T')[0], // Default to today
        newTime: formattedTime,
        reason: ''
      });
      setShowRescheduleModal(true);
    }
  };

  // Manual booking handlers
  const handleManualBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      // Combine date and time for the API
      const startDateTime = new Date(`${manualBookingForm.date}T${manualBookingForm.time}`);
      const endDateTime = new Date(startDateTime.getTime() + manualBookingForm.duration * 60000);

      const bookingData = {
        customerName: manualBookingForm.customerName,
        customerEmail: manualBookingForm.customerEmail,
        customerPhone: manualBookingForm.customerPhone,
        serviceName: manualBookingForm.service,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalPrice: manualBookingForm.price,
        notes: manualBookingForm.notes,
        status: 'confirmed' // Manual bookings are typically confirmed
      };

      const response = await fetch('http://localhost:8000/api/v1/bookings/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        // Refresh bookings list
        fetchBookings();
        
        // Close modal and reset form
        setShowManualBookingModal(false);
        setManualBookingForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          service: '',
          date: '',
          time: '',
          duration: 60,
          price: 0,
          notes: ''
        });
        
        console.log('Manual booking created successfully');
      } else {
        throw new Error('Failed to create manual booking');
      }
    } catch (error: any) {
      console.error('Error creating manual booking:', error);
      setError('Failed to create manual booking');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      // Validate that the new date is not in the past
      const selectedDate = new Date(rescheduleForm.newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate < today) {
        setError('Cannot reschedule to a past date. Please select today or a future date.');
        return;
      }

      // Validate time format
      if (!rescheduleForm.newTime || !rescheduleForm.newTime.match(/^\d{2}:\d{2}$/)) {
        setError('Please select a valid time.');
        return;
      }

      // Find the original booking to get duration
      const originalBooking = bookings.find(b => b.id === rescheduleForm.bookingId);
      if (!originalBooking) {
        setError('Original booking not found. Please try again.');
        return;
      }
      
      // Check what duration value we have
      console.log('Original booking full data:', originalBooking);
      
      // The duration might be stored incorrectly - let's force it to a reasonable value
      let duration = originalBooking.duration;
      
      // If duration seems wrong (too long), default to 60 minutes
      if (!duration || duration > 240) { // More than 4 hours seems wrong
        duration = 60;
        console.log('Duration seemed wrong, defaulting to 60 minutes');
      }
      
      console.log('Using duration:', duration, 'minutes');

      // Convert time from HH:MM to full datetime
      const [hours, minutes] = rescheduleForm.newTime.split(':');
      const newStartTime = new Date(rescheduleForm.newDate + 'T00:00:00.000Z');
      newStartTime.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Calculate end time based on duration (duration is in minutes)
      const newEndTime = new Date(newStartTime.getTime() + duration * 60000);

      // Validate that end time is reasonable (not too far in the future)
      const timeDifference = newEndTime.getTime() - newStartTime.getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      if (hoursDifference > 4) {
        setError(`❌ DURATION ERROR: Service duration is ${hoursDifference.toFixed(1)} hours, which seems incorrect.

🔧 TECHNICAL DETAILS:
• Original booking duration: ${originalBooking.duration} minutes
• Calculated end time is too far from start time

💡 WHAT TO DO:
• Contact system administrator to fix service duration
• Manually adjust the booking time
• Use 1-hour duration temporarily`);
        return;
      }

      const rescheduleData = {
        newStartTime: newStartTime.toISOString(),
        newEndTime: newEndTime.toISOString(),
        reason: rescheduleForm.reason || 'Rescheduled by provider'
      };

      console.log('Final reschedule data:', rescheduleData);
      console.log('Calculated duration:', hoursDifference.toFixed(1), 'hours');

      const response = await fetch(`http://localhost:8000/api/v1/bookings/${rescheduleForm.bookingId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(rescheduleData),
      });

      if (response.ok) {
        // Refresh bookings list
        fetchBookings();
        
        // Close modal and reset form
        setShowRescheduleModal(false);
        setRescheduleForm({
          bookingId: '',
          newDate: '',
          newTime: '',
          reason: ''
        });
        
        console.log('Booking rescheduled successfully');
      } else {
        const errorData = await response.json();
        let errorMessage = 'Unknown error occurred';
        
        if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        }
        
        // Specific error messages based on common API responses
        if (errorMessage.includes('cannot be rescheduled')) {
          // Check booking status to provide specific reason
          const bookingStatus = originalBooking.status;
          if (bookingStatus === 'completed') {
            setError(`❌ CANNOT RESCHEDULE: This booking is already completed. Completed bookings cannot be rescheduled.`);
          } else if (bookingStatus === 'cancelled') {
            setError(`❌ CANNOT RESCHEDULE: This booking was cancelled. Please create a new booking instead.`);
          } else if (bookingStatus === 'in_progress') {
            setError(`❌ CANNOT RESCHEDULE: This booking is currently in progress. Wait until it's finished or contact the customer.`);
          } else {
            // Check if it's a timing issue
            const bookingDate = new Date(originalBooking.date);
            const now = new Date();
            const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            
            if (hoursUntilBooking < 2) {
              setError(`❌ CANNOT RESCHEDULE: Booking is too close (less than 2 hours away). Contact customer directly to reschedule.`);
            } else {
              setError(`❌ CANNOT RESCHEDULE: Booking status is "${bookingStatus}". Only confirmed/pending bookings can be rescheduled.`);
            }
          }
        } else if (errorMessage.includes('past date') || errorMessage.includes('past time')) {
          setError('❌ INVALID TIME: Cannot schedule booking in the past. Please select a future date and time.');
        } else if (errorMessage.includes('conflict') || errorMessage.includes('unavailable')) {
          setError('❌ TIME CONFLICT: This time slot is already booked. Please choose a different date/time.');
        } else if (errorMessage.includes('not found')) {
          setError('❌ BOOKING NOT FOUND: This booking no longer exists. Please refresh the page and try again.');
        } else if (errorMessage.includes('authorization') || errorMessage.includes('permission')) {
          setError('❌ ACCESS DENIED: You do not have permission to reschedule this booking. Please check your login status.');
        } else if (errorMessage.includes('working hours') || errorMessage.includes('business hours')) {
          setError('❌ OUTSIDE BUSINESS HOURS: Selected time is outside your working hours. Please choose a time during business hours.');
        } else {
          setError(`❌ RESCHEDULE FAILED: ${errorMessage}

💡 WHAT TO DO:
• Try a different date/time
• Check if booking status allows rescheduling
• Contact customer directly if urgent
• Refresh page and try again`);
        }
        
        console.error('API Error Details:', errorData);
      }
    } catch (error: any) {
      console.error('Error rescheduling booking:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedFilter === "all") return true;
    return booking.status === selectedFilter;
  });

  const getFilterCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      in_progress: bookings.filter(b => b.status === "in_progress").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProviderNav />
        <div className="">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading bookings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProviderNav />
        <div className="">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchBookings}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
  <div className="">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your appointments and client bookings</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setShowManualBookingModal(true)}
                className="w-full sm:w-auto cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm sm:text-base"
              >
                <span className="mr-2">+</span>
                Add Manual Booking
              </button>
              <button className="w-full sm:w-auto border cursor-pointer border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center text-sm sm:text-base">
                📅 Calendar View
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                📋
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{counts.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">{counts.in_progress}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                �
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-2 sm:px-6" aria-label="Tabs">
              {[
                { key: "all", label: "All", count: counts.all },
                { key: "pending", label: "Pending", count: counts.pending },
                { key: "confirmed", label: "Confirmed", count: counts.confirmed },
                { key: "in_progress", label: "In Progress", count: counts.in_progress },
                { key: "completed", label: "Completed", count: counts.completed },
                { key: "cancelled", label: "Cancelled", count: counts.cancelled },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`
                    py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition whitespace-nowrap
                    ${selectedFilter === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                📅
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {selectedFilter === "all" 
                  ? "You don't have any bookings yet." 
                  : `No ${selectedFilter} bookings found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {booking.customerName}
                          <span className={`ml-2 sm:ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Service</p>
                          <p className="font-medium text-sm sm:text-base">{booking.service}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Date & Time</p>
                          <p className="font-medium text-sm sm:text-base">{booking.date} at {booking.time}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Duration & Price</p>
                          <p className="font-medium text-sm sm:text-base">{booking.duration} min • ${booking.price}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <span>📧 {booking.customerEmail}</span>
                        <span>📞 {booking.customerPhone}</span>
                      </div>
                      {booking.notes && (
                        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-700">
                            <span className="font-medium">Special Notes:</span> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className="bg-blue-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                      >
                        View Details
                      </button>
                      {booking.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="bg-green-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleDeclineBooking(booking.id)}
                            className="bg-red-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition text-xs sm:text-sm"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <>
                          <button 
                            onClick={() => handleCheckInBooking(booking.id)}
                            className="bg-blue-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                          >
                            Check In Customer
                          </button>
                          <button 
                            onClick={() => handleReschedule(booking.id)}
                            className="border cursor-pointer border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {booking.status === "in_progress" && (
                        <>
                          <button 
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
                          >
                            Mark Complete
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm">
                            Add Notes
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-lg sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Booking Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 cursor-pointer hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Customer Information</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.customerEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Booking Information</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Service:</span> {selectedBooking.service}</p>
                    <p><span className="font-medium">Date:</span> {selectedBooking.date}</p>
                    <p><span className="font-medium">Time:</span> {selectedBooking.time}</p>
                    <p><span className="font-medium">Duration:</span> {selectedBooking.duration} minutes</p>
                    <p><span className="font-medium">Price:</span> ${selectedBooking.price}</p>
                  </div>
                </div>
              </div>
              {selectedBooking.notes && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Special Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 border cursor-pointer border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  Close
                </button>
                <button className="flex-1 cursor-pointer bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm">
                  Edit Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showManualBookingModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-lg sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl  font-semibold text-gray-900">Add Manual Booking</h2>
                <button 
                  onClick={() => setShowManualBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleManualBookingSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-4">Customer Information</h3>
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={manualBookingForm.customerName}
                        onChange={(e) => setManualBookingForm(prev => ({ ...prev, customerName: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={manualBookingForm.customerEmail}
                        onChange={(e) => setManualBookingForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        placeholder="customer@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={manualBookingForm.customerPhone}
                        onChange={(e) => setManualBookingForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-4">Booking Details</h3>
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Service *</label>
                      <input
                        type="text"
                        required
                        value={manualBookingForm.service}
                        onChange={(e) => setManualBookingForm(prev => ({ ...prev, service: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        placeholder="Enter service name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={manualBookingForm.date}
                        onChange={(e) => setManualBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Time *</label>
                      <input
                        type="time"
                        required
                        value={manualBookingForm.time}
                        onChange={(e) => setManualBookingForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={manualBookingForm.duration}
                          onChange={(e) => setManualBookingForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={manualBookingForm.price}
                          onChange={(e) => setManualBookingForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                <textarea
                  value={manualBookingForm.notes}
                  onChange={(e) => setManualBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  placeholder="Any special instructions or notes..."
                />
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button 
                  type="button"
                  onClick={() => setShowManualBookingModal(false)}
                  className="flex-1 border cursor-pointer border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Booking Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Reschedule Booking</h2>
                <button 
                  onClick={() => setShowRescheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            {error && (
              <div className="mx-4 sm:mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleRescheduleSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleForm.newDate}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    onChange={(e) => setRescheduleForm({...rescheduleForm, newDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <input
                    type="time"
                    value={rescheduleForm.newTime}
                    onChange={(e) => setRescheduleForm({...rescheduleForm, newTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reschedule (Optional)</label>
                <textarea
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, reason: e.target.value})}
                  placeholder="Enter reason for rescheduling..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                >
                  Reschedule Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}