"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Mail, Phone, Eye, Shield, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface PendingStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialization: string;
  bio: string;
  profileImage?: string;
  businessName: string;
  providerId: string;
  submittedAt: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  workingHours?: any[];
}

export default function AdminStaffVerificationPage() {
  const [pendingStaff, setPendingStaff] = useState<PendingStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<PendingStaff | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingStaff();
  }, []);

  const fetchPendingStaff = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API call
      const mockData: PendingStaff[] = [
        {
          id: 'staff_001',
          name: 'Emma Wilson',
          email: 'emma.wilson@example.com',
          phone: '+1 (555) 123-4567',
          role: 'stylist',
          specialization: 'Hair Coloring & Styling',
          bio: 'Experienced hair stylist with 8+ years in the beauty industry. Specialized in color correction and modern styling techniques.',
          profileImage: 'staff/emma_profile',
          businessName: 'Luxio Beauty Salon',
          providerId: 'provider_001',
          submittedAt: new Date().toISOString(),
          verificationStatus: 'pending',
          workingHours: [
            { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isActive: true },
            { dayOfWeek: 'tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
            { dayOfWeek: 'wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
            { dayOfWeek: 'thursday', startTime: '09:00', endTime: '17:00', isActive: true },
            { dayOfWeek: 'friday', startTime: '09:00', endTime: '17:00', isActive: true },
            { dayOfWeek: 'saturday', startTime: '10:00', endTime: '16:00', isActive: true },
            { dayOfWeek: 'sunday', startTime: '10:00', endTime: '16:00', isActive: false }
          ]
        },
        {
          id: 'staff_002',
          name: 'Marcus Johnson',
          email: 'marcus.j@example.com',
          phone: '+1 (555) 987-6543',
          role: 'barber',
          specialization: 'Classic Cuts & Beard Styling',
          bio: 'Professional barber with expertise in classic and modern cuts. Passionate about traditional barbering techniques.',
          businessName: 'Downtown Barbershop',
          providerId: 'provider_002',
          submittedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          verificationStatus: 'pending'
        }
      ];

      setPendingStaff(mockData);
    } catch (error) {
      console.error('Error fetching pending staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (staffId: string, status: 'approved' | 'rejected') => {
    try {
      setVerificationLoading(staffId);
      
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/staff/${staffId}/verify`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setPendingStaff(prev => 
        prev.map(staff => 
          staff.id === staffId 
            ? { ...staff, verificationStatus: status }
            : staff
        )
      );

      // Close modal if open
      if (selectedStaff?.id === staffId) {
        setShowDetailModal(false);
        setSelectedStaff(null);
      }

    } catch (error) {
      console.error('Error updating verification status:', error);
    } finally {
      setVerificationLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Staff Verification Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Review and approve pending staff member registrations to prevent spam and maintain service quality.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingStaff.filter(s => s.verificationStatus === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Pending Staff List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Staff Verification</h2>
            <p className="text-sm text-gray-600 mt-1">
              Staff members waiting for admin approval
            </p>
          </div>

          {pendingStaff.filter(s => s.verificationStatus === 'pending').length > 0 ? (
            <div className="divide-y divide-gray-200">
              {pendingStaff
                .filter(staff => staff.verificationStatus === 'pending')
                .map((staff) => (
                  <div key={staff.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {staff.profileImage ? (
                          <img
                            src={`https://res.cloudinary.com/dmhvsn3dm/image/upload/w_100,h_100,c_fill,g_face/${staff.profileImage}`}
                            alt={staff.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                          <p className="text-sm text-gray-600">{staff.role} at {staff.businessName}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{staff.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{staff.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.verificationStatus)}`}>
                          {staff.verificationStatus.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(staff.submittedAt)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleVerification(staff.id, 'approved')}
                            disabled={verificationLoading === staff.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleVerification(staff.id, 'rejected')}
                            disabled={verificationLoading === staff.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {staff.specialization && (
                      <div className="mt-3 pl-16">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Specialization:</span> {staff.specialization}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending staff verifications at the moment.</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Staff Verification Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  {selectedStaff.profileImage ? (
                    <img
                      src={`https://res.cloudinary.com/dmhvsn3dm/image/upload/w_150,h_150,c_fill,g_face/${selectedStaff.profileImage}`}
                      alt={selectedStaff.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedStaff.name}</h3>
                    <p className="text-gray-600">{selectedStaff.role} at {selectedStaff.businessName}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStaff.verificationStatus)}`}>
                      {selectedStaff.verificationStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedStaff.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedStaff.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedStaff.bio && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                    <p className="text-gray-600">{selectedStaff.bio}</p>
                  </div>
                )}

                {/* Working Hours */}
                {selectedStaff.workingHours && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Working Hours</h4>
                    <div className="space-y-2">
                      {selectedStaff.workingHours.map((hours, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700 capitalize">{hours.dayOfWeek}</span>
                          <span className="text-gray-600">
                            {hours.isActive ? `${hours.startTime} - ${hours.endTime}` : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="bg-yellow-50 p-3 rounded-lg flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Verification Required</p>
                      <p className="text-sm text-yellow-700">Review all information before approving.</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleVerification(selectedStaff.id, 'rejected')}
                      disabled={verificationLoading === selectedStaff.id}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerification(selectedStaff.id, 'approved')}
                      disabled={verificationLoading === selectedStaff.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}