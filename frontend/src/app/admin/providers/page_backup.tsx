'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building2,
  Star,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  User,
  Shield,
  Download
} from 'lucide-react';
import { useGetAdminUsersQuery, useUpdateAdminUserStatusMutation } from '../../../store/api/adminUsersApi';

// Type definitions for provider data (extends UserData)
interface ProviderData {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  totalBookings?: number;
  totalSpent?: number;
  totalEarned?: number;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profilePicture?: string | null;
}

export default function AdminProviders() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const limit = 10;

  // RTK Query hooks
  const { 
    data: usersData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAdminUsersQuery({
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    role: 'provider', // Only fetch providers
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [updateUserStatus] = useUpdateAdminUserStatusMutation();

  // Extract only providers from backend API
  const allUsers = usersData?.users || [];
  const providers = allUsers.filter(user => user.role === 'provider');
  
  // Apply client-side category filtering if needed
  const filteredProviders = providers.filter(provider => {
    // Note: category filtering disabled since AdminUser doesn't have category field
    // if (categoryFilter !== 'all' && provider.category !== categoryFilter) {
    //   return false;
    // }
    return true;
  });
  
  const totalPages = Math.ceil(filteredProviders.length / limit) || 0;

  // Handle search and filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Trigger refetch when filters change
  useEffect(() => {
    refetch();
  }, [searchQuery, statusFilter, currentPage, refetch]);

  // Helper functions
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? dateString : dateString.toISOString();
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getProviderFullName = (provider: any) => {
    const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
    return fullName || provider.email || 'Unknown Provider';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading state if no data and still loading
  if (isLoading && providers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading providers...</span>
      </div>
    );
  }

  // Show error state if API fails
  if (isError && providers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Unable to Load Providers</h3>
          <p className="text-red-600 mt-1">
            {error && 'data' in error ? (error.data as any)?.message : 'Failed to connect to backend API. Please check your connection and try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (providerId: string, newStatus: string) => {
    try {
      await updateUserStatus({ id: providerId, status: newStatus }).unwrap();
      refetch(); // Refresh the data
    } catch (error: any) {
      console.error('Failed to update provider status:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to update provider status';
      alert(errorMessage);
    }
  };

  const handleReactivateProvider = async (providerId: string) => {
    await handleStatusChange(providerId, 'active');
  };

  const handleSendMessage = (provider: ProviderData) => {
    // Implement messaging functionality
    alert(`Send message to ${getProviderFullName(provider)}`);
  };

  const handleViewFullProfile = (providerId: string) => {
    router.push(`/admin/providers/${providerId}`);
  };

  const handleVerificationChange = async (providerId: string, newVerification: string) => {
    try {
      // This would be implemented when verification API is available
      console.log(`Updating verification for ${providerId} to ${newVerification}`);
      alert(`Verification status would be updated to ${newVerification}`);
    } catch (error) {
      console.error('Failed to update verification:', error);
      alert('Failed to update verification status');
    }
  };

  const handleExportProviders = () => {
    try {
      // Prepare data for export
      const exportData = providers.map(provider => ({
        'Provider ID': provider.id,
        'First Name': provider.firstName || '',
        'Last Name': provider.lastName || '',
        'Full Name': getProviderFullName(provider),
        'Email': provider.email,
        'Phone': provider.phone || '',
        'Status': provider.status,
        'Email Verified': provider.isEmailVerified ? 'Yes' : 'No',
        'Phone Verified': provider.isPhoneVerified ? 'Yes' : 'No',
        'Total Bookings': provider.totalBookings || 0,
        'Total Earned': provider.totalEarned || 0,
        'Joined Date': formatDate(provider.createdAt),
        'Last Updated': formatDate(provider.updatedAt)
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            const stringValue = String(value || '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      let filename = `providers_export_${dateString}`;
      
      if (statusFilter !== 'all') {
        filename += `_${statusFilter}`;
      }
      if (searchQuery) {
        filename += `_search`;
      }
      
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Successfully exported ${exportData.length} providers to CSV file!`);
      
    } catch (error) {
      console.error('Export failed:', error);
            alert('Failed to export providers. Please try again.');
    }
  };

  // Mock categories since AdminUser doesn't have category field  
  const categories = ['Cleaning', 'Maintenance', 'Repairs', 'Other'];

  return (
    }
  };

  // Mock categories since AdminUser doesn't have category field
  const categories = ['Cleaning', 'Maintenance', 'Repairs', 'Other'];
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Provider Details - {provider.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
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
                  <div className="flex flex-wrap gap-2 pb-2">
                    {provider.services.map((service: string, index: number) => (
                      <span key={index} className="px-3 py-1  bg-blue-100 text-blue-800 text-sm rounded-full">
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
                    <span className="font-medium text-gray-900">{(provider.totalBookings || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings:</span>
                    <span className="font-medium text-gray-900">${(provider.totalEarnings || 0).toLocaleString()}</span>
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
                      className="w-full px-4 py-2 cursor-pointer bg-red-600 mb-4 text-white rounded-lg hover:bg-red-700"
                    >
                      Suspend Provider
                    </button>
                  )}
                  
                  {provider.status === 'suspended' && (
                    <button 
                      onClick={() => handleStatusChange(provider.id, 'active')}
                      className="w-full px-4 py-2  bg-green-600 text-white rounded-lg hover:bg-green-700"
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

                  <button className="w-full px-4 py-2 mb-4 cursor-pointer bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Send Message
                  </button>
                  <button className="w-full px-4 py-2 mb-4 cursor-pointer bg-gray-600 text-white rounded-lg hover:bg-gray-700">
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

  // Mock categories since AdminUser doesn't have category field  
  const categories = ['Cleaning', 'Maintenance', 'Repairs', 'Other'];

  return (
    <div className="w-[95%] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Management</h1>
            <p className="text-gray-600 mt-1">Manage service providers and their verification status</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
                ${providers.reduce((sum, p) => sum + (p.totalEarned || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
          
          <div className="flex items-center justify-between gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option key="all" value="all">All Status</option>
              <option key="active" value="active">Active</option>
              <option key="pending" value="pending">Pending</option>
              <option key="suspended" value="suspended">Suspended</option>
              <option key="inactive" value="inactive">Inactive</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option key="all" value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button
              onClick={handleExportProviders}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={providers.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider Actions
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
                        <div className="text-sm font-medium text-gray-900">{getProviderFullName(provider)}</div>
                        <div className="text-sm text-gray-500">{provider.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Provider</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-4 py-3 text-xs font-medium rounded-xl border-green-400 border ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{provider.email}</span>
                      </div>
                      {provider.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          <span>{provider.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="text-sm text-gray-500">
                        {provider.totalBookings || 0} bookings • ${(provider.totalEarned || 0).toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(provider.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Reactivate Provider Button */}
                      {provider.status !== 'active' && (
                        <button 
                          onClick={() => handleReactivateProvider(provider.id)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="Reactivate Provider"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* Send Message Button */}
                      <button 
                        onClick={() => handleSendMessage(provider)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded"
                        title="Send Message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      
                      {/* View Full Profile Button */}
                      <button 
                        onClick={() => handleViewFullProfile(provider.id)}
                        className="text-purple-600 hover:text-purple-700 p-1 rounded"
                        title="View Full Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}