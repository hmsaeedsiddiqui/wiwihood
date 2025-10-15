'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Check,
  X,
  Star,
  AlertCircle,
  Clock,
  DollarSign,
  Tag,
  MapPin,
  Building2,
  Calendar,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Crown,
  Zap,
  Trophy,
  Gift,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { CloudinaryImage } from '@/components/cloudinary/CloudinaryImage';
import { 
  useGetAllServicesQuery, 
  useApproveServiceMutation, 
  useBulkServiceActionMutation,
  useAssignBadgeMutation,
  AdminServiceFilters 
} from '@/store/api/adminServicesApi';

const availableBadges = [
  { value: 'New on vividhood', label: 'New on vividhood', icon: Sparkles, color: 'text-blue-600' },
  { value: 'Popular', label: 'Popular', icon: Star, color: 'text-yellow-600' },
  { value: 'Hot Deal', label: 'Hot Deal', icon: Zap, color: 'text-red-600' },
  { value: 'Best Seller', label: 'Best Seller', icon: Trophy, color: 'text-purple-600' },
  { value: 'Limited Time', label: 'Limited Time', icon: Clock, color: 'text-orange-600' },
  { value: 'Premium', label: 'Premium', icon: Crown, color: 'text-indigo-600' },
  { value: 'Top Rated', label: 'Top Rated', icon: Award, color: 'text-green-600' },
  { value: 'Special Offer', label: 'Special Offer', icon: Gift, color: 'text-pink-600' }
];

export default function AdminServicesPage() {
  // API hooks for real data
  const [filters, setFilters] = useState<AdminServiceFilters>({
    page: 1,
    limit: 10,
    status: 'ALL'
  });
  
  const { 
    data: servicesData, 
    isLoading: servicesLoading, 
    error: servicesError,
    refetch: refetchServices
  } = useGetAllServicesQuery(filters);
  
  const [approveService] = useApproveServiceMutation();
  const [bulkServiceAction] = useBulkServiceActionMutation();
  const [assignBadge] = useAssignBadgeMutation();

  const services = servicesData?.services || [];
  const totalCount = servicesData?.total || 0;
  const statistics = servicesData?.stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
    inactive: 0
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Update filters when search or status filter changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      status: statusFilter !== 'ALL' ? statusFilter as any : undefined,
      page: 1
    }));
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Update filters when page changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: currentPage
    }));
  }, [currentPage]);

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Use API statistics instead of calculating locally
  const stats = statistics;

  const handleApproveService = async (service: any, approved: boolean, badge?: string, rating?: number, comments?: string) => {
    try {
      await approveService({
        serviceId: service.id,
        approved,
        adminComments: comments,
        adminAssignedBadge: badge,
        adminQualityRating: rating
      }).unwrap();
      
      // Refetch services to get updated data
      refetchServices();
      
      setShowApprovalModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Failed to approve/reject service:', error);
      alert('Failed to update service status. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        await bulkServiceAction({
          serviceIds: [serviceId],
          action: 'delete',
          reason: 'Admin deletion'
        }).unwrap();
        
        refetchServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedServices.length === 0) return;

    const actionMap: { [key: string]: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete' } = {
      'approve': 'approve',
      'reject': 'reject', 
      'delete': 'delete',
      'activate': 'activate',
      'deactivate': 'deactivate'
    };

    const mappedAction = actionMap[action];
    if (!mappedAction) return;

    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedServices.length} services?`
      : `Are you sure you want to ${action} ${selectedServices.length} services?`;

    if (confirm(confirmMessage)) {
      try {
        await bulkServiceAction({
          serviceIds: selectedServices,
          action: mappedAction,
          reason: `Bulk ${action} by admin`
        }).unwrap();
        
        refetchServices();
        setSelectedServices([]);
      } catch (error) {
        console.error(`Failed to ${action} services:`, error);
        alert(`Failed to ${action} services. Please try again.`);
      }
    }
  };

  const openApprovalModal = (service: any) => {
    setSelectedService(service);
    setShowApprovalModal(true);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            <CheckCircle className="w-3 h-3" />
            {isActive ? 'Active' : 'Approved'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (servicesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">Failed to load services</p>
              <button 
                onClick={() => refetchServices()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
              <p className="text-gray-600">Review, approve, and manage all provider services</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Services</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services, providers, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING_APPROVAL">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              
              {selectedServices.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Approve ({selectedServices.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedServices.length === services.length && services.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices(services.map(s => s.id));
                        } else {
                          setSelectedServices([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Service</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Provider</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Badge</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Submitted</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.id]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {service.featuredImage && (
                          <CloudinaryImage
                            src={service.featuredImage}
                            alt={service.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500 max-w-xs truncate">{service.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.provider.businessName}</p>
                        <p className="text-xs text-gray-500">{service.provider.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                        <Tag className="w-3 h-3" />
                        {service.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{service.basePrice}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(service.approvalStatus, service.isActive)}
                    </td>
                    <td className="py-4 px-6">
                      {service.adminAssignedBadge ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800">
                          <Star className="w-3 h-3" />
                          {service.adminAssignedBadge}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No badge</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-500">
                        {new Date(service.submittedForApproval).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openApprovalModal(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Review & Approve"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} services
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Service Approval Modal */}
        {showApprovalModal && selectedService && (
          <ServiceApprovalModal
            service={selectedService}
            availableBadges={availableBadges}
            onApprove={handleApproveService}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedService(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Service Approval Modal Component
function ServiceApprovalModal({ 
  service, 
  availableBadges, 
  onApprove, 
  onClose 
}: {
  service: any;
  availableBadges: any[];
  onApprove: (service: any, approved: boolean, badge?: string, rating?: number, comments?: string) => void;
  onClose: () => void;
}) {
  const [selectedBadge, setSelectedBadge] = useState(service.adminAssignedBadge || '');
  const [qualityRating, setQualityRating] = useState(service.adminQualityRating || 0);
  const [adminComments, setAdminComments] = useState(service.adminComments || '');

  const handleApprove = () => {
    onApprove(service, true, selectedBadge, qualityRating, adminComments);
  };

  const handleReject = () => {
    onApprove(service, false, '', 0, adminComments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Review Service</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <p className="text-lg font-medium text-gray-900">{service.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <p className="text-gray-900">{service.provider.businessName}</p>
                  <p className="text-sm text-gray-500">{service.provider.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{service.category.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <p className="text-gray-900">${service.basePrice}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <p className="text-gray-900">{service.durationMinutes} min</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 text-sm">{service.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Images</h3>
              {service.images && service.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {service.images.slice(0, 4).map((image: string, index: number) => (
                    <CloudinaryImage
                      key={index}
                      src={image}
                      alt={`${service.name} image ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-lg object-cover w-full h-32"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  No images uploaded
                </p>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Review</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Badge Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Badge</label>
                  <select
                    value={selectedBadge}
                    onChange={(e) => setSelectedBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No badge</option>
                    {availableBadges.map((badge) => (
                      <option key={badge.value} value={badge.value}>
                        {badge.label}
                      </option>
                    ))}
                  </select>
                  {selectedBadge && (
                    <div className="mt-2">
                      {(() => {
                        const badge = availableBadges.find(b => b.value === selectedBadge);
                        const IconComponent = badge?.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800`}>
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {selectedBadge}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Quality Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setQualityRating(rating)}
                        className={`p-1 rounded transition-colors ${
                          rating <= qualityRating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {qualityRating > 0 ? `${qualityRating}/5` : 'Not rated'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {/* Admin Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Comments</label>
                  <textarea
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    rows={6}
                    placeholder="Add comments about the service quality, presentation, or any feedback for the provider..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject Service
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Approve & Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}