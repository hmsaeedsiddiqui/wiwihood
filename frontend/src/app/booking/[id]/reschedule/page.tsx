'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
  service: {
    id: string;
    name: string;
    duration: number;
  };
  provider: {
    id: string;
    businessName: string;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function RescheduleBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  useEffect(() => {
    if (selectedDate && booking) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, booking]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8000/api/v1/bookings/${bookingId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
      } else {
        throw new Error('Failed to fetch booking details');
      }
    } catch (error: any) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date: string) => {
    if (!booking) return;

    try {
      // Generate mock time slots for demo
      const slots: TimeSlot[] = [
        { time: '09:00', available: true },
        { time: '10:00', available: false },
        { time: '11:00', available: true },
        { time: '12:00', available: true },
        { time: '13:00', available: false },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
        { time: '16:00', available: false },
        { time: '17:00', available: true },
      ];
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleReschedule = async () => {
    if (!booking || !selectedDate || !selectedTime) return;

    try {
      setRescheduleLoading(true);

      // Convert selected date and time to proper datetime format
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + booking.service.duration * 60000);

      const response = await fetch(`http://localhost:8000/api/v1/bookings/${booking.id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
        }),
      });

      if (response.ok) {
        alert('Booking rescheduled successfully!');
        router.push(`/booking/${booking.id}`);
      } else {
        throw new Error('Failed to reschedule booking');
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      alert('Failed to reschedule booking. Please try again.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Booking not found'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "The booking you're looking for doesn't exist."}
          </p>
          <Link href="/customer/bookings" className="text-blue-600 hover:text-blue-700">
            Return to bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/booking/${booking.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to booking details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Reschedule Booking</h1>
          <p className="text-gray-600">Booking #{booking.bookingNumber}</p>
        </div>

        {/* Current Booking Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Booking</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Service:</span> {booking.service.name}</p>
            <p><span className="font-medium">Provider:</span> {booking.provider.businessName}</p>
            <p><span className="font-medium">Duration:</span> {booking.service.duration} minutes</p>
            <p><span className="font-medium">Current Date:</span> {new Date(booking.startDateTime).toLocaleDateString()}</p>
            <p><span className="font-medium">Current Time:</span> {new Date(booking.startDateTime).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Reschedule Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Select New Date & Time</h2>
          
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                        selectedTime === slot.time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : slot.available
                          ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                      {!slot.available && (
                        <div className="text-xs mt-1">Unavailable</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation */}
            {selectedDate && selectedTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      New appointment time
                    </p>
                    <p className="text-sm text-blue-700">
                      {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}, {selectedTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Link
                href={`/booking/${booking.id}`}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleReschedule}
                disabled={!selectedDate || !selectedTime || rescheduleLoading}
                className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                  selectedDate && selectedTime && !rescheduleLoading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}