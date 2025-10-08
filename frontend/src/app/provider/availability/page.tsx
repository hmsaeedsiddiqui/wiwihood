'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Settings, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings?: number;
}

interface WorkingHours {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
}

interface ProviderAvailability {
  id: string;
  providerId: string;
  workingHours: WorkingHours[];
  timeSlots: TimeSlot[];
  slotDuration: number;
  bufferTime: number;
  advanceBookingDays: number;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function ProviderAvailabilityPage() {
  const [availability, setAvailability] = useState<ProviderAvailability | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  const defaultWorkingHours: WorkingHours[] = DAYS_OF_WEEK.map((day, index) => ({
    id: `temp-${index}`,
    dayOfWeek: day,
    startTime: '09:00',
    endTime: '17:00',
    isWorkingDay: index < 5,
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  }));

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/providers/me/availability', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Availability data received:', data);
        
        if (data && data.workingHours && data.workingHours.length > 0) {
          setWorkingHours(data.workingHours);
        } else {
          setWorkingHours(defaultWorkingHours);
        }
        setError(null);
      } else {
        console.log('No availability data found, using defaults');
        setWorkingHours(defaultWorkingHours);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching availability:', error);
      setWorkingHours(defaultWorkingHours);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const payload = {
        workingHours: workingHours,
        slotDuration: 60,
        bufferTime: 15,
        advanceBookingDays: 30,
      };

      const response = await fetch('http://localhost:8000/api/v1/providers/me/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Availability saved successfully:', data);
        setError(null);
        alert('Availability saved successfully! Your working hours are now live for customer bookings.');
      } else {
        const errorData = await response.text();
        console.error('Failed to save availability:', errorData);
        setError('Failed to save availability. Please try again.');
      }
    } catch (error: any) {
      console.error('Error saving availability:', error);
      setError('Error saving availability. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateWorkingHours = (dayIndex: number, field: string, value: string | boolean) => {
    const updatedHours = [...workingHours];
    updatedHours[dayIndex] = {
      ...updatedHours[dayIndex],
      [field]: value,
    };
    setWorkingHours(updatedHours);
  };

  const toggleWorkingDay = (dayIndex: number) => {
    updateWorkingHours(dayIndex, 'isWorkingDay', !workingHours[dayIndex].isWorkingDay);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Availability</h2>
          <p className="text-gray-600">Setting up your schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="mb-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchAvailability}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
                <Calendar className="inline-block mr-3 h-8 w-8" />
                Availability Management
              </h1>
              <p className="text-white/90 text-lg">Set your working hours and booking time slots</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={saveAvailability}
                disabled={saving}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 flex items-center font-semibold"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href="/provider/calendar"
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all text-center font-semibold flex items-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
                { id: 'timeslots', label: 'Time Slots', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'blocked', label: 'Blocked Times', icon: Shield }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-semibold text-sm flex items-center transition-all ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Weekly Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Set Your Weekly Working Hours</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Configure your availability for each day of the week</p>
                
                <div className="space-y-3 md:space-y-4">
                  {workingHours.map((dayHours, index) => (
                    <div key={dayHours.dayOfWeek} className="border border-gray-200 rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <input
                            type="checkbox"
                            checked={dayHours.isWorkingDay}
                            onChange={() => toggleWorkingDay(index)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <h4 className="font-medium text-sm md:text-base text-gray-900">{dayHours.dayOfWeek}</h4>
                        </div>
                        {!dayHours.isWorkingDay && (
                          <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Not Available
                          </span>
                        )}
                      </div>

                      {dayHours.isWorkingDay && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={dayHours.startTime}
                              onChange={(e) => updateWorkingHours(index, 'startTime', e.target.value)}
                              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={dayHours.endTime}
                              onChange={(e) => updateWorkingHours(index, 'endTime', e.target.value)}
                              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                              Break Start
                            </label>
                            <input
                              type="time"
                              value={dayHours.breakStartTime || ''}
                              onChange={(e) => updateWorkingHours(index, 'breakStartTime', e.target.value)}
                              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                              Break End
                            </label>
                            <input
                              type="time"
                              value={dayHours.breakEndTime || ''}
                              onChange={(e) => updateWorkingHours(index, 'breakEndTime', e.target.value)}
                              className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots Tab */}
            {activeTab === 'timeslots' && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Time Slot Management</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">View and manage your available booking time slots for each day</p>
                
                {/* Slot Duration Settings */}
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Slot Duration
                      </label>
                      <select 
                        className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={30}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Buffer Time
                      </label>
                      <select 
                        className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={15}
                      >
                        <option value={0}>No buffer</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>
                    <div className="flex items-end sm:col-span-2 md:col-span-1">
                      <button className="w-full bg-blue-600 text-white px-3 md:px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition">
                        Generate Slots
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daily Time Slots */}
                <div className="space-y-4 md:space-y-6">
                  {DAYS_OF_WEEK.map((day, dayIndex) => {
                    const dayData = workingHours.find(h => h.dayOfWeek === day);
                    if (!dayData?.isWorkingDay) return null;

                    const generateDaySlots = () => {
                      const slots = [];
                      const startTime = dayData.startTime || '09:00';
                      const endTime = dayData.endTime || '17:00';
                      const breakStart = dayData.breakStartTime;
                      const breakEnd = dayData.breakEndTime;
                      
                      const [startHour, startMin] = startTime.split(':').map(Number);
                      const [endHour, endMin] = endTime.split(':').map(Number);
                      
                      let currentHour = startHour;
                      let currentMin = startMin;
                      const slotDuration = 30;
                      
                      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
                        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
                        
                        const isBreakTime = breakStart && breakEnd && 
                          timeString >= breakStart && timeString < breakEnd;
                        
                        slots.push({
                          time: timeString,
                          isAvailable: !isBreakTime,
                          isBreak: isBreakTime
                        });
                        
                        currentMin += slotDuration;
                        if (currentMin >= 60) {
                          currentHour += Math.floor(currentMin / 60);
                          currentMin = currentMin % 60;
                        }
                      }
                      
                      return slots;
                    };

                    const daySlots = generateDaySlots();

                    return (
                      <div key={day} className="border border-gray-200 rounded-lg p-3 md:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
                          <h4 className="font-semibold text-base md:text-lg text-gray-900">{day}</h4>
                          <div className="text-xs md:text-sm text-gray-600">
                            {dayData.startTime} - {dayData.endTime}
                            {dayData.breakStartTime && dayData.breakEndTime && (
                              <span className="block sm:inline sm:ml-2">(Break: {dayData.breakStartTime} - {dayData.breakEndTime})</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                          {daySlots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className={`
                                px-1 md:px-2 py-1 text-xs rounded text-center cursor-pointer transition
                                ${slot.isBreak 
                                  ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                                  : slot.isAvailable 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                }
                              `}
                              onClick={() => {
                                if (!slot.isBreak) {
                                  slot.isAvailable = !slot.isAvailable;
                                }
                              }}
                            >
                              {slot.time}
                              {slot.isBreak && <div className="text-xs hidden sm:block">Break</div>}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-3 md:gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-100 rounded"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-100 rounded"></div>
                            <span>Unavailable</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-100 rounded"></div>
                            <span>Break Time</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bulk Actions */}
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3 text-sm md:text-base">Bulk Actions</h4>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <button className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-green-700 transition text-xs md:text-sm">
                      Enable All Slots
                    </button>
                    <button className="bg-gray-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-gray-700 transition text-xs md:text-sm">
                      Disable All Slots
                    </button>
                    <button className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-blue-700 transition text-xs md:text-sm">
                      Copy to All Days
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Booking Settings</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Configure how customers can book appointments with you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Default Appointment Duration
                      </label>
                      <select className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Buffer Time Between Appointments
                      </label>
                      <select className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={0}>No buffer</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Advance Booking Period
                      </label>
                      <select className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={7}>1 week</option>
                        <option value={14}>2 weeks</option>
                        <option value={30}>1 month</option>
                        <option value={60}>2 months</option>
                        <option value={90}>3 months</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Minimum Notice Period
                      </label>
                      <select className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={1}>1 hour</option>
                        <option value={2}>2 hours</option>
                        <option value={4}>4 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={48}>48 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Maximum Bookings Per Day
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        defaultValue={8}
                        className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allowWeekends"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="allowWeekends" className="text-xs md:text-sm text-gray-700">
                        Allow weekend bookings
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoConfirm"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="autoConfirm" className="text-xs md:text-sm text-gray-700">
                        Auto-confirm bookings
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blocked Times Tab */}
            {activeTab === 'blocked' && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Blocked Times & Holidays</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Block specific dates and times when you're not available</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-sm md:text-base">Add New Blocked Period</h4>
                    <div className="space-y-4 p-3 md:p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Reason (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Vacation, Personal appointment"
                          className="w-full px-2 md:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition">
                        Block This Time
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-sm md:text-base">Current Blocked Times</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">December 25, 2024</p>
                          <p className="text-xs md:text-sm text-gray-600">All day - Christmas Holiday</p>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="text-center py-8 text-gray-500 text-sm">
                        <p>No blocked times set</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 text-sm md:text-base">Quick Schedule Templates</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Apply common working schedules</p>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-xs md:text-sm border border-gray-200 rounded hover:bg-gray-50">
                Monday-Friday 9AM-5PM
              </button>
              <button className="w-full text-left px-3 py-2 text-xs md:text-sm border border-gray-200 rounded hover:bg-gray-50">
                Monday-Saturday 10AM-6PM
              </button>
              <button className="w-full text-left px-3 py-2 text-xs md:text-sm border border-gray-200 rounded hover:bg-gray-50">
                Evening Hours 2PM-10PM
              </button>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 text-sm md:text-base">Availability Summary</h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>Working Days:</span>
                <span className="font-medium">
                  {workingHours.filter(h => h.isWorkingDay).length}/7
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Hours/Week:</span>
                <span className="font-medium">40 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Slots/Day:</span>
                <span className="font-medium">8 slots</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 text-sm md:text-base">Booking Statistics</h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>This Week:</span>
                <span className="font-medium">12 bookings</span>
              </div>
              <div className="flex justify-between">
                <span>Available Slots:</span>
                <span className="font-medium text-green-600">28 remaining</span>
              </div>
              <div className="flex justify-between">
                <span>Utilization:</span>
                <span className="font-medium">70%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}