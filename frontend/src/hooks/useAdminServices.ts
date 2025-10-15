import { 
  useGetAllServicesQuery, 
  useGetServiceStatsQuery,
  useGetServiceByIdQuery,
  useApproveServiceMutation,
  useAssignBadgeMutation,
  useDeleteServiceMutation,
  useBulkServiceActionMutation,
  type AdminServiceQuery
} from '@/store/api/adminServicesApi';

// Custom hook for admin services management
export const useAdminServices = (query?: AdminServiceQuery) => {
  const {
    data: servicesData,
    isLoading,
    error,
    refetch
  } = useGetAllServicesQuery(query || {});

  const { data: stats, isLoading: statsLoading } = useGetServiceStatsQuery();

  const [approveService, { isLoading: isApproving }] = useApproveServiceMutation();
  const [assignBadge, { isLoading: isAssigningBadge }] = useAssignBadgeMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [bulkAction, { isLoading: isBulkActioning }] = useBulkServiceActionMutation();

  const handleApproveService = async (
    serviceId: string, 
    isApproved: boolean, 
    comments?: string,
    badge?: string,
    rating?: number
  ) => {
    try {
      await approveService({
        id: serviceId,
        data: {
          isApproved,
          adminComments: comments,
          adminAssignedBadge: badge,
          adminQualityRating: rating
        }
      }).unwrap();
      refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleAssignBadge = async (serviceId: string, badge: string) => {
    try {
      await assignBadge({ id: serviceId, badge }).unwrap();
      refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId).unwrap();
      refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleBulkAction = async (
    serviceIds: string[], 
    action: 'approve' | 'reject' | 'delete' | 'feature' | 'unfeature',
    comments?: string
  ) => {
    try {
      await bulkAction({
        serviceIds,
        action,
        adminComments: comments
      }).unwrap();
      refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    // Data
    services: servicesData?.services || [],
    pagination: {
      total: servicesData?.total || 0,
      page: servicesData?.page || 1,
      limit: servicesData?.limit || 20,
      totalPages: servicesData?.totalPages || 0
    },
    stats,

    // Loading states
    isLoading,
    statsLoading,
    isApproving,
    isAssigningBadge,
    isDeleting,
    isBulkActioning,

    // Error
    error,

    // Actions
    refetch,
    handleApproveService,
    handleAssignBadge,
    handleDeleteService,
    handleBulkAction
  };
};

// Hook for individual service details
export const useAdminServiceDetails = (serviceId: string) => {
  const { data: service, isLoading, error, refetch } = useGetServiceByIdQuery(serviceId);
  
  return {
    service,
    isLoading,
    error,
    refetch
  };
};

// Badge options for admin assignment
export const ADMIN_BADGE_OPTIONS = [
  'New on vividhood',
  'Popular',
  'Hot Deal',
  'Best Seller',
  'Limited Time',
  'Premium',
  'Trending',
  'Editor\'s Choice',
  'Staff Pick',
  'Customer Favorite'
];

// Service status color mapping
export const getServiceStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-100';
    case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'active': return 'text-blue-600 bg-blue-100';
    case 'inactive': return 'text-gray-600 bg-gray-100';
    case 'draft': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Service approval status color mapping
export const getApprovalStatusColor = (isApproved: boolean) => {
  return isApproved 
    ? 'text-green-600 bg-green-100' 
    : 'text-yellow-600 bg-yellow-100';
};