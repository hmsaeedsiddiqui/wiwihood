"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Edit, Trash2, Save, X } from "lucide-react";
import axios from "axios";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface AvailabilityCalendarProps {
  providerId?: string;
  onScheduleChange?: (schedule: WeeklySchedule) => void;
  readOnly?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  providerId,
  onScheduleChange,
  readOnly = false
}) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    monday: { isOpen: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { isOpen: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { isOpen: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    thursday: { isOpen: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { isOpen: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    saturday: { isOpen: true, timeSlots: [{ start: "09:00", end: "15:00" }] },
    sunday: { isOpen: false, timeSlots: [] }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingDay, setEditingDay] = useState<string | null>(null);

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];

  useEffect(() => {
    if (providerId) {
      fetchAvailability();
    }
  }, [providerId]);

  useEffect(() => {
    if (onScheduleChange) {
      onScheduleChange(schedule);
    }
  }, [schedule, onScheduleChange]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/providers/${providerId}/availability`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      if (response.data) {
        setSchedule(response.data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Keep default schedule if API fails
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    if (!providerId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/providers/${providerId}/availability`,
        schedule,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      setError("");
      alert("Availability updated successfully!");
    } catch (error) {
      console.error('Error saving availability:', error);
      setError("Failed to save availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDayOpen = (day: string) => {
    if (readOnly) return;
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklySchedule],
        isOpen: !prev[day as keyof WeeklySchedule].isOpen,
        timeSlots: !prev[day as keyof WeeklySchedule].isOpen ? 
          [{ start: "09:00", end: "17:00" }] : 
          prev[day as keyof WeeklySchedule].timeSlots
      }
    }));
  };

  const addTimeSlot = (day: string) => {
    if (readOnly) return;
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklySchedule],
        timeSlots: [
          ...prev[day as keyof WeeklySchedule].timeSlots,
          { start: "09:00", end: "17:00" }
        ]
      }
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    if (readOnly) return;
    
    setSchedule(prev => {
      const daySchedule = prev[day as keyof WeeklySchedule];
      const updatedTimeSlots = [...daySchedule.timeSlots];
      updatedTimeSlots[index] = { ...updatedTimeSlots[index], [field]: value };
      
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          timeSlots: updatedTimeSlots
        }
      };
    });
  };

  const removeTimeSlot = (day: string, index: number) => {
    if (readOnly) return;
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeeklySchedule],
        timeSlots: prev[day as keyof WeeklySchedule].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const copyToPreviousDay = (fromDay: string) => {
    if (readOnly) return;
    
    const dayIndex = daysOfWeek.findIndex(d => d.key === fromDay);
    if (dayIndex > 0) {
      const previousDay = daysOfWeek[dayIndex - 1].key;
      setSchedule(prev => ({
        ...prev,
        [previousDay]: { ...prev[fromDay as keyof WeeklySchedule] }
      }));
    }
  };

  const copyToAllDays = (fromDay: string) => {
    if (readOnly) return;
    
    const daySchedule = schedule[fromDay as keyof WeeklySchedule];
    const newSchedule = { ...schedule };
    
    daysOfWeek.forEach(day => {
      if (day.key !== fromDay) {
        newSchedule[day.key as keyof WeeklySchedule] = { ...daySchedule };
      }
    });
    
    setSchedule(newSchedule);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Availability Calendar</h2>
        </div>
        {!readOnly && providerId && (
          <button
            onClick={saveAvailability}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const daySchedule = schedule[day.key as keyof WeeklySchedule];
          
          return (
            <div key={day.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={daySchedule.isOpen}
                      onChange={() => toggleDayOpen(day.key)}
                      disabled={readOnly}
                      className="mr-2 rounded"
                    />
                    <span className="font-medium text-gray-900">{day.label}</span>
                  </label>
                  {daySchedule.isOpen && (
                    <span className="text-sm text-gray-500">
                      ({daySchedule.timeSlots.length} time slot{daySchedule.timeSlots.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                
                {!readOnly && daySchedule.isOpen && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToPreviousDay(day.key)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                      disabled={daysOfWeek.findIndex(d => d.key === day.key) === 0}
                    >
                      Copy to Previous
                    </button>
                    <button
                      onClick={() => copyToAllDays(day.key)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Copy to All
                    </button>
                  </div>
                )}
              </div>

              {daySchedule.isOpen ? (
                <div className="space-y-2">
                  {daySchedule.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(day.key, index, 'start', e.target.value)}
                        disabled={readOnly}
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(day.key, index, 'end', e.target.value)}
                        disabled={readOnly}
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {!readOnly && daySchedule.timeSlots.length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(day.key, index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {!readOnly && (
                    <button
                      onClick={() => addTimeSlot(day.key)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Closed</div>
              )}
            </div>
          );
        })}
      </div>

      {!readOnly && !providerId && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            ℹ️ Your availability will be saved when you complete the business setup.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;