"use client";
import React, { useState, useEffect } from "react";
import { User, Plus, Edit, Trash2, Mail, Phone, Calendar, Save, X, Camera, Clock, CheckCircle, AlertCircle, Shield } from "lucide-react";
import axios from 'axios';
import QRTIntegration from '@/utils/qrtIntegration';
import { ImageUpload } from '@/components/cloudinary/ImageUpload';
import { StaffModal } from '@/components/StaffModal';
import { useRouter } from 'next/navigation';

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

interface WorkingHours {
  id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function StaffManagementPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      // QRT Integration - Staff Management
      console.log('🚀 QRT Staff Integration...');
      
      const staffData = await QRTIntegration.getStaff();
      setStaff(staffData || []);
      
      console.log('✅ QRT Staff Complete!');
    } catch (error) {
      console.error('QRT Staff Error:', error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (staffData: Omit<Staff, 'id' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('providerToken');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/providers/staff`,
        staffData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchStaff();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const updateStaff = async (id: string, staffData: Partial<Staff>) => {
    try {
      const token = localStorage.getItem('providerToken');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/providers/staff/${id}`,
        staffData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchStaff();
      setShowEditModal(false);
      setEditingStaff(null);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const removeStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    
    try {
      const token = localStorage.getItem('providerToken');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/providers/staff/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchStaff();
    } catch (error) {
      console.error('Error removing staff:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Staff</h2>
          <p className="text-gray-600">Fetching your team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-white/10 bg-opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg flex items-center">
                <User className="mr-3 h-10 w-10" />
                Staff Management
              </h1>
              <p className="text-white/90 text-lg">Manage your team members, their roles, and schedules</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="group bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-semibold flex items-center shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                Add Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Staff Grid */}
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member) => (
              <div key={member.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {member.profileImage ? (
                          <img 
                            src={`https://res.cloudinary.com/dmhvsn3dm/image/upload/w_100,h_100,c_fill,g_face/${member.profileImage}`}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                        
                        {/* Verification Badge */}
                        {member.verificationStatus === 'approved' && member.isVerified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {member.verificationStatus === 'pending' && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1.5 shadow-lg">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.status)}`}>
                          {member.status ? member.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingStaff(member);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeStaff(member.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Role</p>
                      <p className="text-gray-900 capitalize font-medium">{member.role}</p>
                    </div>
                    
                    {member.specialization && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Specialization</p>
                        <p className="text-gray-900">{member.specialization}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {member.email && (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Mail className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="text-gray-600 truncate flex-1">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="bg-pink-100 p-2 rounded-lg">
                          <Phone className="h-4 w-4 text-pink-600" />
                        </div>
                        <span className="text-gray-600">{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <User className="h-12 w-12 text-orange-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Staff Members Yet</h3>
              <p className="text-gray-600 mb-8">Start building your team by adding your first staff member.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Staff Member
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <StaffModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addStaff}
        />
      )}

      {/* Edit Staff Modal */}
      {showEditModal && editingStaff && (
        <StaffModal
          isEdit
          staff={editingStaff}
          onClose={() => {
            setShowEditModal(false);
            setEditingStaff(null);
          }}
          onSubmit={(data) => updateStaff(editingStaff.id, data)}
        />
      )}
    </div>
  );
}