'use client';
import React, { useState } from 'react';
import { Clock, Ban, Coffee, Plane } from 'lucide-react';

interface TimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onTimeBlockCreated: (timeBlock: any) => void;
}

export default function TimeBlockModal({ isOpen, onClose, selectedDate, onTimeBlockCreated }: TimeBlockModalProps) {
  const [timeBlockForm, setTimeBlockForm] = useState({
    type: 'blocked' as 'blocked' | 'break' | 'vacation',
    startTime: '',
    endTime: '',
    reason: '',
    recurring: false,
    endDate: ''
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !selectedDate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!timeBlockForm.startTime || !timeBlockForm.endTime) {
      setError('Please select start and end times');
      return;
    }

    if (timeBlockForm.startTime >= timeBlockForm.endTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      const timeBlockData = {
        date: selectedDate.toISOString().split('T')[0],
        startTime: timeBlockForm.startTime,
        endTime: timeBlockForm.endTime,
        reason: timeBlockForm.reason,
        type: timeBlockForm.type,
        recurring: timeBlockForm.recurring,
        endDate: timeBlockForm.endDate || null
      };

      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:8000/api/v1/time-blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('providerToken')}`
        },
        body: JSON.stringify(timeBlockData)
      });

      if (response.ok) {
        const newTimeBlock = await response.json();
        onTimeBlockCreated(newTimeBlock);
        
        // Reset form
        setTimeBlockForm({
          type: 'blocked',
          startTime: '',
          endTime: '',
          reason: '',
          recurring: false,
          endDate: ''
        });
        
        onClose();
      } else {
        setError('Failed to create time block');
      }
    } catch (error: any) {
      console.error('Time block creation error:', error);
      setError(error.message || 'Failed to create time block');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blocked': return <Ban className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'vacation': return <Plane className="w-4 h-4" />;
      default: return <Ban className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      case 'break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vacation': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Block Time - {selectedDate.toLocaleDateString()}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Block Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'blocked', label: 'Blocked', icon: Ban },
                { value: 'break', label: 'Break', icon: Coffee },
                { value: 'vacation', label: 'Vacation', icon: Plane }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setTimeBlockForm({...timeBlockForm, type: type.value as any})}
                  className={`
                    p-3 rounded-lg border text-center transition-colors flex flex-col items-center gap-1
                    ${timeBlockForm.type === type.value 
                      ? getTypeColor(type.value)
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={timeBlockForm.startTime}
                onChange={(e) => setTimeBlockForm({...timeBlockForm, startTime: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={timeBlockForm.endTime}
                onChange={(e) => setTimeBlockForm({...timeBlockForm, endTime: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={timeBlockForm.reason}
              onChange={(e) => setTimeBlockForm({...timeBlockForm, reason: e.target.value})}
              placeholder="e.g., Personal appointment, Lunch break"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Recurring */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={timeBlockForm.recurring}
                onChange={(e) => setTimeBlockForm({...timeBlockForm, recurring: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Repeat weekly</span>
            </label>
          </div>

          {/* End Date (if recurring) */}
          {timeBlockForm.recurring && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={timeBlockForm.endDate}
                onChange={(e) => setTimeBlockForm({...timeBlockForm, endDate: e.target.value})}
                min={selectedDate.toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Block Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}