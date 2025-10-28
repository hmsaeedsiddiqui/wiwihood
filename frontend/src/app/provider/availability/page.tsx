'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Settings, Shield, CheckCircle, AlertCircle, Save, Plus, Trash2 } from 'lucide-react';
import {
  useGetProviderWorkingHoursQuery,
  useCreateOrUpdateWorkingHoursMutation,
  useGetProviderBlockedTimesQuery,
  useCreateBlockedTimeMutation,
  useDeleteBlockedTimeMutation,
  useGetProviderTimeSlotsQuery,
  useGenerateTimeSlotsMutation,
  useBulkUpdateTimeSlotsMutation,
  useGetAvailabilityAnalyticsQuery,
  useGetAvailabilitySettingsQuery,
  useUpdateAvailabilitySettingsMutation,
  type WorkingHours,
  type BlockedTime,
  type TimeSlot,
  type CreateBlockedTimeRequest,
  type GenerateTimeSlotsRequest,
} from '../../../store/api/providersApi';

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
] as const;

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday', 
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function ProviderAvailabilityPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [blockForm, setBlockForm] = useState<CreateBlockedTimeRequest>({
    blockDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    blockType: 'personal',
    isAllDay: false,
  });

  // API hooks
  const { 
    data: workingHours = [], 
    isLoading: loadingHours, 
    error: hoursError 
  } = useGetProviderWorkingHoursQuery();
  
  const { 
    data: blockedTimes = [], 
    isLoading: loadingBlocked 
  } = useGetProviderBlockedTimesQuery({});
  
  const { 
    data: analytics 
  } = useGetAvailabilityAnalyticsQuery({ period: 'month' });
  
  const { 
    data: settings 
  } = useGetAvailabilitySettingsQuery();

  const [createOrUpdateWorkingHours, { isLoading: savingHours }] = useCreateOrUpdateWorkingHoursMutation();
  const [createBlockedTime] = useCreateBlockedTimeMutation();
  const [deleteBlockedTime] = useDeleteBlockedTimeMutation();
  const [generateTimeSlots] = useGenerateTimeSlotsMutation();
  const [updateAvailabilitySettings] = useUpdateAvailabilitySettingsMutation();

  // Local state for working hours
  const [localWorkingHours, setLocalWorkingHours] = useState<WorkingHours[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize local state when data loads
  useEffect(() => {
    if (!loadingHours && !hoursError && !isInitialized) {
      if (workingHours.length > 0) {
        setLocalWorkingHours([...workingHours]);
      } else {
        // Initialize with default hours if none exist
        const defaultHours: Partial<WorkingHours>[] = DAYS_OF_WEEK.map(day => ({
          dayOfWeek: day,
          isWorkingDay: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day),
          startTime: '09:00',
          endTime: '17:00',
          breakStartTime: '12:00',
          breakEndTime: '13:00',
        }));
        setLocalWorkingHours(defaultHours as WorkingHours[]);
      }
      setIsInitialized(true);
    }
  }, [loadingHours, hoursError, isInitialized, workingHours.length]); // Use workingHours.length instead of the whole array

  const updateWorkingHours = (dayIndex: number, field: string, value: string | boolean) => {
    const updatedHours = [...localWorkingHours];
    updatedHours[dayIndex] = {
      ...updatedHours[dayIndex],
      [field]: value,
    };
    setLocalWorkingHours(updatedHours);
  };

  const toggleWorkingDay = (dayIndex: number) => {
    updateWorkingHours(dayIndex, 'isWorkingDay', !localWorkingHours[dayIndex]?.isWorkingDay);
  };

  const saveAvailability = async () => {
    try {
      await createOrUpdateWorkingHours(localWorkingHours).unwrap();
      alert('Availability saved successfully!');
    } catch (error: any) {
      console.error('Error saving availability:', error);
      alert('Failed to save availability. Please try again.');
    }
  };

  const handleAddBlockedTime = async () => {
    if (!blockForm.blockDate || !blockForm.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createBlockedTime(blockForm).unwrap();
      setBlockForm({
        blockDate: '',
        startTime: '',
        endTime: '',
        reason: '',
        blockType: 'personal',
        isAllDay: false,
      });
      alert('Blocked time added successfully!');
    } catch (error: any) {
      console.error('Error adding blocked time:', error);
      alert('Failed to add blocked time. Please try again.');
    }
  };

  const handleDeleteBlockedTime = async (id: string) => {
    if (confirm('Are you sure you want to delete this blocked time?')) {
      try {
        await deleteBlockedTime(id).unwrap();
        alert('Blocked time deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting blocked time:', error);
        alert('Failed to delete blocked time. Please try again.');
      }
    }
  };

  const handleGenerateSlots = async () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    const generateData: GenerateTimeSlotsRequest = {
      fromDate: today.toISOString().split('T')[0],
      toDate: nextMonth.toISOString().split('T')[0],
      slotDurationMinutes: 30,
      bufferTimeMinutes: 15,
      skipExistingSlots: true,
    };

    try {
      await generateTimeSlots(generateData).unwrap();
      alert('Time slots generated successfully!');
    } catch (error: any) {
      console.error('Error generating time slots:', {
        error,
        message: error?.message || 'Unknown error',
        status: error?.status || 'No status',
        data: error?.data || 'No data'
      });
      alert('Failed to generate time slots. Please try again.');
    }
  };

  const handleSettingsChange = async (field: string, value: any) => {
    try {
      await updateAvailabilitySettings({
        [field]: value,
      }).unwrap();
    } catch (error: any) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  if (loadingHours) {
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

  if (hoursError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="mb-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading</h2>
          <p className="text-gray-600 mb-6">Failed to load availability data</p>
          <button 
            onClick={() => window.location.reload()}
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
                disabled={savingHours}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 flex items-center font-semibold"
              >
                {savingHours ? (
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
                <h3 className="text-lg font-semibold mb-4">Set Your Weekly Working Hours</h3>
                <p className="text-gray-600 mb-6">Configure your availability for each day of the week</p>
                
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((day, index) => {
                    const dayHours = localWorkingHours.find(h => h.dayOfWeek === day) || {
                      dayOfWeek: day,
                      isWorkingDay: false,
                      startTime: '09:00',
                      endTime: '17:00',
                    };
                    
                    return (
                      <div key={day} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={dayHours?.isWorkingDay || false}
                              onChange={() => toggleWorkingDay(index)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            <h4 className="font-medium text-gray-900">{DAY_LABELS[day]}</h4>
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
                                value={dayHours.startTime || '09:00'}
                                onChange={(e) => updateWorkingHours(index, 'startTime', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={dayHours.endTime || '17:00'}
                                onChange={(e) => updateWorkingHours(index, 'endTime', e.target.value)}
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
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Time Slots Tab */}
            {activeTab === 'timeslots' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Time Slot Management</h3>
                    <p className="text-gray-600">Generate and manage your available booking time slots</p>
                  </div>
                  <button
                    onClick={handleGenerateSlots}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Slots
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Automatic Slot Generation</h4>
                  <p className="text-blue-700 text-sm">
                    Click "Generate Slots" to automatically create time slots based on your working hours. 
                    This will generate slots for the next 30 days with 30-minute durations and 15-minute buffer times.
                  </p>
                </div>

                {analytics && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Slot Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analytics.slots.total}</div>
                        <div className="text-sm text-gray-600">Total Slots</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analytics.slots.available}</div>
                        <div className="text-sm text-gray-600">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{analytics.slots.booked}</div>
                        <div className="text-sm text-gray-600">Booked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{analytics.rates.utilization}%</div>
                        <div className="text-sm text-gray-600">Utilization</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Booking Settings</h3>
                <p className="text-gray-600 mb-6">Configure how customers can book appointments with you</p>
                
                {settings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Slot Duration (minutes)
                        </label>
                        <select 
                          value={settings?.defaultSlotDuration || 30}
                          onChange={(e) => handleSettingsChange('defaultSlotDuration', parseInt(e.target.value))}
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
                          Buffer Time (minutes)
                        </label>
                        <select 
                          value={settings?.defaultBufferTime || 15}
                          onChange={(e) => handleSettingsChange('defaultBufferTime', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={0}>No buffer</option>
                          <option value={10}>10 minutes</option>
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Advance Booking Period (days)
                        </label>
                        <select 
                          value={settings?.maxAdvanceBookingDays || 30}
                          onChange={(e) => handleSettingsChange('maxAdvanceBookingDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
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
                          Minimum Notice Period (hours)
                        </label>
                        <select 
                          value={settings?.minAdvanceBookingHours || 2}
                          onChange={(e) => handleSettingsChange('minAdvanceBookingHours', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={1}>1 hour</option>
                          <option value={2}>2 hours</option>
                          <option value={4}>4 hours</option>
                          <option value={24}>24 hours</option>
                          <option value={48}>48 hours</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="autoGenerate"
                            checked={settings?.autoGenerateSlots || false}
                            onChange={(e) => handleSettingsChange('autoGenerateSlots', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label htmlFor="autoGenerate" className="text-sm text-gray-700">
                            Auto-generate time slots
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="requireConfirmation"
                            checked={settings?.requireConfirmation || false}
                            onChange={(e) => handleSettingsChange('requireConfirmation', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label htmlFor="requireConfirmation" className="text-sm text-gray-700">
                            Require booking confirmation
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                          value={blockForm.blockDate}
                          onChange={(e) => setBlockForm({...blockForm, blockDate: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={blockForm.blockType}
                          onChange={(e) => setBlockForm({...blockForm, blockType: e.target.value as any})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="personal">Personal</option>
                          <option value="vacation">Vacation</option>
                          <option value="holiday">Holiday</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="emergency">Emergency</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isAllDay"
                          checked={blockForm.isAllDay}
                          onChange={(e) => setBlockForm({...blockForm, isAllDay: e.target.checked})}
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
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Vacation, Personal appointment"
                          value={blockForm.reason}
                          onChange={(e) => setBlockForm({...blockForm, reason: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button 
                        onClick={handleAddBlockedTime}
                        className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Block This Time
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Current Blocked Times</h4>
                    <div className="space-y-2">
                      {blockedTimes.length > 0 ? (
                        blockedTimes.map((blockedTime) => (
                          <div key={blockedTime.id} className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">{blockedTime.blockDate}</p>
                              <p className="text-sm text-gray-600">
                                {blockedTime.isAllDay ? 'All day' : `${blockedTime.startTime} - ${blockedTime.endTime}`}
                                {' - '}{blockedTime.reason}
                              </p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {blockedTime.blockType}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeleteBlockedTime(blockedTime.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
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

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Availability Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Working Days:</span>
                  <span className="font-medium">{analytics.workingSchedule.workingDays}/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Hours/Week:</span>
                  <span className="font-medium">{analytics.workingSchedule.totalWorkingHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Hours/Day:</span>
                  <span className="font-medium">{analytics.workingSchedule.avgHoursPerDay}h</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Booking Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Available Slots:</span>
                  <span className="font-medium text-green-600">{analytics.slots.available}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booked Slots:</span>
                  <span className="font-medium text-blue-600">{analytics.slots.booked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilization Rate:</span>
                  <span className="font-medium">{analytics.rates.utilization}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Blocked Times</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Blocked:</span>
                  <span className="font-medium">{analytics.blockedTimes.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Blocks:</span>
                  <span className="font-medium">{analytics.blockedTimes.active}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Types: {Object.entries(analytics.blockedTimes.byType)
                    .filter(([_, count]) => count > 0)
                    .map(([type, count]) => `${type}: ${count}`)
                    .join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}