"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface WorkingHours {
  id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  workingHours?: WorkingHours[];
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

export default function StaffCalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = searchParams.get('staffId');
  
  const [staff, setStaff] = useState<Staff | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (staffId) {
      fetchStaffDetails();
    }
  }, [staffId]);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API call
      const mockStaff: Staff = {
        id: staffId!,
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        role: 'Senior Stylist',
        profileImage: 'staff/emma_profile',
        workingHours: [
          { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'thursday', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'friday', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'saturday', startTime: '10:00', endTime: '16:00', isActive: true },
          { dayOfWeek: 'sunday', startTime: '10:00', endTime: '16:00', isActive: false }
        ]
      };

      setStaff(mockStaff);
      setWorkingHours(mockStaff.workingHours || []);
    } catch (error) {
      console.error('Error fetching staff details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: string | boolean) => {
    setWorkingHours(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    );
  };

  const saveWorkingHours = async () => {
    try {
      setSaving(true);
      
      // API call to save working hours
      console.log('Saving working hours:', workingHours);
      
      // Mock successful save
      setTimeout(() => {
        setSaving(false);
        alert('Working hours saved successfully!');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving working hours:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Staff member not found</h2>
          <button
            onClick={() => router.back()}
            className="text-orange-600 hover:text-orange-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Staff</span>
          </button>
          
          <div className="flex items-center space-x-4">
            {staff.profileImage ? (
              <img
                src={`https://res.cloudinary.com/dmhvsn3dm/image/upload/w_100,h_100,c_fill,g_face/${staff.profileImage}`}
                alt={staff.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{staff.name}</h1>
              <p className="text-gray-600">{staff.role} • Individual Calendar Management</p>
            </div>
          </div>
        </div>

        {/* Calendar Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Working Hours & Availability</h2>
          </div>

          <div className="space-y-4">
            {daysOfWeek.map((day, index) => {
              const dayHours = workingHours.find(h => h.dayOfWeek === day.key) || {
                dayOfWeek: day.key,
                startTime: '09:00',
                endTime: '17:00',
                isActive: day.key !== 'sunday'
              };

              return (
                <div key={day.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dayHours.isActive}
                        onChange={(e) => {
                          const dayIndex = workingHours.findIndex(h => h.dayOfWeek === day.key);
                          if (dayIndex >= 0) {
                            handleWorkingHoursChange(dayIndex, 'isActive', e.target.checked);
                          } else {
                            setWorkingHours(prev => [...prev, { ...dayHours, isActive: e.target.checked }]);
                          }
                        }}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {day.label}
                      </span>
                    </label>
                  </div>

                  {dayHours.isActive ? (
                    <>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={dayHours.startTime}
                          onChange={(e) => {
                            const dayIndex = workingHours.findIndex(h => h.dayOfWeek === day.key);
                            if (dayIndex >= 0) {
                              handleWorkingHoursChange(dayIndex, 'startTime', e.target.value);
                            } else {
                              setWorkingHours(prev => [...prev, { ...dayHours, startTime: e.target.value }]);
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End Time</label>
                        <input
                          type="time"
                          value={dayHours.endTime}
                          onChange={(e) => {
                            const dayIndex = workingHours.findIndex(h => h.dayOfWeek === day.key);
                            if (dayIndex >= 0) {
                              handleWorkingHoursChange(dayIndex, 'endTime', e.target.value);
                            } else {
                              setWorkingHours(prev => [...prev, { ...dayHours, endTime: e.target.value }]);
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 text-sm text-gray-400 italic">
                      Day off
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={saveWorkingHours}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Working Hours'}</span>
            </button>
          </div>
        </div>

        {/* Appointment Calendar Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Appointment Calendar</h2>
            </div>
            <span className="text-sm text-gray-500">
              Individual booking calendar for {staff.name}
            </span>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Individual Calendar System</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Customers can book appointments specifically with {staff.name} during their available hours. 
                  Each staff member has their own independent calendar for appointment management.
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Summary */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Weekly Schedule Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {daysOfWeek.map((day) => {
                const dayHours = workingHours.find(h => h.dayOfWeek === day.key);
                return (
                  <div key={day.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{day.label}</span>
                    <span className="text-sm text-gray-600">
                      {dayHours?.isActive ? `${dayHours.startTime} - ${dayHours.endTime}` : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}