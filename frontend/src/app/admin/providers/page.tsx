'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building2,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { adminApi } from '../../../lib/adminApi';

// Mock provider data
const mockProviders = [
  {
    id: 'PRV-001',
    businessName: 'Elite Beauty Salon',
    ownerName: 'Maria Rodriguez',
    email: 'maria@elitebeauty.com',
    phone: '+1 (555) 123-4567',
    address: '123 Beauty Street, NYC, NY 10001',
    category: 'Hair & Beauty',
    status: 'active',
    verification: 'verified',
    joinDate: '2024-01-15',
    rating: 4.9,
    totalReviews: 245,
    totalBookings: 1856,
    totalEarnings: 127580,
    services: ['Hair Styling', 'Hair Coloring', 'Hair Treatment'],
    documents: {
      businessLicense: 'verified',
      insurance: 'verified',
      certifications: 'verified'
    },
    workingHours: 'Mon-Sat: 9:00 AM - 7:00 PM'
  },
  {
    id: 'PRV-002',
    businessName: 'Zen Wellness Spa',
    ownerName: 'David Chen',
    email: 'david@zenwellness.com',
    phone: '+1 (555) 234-5678',
    address: '456 Wellness Ave, NYC, NY 10002',
    category: 'Spa & Wellness',
    status: 'active',
    verification: 'verified',
    joinDate: '2024-02-20',
    rating: 4.8,
    totalReviews: 189,
    totalBookings: 1423,
    totalEarnings: 198750,
    services: ['Deep Tissue Massage', 'Aromatherapy', 'Hot Stone Therapy'],
    documents: {
      businessLicense: 'verified',
      insurance: 'verified',
      certifications: 'pending'
    },
    workingHours: 'Mon-Sun: 8:00 AM - 9:00 PM'
  },
  {
    id: 'PRV-003',
    businessName: 'Urban Fitness Studio',
    ownerName: 'Sarah Johnson',
    email: 'sarah@urbanfitness.com',
    phone: '+1 (555) 345-6789',
    address: '789 Fitness Blvd, NYC, NY 10003',
    category: 'Fitness & Training',
    status: 'pending',
    verification: 'pending',
    joinDate: '2025-09-20',
    rating: 0,
    totalReviews: 0,
    totalBookings: 0,
    totalEarnings: 0,
    services: ['Personal Training', 'Group Classes', 'Nutrition Coaching'],
    documents: {
      businessLicense: 'pending',
      insurance: 'pending',
      certifications: 'pending'
    },
    workingHours: 'Mon-Fri: 6:00 AM - 10:00 PM'
  },
  {
    id: 'PRV-004',
    businessName: 'Classic Barber Shop',
    ownerName: 'Michael Thompson',
    email: 'mike@classicbarber.com',
    phone: '+1 (555) 456-7890',
    address: '321 Barber Lane, NYC, NY 10004',
    category: 'Hair Care',
    status: 'suspended',
    verification: 'verified',
    joinDate: '2023-11-10',
    rating: 4.2,
    totalReviews: 156,
    totalBookings: 892,
    totalEarnings: 45680,
    services: ['Classic Haircut', 'Beard Trim', 'Hot Towel Shave'],
    documents: {
      businessLicense: 'verified',
      insurance: 'expired',
      certifications: 'verified'
    },
    workingHours: 'Tue-Sat: 9:00 AM - 6:00 PM'
  }
];

export default function AdminProviders() {
  const [providers, setProviders] = useState(mockProviders);
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProviders();
  }, [currentPage]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProviders({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        verified: statusFilter === 'verified' ? true : undefined,
      });
      
      setProviders(response.providers || mockProviders);
      setFilteredProviders(response.providers || mockProviders);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Failed to load providers:', error);
      // Keep using mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = providers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(provider => provider.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(provider => provider.category === categoryFilter);
    }

    setFilteredProviders(filtered);
  }, [providers, searchQuery, statusFilter, categoryFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (providerId: string, newStatus: string) => {
    try {
      await adminApi.updateProviderStatus(providerId, newStatus);
      setProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, status: newStatus }
          : provider
      ));
    } catch (error) {
      console.error('Failed to update provider status:', error);
      alert('Failed to update provider status');
    }
  };

  const handleVerificationChange = async (providerId: string, newVerification: string) => {
    try {
      await adminApi.updateProviderStatus(providerId, newVerification);
      setProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, verification: newVerification }
          : provider
      ));
    } catch (error) {
      console.error('Failed to update provider verification:', error);
      alert('Failed to update provider verification');
    }
  };

  const ProviderDetailModal = ({ provider, onClose }: { provider: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Provider Details - {provider.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Name</label>
                      <p className="text-gray-900 font-medium">{provider.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Owner Name</label>
                      <p className="text-gray-900">{provider.ownerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-gray-900">{provider.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Join Date</label>
                      <p className="text-gray-900">{provider.joinDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900">{provider.address}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Working Hours</label>
                    <p className="text-gray-900">{provider.workingHours}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{provider.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{provider.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{provider.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Services Offered</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Document Verification</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Business License:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.documents.businessLicense)}`}>
                      {provider.documents.businessLicense}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Insurance:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.documents.insurance)}`}>
                      {provider.documents.insurance}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Certifications:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.documents.certifications)}`}>
                      {provider.documents.certifications}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Performance</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Status</label>
                    <span className={`block mt-1 px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Verification</label>
                    <span className={`block mt-1 px-2 py-1 text-xs font-medium rounded-full w-fit ${getVerificationColor(provider.verification)}`}>
                      {provider.verification}
                    </span>
                  </div>

                  {provider.rating > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rating</label>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-900 font-medium">{provider.rating}</span>
                        <span className="ml-1 text-gray-600 text-sm">({provider.totalReviews} reviews)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Stats</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings:</span>
                    <span className="font-medium text-gray-900">{provider.totalBookings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings:</span>
                    <span className="font-medium text-gray-900">${provider.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews:</span>
                    <span className="font-medium text-gray-900">{provider.totalReviews}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  {provider.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(provider.id, 'active')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Approve Provider
                      </button>
                      <button 
                        onClick={() => handleStatusChange(provider.id, 'suspended')}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject Provider
                      </button>
                    </>
                  )}
                  
                  {provider.status === 'active' && (
                    <button 
                      onClick={() => handleStatusChange(provider.id, 'suspended')}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Suspend Provider
                    </button>
                  )}
                  
                  {provider.status === 'suspended' && (
                    <button 
                      onClick={() => handleStatusChange(provider.id, 'active')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Reactivate Provider
                    </button>
                  )}

                  {provider.verification === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleVerificationChange(provider.id, 'verified')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Verify Documents
                      </button>
                      <button 
                        onClick={() => handleVerificationChange(provider.id, 'rejected')}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject Verification
                      </button>
                    </>
                  )}

                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Send Message
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const categories = [...new Set(providers.map(p => p.category))];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Management</h1>
            <p className="text-gray-600 mt-1">Manage service providers and their verification status</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${providers.reduce((sum, p) => sum + p.totalEarnings, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search providers by name, email, or business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Providers ({filteredProviders.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{provider.businessName}</div>
                        <div className="text-sm text-gray-500">{provider.ownerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{provider.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.verification)}`}>
                      {provider.verification}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {provider.totalBookings > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{provider.rating} ({provider.totalReviews})</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {provider.totalBookings} bookings • ${provider.totalEarnings.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedProvider(provider)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <ProviderDetailModal 
          provider={selectedProvider} 
          onClose={() => setSelectedProvider(null)} 
        />
      )}
    </div>
  );
}