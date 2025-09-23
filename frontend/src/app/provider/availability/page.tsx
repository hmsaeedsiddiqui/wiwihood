'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProviderNav from '@/components/ProviderNav';

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
  slotDuration: number; // in minutes
  bufferTime: number; // buffer between appointments in minutes
  advanceBookingDays: number; // how many days ahead can customers book
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

  // Default working hours template
  const defaultWorkingHours: WorkingHours[] = DAYS_OF_WEEK.map((day, index) => ({
    id: `temp-${index}`,
    dayOfWeek: day,
    startTime: '09:00',
    endTime: '17:00',
    isWorkingDay: index < 5, // Monday to Friday by default
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

      // Temporary: Skip API call and use default data
      const useDefaults = true;
      if (useDefaults) {
        setWorkingHours(defaultWorkingHours);
        setError(null);
      }
    } catch (error: any) {
      // For now, just use defaults instead of showing error
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
        slotDuration: 60, // Default 60 minutes
        bufferTime: 15, // Default 15 minutes buffer
        advanceBookingDays: 30, // Default 30 days advance booking
      };

      const response = await fetch('http://localhost:8000/api/v1/providers/me/availability', {
        method: availability ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Temporary: Skip API call for now and just simulate success
      const simulateSuccess = true;
      if (simulateSuccess) {
        // setAvailability(payload);
        setError(null);
        alert('Availability saved successfully! (Simulated - API will be connected later)');
      }
    } catch (error: any) {
      // For now, just log the error since we're simulating success
      console.log('API call would have failed:', error.message);
      setError(null);
      alert('Availability saved successfully! (Simulated - API will be connected later)');
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
      <div className="min-h-screen bg-gray-50">
        <ProviderNav />
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading availability settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProviderNav />
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchAvailability}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
            <p className="text-gray-600">Set your working hours and booking time slots</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={saveAvailability}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/provider/calendar"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              📅 View Calendar
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'schedule', label: 'Weekly Schedule' },
                { id: 'timeslots', label: 'Time Slots' },
                { id: 'settings', label: 'Booking Settings' },
                { id: 'blocked', label: 'Blocked Times' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Weekly Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Set Your Weekly Working Hours</h3>
                <p className="text-gray-600 mb-6">Configure your availability for each day of the week</p>
                
                <div className="space-y-4">
                  {workingHours.map((dayHours, index) => (
                    <div key={dayHours.dayOfWeek} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={dayHours.isWorkingDay}
                            onChange={() => toggleWorkingDay(index)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <h4 className="font-medium text-gray-900">{dayHours.dayOfWeek}</h4>
                        </div>
                        {!dayHours.isWorkingDay && (
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Not Available
                          </span>
                        )}
                      </div>

                      {dayHours.isWorkingDay && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={dayHours.startTime}
                              onChange={(e) => updateWorkingHours(index, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={dayHours.endTime}
                              onChange={(e) => updateWorkingHours(index, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Break Start
                            </label>
                            <input
                              type="time"
                              value={dayHours.breakStartTime || ''}
                              onChange={(e) => updateWorkingHours(index, 'breakStartTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Break End
                            </label>
                            <input
                              type="time"
                              value={dayHours.breakEndTime || ''}
                              onChange={(e) => updateWorkingHours(index, 'breakEndTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h3 className="text-lg font-semibold mb-4">Time Slot Management</h3>
                <p className="text-gray-600 mb-6">View and manage your available booking time slots for each day</p>
                
                {/* Slot Duration Settings */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slot Duration
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={30}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer Time
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={15}
                      >
                        <option value={0}>No buffer</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                        Generate Slots
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daily Time Slots */}
                <div className="space-y-6">
                  {DAYS_OF_WEEK.map((day, dayIndex) => {
                    const dayData = workingHours.find(h => h.dayOfWeek === day);
                    if (!dayData?.isWorkingDay) return null;

                    // Generate time slots for this day
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
                      const slotDuration = 30; // minutes
                      
                      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
                        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
                        
                        // Check if slot is during break time
                        const isBreakTime = breakStart && breakEnd && 
                          timeString >= breakStart && timeString < breakEnd;
                        
                        slots.push({
                          time: timeString,
                          isAvailable: !isBreakTime,
                          isBreak: isBreakTime
                        });
                        
                        // Add slot duration
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
                      <div key={day} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg text-gray-900">{day}</h4>
                          <div className="text-sm text-gray-600">
                            {dayData.startTime} - {dayData.endTime}
                            {dayData.breakStartTime && dayData.breakEndTime && (
                              <span className="ml-2">(Break: {dayData.breakStartTime} - {dayData.breakEndTime})</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                          {daySlots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className={`
                                px-2 py-1 text-xs rounded text-center cursor-pointer transition
                                ${slot.isBreak 
                                  ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                                  : slot.isAvailable 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                }
                              `}
                              onClick={() => {
                                if (!slot.isBreak) {
                                  // Toggle slot availability
                                  slot.isAvailable = !slot.isAvailable;
                                }
                              }}
                            >
                              {slot.time}
                              {slot.isBreak && <div className="text-xs">Break</div>}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 flex gap-4 text-xs">
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
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Bulk Actions</h4>
                  <div className="flex gap-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm">
                      Enable All Slots
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-sm">
                      Disable All Slots
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">
                      Copy to All Days
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Booking Settings</h3>
                <p className="text-gray-600 mb-6">Configure how customers can book appointments with you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Appointment Duration
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer Time Between Appointments
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={0}>No buffer</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advance Booking Period
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Notice Period
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={1}>1 hour</option>
                        <option value={2}>2 hours</option>
                        <option value={4}>4 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={48}>48 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Bookings Per Day
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        defaultValue={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allowWeekends"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="allowWeekends" className="text-sm text-gray-700">
                        Allow weekend bookings
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoConfirm"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="autoConfirm" className="text-sm text-gray-700">
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
                <h3 className="text-lg font-semibold mb-4">Blocked Times & Holidays</h3>
                <p className="text-gray-600 mb-6">Block specific dates and times when you're not available</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Add New Blocked Period</h4>
                    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Vacation, Personal appointment"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Block This Time
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Current Blocked Times</h4>
                    <div className="space-y-2">
                      {/* Sample blocked times - replace with real data */}
                      <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">December 25, 2024</p>
                          <p className="text-sm text-gray-600">All day - Christmas Holiday</p>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="text-center py-8 text-gray-500">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Quick Schedule Templates</h3>
            <p className="text-sm text-gray-600 mb-4">Apply common working schedules</p>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50">
                Monday-Friday 9AM-5PM
              </button>
              <button className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50">
                Monday-Saturday 10AM-6PM
              </button>
              <button className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50">
                Evening Hours 2PM-10PM
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Availability Summary</h3>
            <div className="space-y-2 text-sm">
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

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Booking Statistics</h3>
            <div className="space-y-2 text-sm">
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