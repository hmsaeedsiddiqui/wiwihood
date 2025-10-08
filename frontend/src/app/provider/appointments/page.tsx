"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, Phone, Mail, MoreVertical, Filter, Search, Plus, Check, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import QRTIntegration from "@/utils/qrtIntegration";

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  amount: number;
  duration: string;
  location: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.relative')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('🚀 QRT: Loading appointments...');
      
      // Use QRT Integration for better error handling
      const appointmentsData = await QRTIntegration.getAppointments();
      
      // Add defensive programming to handle different data structures
      let appointmentsArray = [];
      if (Array.isArray(appointmentsData)) {
        appointmentsArray = appointmentsData;
      } else if (appointmentsData && Array.isArray(appointmentsData.data)) {
        appointmentsArray = appointmentsData.data;
      } else {
        console.warn('QRT: appointmentsData is not an array, using fallback');
        appointmentsArray = [];
      }
      
      // Transform data to match Appointment interface
      const transformedAppointments: Appointment[] = appointmentsArray.map((appointment: any) => ({
        id: appointment.id,
        customerName: appointment.customerName || 'Unknown Customer',
        customerEmail: appointment.customerEmail || 'customer@example.com',
        customerPhone: appointment.customerPhone || '+1234567890',
        serviceName: appointment.serviceName || 'Service',
        time: appointment.time || '10:00 AM',
        date: appointment.date || 'Today',
        status: appointment.status || 'confirmed',
        amount: appointment.amount || 0,
        duration: appointment.duration || '1h',
        location: appointment.location || 'Luxio Nail Ladies Salon'
      }));
      
      setAppointments(transformedAppointments);
      console.log('✅ QRT: Appointments loaded successfully', transformedAppointments.length);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle New Appointment Button
  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  // Handle New Appointment Form Submission
  const handleCreateAppointment = async (formData: any) => {
    try {
      const newAppointment: Appointment = {
        id: Date.now().toString(), // Generate temporary ID
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        serviceName: formData.serviceName,
        time: formData.time,
        date: formData.date,
        status: 'pending', // New appointments start as pending
        amount: parseFloat(formData.amount) || 0,
        duration: formData.duration,
        location: 'Luxio Nail Ladies Salon' // Default location
      };

      // Add to local state immediately
      setAppointments(prev => [newAppointment, ...prev]);
      
      // Close modal
      setShowNewAppointment(false);
      
      // Here you would make API call to backend
      // await QRTIntegration.createAppointment(newAppointment);
      
      console.log('✅ New appointment created:', newAppointment);
      alert('New appointment created successfully!');
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error creating appointment. Please try again.');
    }
  };

  // Handle Appointment Status Changes
  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      setUpdatingStatus(appointmentId);
      
      // Update local state immediately for better UX
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );

      // Close dropdown
      setActiveDropdown(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Here you would make actual API call to backend
      // await QRTIntegration.updateAppointmentStatus(appointmentId, newStatus);
      
      console.log(`✅ Appointment ${appointmentId} updated to ${newStatus}`);
      
      // Show success message based on status
      const statusMessage = {
        confirmed: 'Appointment confirmed successfully!',
        cancelled: 'Appointment cancelled successfully!',
        completed: 'Appointment marked as completed!'
      };
      
      alert(statusMessage[newStatus]);
      
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment. Please try again.');
      
      // Revert the local state change on error
      fetchAppointments();
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Toggle dropdown for appointment actions
  const toggleDropdown = (appointmentId: string) => {
    setActiveDropdown(activeDropdown === appointmentId ? null : appointmentId);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingAppointments = filteredAppointments.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600">Manage your upcoming and past appointments</p>
            </div>
            <button 
              onClick={handleNewAppointment}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.date === new Date().toLocaleDateString('en-US')).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900">{appointment.serviceName}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'confirmed' ? 'Confirmed' : appointment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-2">{appointment.customerName}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{appointment.date} at {appointment.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{appointment.location}</span>
                          </div>
                          {appointment.customerPhone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{appointment.customerPhone}</span>
                            </div>
                          )}
                          {appointment.customerEmail && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{appointment.customerEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">AED {appointment.amount}</p>
                        <p className="text-xs text-gray-500">{appointment.duration}</p>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(appointment.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === appointment.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              {appointment.status === 'pending' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  disabled={updatingStatus === appointment.id}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  {updatingStatus === appointment.id ? (
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                                  ) : (
                                    <Check className="h-4 w-4 mr-2 text-green-600" />
                                  )}
                                  Confirm Appointment
                                </button>
                              )}
                              
                              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                  disabled={updatingStatus === appointment.id}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  {updatingStatus === appointment.id ? (
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                  ) : (
                                    <Check className="h-4 w-4 mr-2 text-blue-600" />
                                  )}
                                  Mark as Completed
                                </button>
                              )}
                              
                              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  disabled={updatingStatus === appointment.id}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  {updatingStatus === appointment.id ? (
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                  ) : (
                                    <X className="h-4 w-4 mr-2 text-red-600" />
                                  )}
                                  Cancel Appointment
                                </button>
                              )}
                              
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  setActiveDropdown(null);
                                  alert(`View details for appointment ${appointment.id}`);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <AlertCircle className="h-4 w-4 mr-2 text-gray-600" />
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Create New Appointment</h2>
                <button
                  onClick={() => setShowNewAppointment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = Object.fromEntries(formData.entries());
                handleCreateAppointment(data);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+971 50 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service *
                  </label>
                  <select
                    name="serviceName"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a service</option>
                    <option value="Hair Cut & Style">Hair Cut & Style</option>
                    <option value="Hair Coloring">Hair Coloring</option>
                    <option value="Deep Conditioning Treatment">Deep Conditioning Treatment</option>
                    <option value="Manicure">Manicure</option>
                    <option value="Pedicure">Pedicure</option>
                    <option value="Facial Treatment">Facial Treatment</option>
                    <option value="Massage">Massage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <select
                    name="time"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <select
                    name="duration"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select duration</option>
                    <option value="30min">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="1.5h">1.5 hours</option>
                    <option value="2h">2 hours</option>
                    <option value="2.5h">2.5 hours</option>
                    <option value="3h">3 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (AED) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="85.00"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewAppointment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}