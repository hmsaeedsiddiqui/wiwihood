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
  businessName?: string;
  ownerName?: string;
  category?: string;
  joinDate?: string;
  address?: string;
  workingHours?: string;
  services?: string[];
  documents?: {
    businessLicense: string;
    insurance: string;
    certifications: string;
  };
  verification?: string;
  rating?: number;
  totalReviews?: number;
  totalEarnings?: number;
}

// Provider Details Modal Component
const ProviderDetailsModal = ({ 
  isOpen, 
  onClose, 
  provider,
  handleStatusChange,
  handleVerificationChange
}: {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderData | null;
  handleStatusChange: (id: string, status: string) => void;
  handleVerificationChange: (id: string, verification: string) => void;
}) => {
  if (!isOpen || !provider) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Provider Details - {provider.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-gray-900 font-medium">{provider.businessName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Owner Name</label>
                  <p className="text-gray-900">{provider.ownerName || `${provider.firstName || ''} ${provider.lastName || ''}`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900">{provider.category || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Join Date</label>
                  <p className="text-gray-900">{provider.joinDate || new Date(provider.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-gray-900">{provider.address || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Working Hours</label>
                <p className="text-gray-900">{provider.workingHours || 'N/A'}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{provider.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{provider.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{provider.address || 'N/A'}</span>
                </div>
              </div>

              {/* Services */}
              {provider.services && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Services Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Status */}
              {provider.documents && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Document Verification</label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Business License:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.documents.businessLicense)}`}>
                        {provider.documents.businessLicense}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Insurance:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.documents.insurance)}`}>
                        {provider.documents.insurance}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Certifications:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(provider.documents.certifications)}`}>
                        {provider.documents.certifications}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status and Verification Section */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Current Status</label>
                <span className={`block mt-1 px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(provider.status)}`}>
                  {provider.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Verification Status</label>
                <span className={`block mt-1 px-2 py-1 text-xs font-medium rounded-full w-fit ${getVerificationColor(provider.verification || 'pending')}`}>
                  {provider.verification || 'pending'}
                </span>
              </div>
              {provider.rating && provider.rating > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Rating</label>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-900 font-medium">{provider.rating}</span>
                    <span className="ml-1 text-gray-600 text-sm">({provider.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <span className="font-medium text-gray-900">{(provider.totalBookings || 0).toLocaleString()}</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <span className="font-medium text-gray-900">${(provider.totalEarnings || 0).toLocaleString()}</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Reviews</p>
                <span className="font-medium text-gray-900">{provider.totalReviews || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
            {provider.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange(provider.id, 'active')}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  Approve Provider
                </button>
                <button
                  onClick={() => handleStatusChange(provider.id, 'suspended')}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject Provider
                </button>
              </>
            )}
            {provider.status === 'active' && (
              <button
                onClick={() => handleStatusChange(provider.id, 'suspended')}
                className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors"
              >
                Suspend Provider
              </button>
            )}
            {provider.status === 'suspended' && (
              <button
                onClick={() => handleStatusChange(provider.id, 'active')}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Reactivate Provider
              </button>
            )}
            {provider.verification === 'pending' && (
              <>
                <button
                  onClick={() => handleVerificationChange(provider.id, 'verified')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Verify Documents
                </button>
                <button
                  onClick={() => handleVerificationChange(provider.id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject Documents
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminProviders() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const limit = 10;

  const categories = ['Cleaning', 'Maintenance', 'Repairs', 'Other'];

  // Using the admin users API for now
  const { 
    data: apiResponse, 
    isLoading, 
    error, 
    refetch 
  } = useGetAdminUsersQuery({
    page: currentPage,
    limit,
    search: searchQuery,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    role: 'provider'
  });

  const [updateUserStatus] = useUpdateAdminUserStatusMutation();

  const providers = apiResponse?.data || [];
  const totalCount = apiResponse?.total || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleStatusChange = async (providerId: string, newStatus: string) => {
    try {
      await updateUserStatus({ userId: providerId, status: newStatus }).unwrap();
      refetch();
      alert(`Provider status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update provider status:', error);
      alert('Failed to update provider status');
    }
  };

  const handleVerificationChange = (providerId: string, verification: string) => {
    // This would need a separate API endpoint for verification
    console.log(`Update verification for ${providerId} to ${verification}`);
    alert(`Verification would be updated to ${verification}`);
  };

  const getProviderFullName = (provider: ProviderData) => {
    return `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || provider.email;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (provider: ProviderData) => {
    setSelectedProvider(provider);
    setIsDetailsModalOpen(true);
  };

  const handleExportProviders = () => {
    // Export functionality
    console.log('Export providers');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage service providers, their verification status, and business information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleExportProviders}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((provider: ProviderData) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getProviderFullName(provider)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {provider.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{provider.email}</div>
                    <div className="text-sm text-gray-500">{provider.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(provider.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(provider)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * limit, totalCount)}</span> of{' '}
                  <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        provider={selectedProvider}
        handleStatusChange={handleStatusChange}
        handleVerificationChange={handleVerificationChange}
      />
    </div>
  );
}