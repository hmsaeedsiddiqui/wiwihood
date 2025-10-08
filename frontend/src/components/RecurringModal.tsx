'use client';
import React, { useState, useEffect } from 'react';
import { RotateCcw, Calendar, Clock, User, Mail } from 'lucide-react';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onRecurringCreated: (recurring: any) => void;
}

export default function RecurringModal({ isOpen, onClose, selectedDate, onRecurringCreated }: RecurringModalProps) {
  const [services, setServices] = useState<any[]>([]);
  const [recurringForm, setRecurringForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    startTime: '',
    interval: 'weekly' as 'weekly' | 'biweekly' | 'monthly',
    endDate: '',
    notes: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/services/my-services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  if (!isOpen || !selectedDate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!recurringForm.customerName || !recurringForm.customerEmail || !recurringForm.serviceId || !recurringForm.startTime) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const recurringData = {
        customerName: recurringForm.customerName,
        customerEmail: recurringForm.customerEmail,
        customerPhone: recurringForm.customerPhone,
        serviceId: recurringForm.serviceId,
        startDate: selectedDate.toISOString().split('T')[0],
        startTime: recurringForm.startTime,
        interval: recurringForm.interval,
        endDate: recurringForm.endDate || null,
        notes: recurringForm.notes
      };

      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:8000/api/v1/recurring-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('providerToken')}`
        },
        body: JSON.stringify(recurringData)
      });

      if (response.ok) {
        const newRecurring = await response.json();
        onRecurringCreated(newRecurring);
        
        // Reset form
        setRecurringForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          serviceId: '',
          startTime: '',
          interval: 'weekly',
          endDate: '',
          notes: ''
        });
        
        onClose();
      } else {
        setError('Failed to create recurring appointment');
      }
    } catch (error: any) {
      console.error('Recurring appointment creation error:', error);
      setError(error.message || 'Failed to create recurring appointment');
    } finally {
      setLoading(false);
    }
  };

  const getIntervalLabel = (interval: string) => {
    switch (interval) {
      case 'weekly': return 'Every week';
      case 'biweekly': return 'Every 2 weeks';
      case 'monthly': return 'Every month';
      default: return interval;
    }
  };

  const getNextOccurrences = () => {
    if (!selectedDate || !recurringForm.interval) return [];
    
    const dates = [];
    const currentDate = new Date(selectedDate);
    
    for (let i = 1; i <= 4; i++) {
      const nextDate = new Date(currentDate);
      
      switch (recurringForm.interval) {
        case 'weekly':
          nextDate.setDate(currentDate.getDate() + (i * 7));
          break;
        case 'biweekly':
          nextDate.setDate(currentDate.getDate() + (i * 14));
          break;
        case 'monthly':
          nextDate.setMonth(currentDate.getMonth() + i);
          break;
      }
      
      dates.push(nextDate);
    }
    
    return dates;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Create Recurring Appointment
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Starting from {selectedDate.toLocaleDateString()}
          </p>
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

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={recurringForm.customerName}
                  onChange={(e) => setRecurringForm({...recurringForm, customerName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={recurringForm.customerEmail}
                  onChange={(e) => setRecurringForm({...recurringForm, customerEmail: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={recurringForm.customerPhone}
                  onChange={(e) => setRecurringForm({...recurringForm, customerPhone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Service & Time */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Service & Time
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service *
                </label>
                <select
                  value={recurringForm.serviceId}
                  onChange={(e) => setRecurringForm({...recurringForm, serviceId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.basePrice} ({service.durationMinutes} min)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={recurringForm.startTime}
                  onChange={(e) => setRecurringForm({...recurringForm, startTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recurrence Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Recurrence Settings
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'biweekly', label: 'Bi-weekly' },
                    { value: 'monthly', label: 'Monthly' }
                  ].map((interval) => (
                    <button
                      key={interval.value}
                      type="button"
                      onClick={() => setRecurringForm({...recurringForm, interval: interval.value as any})}
                      className={`
                        p-3 rounded-lg border text-center transition-colors
                        ${recurringForm.interval === interval.value 
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-sm font-medium">{interval.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={recurringForm.endDate}
                  onChange={(e) => setRecurringForm({...recurringForm, endDate: e.target.value})}
                  min={selectedDate.toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next 4 Occurrences:</h4>
            <div className="space-y-1">
              {getNextOccurrences().map((date, index) => (
                <div key={index} className="text-sm text-blue-700">
                  {date.toLocaleDateString()} at {recurringForm.startTime || 'Time TBD'}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={recurringForm.notes}
              onChange={(e) => setRecurringForm({...recurringForm, notes: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special instructions or notes..."
            />
          </div>

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
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Recurring'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}