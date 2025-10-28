'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Settings, Shield, CheckCircle, AlertCircle, Save, Plus, Edit, Trash2, X } from 'lucide-react';

// =================== UNIFIED INTERFACES ===================
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

interface BlockedTime {
  id: string;
  date: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  isAllDay: boolean;
}

// =================== UNIFIED COMPONENT ===================
const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

interface UnifiedAvailabilityProps {
  providerId?: string;
  mode?: 'full' | 'embedded'; // full = complete page, embedded = component only
  readOnly?: boolean;
  onScheduleChange?: (schedule: ProviderAvailability) => void;
}

export default function UnifiedAvailability({ 
  providerId, 
  mode = 'full', 
  readOnly = false,
  onScheduleChange 
}: UnifiedAvailabilityProps) {
  // =================== STATE MANAGEMENT ===================
  const [availability, setAvailability] = useState<ProviderAvailability | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  // Settings state
  const [slotDuration, setSlotDuration] = useState(30);
  const [bufferTime, setBufferTime] = useState(15);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(30);
  const [minNoticeHours, setMinNoticeHours] = useState(2);
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(8);
  const [allowWeekends, setAllowWeekends] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);

  // Block time form state
  const [blockForm, setBlockForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    isAllDay: false
  });

  const defaultWorkingHours: WorkingHours[] = DAYS_OF_WEEK.map((day, index) => ({
    id: `temp-${index}`,
    dayOfWeek: day,
    startTime: '09:00',
    endTime: '17:00',
    isWorkingDay: index < 5,
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  }));

  // =================== LIFECYCLE EFFECTS ===================
  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (onScheduleChange && availability) {
      onScheduleChange(availability);
    }
  }, [availability, onScheduleChange]);

  // =================== API FUNCTIONS ===================
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
          setAvailability(data);
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
    if (readOnly) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const payload = {
        workingHours: workingHours,
        slotDuration,
        bufferTime,
        advanceBookingDays,
        blockedTimes,
        settings: {
          minNoticeHours,
          maxBookingsPerDay,
          allowWeekends,
          autoConfirm
        }
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
        setAvailability(data);
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

  // =================== WORKING HOURS FUNCTIONS ===================
  const updateWorkingHours = (dayIndex: number, field: string, value: string | boolean) => {
    if (readOnly) return;
    
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

  const applyTemplate = (template: string) => {
    if (readOnly) return;
    
    let templateHours = [...defaultWorkingHours];
    
    switch (template) {
      case 'weekdays':
        templateHours = DAYS_OF_WEEK.map((day, index) => ({
          id: `template-${index}`,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isWorkingDay: index < 5,
          breakStartTime: '12:00',
          breakEndTime: '13:00',
        }));
        break;
      case 'extended':
        templateHours = DAYS_OF_WEEK.map((day, index) => ({
          id: `template-${index}`,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '18:00',
          isWorkingDay: index < 6,
          breakStartTime: '13:00',
          breakEndTime: '14:00',
        }));
        break;
      case 'evening':
        templateHours = DAYS_OF_WEEK.map((day, index) => ({
          id: `template-${index}`,
          dayOfWeek: day,
          startTime: '14:00',
          endTime: '22:00',
          isWorkingDay: index < 6,
          breakStartTime: '18:00',
          breakEndTime: '19:00',
        }));
        break;
    }
    
    setWorkingHours(templateHours);
  };

  // =================== TIME SLOT FUNCTIONS ===================
  const generateDaySlots = (dayData: WorkingHours) => {
    const slots = [];
    const startTime = dayData.startTime || '09:00';
    const endTime = dayData.endTime || '17:00';
    const breakStart = dayData.breakStartTime;
    const breakEnd = dayData.breakEndTime;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
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

  const bulkSlotAction = (action: 'enable' | 'disable' | 'copy') => {
    if (readOnly) return;
    // Implementation for bulk actions
    console.log(`Bulk action: ${action}`);
  };

  // =================== BLOCKED TIMES FUNCTIONS ===================
  const addBlockedTime = () => {
    if (readOnly) return;
    
    if (!blockForm.date) {
      alert('Please select a date');
      return;
    }

    const newBlockedTime: BlockedTime = {
      id: `block-${Date.now()}`,
      date: blockForm.date,
      startTime: blockForm.isAllDay ? undefined : blockForm.startTime,
      endTime: blockForm.isAllDay ? undefined : blockForm.endTime,
      reason: blockForm.reason,
      isAllDay: blockForm.isAllDay
    };

    setBlockedTimes([...blockedTimes, newBlockedTime]);
    setBlockForm({
      date: '',
      startTime: '',
      endTime: '',
      reason: '',
      isAllDay: false
    });
  };

  const removeBlockedTime = (id: string) => {
    if (readOnly) return;
    setBlockedTimes(blockedTimes.filter(bt => bt.id !== id));
  };

  // =================== RENDER FUNCTIONS ===================
  if (loading) {
    return (
      <div className={mode === 'embedded' ? "p-8" : "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"}>
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
      <div className={mode === 'embedded' ? "p-8" : "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"}>
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

  const renderContent = () => (
    <>
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
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Set Your Weekly Working Hours</h3>
                  <p className="text-gray-600">Configure your availability for each day of the week</p>
                </div>
                {!readOnly && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyTemplate('weekdays')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                    >
                      Mon-Fri 9-5
                    </button>
                    <button
                      onClick={() => applyTemplate('extended')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                    >
                      Mon-Sat 10-6
                    </button>
                    <button
                      onClick={() => applyTemplate('evening')}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm"
                    >
                      Evening 2-10
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {workingHours.map((dayHours, index) => (
                  <div key={dayHours.dayOfWeek} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={dayHours.isWorkingDay}
                          onChange={() => toggleWorkingDay(index)}
                          disabled={readOnly}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={dayHours.startTime}
                            onChange={(e) => updateWorkingHours(index, 'startTime', e.target.value)}
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slot Duration
                    </label>
                    <select 
                      value={slotDuration}
                      onChange={(e) => setSlotDuration(Number(e.target.value))}
                      disabled={readOnly}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      value={bufferTime}
                      onChange={(e) => setBufferTime(Number(e.target.value))}
                      disabled={readOnly}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No buffer</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    {!readOnly && (
                      <button 
                        onClick={() => bulkSlotAction('enable')}
                        className="w-full bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                      >
                        Generate Slots
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Daily Time Slots */}
              <div className="space-y-6">
                {DAYS_OF_WEEK.map((day, dayIndex) => {
                  const dayData = workingHours.find(h => h.dayOfWeek === day);
                  if (!dayData?.isWorkingDay) return null;

                  const daySlots = generateDaySlots(dayData);

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
                      
                      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
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
                              if (!slot.isBreak && !readOnly) {
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
              {!readOnly && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Bulk Actions</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => bulkSlotAction('enable')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                    >
                      Enable All Slots
                    </button>
                    <button 
                      onClick={() => bulkSlotAction('disable')}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-sm"
                    >
                      Disable All Slots
                    </button>
                    <button 
                      onClick={() => bulkSlotAction('copy')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      Copy to All Days
                    </button>
                  </div>
                </div>
              )}
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
                      Advance Booking Period
                    </label>
                    <select 
                      value={advanceBookingDays}
                      onChange={(e) => setAdvanceBookingDays(Number(e.target.value))}
                      disabled={readOnly}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={7}>1 week</option>
                      <option value={14}>2 weeks</option>
                      <option value={30}>1 month</option>
                      <option value={60}>2 months</option>
                      <option value={90}>3 months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Notice Period
                    </label>
                    <select 
                      value={minNoticeHours}
                      onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                      disabled={readOnly}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 hour</option>
                      <option value={2}>2 hours</option>
                      <option value={4}>4 hours</option>
                      <option value={24}>24 hours</option>
                      <option value={48}>48 hours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Bookings Per Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={maxBookingsPerDay}
                      onChange={(e) => setMaxBookingsPerDay(Number(e.target.value))}
                      disabled={readOnly}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allowWeekends"
                        checked={allowWeekends}
                        onChange={(e) => setAllowWeekends(e.target.checked)}
                        disabled={readOnly}
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
                        checked={autoConfirm}
                        onChange={(e) => setAutoConfirm(e.target.checked)}
                        disabled={readOnly}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="autoConfirm" className="text-sm text-gray-700">
                        Auto-confirm bookings
                      </label>
                    </div>
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
                        value={blockForm.date}
                        onChange={(e) => setBlockForm({...blockForm, date: e.target.value})}
                        disabled={readOnly}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isAllDay"
                        checked={blockForm.isAllDay}
                        onChange={(e) => setBlockForm({...blockForm, isAllDay: e.target.checked})}
                        disabled={readOnly}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="isAllDay" className="text-sm text-gray-700">
                        All day
                      </label>
                    </div>

                    {!blockForm.isAllDay && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={blockForm.startTime}
                            onChange={(e) => setBlockForm({...blockForm, startTime: e.target.value})}
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={blockForm.endTime}
                            onChange={(e) => setBlockForm({...blockForm, endTime: e.target.value})}
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Vacation, Personal appointment"
                        value={blockForm.reason}
                        onChange={(e) => setBlockForm({...blockForm, reason: e.target.value})}
                        disabled={readOnly}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {!readOnly && (
                      <button 
                        onClick={addBlockedTime}
                        className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Block This Time
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Current Blocked Times</h4>
                  <div className="space-y-2">
                    {blockedTimes.map((blockedTime) => (
                      <div key={blockedTime.id} className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{blockedTime.date}</p>
                          <p className="text-sm text-gray-600">
                            {blockedTime.isAllDay ? 'All day' : `${blockedTime.startTime} - ${blockedTime.endTime}`}
                            {blockedTime.reason && ` - ${blockedTime.reason}`}
                          </p>
                        </div>
                        {!readOnly && (
                          <button 
                            onClick={() => removeBlockedTime(blockedTime.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {blockedTimes.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        <p>No blocked times set</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Availability Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Working Days:</span>
              <span className="font-medium">
                {workingHours.filter(h => h.isWorkingDay).length}/7
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Hours/Week:</span>
              <span className="font-medium">
                {workingHours
                  .filter(h => h.isWorkingDay)
                  .reduce((total, day) => {
                    const start = new Date(`1970-01-01T${day.startTime}:00`);
                    const end = new Date(`1970-01-01T${day.endTime}:00`);
                    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  }, 0)
                  .toFixed(1)} hours
              </span>
            </div>
            <div className="flex justify-between">
              <span>Slot Duration:</span>
              <span className="font-medium">{slotDuration} minutes</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Booking Settings</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Buffer Time:</span>
              <span className="font-medium">{bufferTime} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Advance Booking:</span>
              <span className="font-medium">{advanceBookingDays} days</span>
            </div>
            <div className="flex justify-between">
              <span>Min Notice:</span>
              <span className="font-medium">{minNoticeHours} hours</span>
            </div>
            <div className="flex justify-between">
              <span>Auto Confirm:</span>
              <span className="font-medium">{autoConfirm ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Blocked Times</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Blocked:</span>
              <span className="font-medium">{blockedTimes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>All Day Blocks:</span>
              <span className="font-medium">
                {blockedTimes.filter(bt => bt.isAllDay).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Partial Blocks:</span>
              <span className="font-medium">
                {blockedTimes.filter(bt => !bt.isAllDay).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (mode === 'embedded') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Availability Management</h2>
          </div>
          {!readOnly && (
            <button
              onClick={saveAvailability}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
        {renderContent()}
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
                Unified Availability Management
              </h1>
              <p className="text-white/90 text-lg">Complete availability control in one place</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {!readOnly && (
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
                      Save All Changes
                    </>
                  )}
                </button>
              )}
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
        {renderContent()}
      </div>
    </div>
  );
}

// =================== EXPORT OPTIONS ===================
// Export as default for full page use
export { UnifiedAvailability };

// Export specific components for modular use if needed
export const AvailabilitySchedule = ({ workingHours, onUpdate, readOnly }: any) => (
  <UnifiedAvailability mode="embedded" readOnly={readOnly} />
);

export const AvailabilitySettings = ({ settings, onUpdate, readOnly }: any) => (
  <UnifiedAvailability mode="embedded" readOnly={readOnly} />
);