import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Admin Service Types
export interface AdminServiceFilters {
  search?: string;
  status?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'ALL';
  categoryId?: string;
  providerId?: string;
  hasImages?: boolean;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'submittedForApproval' | 'approvalDate' | 'name' | 'price' | 'provider';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface AdminApprovalData {
  isApproved: boolean;
  adminComments?: string;
  adminAssignedBadge?: string;
  adminQualityRating?: number;
}

export interface AdminBadgeData {
  badge: string;
  qualityRating?: number;
}

export interface AdminBulkAction {
  serviceIds: string[];
  action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete';
  reason?: string;
}

export interface ServiceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  inactive: number;
}

export interface AdminService {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  provider: {
    id: string;
    businessName: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  basePrice: number;
  durationMinutes: number;
  serviceType: string;
  isActive: boolean;
  isApproved: boolean;
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  adminComments?: string;
  adminAssignedBadge?: string;
  adminQualityRating?: number;
  featuredImage?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  approvalDate?: string;
  approvedByAdminId?: string;
}

export interface AdminServicesResponse {
  services: AdminService[];
  total: number;
  stats: ServiceStats;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailableBadge {
  value: string;
  label: string;
  description: string;
}

// RTK Query API
export const adminServicesApi = createApi({
  reducerPath: 'adminServicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/admin/services`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminService', 'ServiceStats'],
  endpoints: (builder) => ({
    // Get all services with filters
    getAllServices: builder.query<AdminServicesResponse, AdminServiceFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
        return `?${params.toString()}`;
      },
      providesTags: ['AdminService', 'ServiceStats'],
    }),

    // Get service statistics
    getServiceStats: builder.query<ServiceStats, void>({
      query: () => 'stats',
      providesTags: ['ServiceStats'],
    }),

    // Get service by ID
    getServiceById: builder.query<AdminService, string>({
      query: (id) => id,
      providesTags: (result, error, id) => [{ type: 'AdminService', id }],
    }),

    // Approve or reject service
    approveService: builder.mutation<
      { success: boolean; message: string; service: AdminService },
      { serviceId: string; approvalData: AdminApprovalData }
    >({
      query: ({ serviceId, approvalData }) => ({
        url: `${serviceId}/approve`,
        method: 'POST',
        body: approvalData,
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
    }),

    // Assign badge to service
    assignBadge: builder.mutation<
      { success: boolean; message: string; service: AdminService },
      { serviceId: string; badgeData: AdminBadgeData }
    >({
      query: ({ serviceId, badgeData }) => ({
        url: `${serviceId}/badge`,
        method: 'PUT',
        body: badgeData,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: 'AdminService', id: serviceId },
        'AdminService',
      ],
    }),

    // Toggle service status
    toggleServiceStatus: builder.mutation<
      { success: boolean; message: string; service: AdminService },
      string
    >({
      query: (serviceId) => ({
        url: `${serviceId}/toggle-status`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, serviceId) => [
        { type: 'AdminService', id: serviceId },
        'AdminService',
        'ServiceStats',
      ],
    }),

    // Delete service
    deleteService: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (serviceId) => ({
        url: serviceId,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
    }),

    // Set service to pending
    setServicePending: builder.mutation<
      { success: boolean; message: string; service: AdminService },
      string
    >({
      query: (serviceId) => ({
        url: `${serviceId}/pending`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
    }),

    // Bulk actions
    bulkServiceAction: builder.mutation<
      { success: boolean; message: string },
      AdminBulkAction
    >({
      query: (bulkData) => ({
        url: 'bulk-action',
        method: 'POST',
        body: bulkData,
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
    }),

    // Get available badges
    getAvailableBadges: builder.query<{ badges: AvailableBadge[] }, void>({
      query: () => 'badges/available',
    }),

    // Get pending services count
    getPendingCount: builder.query<{ pendingCount: number }, void>({
      query: () => 'pending/count',
      providesTags: ['ServiceStats'],
    }),

    // Export services data
    exportServicesData: builder.mutation<
      {
        success: boolean;
        data: any[];
        totalRecords: number;
        exportedAt: string;
      },
      AdminServiceFilters
    >({
      query: (filters) => ({
        url: 'export',
        method: 'POST',
        body: filters,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetAllServicesQuery,
  useGetServiceStatsQuery,
  useGetServiceByIdQuery,
  useApproveServiceMutation,
  useAssignBadgeMutation,
  useToggleServiceStatusMutation,
  useDeleteServiceMutation,
  useSetServicePendingMutation,
  useBulkServiceActionMutation,
  useGetAvailableBadgesQuery,
  useGetPendingCountQuery,
  useExportServicesDataMutation,
} = adminServicesApi;