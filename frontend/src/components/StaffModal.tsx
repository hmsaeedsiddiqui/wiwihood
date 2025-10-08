"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Camera, Clock, User, Mail, Phone, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { ImageUpload } from './cloudinary/ImageUpload';

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
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending_verification' | 'suspended';
  specialization: string;
  bio: string;
  profileImage?: string;
  workingHours?: WorkingHours[];
  isVerified?: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface StaffModalProps {
  isEdit?: boolean;
  staff?: Staff;
  onClose: () => void;
  onSubmit: (data: Omit<Staff, 'id' | 'createdAt'>) => void;
}

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export const StaffModal: React.FC<StaffModalProps> = ({ 
  isEdit = false, 
  staff, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'pending_verification' as const,
    specialization: '',
    bio: '',
    profileImage: '',
    verificationStatus: 'pending' as const,
    isVerified: false
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(
    daysOfWeek.map(day => ({
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      isActive: day !== 'saturday' && day !== 'sunday'
    }))
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'schedule' | 'verification'>('basic');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && staff) {
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || '',
        status: staff.status || 'pending_verification',
        specialization: staff.specialization || '',
        bio: staff.bio || '',
        profileImage: staff.profileImage || '',
        verificationStatus: staff.verificationStatus || 'pending',
        isVerified: staff.isVerified || false
      });

      if (staff.workingHours && staff.workingHours.length > 0) {
        setWorkingHours(staff.workingHours);
      }
    }
  }, [isEdit, staff]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: string | boolean) => {
    setWorkingHours(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        workingHours
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Basic Information', icon: User },
              { id: 'schedule', label: 'Schedule & Calendar', icon: Calendar },
              { id: 'verification', label: 'Verification Status', icon: CheckCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="text-center">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Photo</h3>
                    <p className="text-sm text-gray-500">Upload a professional photo for the staff member</p>
                  </div>
                  
                  {formData.profileImage ? (
                    <div className="relative inline-block">
                      <img
                        src={`https://res.cloudinary.com/dmhvsn3dm/image/upload/w_150,h_150,c_fill,g_face/${formData.profileImage}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('profileImage', '')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300 border-dashed">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="mt-4 max-w-xs mx-auto">
                    <ImageUpload
                      uploadType="profile"
                      onImageUploaded={(publicId: string) => {
                        handleInputChange('profileImage', publicId);
                      }}
                      maxFiles={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="stylist">Stylist</option>
                      <option value="barber">Barber</option>
                      <option value="therapist">Therapist</option>
                      <option value="trainer">Personal Trainer</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="manager">Manager</option>
                      <option value="assistant">Assistant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Hair Coloring, Deep Tissue Massage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="pending_verification">Pending Verification</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Bio / Description
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Brief description about the staff member's experience and skills..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Working Hours & Schedule
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Set the working hours for each day of the week. This will be used for appointment scheduling.
                  </p>
                </div>

                <div className="space-y-4">
                  {workingHours.map((day, index) => (
                    <div key={day.dayOfWeek} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-24">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={day.isActive}
                            onChange={(e) => handleWorkingHoursChange(index, 'isActive', e.target.checked)}
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                            {day.dayOfWeek}
                          </span>
                        </label>
                      </div>

                      {day.isActive ? (
                        <>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={day.startTime}
                              onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">End Time</label>
                            <input
                              type="time"
                              value={day.endTime}
                              onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
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
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Individual Calendar Integration</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Each staff member will have their own calendar for appointment management. 
                        Customers can book appointments specifically with this staff member during their working hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Verification & Approval Status
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    All staff members require admin approval before they can start accepting appointments.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Status
                      </label>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(formData.verificationStatus)}`}>
                        {formData.verificationStatus === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
                        {formData.verificationStatus === 'rejected' && <AlertCircle className="h-4 w-4 mr-1" />}
                        {formData.verificationStatus === 'pending' && <Clock className="h-4 w-4 mr-1" />}
                        {formData.verificationStatus.charAt(0).toUpperCase() + formData.verificationStatus.slice(1)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Verification Required
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isVerified}
                          onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {formData.isVerified ? 'Verified by Admin' : 'Pending Admin Verification'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-900">Anti-Spam Protection</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          All new staff members undergo manual verification by administrators to prevent spam accounts and ensure service quality. 
                          Staff members cannot accept appointments until verified.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Verification Checklist</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Profile photo uploaded', completed: !!formData.profileImage },
                      { label: 'Contact information provided', completed: !!(formData.email && formData.phone) },
                      { label: 'Working hours configured', completed: workingHours.some(h => h.isActive) },
                      { label: 'Role and specialization defined', completed: !!(formData.role && formData.specialization) },
                      { label: 'Bio/description added', completed: formData.bio.length > 20 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {item.completed && <CheckCircle className="h-3 w-3" />}
                        </div>
                        <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (isEdit ? 'Update Staff' : 'Add Staff')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};