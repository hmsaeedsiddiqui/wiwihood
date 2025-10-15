'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  useGetAllServicesQuery, 
  useGetServiceStatsQuery,
  useApproveServiceMutation,
  useAssignBadgeMutation,
  useDeleteServiceMutation,
  useBulkServiceActionMutation,
  type AdminService,
  type AdminServiceQuery
} from '@/store/api/adminServicesApi';

export default function AdminServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [approvalFilter, setApprovalFilter] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);
  const [approvalData, setApprovalData] = useState({
    isApproved: true,
    adminComments: '',
    adminAssignedBadge: '',
    adminQualityRating: 5
  });

  // API queries
  const queryParams: AdminServiceQuery = {
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    isApproved: approvalFilter === 'approved' ? true : approvalFilter === 'pending' ? false : undefined,
    page: currentPage,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  };

  const { data: servicesData, isLoading, refetch } = useGetAllServicesQuery(queryParams);
  const { data: stats } = useGetServiceStatsQuery();

  // API mutations
  const [approveService] = useApproveServiceMutation();
  const [assignBadge] = useAssignBadgeMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [bulkAction] = useBulkServiceActionMutation();

  // Badge options
  const badgeOptions = [
    'New on vividhood',
    'Popular',
    'Hot Deal',
    'Best Seller',
    'Limited Time',
    'Premium',
    'Trending',
    'Editor\'s Choice'
  ];

  const handleApproveService = async () => {
    if (!selectedService) return;

    try {
      await approveService({
        id: selectedService.id,
        data: approvalData
      }).unwrap();
      
      setShowApprovalModal(false);
      setSelectedService(null);
      refetch();
    } catch (error) {
      console.error('Error approving service:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedServices.length === 0) return;

    try {
      await bulkAction({
        serviceIds: selectedServices,
        action: action as any,
        adminComments: `Bulk ${action} performed by admin`
      }).unwrap();
      
      setSelectedServices([]);
      refetch();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0EF] via-white to-[#E89B8B]/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
          <p className="text-gray-600">Manage and approve provider services</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                </div>
                <Package className="h-8 w-8 text-[#E89B8B]" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedServices}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingServices}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.featuredServices}</p>
                </div>
                <Star className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeServices}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.approvalRate.toFixed(1)}%</p>
                </div>
                <Users className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
              >
                <option value="">All Approvals</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              
              {selectedServices.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve ({selectedServices.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleBulkAction('feature')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Star className="h-4 w-4" />
                    Feature
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E89B8B]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedServices.length === servicesData?.services.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices(servicesData?.services.map(s => s.id) || []);
                          } else {
                            setSelectedServices([]);
                          }
                        }}
                        className="rounded border-gray-300 text-[#E89B8B] focus:ring-[#E89B8B]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {servicesData?.services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleSelectService(service.id)}
                          className="rounded border-gray-300 text-[#E89B8B] focus:ring-[#E89B8B]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {service.featuredImage && (
                            <img 
                              src={service.featuredImage} 
                              alt={service.name}
                              className="h-10 w-10 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{service.shortDescription}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.provider.businessName}</div>
                        <div className="text-sm text-gray-500">{service.provider.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {service.currency} {service.basePrice}
                        </div>
                        <div className="text-sm text-gray-500">{service.durationMinutes}min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {service.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-yellow-600 bg-yellow-100">
                            <AlertCircle className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.adminAssignedBadge ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-purple-600 bg-purple-100">
                            {service.adminAssignedBadge}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No badge</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setShowApprovalModal(true);
                            }}
                            className="text-[#E89B8B] hover:text-[#D4876F] p-1 rounded"
                            title="Review & Approve"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {!service.isApproved && (
                            <button
                              onClick={async () => {
                                await approveService({
                                  id: service.id,
                                  data: { isApproved: true, adminComments: 'Quick approval' }
                                });
                                refetch();
                              }}
                              className="text-green-600 hover:text-green-800 p-1 rounded"
                              title="Quick Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this service?')) {
                                await deleteService(service.id);
                                refetch();
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {servicesData && servicesData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, servicesData.total)} of {servicesData.total} services
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg">
                Page {currentPage} of {servicesData.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(servicesData.totalPages, prev + 1))}
                disabled={currentPage === servicesData.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Review Service</h2>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Service Details */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  {selectedService.featuredImage && (
                    <img 
                      src={selectedService.featuredImage} 
                      alt={selectedService.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedService.name}</h3>
                    <p className="text-gray-600">{selectedService.provider.businessName}</p>
                    <p className="text-[#E89B8B] font-medium">{selectedService.currency} {selectedService.basePrice}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{selectedService.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Duration:</span> {selectedService.durationMinutes} minutes
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedService.category.name}
                  </div>
                  <div>
                    <span className="font-medium">Current Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedService.status)}`}>
                      {selectedService.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Featured:</span> {selectedService.isFeatured ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              {/* Approval Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Decision
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={approvalData.isApproved}
                        onChange={() => setApprovalData(prev => ({ ...prev, isApproved: true }))}
                        className="mr-2 text-[#E89B8B] focus:ring-[#E89B8B]"
                      />
                      Approve
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!approvalData.isApproved}
                        onChange={() => setApprovalData(prev => ({ ...prev, isApproved: false }))}
                        className="mr-2 text-[#E89B8B] focus:ring-[#E89B8B]"
                      />
                      Reject
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Comments
                  </label>
                  <textarea
                    value={approvalData.adminComments}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, adminComments: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
                    rows={3}
                    placeholder="Add comments about your decision..."
                  />
                </div>

                {approvalData.isApproved && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Badge (Optional)
                      </label>
                      <select
                        value={approvalData.adminAssignedBadge}
                        onChange={(e) => setApprovalData(prev => ({ ...prev, adminAssignedBadge: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
                      >
                        <option value="">No Badge</option>
                        {badgeOptions.map(badge => (
                          <option key={badge} value={badge}>{badge}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality Rating (1-5)
                      </label>
                      <select
                        value={approvalData.adminQualityRating}
                        onChange={(e) => setApprovalData(prev => ({ ...prev, adminQualityRating: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E89B8B] focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map(rating => (
                          <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleApproveService}
                    className="flex-1 bg-[#E89B8B] text-white py-2 px-4 rounded-lg hover:bg-[#D4876F] transition-colors"
                  >
                    {approvalData.isApproved ? 'Approve Service' : 'Reject Service'}
                  </button>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}