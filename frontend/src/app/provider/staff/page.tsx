"use client";
import React, { useState, useEffect } from "react";
import { User, Plus, Edit, Trash2, Mail, Phone, Calendar, Save, X } from "lucide-react";
import axios from 'axios';
import QRTIntegration from '@/utils/qrtIntegration';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  specialization: string;
  bio: string;
  profileImage?: string;
  workingHours?: WorkingHours[];
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

  const StaffModal = ({ isEdit = false, staff: existingStaff = null, onClose, onSubmit }: {
    isEdit?: boolean;
    staff?: Staff | null;
    onClose: () => void;
    onSubmit: (data: any) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: existingStaff?.name || '',
      email: existingStaff?.email || '',
      phone: existingStaff?.phone || '',
      role: existingStaff?.role || 'staff',
      status: existingStaff?.status || 'active',
      specialization: existingStaff?.specialization || '',
      bio: existingStaff?.bio || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{isEdit ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="specialist">Specialist</option>
                <option value="assistant">Assistant</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., Hair Styling, Massage Therapy, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                placeholder="Brief description about the staff member..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {isEdit ? 'Update' : 'Add'} Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">Staff Management</h1>
              <p className="text-gray-600 mt-1">Manage your team members, their roles, and schedules</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Staff</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Staff Grid */}
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                      {member.profileImage ? (
                        <img 
                          src={member.profileImage} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : member.status === 'on_leave'
                          ? 'bg-yellow-100 text-yellow-800'
                          : member.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status ? member.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingStaff(member);
                        setShowEditModal(true);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeStaff(member.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Role</p>
                    <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                  </div>
                  
                  {member.specialization && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Specialization</p>
                      <p className="text-sm text-gray-600">{member.specialization}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {member.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {member.bio && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Bio</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-700 transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span>View Schedule</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No staff members</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first staff member.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
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